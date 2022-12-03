import {DataSource} from "typeorm";
import UserPgSql from "./user/UserPgSql";
import CardPgSql from "./cards/CardPgSql";
import FolderPgSql from "./folders/FolderPgSql";


let dataSource = new DataSource({
  type: "postgres",
  host: "backend-db",
  port: 5432,
  username: "root",
  password: "admin",
  database: "flashcards",
  synchronize: true,
  entities: [UserPgSql, CardPgSql, FolderPgSql],
})

let promise = new Promise(async (success: (dataSource: DataSource) => any, error) => {
  try {
    success(await dataSource.initialize());
  } catch (e) {
    error(e);
  }
});

export default promise;
