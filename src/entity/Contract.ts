import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  PrimaryColumn,
} from 'typeorm'

@Entity('contracts')
export class Contract extends BaseEntity {
  @PrimaryColumn()
  address!: string

  @Column({ type: 'simple-json' })
  metadata!: {
    lastSyncBlock: number
  }
}
