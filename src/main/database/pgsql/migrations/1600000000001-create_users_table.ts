import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class create_users_table_1600000000001 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'users',
      columns: [
        {
          name: 'id',
          type: 'bigint',
          generationStrategy: 'increment',
          isPrimary: true
        },
        {
          name: 'email',
          type: 'varchar'
        },
        {
          name: 'pass',
          type: 'varchar'
        }
      ],
      indices: [
        {
          name: 'users_email_unique_index',
          columnNames: ['email'],
          isUnique: true
        }
      ]
    }), true, true, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {

  }

}
