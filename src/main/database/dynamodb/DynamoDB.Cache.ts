import { DeleteCommand, DeleteCommandOutput, DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient, GetItemCommand, GetItemCommandOutput, ScanCommand } from "@aws-sdk/client-dynamodb";

export default class DynamoDBCache {
	client: DynamoDBClient;
	dynamo: DynamoDBDocumentClient;
	tableName: string;

	constructor(client: DynamoDBClient, dynamo: DynamoDBDocumentClient, tableName: string) {
		this.client = client;
		this.dynamo = dynamo;
		this.tableName = tableName;
	}

	async getCache(key: any): Promise<string | null> {
		let cacheKey = undefined;

		try {
			cacheKey = JSON.stringify(key);
		} catch (e) {
		}

		if (cacheKey) {
			const params = new GetItemCommand({
				TableName: this.tableName,
				Key: {
					key: {S: cacheKey}
				}
			});

			const data: GetItemCommandOutput = await this.client.send(params);
			if (data && data.Item && data.Item?.cache?.S) {
				try {
					return data.Item?.cache?.S;
				} catch (e) {
				}
			}
		}

		return null;
	}

	async setCache(key: any, cache: any): Promise<void> {
		let cacheKey = undefined;
		try {
			cacheKey = JSON.stringify(key);
		} catch (e) {
		}

		let cacheValue = undefined;
		try {
			cacheValue = JSON.stringify(cache);
		} catch (e) {
		}

		if (cacheKey && cacheValue) {
			await this.dynamo.send(
				new PutCommand({
					TableName: this.tableName,
					Item: {
						key: cacheKey,
						cache: cacheValue
					},
				})
			);
		}
	}

	async clearCache(): Promise<void> {
		const scanResult = await this.client.send(
			new ScanCommand({
				TableName: this.tableName
			})
		);

		if (scanResult.Items && scanResult.Items.length) {
			const items = scanResult.Items;

			const deletePromises: Promise<DeleteCommandOutput>[] = items.map(item => {
				return this.dynamo.send(new DeleteCommand({
					TableName: this.tableName,
					Key: {
						key: item.key,
					},
				}));
			});

			const promiseResult: PromiseSettledResult<any>[] = await Promise.allSettled(deletePromises);
		}
	}

}
