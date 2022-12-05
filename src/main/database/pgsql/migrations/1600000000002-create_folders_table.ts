import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class create_folders_table_1600000000002 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'folders',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          generationStrategy: 'increment',
          isPrimary: true
        },
        {
          name: 'name',
          type: 'varchar',
          isNullable: false
        },
        {
          name: 'parent_id',
          type: 'bigint',
          isNullable: true
        },
        {
          name: 'user_id',
          type: 'bigint',
          isNullable: false
        },
      ],
      indices: [
        {
          name: 'folders_parent_index',
          columnNames: ['parent_id'],
          isUnique: false
        },
        {
          name: 'folders_user_index',
          columnNames: ['user_id'],
          isUnique: false
        }
      ]
    }), true, true, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {

  }

}
