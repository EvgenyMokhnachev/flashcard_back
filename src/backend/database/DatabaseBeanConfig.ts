import UserRepository from "../domain/user/UserRepository";
import UserRepositoryPgSql from "./pgsql/user/UserRepositoryPgSql";

export const userRepository: UserRepository = new UserRepositoryPgSql();
