import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import UserRepository from "../../../domain/user/UserRepository";
import User from "../../../domain/user/User";
import UserFilter from "../../../domain/user/UserFilter";
import { InMemoryCache } from "../InMemory.Cache";

export default class UserRepositoryInMemoryCache implements UserRepository {
	userRepository: UserRepository;
	cache: InMemoryCache;

	constructor(userRepository: UserRepository) {
		this.userRepository = userRepository;
		this.cache = new InMemoryCache();
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

	public async findFirst(filter: UserFilter): Promise<User | undefined> {
		let result = undefined;
		let users = await this.find(filter);
		if (users && users.length) {
			result = users[0];
		}
		return result;
	}

}
