const Web3 = require('web3')
const ETHTonardo = require('./src/contracts/ETHTornado.json')

async function get() {
  var web3 = new Web3('https://rpc.testnet.moonbeam.network')

  var contract = new web3.eth.Contract(
    ETHTonardo.abi,
    '0xBA1c32b3897C54F508955b38759f6ce2a3251D9B'
  )

  const from = 969233
  const events = await contract.getPastEvents('Deposit', {
    fromBlock: from,
    toBlock: from + 10000,
  })
  console.log(events)
}
get()
