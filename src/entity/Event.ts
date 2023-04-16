import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  PrimaryColumn,
} from 'typeorm'

@Entity('events')
export class Event extends BaseEntity {
  @PrimaryColumn({ name: 'block_number' })
  blockNumber!: number

  @Column()
  address!: string

  @Column({ name: 'block_hash' })
  blockHash!: string

  @Column({ name: 'log_index' })
  logIndex!: number

  @Column({ name: 'transaction_hash' })
  transactionHash!: string

  @Column({ name: 'transaction_index' })
  transactionIndex!: number

  @Column()
  commitment!: string

  @Column({ name: 'leaf_index' })
  leafIndex!: number

  @Column()
  timestamp!: number

  @Column()
  signature!: string

  @Column({ name: 'raw_data' })
  rawData!: string
}
