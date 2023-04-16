import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateTableContract1634318195488 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE contracts (
            address text PRIMARY KEY,
            metadata jsonb
        );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS contracts;
    `)
  }
}
