import { redisRepository } from "./RedisRepository";
import CardFilter from "../../domain/cards/CardFilter";
import Card from "../../domain/cards/Card";

class CardsRedisRepository {

	public async setCardsCacheByFilter(filter: CardFilter, cache: Card[]): Promise<void> {
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
			return redisRepository.set('cards:' + filterJSON, cacheJSON, 300);
		}
	}

	public async getCardsCacheByFilter(filter: CardFilter): Promise<Card[] | null> {
		const connectToRedis = redisRepository.connectToRedis();

		let filterJSON = '{}';
		try {
			filterJSON = JSON.stringify(filter) || '{}';
		} catch (e) {
			filterJSON = '{}'
		}

		await connectToRedis;
		const result: string | null = await redisRepository.get('cards:' + filterJSON) || null;

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

	public async setCardById(cardId: number, cache: Card): Promise<void> {
		const connectToRedis = redisRepository.connectToRedis();

		let cacheJSON = null;
		try {
			cacheJSON = JSON.stringify(cache) || null;
		} catch (e) {
			cacheJSON = null;
		}

		if (cacheJSON) {
			await connectToRedis;
			return redisRepository.set('cards:byId:' + cardId, cacheJSON, 300);
		}
	}

	public async getCardById(cardId: number): Promise<Card | null> {
		const connectToRedis = redisRepository.connectToRedis();

		await connectToRedis;
		const result: string | null = await redisRepository.get('cards:byId:' + cardId) || null;

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

	public async clearCardsCache() {
		await redisRepository.deleteByPattern('cards:*');
	}

}

export const cardsRedisRepository = new CardsRedisRepository();
