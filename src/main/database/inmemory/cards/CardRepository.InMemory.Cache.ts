import CardRepository from "../../../domain/cards/CardRepository";
import Card from "../../../domain/cards/Card";
import CardFilter from "../../../domain/cards/CardFilter";
import { InMemoryCache } from "../InMemory.Cache";

export default class CardRepositoryInMemoryCache implements CardRepository {
	cardRepository: CardRepository;
	cache: InMemoryCache;

	constructor(cardRepository: CardRepository) {
		this.cardRepository = cardRepository;
		this.cache = new InMemoryCache();
	}

	public async save(card: Card): Promise<Card> {
		const result = this.cardRepository.save(card);
		await this.cache.clearCache();
		return result;
	}

	async delete(id: number): Promise<boolean> {
		const result = this.cardRepository.delete(id);
		await this.cache.clearCache();
		return result;
	}

	async findById(id: number): Promise<Card | null> {
		const cache: string | null = await this.cache.getCache(id);
		if (cache) try {
			return JSON.parse(cache);
		} catch (e) {
		}

		const result = this.cardRepository.findById(id);

		if (result) {
			await this.cache.setCache(id, result);
		}

		return result;
	}

	public async find(filter: CardFilter): Promise<Card[]> {
		const cache: string | null = await this.cache.getCache(filter);
		if (cache) try {
			return JSON.parse(cache);
		} catch (e) {
		}

		const result = await this.cardRepository.find(filter);

		if (result && result.length) {
			await this.cache.setCache(filter, result);
		}

		return result;
	}

}
