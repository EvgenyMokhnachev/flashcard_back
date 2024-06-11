import { redisRepository } from "./RedisRepository";

class UserTokenRedisRepository {

	public async setUserAuthToken(token: string, userId: number): Promise<void> {
		await redisRepository.connectToRedis();
		return redisRepository.set('user-token:' + token, userId + '', 300);
	}

	public async getUserAuthToken(token: string): Promise<number | null> {
		await redisRepository.connectToRedis();
		const userId = await redisRepository.get('user-token:' + token);
		if (userId !== null) {
			return parseInt(userId + '');
		}
		return null;
	}

}

export const userTokenRedisRepository = new UserTokenRedisRepository();
