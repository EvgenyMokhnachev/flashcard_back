import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class add_difficult_change_time_column_in_cards_table_1600000000005 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      ALTER TABLE cards ADD COLUMN difficult_change_time TIMESTAMP;
    `);

    await queryRunner.query(`
      UPDATE cards SET difficult_change_time = CURRENT_TIMESTAMP;
    `);

    await queryRunner.query(`
      ALTER TABLE cards ALTER COLUMN difficult_change_time SET NOT NULL;
    `);

    await queryRunner.query(`
      CREATE INDEX cards_difficult_change_time_index
        on cards (difficult_change_time);
    `);

    await queryRunner.query(`
      CREATE INDEX cards_difficult_type_difficult_change_time_index
        on cards (difficult, difficult_change_time);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {

  }

}
