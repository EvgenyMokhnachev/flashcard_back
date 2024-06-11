import { redisRepository } from "./RedisRepository";
import UserFilter from "../../domain/user/UserFilter";
import User from "../../domain/user/User";

class UsersRedisRepository {

	public async setUsersCacheByFilter(filter: UserFilter, cache: User[]): Promise<void> {
		const connectToRedis = redisRepository.connectToRedis();

		let filterJSON = '{}';
		try {
			filterJSON = JSON.stringify(filter) || '{}';
		} catch (e) {
			filterJSON = '{}'
		}

		let cacheJSON = null;
		try {
			cacheJSON = JSON.stringify(cache) || null;
		} catch (e) {
			cacheJSON = null;
		}

		if (cacheJSON) {
			await connectToRedis;
			return redisRepository.set('users:' + filterJSON, cacheJSON, 300);
		}
	}

	public async getUsersCacheByFilter(filter: UserFilter): Promise<User[] | null> {
		const connectToRedis = redisRepository.connectToRedis();

		let filterJSON = '{}';
		try {
			filterJSON = JSON.stringify(filter) || '{}';
		} catch (e) {
			filterJSON = '{}'
		}

		await connectToRedis;
		const result: string | null = await redisRepository.get('users:' + filterJSON) || null;

		if (result) {
			try {
				return JSON.parse(result) || null;
			} catch (e) {
				return null;
			}
		} else {
			return null;
		}
	}

	public async setUserById(userId: number, cache: User): Promise<void> {
		const connectToRedis = redisRepository.connectToRedis();

		let cacheJSON = null;
		try {
			cacheJSON = JSON.stringify(cache) || null;
		} catch (e) {
			cacheJSON = null;
		}

		if (cacheJSON) {
			await connectToRedis;
			return redisRepository.set('users:byId:' + userId, cacheJSON, 300);
		}
	}

	public async getUserById(userId: number): Promise<User | null> {
		const connectToRedis = redisRepository.connectToRedis();

		await connectToRedis;
		const result: string | null = await redisRepository.get('users:byId:' + userId) || null;

		if (result) {
			try {
				return JSON.parse(result) || null;
			} catch (e) {
				return null;
			}
		} else {
			return null;
		}
	}

	public async clearUsersCache() {
		await redisRepository.deleteByPattern('users:');
	}

}

export const usersRedisRepository = new UsersRedisRepository();
