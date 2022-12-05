import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class add_difficult_column_in_cards_table_1600000000004 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      ALTER TABLE cards ADD COLUMN difficult INTEGER;
    `);

    await queryRunner.query(`
      UPDATE cards SET difficult = 1;
    `);

    await queryRunner.query(`
      ALTER TABLE cards ALTER COLUMN difficult SET NOT NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX cards_difficult_index
        on cards (difficult);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {

  }

}
