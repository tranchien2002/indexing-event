import 'reflect-metadata'
import Koa from 'koa'
import cors from '@koa/cors'
import Router from 'koa-router'
import { createConnection } from 'typeorm'
import Web3 from 'web3'
import { CronJob } from 'cron'
import config from './config'
import { Event } from './entity/Event'
import { Contract } from './entity/Contract'

const ETHTonardo = require('./contracts/ETHTornado.json')

async function syncContractEvents(web3: Web3, address: string) {
  try {
    web3.setProvider('https://rpc.testnet.moonbeam.network')

    // Find get latest synced block from saved contract in database
    const dbContract = await Contract.findOne({ address })
    if (!dbContract) {
      console.error(
        `failed to sync contract ${address} events: contract is not in db`
      )
      return
    }
    const from = (dbContract?.metadata?.lastSyncBlock || 0) + 1
    // Get 1000 block from 'from' to not get in timed out errors
    // If to > latest block, then to is latest
    let to = from + 1000
    const countBlocks = await web3.eth.getBlockNumber()
    if (to > countBlocks) {
      to = countBlocks
    }
    var contract = new web3.eth.Contract(ETHTonardo.abi, address)
    // Get blocks from web3 and save to database
    const events = await contract.getPastEvents('Deposit', {
      fromBlock: from,
      toBlock: to,
    })
    const newEvents = events.map((e) => {
      const {
        address,
        blockHash,
        blockNumber,
        logIndex,
        transactionHash,
        transactionIndex,
        returnValues: { commitment, leafIndex, timestamp },
        raw: { data },
        signature,
      } = e
      return Event.create({
        address,
        blockHash,
        blockNumber,
        logIndex,
        transactionHash,
        transactionIndex,
        commitment: commitment as string,
        leafIndex: leafIndex as number,
        timestamp: timestamp as number,
        rawData: data as string,
        signature,
      })
    })
    await Event.save(newEvents)
    // Update last synced block number of contract in database
    if (!dbContract.metadata) {
      dbContract.metadata = { lastSyncBlock: to }
    } else {
      dbContract.metadata.lastSyncBlock = to
    }
    await Contract.save(dbContract)
  } catch (e) {
    console.error(`failed to sync contract ${address} events: ${e}`)
  }
}

const syncEvents = (web3: Web3) => async () => {
  const contracts = await Contract.find()
  await Promise.all(contracts.map((c) => syncContractEvents(web3, c.address)))
}

async function getEvents(ctx: Koa.Context) {
  const { address, page, limit } = ctx.query
  if (!address) {
    ctx.body = {
      status: 400,
      message: 'Address is required',
    }
    ctx.status = 400
    return
  }
  const contract = await Contract.findOne({ address: address as string })
  if (!contract) {
    ctx.body = {
      status: 404,
      message: 'Contract not found',
    }
    ctx.status = 404
    return
  }
  let eventsWithTotal = null
  if (!limit) {
    eventsWithTotal = await Event.findAndCount({
      where: { address },
      order: { timestamp: 'DESC' },
    })
  } else {
    const limitNumber = parseInt(limit as string, 10) || 10
    const pageNumber = parseInt(page as string, 10) || 1
    eventsWithTotal = await Event.findAndCount({
      where: { address },
      order: { timestamp: 'DESC' },
      skip: limitNumber * (pageNumber - 1),
      take: limitNumber,
    })
  }
  ctx.body = {
    status: 200,
    message: 'Success',
    data: {
      events: eventsWithTotal?.[0],
      total: eventsWithTotal?.[1],
      lastSyncBlock: contract?.metadata?.lastSyncBlock,
    },
  }
  ctx.status = 200
  return
}

async function insertContracts() {
  const contracts = [
    process.env.ETHSandstorm01,
    process.env.ETHSandstorm1,
    process.env.ETHSandstorm10,
    process.env.ETHSandstorm100,
  ]
  for (let i = 0; i < contracts.length; i++) {
    // Check if contract exists
    const existContract = await Contract.findOne({ address: contracts[i] })
    if (!existContract) {
      await Contract.save(
        Contract.create({
          address: contracts[i],
        })
      )
    }
  }
}

async function startServer() {
  var web3 = new Web3()

  await createConnection(config.postgres)
  await insertContracts()

  var job = new CronJob('*/10 * * * * *', syncEvents(web3))
  job.start()

  const app = new Koa()
  app.use(cors())

  const router = new Router()
  router.get('/', async (ctx) => {
    ctx.body = 'Hello World!'
  })
  router.get('/events', getEvents)
  app.use(router.routes())

  app.listen(3000)

  console.log('Server running on port 3000')
}

startServer()
