import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import DynamoDBCache from "../DynamoDB.Cache";
import CardRepository from "../../../domain/cards/CardRepository";
import Card from "../../../domain/cards/Card";
import CardFilter from "../../../domain/cards/CardFilter";

export default class CardRepositoryDynamoDBCache implements CardRepository {
	client: DynamoDBClient;
	dynamo: DynamoDBDocumentClient;
	cache: DynamoDBCache;
	cardRepository: CardRepository;

	constructor(client: DynamoDBClient, dynamo: DynamoDBDocumentClient, cardRepository: CardRepository) {
		this.client = client;
		this.dynamo = dynamo;
		this.cache = new DynamoDBCache(client, dynamo, 'flashcards_cards_cache');
		this.cardRepository = cardRepository;
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
