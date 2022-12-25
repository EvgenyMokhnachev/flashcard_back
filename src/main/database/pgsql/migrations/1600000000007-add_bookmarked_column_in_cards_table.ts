import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class add_bookmarked_column_in_cards_table_1600000000007 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
      ALTER TABLE cards ADD COLUMN bookmarked BOOLEAN;
    `);

    await queryRunner.query(`
      UPDATE cards SET bookmarked = false;
    `);

    await queryRunner.query(`
      ALTER TABLE cards ALTER COLUMN bookmarked SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {

  }

}
