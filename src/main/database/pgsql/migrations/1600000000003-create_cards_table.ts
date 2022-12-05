import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class create_cards_table_1600000000003 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'cards',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          generationStrategy: 'increment',
          isPrimary: true
        },
        {
          name: 'folder_id',
          type: 'bigint',
          isNullable: true,
        },
        {
          name: 'user_id',
          type: 'bigint',
          isNullable: false
        },
        {
          name: 'front_side',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'back_side',
          type: 'varchar',
          isNullable: false
        }
      ],
      indices: [
        {
          name: 'cards_folder_index',
          columnNames: ['folder_id'],
          isUnique: false
        },
        {
          name: 'cards_user_index',
          columnNames: ['user_id'],
          isUnique: false
        }
      ]
    }), true, true, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {

  }

}
