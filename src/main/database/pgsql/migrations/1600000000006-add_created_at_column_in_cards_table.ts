import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class add_created_at_column_in_cards_table_1600000000006 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      ALTER TABLE cards ADD COLUMN created_at TIMESTAMP;
    `);

    await queryRunner.query(`
      UPDATE cards SET created_at = CURRENT_TIMESTAMP;
    `);

    await queryRunner.query(`
      ALTER TABLE cards ALTER COLUMN created_at SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {

  }

}
