import AuthTokenRepository from "../domain/auth/AuthTokenRepository";
import AuthTokenRepositoryDynamoDB from "./dynamodb/authToken/AuthTokenRepository.DynamoDB";
import UserRepository from "../domain/user/UserRepository";
import UserRepositoryDynamoDB from "./dynamodb/user/UserRepository.DynamoDB";
import CardRepository from "../domain/cards/CardRepository";
import CardRepositoryDynamoDB from "./dynamodb/cards/CardRepository.DynamoDB";
import FolderRepository from "../domain/folders/FolderRepository";
import FoldersRepositoryDynamoDB from "./dynamodb/folders/FoldersRepository.DynamoDB";

export const authTokenRepository: AuthTokenRepository = new AuthTokenRepositoryDynamoDB();
export const userRepository: UserRepository = new UserRepositoryDynamoDB();
export const cardRepository: CardRepository = new CardRepositoryDynamoDB();
export const folderRepository: FolderRepository = new FoldersRepositoryDynamoDB();
