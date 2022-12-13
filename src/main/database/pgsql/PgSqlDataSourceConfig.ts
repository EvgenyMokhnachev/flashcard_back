import {DataSource} from "typeorm";
import UserPgSql from "./user/UserPgSql";
import CardPgSql from "./cards/CardPgSql";
import FolderPgSql from "./folders/FolderPgSql";
import {create_users_table_1600000000001} from "./migrations/1600000000001-create_users_table";
import {create_folders_table_1600000000002} from "./migrations/1600000000002-create_folders_table";
import {create_cards_table_1600000000003} from "./migrations/1600000000003-create_cards_table";
import {add_difficult_column_in_cards_table_1600000000004} from "./migrations/1600000000004-add_difficult_column_in_cards_table";
import {add_difficult_change_time_column_in_cards_table_1600000000005} from "./migrations/1600000000005-add_difficult_change_time_column_in_cards_table";
import {add_created_at_column_in_cards_table_1600000000006} from "./migrations/1600000000006-add_created_at_column_in_cards_table";

export default new DataSource({
  type: "postgres",
  host: "backend-db",
  port: 5432,
  username: "root",
  password: "admin",
  database: "flashcards",
  entities: [UserPgSql, CardPgSql, FolderPgSql],
  synchronize: false,
  migrationsTableName: 'flashcards_migrations_log',
  // migrations: ['/app/src/main/database/pgsql/migrations/*.ts'],
  migrations: [
    create_users_table_1600000000001,
    create_folders_table_1600000000002,
    create_cards_table_1600000000003,
    add_difficult_column_in_cards_table_1600000000004,
    add_difficult_change_time_column_in_cards_table_1600000000005,
    add_created_at_column_in_cards_table_1600000000006
  ]
})
