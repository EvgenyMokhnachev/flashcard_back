import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import DynamoDBCache from "../DynamoDB.Cache";
import UserRepository from "../../../domain/user/UserRepository";
import User from "../../../domain/user/User";
import UserFilter from "../../../domain/user/UserFilter";

export default class UserRepositoryDynamoDBCache implements UserRepository {
	client: DynamoDBClient;
	dynamo: DynamoDBDocumentClient;
	cache: DynamoDBCache;
	userRepository: UserRepository;

	constructor(client: DynamoDBClient, dynamo: DynamoDBDocumentClient, userRepository: UserRepository) {
		this.client = client;
		this.dynamo = dynamo;
		this.cache = new DynamoDBCache(client, dynamo, 'flashcards_users_cache');
		this.userRepository = userRepository;
	}

	public async save(user: User): Promise<User> {
		const result = this.userRepository.save(user);
		await this.cache.clearCache();
		return result;
	}

	public async find(filter: UserFilter): Promise<User[]> {
		const cache: string | null = await this.cache.getCache(filter);
		if (cache) try {
			return JSON.parse(cache);
		} catch (e) {
		}

		const result = await this.userRepository.find(filter);

		if (result && result.length) {
			await this.cache.setCache(filter, result);
		}

		return result;
	}

	public async findFirst(filter: UserFilter): Promise<User|undefined> {
		let result = undefined;
		let users = await this.find(filter);
		if (users && users.length) {
			result = users[0];
		}
		return result;
	}

}
