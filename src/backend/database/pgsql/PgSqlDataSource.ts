import {DataSource} from "typeorm";
import UserPgSql from "./user/UserPgSql";


let dataSource = new DataSource({
  type: "postgres",
  host: "backend-db",
  port: 5432,
  username: "root",
  password: "admin",
  database: "flashcards",
  synchronize: true,
  entities: [UserPgSql],
})

let promise = new Promise(async (success: (dataSource: DataSource) => any, error) => {
  try {
    success(await dataSource.initialize());
  } catch (e) {
    error(e);
  }
});

export default promise;
