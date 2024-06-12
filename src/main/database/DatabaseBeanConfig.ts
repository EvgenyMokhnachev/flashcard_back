// import AuthTokenRepository from "../domain/auth/AuthTokenRepository";
// import AuthTokenRepositoryDynamoDB from "./dynamodb/authToken/AuthTokenRepository.DynamoDB";
// import UserRepository from "../domain/user/UserRepository";
// import UserRepositoryDynamoDB from "./dynamodb/user/UserRepository.DynamoDB";
// import CardRepository from "../domain/cards/CardRepository";
// import CardRepositoryDynamoDB from "./dynamodb/cards/CardRepository.DynamoDB";
// import FolderRepository from "../domain/folders/FolderRepository";
// import FoldersRepositoryDynamoDB from "./dynamodb/folders/FoldersRepository.DynamoDB";
// import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
// import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
// import FoldersRepositoryDynamoDBCache from "./dynamodb/folders/FoldersRepository.DynamoDB.Cache";
// import UserRepositoryDynamoDBCache from "./dynamodb/user/UserRepository.DynamoDB.Cache";
// import CardRepositoryDynamoDBCache from "./dynamodb/cards/CardRepository.DynamoDB.Cache";
//
// const client = new DynamoDBClient({});
// const dynamo = DynamoDBDocumentClient.from(client);
//
// export const authTokenRepository: AuthTokenRepository = new AuthTokenRepositoryDynamoDB(
// 	client,
// 	dynamo,);
// export const userRepository: UserRepository = new UserRepositoryDynamoDBCache(client, dynamo, new UserRepositoryDynamoDB(
// 	client,
// 	dynamo,));
// export const cardRepository: CardRepository = new CardRepositoryDynamoDBCache(client, dynamo, new CardRepositoryDynamoDB(
// 	client,
// 	dynamo,));
// export const folderRepository: FolderRepository = new FoldersRepositoryDynamoDBCache(
// 	client,
// 	dynamo,
// 	new FoldersRepositoryDynamoDB(client, dynamo)
// );

import AuthTokenRepository from "../domain/auth/AuthTokenRepository";
import UserRepository from "../domain/user/UserRepository";
import UserRepositoryDynamoDB from "./dynamodb/user/UserRepository.DynamoDB";
import CardRepository from "../domain/cards/CardRepository";
import CardRepositoryDynamoDB from "./dynamodb/cards/CardRepository.DynamoDB";
import FolderRepository from "../domain/folders/FolderRepository";
import FoldersRepositoryDynamoDB from "./dynamodb/folders/FoldersRepository.DynamoDB";
import AuthTokenRepositoryInMemory from "./inmemory/authToken/AuthTokenRepository.InMemory.Cache";
import UserRepositoryInMemoryCache from "./inmemory/user/UserRepository.InMemory.Cache";
import CardRepositoryInMemoryCache from "./inmemory/cards/CardRepository.InMemory.Cache";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import FoldersRepositoryInMemoryCache from "./inmemory/folders/FoldersRepository.InMemory.Cache";

const client = new DynamoDBClient({
	credentials: {
		accessKeyId: process.env.AWS_DYNAMO_DB_ACCESS_KEY_ID || '',
		secretAccessKey: process.env.AWS_DYNAMO_DB_ACCESS_KEY_SECRET || ''
	},
	region: 'eu-central-1',
});
const dynamo = DynamoDBDocumentClient.from(client);

export const authTokenRepository: AuthTokenRepository = new AuthTokenRepositoryInMemory();
export const userRepository: UserRepository = new UserRepositoryInMemoryCache(new UserRepositoryDynamoDB(client, dynamo));
export const cardRepository: CardRepository = new CardRepositoryInMemoryCache(new CardRepositoryDynamoDB(client, dynamo));
export const folderRepository: FolderRepository = new FoldersRepositoryInMemoryCache(new FoldersRepositoryDynamoDB(client, dynamo));
