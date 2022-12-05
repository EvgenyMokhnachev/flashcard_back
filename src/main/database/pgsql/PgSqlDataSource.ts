import {DataSource} from "typeorm";
import dataSource from "./PgSqlDataSourceConfig";

let promise = new Promise(async (success: (dataSource: DataSource) => any, error) => {
  try {
    success(await dataSource.initialize());
  } catch (e) {
    error(e);
  }
});

export default promise;
