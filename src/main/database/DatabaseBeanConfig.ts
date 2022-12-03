import UserRepository from "../domain/user/UserRepository";
import UserRepositoryPgSql from "./pgsql/user/UserRepositoryPgSql";
export const userRepository: UserRepository = new UserRepositoryPgSql();

import CardRepository from "../domain/cards/CardRepository";
import CardRepositoryPgSql from "./pgsql/cards/CardRepositoryPgSql";
export const cardRepository: CardRepository = new CardRepositoryPgSql();

import FolderRepository from "../domain/folders/FolderRepository";
import FoldersRepositoryPgSql from "./pgsql/folders/FoldersRepositoryPgSql";
export const folderRepository: FolderRepository = new FoldersRepositoryPgSql();
