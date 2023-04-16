import { MigrationInterface, QueryRunner } from 'typeorm'

export class Init1634226088869 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE events (
            block_number bigint PRIMARY KEY,
            address text,
            block_hash text,
            log_index integer,
            transaction_hash text,
            transaction_index integer,
            commitment text,
            leaf_index integer,
            timestamp integer,
            signature text,
            raw_data text
        );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS events;
    `)
  }
}
