import Card from "../../../domain/cards/Card";
import CardFilter from "../../../domain/cards/CardFilter";
import CardRepository from "../../../domain/cards/CardRepository";
import CardDifficultType from "../../../domain/cards/CardDifficultType";
import { DeleteItemCommandInput } from "@aws-sdk/client-dynamodb/dist-types/commands/DeleteItemCommand";
import {
	DeleteItemCommand,
	DynamoDBClient,
	GetItemCommand,
	GetItemCommandOutput,
	ScanCommand,
	ScanCommandInput,
	ScanCommandOutput
} from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, NumberValue, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "flashcards_cards";

export default class CardRepositoryDynamoDB implements CardRepository {

	async delete(id: number): Promise<boolean> {
		const params: DeleteItemCommandInput = {
			TableName: tableName,
			Key: {
				id: {N: id.toString()}
			}
		};

		try {
			const command = new DeleteItemCommand(params);
			await client.send(command);
			return true;
		} catch (error) {
			return false;
		}
	}

	public async save(card: Card): Promise<Card> {
		if (!card.createdAt) {
			card.createdAt = new Date();
		}

		card.id = card.id ? card.id : parseInt(new Date().getTime() + '' + Math.round(Math.random() * 10))

		await dynamo.send(
			new PutCommand({
				TableName: tableName,
				Item: {
					id: card.id ? NumberValue.from(String(card.id)) : null,
					folderId: card.folderId ? NumberValue.from(String(card.folderId)) : null,
					userId: card.userId ? NumberValue.from(String(card.userId)) : null,
					frontSide: card.frontSide || null,
					backSide: card.backSide || null,
					difficult: card.difficult === undefined ? undefined : card.difficult === null ? null : NumberValue.from(String(card.difficult!.valueOf() as number)),
					difficultChangeTime: card.difficultChangeTime ? NumberValue.from(String(new Date(card.difficultChangeTime!).getTime())) : null,
					createdAt: card.createdAt ? NumberValue.from(String(new Date(card.createdAt!).getTime())) : null,
					bookmarked: NumberValue.from(String(card.bookmarked ? 1 : 0))
				},
			})
		);
		return card;
	}

	public async findById(id: number): Promise<Card | null> {
		const params = new GetItemCommand({
			TableName: tableName,
			Key: {
				id: {N: String(id)}
			}
		});

		const data: GetItemCommandOutput = await client.send(params);

		return (() => {
			const id: number | undefined = data.Item?.id?.N ? parseInt(data.Item?.id?.N) : undefined;
			const folderId: number | undefined = data.Item?.folderId?.N ? parseInt(data.Item?.folderId?.N) : undefined;
			const userId: number | undefined = data.Item?.userId?.N ? parseInt(data.Item?.userId?.N) : undefined;
			const frontSide: string | undefined = data.Item?.frontSide?.S ? data.Item?.frontSide?.S + '' : undefined;
			const backSide: string | undefined = data.Item?.backSide?.S ? data.Item?.backSide?.S + '' : undefined;
			const difficult: CardDifficultType | undefined = data.Item?.difficult?.N ? parseInt(data.Item?.difficult?.N) : undefined;
			const difficultChangeTime: Date | undefined = data.Item?.difficultChangeTime?.N ? (new Date(parseInt(data.Item?.difficultChangeTime?.N))) : undefined;
			const createdAt: Date | undefined = data.Item?.createdAt?.N ? (new Date(parseInt(data.Item?.createdAt?.N))) : undefined;
			const bookmarked: boolean | undefined = data.Item?.bookmarked?.N ? data.Item?.bookmarked?.N + '' === 1 + '' : undefined;
			return data.Item ? new Card(
				id, folderId, userId, frontSide, backSide, difficult, difficultChangeTime, createdAt, bookmarked
			) : null;
		})();
	}

