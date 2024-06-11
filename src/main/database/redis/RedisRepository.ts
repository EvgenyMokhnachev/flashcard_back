import { createClient, RedisClientType } from "redis";

class RedisRepository {
	private client: RedisClientType;

	constructor() {
		this.client = createClient({
			url: 'rediss://flashcards-cache-r4iryk.serverless.euc1.cache.amazonaws.com:6379'
		});
	}

	public connectToRedis = async () => {
		if (!this.client.isOpen) {
			await this.client.connect();
		}
	};

	public async set(key: string, value: string, ttlSecs?: number) {
		await this.connectToRedis();
		await this.client.set(key, value, ttlSecs ? {EX: ttlSecs} : undefined);
	}

	public async get(key: string): Promise<string | null> {
		await this.connectToRedis();
		return await this.client.get(key) || null;
	}

	public deleteByPattern = async (pattern: string) => {
		await this.connectToRedis();

		let cursor = 0;
		const keysToDelete: string[] = [];

		do {
			const result = await this.client.scan(cursor, {MATCH: pattern});
			cursor = result.cursor;
			keysToDelete.push(...result.keys);
		} while (cursor !== 0);

		if (keysToDelete.length > 0) {
			await this.client.del(keysToDelete);
		}
	}

}

export const redisRepository = new RedisRepository();