	public async find(filter: CardFilter): Promise<Card[]> {
		const filterExpression = [];
		filterExpression.push((filter.ids || []).map((id, index) => `id = :id${index}`).join(' OR '));
		filterExpression.push((filter.userIds || []).map((id, index) => `userId = :userId${index}`).join(' OR '));
		filterExpression.push((filter.folderIds || []).map((id, index) => `folderId = :folderId${index}`).join(' OR '));
		filterExpression.push((filter.difficultTypes || []).map((difficult, index) => `difficult = :difficult${index}`).join(' OR '));
		if (filter.bookmarked === true || filter.bookmarked === false) filterExpression.push('bookmarked = :bookmarkedFilterVal');
		if (filter.createdAtFrom) filterExpression.push(`createdAt >= :createdAt${filter.createdAtFrom.getTime()}`);
		if (filter.createdAtTo) filterExpression.push(`createdAt <= :createdAt${filter.createdAtTo.getTime()}`);
		const queryStr = filterExpression.filter(i => !!i).map(i => `(${i})`).join(' AND ');

		// Create ExpressionAttributeValues
		const expressionAttributeValues = {
			...(filter.ids || []).reduce((acc, id, index) => ({...acc, [`:id${index}`]: {N: String(id)}}), {}),
			...(filter.userIds || []).reduce((acc, id, index) => ({...acc, [`:userId${index}`]: {N: String(id)}}), {}),
			...(filter.folderIds || []).reduce((acc, id, index) => ({...acc, [`:folderId${index}`]: {N: String(id)}}), {}),
			...(filter.difficultTypes || []).reduce((acc, diffT, index) => ({
				...acc,
				[`:difficult${index}`]: {N: String(diffT)}
			}), {}),
			...(filter.createdAtFrom) ? {[`:createdAt${filter.createdAtFrom.getTime()}`]: {N: String(filter.createdAtFrom.getTime())}} : {},
			...(filter.createdAtTo) ? {[`:createdAt${filter.createdAtTo.getTime()}`]: {N: String(filter.createdAtTo.getTime())}} : {},
			...(filter.bookmarked === true || filter.bookmarked === false ? {
				[':bookmarkedFilterVal']: {N: filter.bookmarked ? '1' : '0'}
			} : {})
		};

		const params: ScanCommandInput = {
			TableName: tableName,
			FilterExpression: queryStr,
			ExpressionAttributeValues: expressionAttributeValues
		};

		const data: ScanCommandOutput = await client.send(new ScanCommand(params));

		return (data.Items || [])
			.map(responseItem => {
				// throw responseItem;
				const id: number | undefined = responseItem?.id?.N ? parseInt(responseItem?.id?.N) : undefined;
				const folderId: number | undefined = responseItem?.folderId?.N ? parseInt(responseItem?.folderId?.N) : undefined;
				const userId: number | undefined = responseItem?.userId?.N ? parseInt(responseItem?.userId?.N) : undefined;
				const frontSide: string | undefined = responseItem?.frontSide?.S ? responseItem?.frontSide?.S + '' : undefined;
				const backSide: string | undefined = responseItem?.backSide?.S ? responseItem?.backSide?.S + '' : undefined;
				const difficult: CardDifficultType | undefined = responseItem?.difficult?.N ? parseInt(responseItem?.difficult?.N) : undefined;
				const difficultChangeTime: Date | undefined = responseItem?.difficultChangeTime?.N ? (new Date(parseInt(responseItem?.difficultChangeTime?.N))) : undefined;
				const createdAt: Date | undefined = responseItem?.createdAt?.N ? (new Date(parseInt(responseItem?.createdAt?.N))) : undefined;
				const bookmarked: boolean | undefined = responseItem?.bookmarked?.N ? responseItem?.bookmarked?.N + '' === 1 + '' : undefined;
				return responseItem ? new Card(
					id, folderId, userId, frontSide, backSide, difficult, difficultChangeTime, createdAt, bookmarked
				) : null;
			})
			.filter(i => !!i) as Card[];
	}

}
