import FolderRepository from "../../../domain/folders/FolderRepository";
import Folder from "../../../domain/folders/Folder";
import FoldersFilter from "../../../domain/folders/FoldersFilter";
import { DynamoDBDocumentClient, NumberValue, PutCommand } from "@aws-sdk/lib-dynamodb";
import {
	DeleteItemCommand,
	DynamoDBClient,
	GetItemCommand,
	GetItemCommandOutput,
	ScanCommand,
	ScanCommandInput,
	ScanCommandOutput
} from "@aws-sdk/client-dynamodb";
import { DeleteItemCommandInput } from "@aws-sdk/client-dynamodb/dist-types/commands/DeleteItemCommand";

const tableName = "flashcards_folders";

export default class FoldersRepositoryDynamoDB implements FolderRepository {
	client: DynamoDBClient;
	dynamo: DynamoDBDocumentClient;

	constructor(client: DynamoDBClient, dynamo: DynamoDBDocumentClient) {
		this.client = client;
		this.dynamo = dynamo;
	}

	public async save(folder: Folder): Promise<Folder> {
		folder.id = folder.id ? folder.id : parseInt(new Date().getTime() + '' + Math.round(Math.random() * 10))
		await this.dynamo.send(
			new PutCommand({
				TableName: tableName,
				Item: {
					id: folder.id ? NumberValue.from(folder.id) : folder.id,
					parentId: folder.parentId ? NumberValue.from(folder.parentId) : folder.parentId,
					userId: folder.userId ? NumberValue.from(folder.userId) : folder.userId,
					name: folder.name,
				},
			})
		);
		return folder;
	}

	async delete(id: number): Promise<boolean> {
		const params: DeleteItemCommandInput = {
			TableName: tableName,
			Key: {
				id: {N: id.toString()}
			}
		};

		try {
			const command = new DeleteItemCommand(params);
			await this.client.send(command);
			return true;
		} catch (error) {
			throw error;
		}
	}

	async findById(id: number): Promise<Folder | null> {
		const params = new GetItemCommand({
			TableName: tableName,
			Key: {
				id: {N: id.toString()}
			}
		});

		const data: GetItemCommandOutput = await this.client.send(params);

		return (() => {
			const name: string | undefined = data.Item?.name?.S ? data.Item?.name?.S + '' : undefined;
			const id: number | undefined = data.Item?.id?.N ? parseInt(data.Item?.id?.N) : undefined;
			const parentId: number | undefined = data.Item?.parentId?.N ? parseInt(data.Item?.parentId?.N) : undefined;
			const userId: number | undefined = data.Item?.userId?.N ? parseInt(data.Item?.userId?.N) : undefined;
			return data.Item ? new Folder(id, name, parentId, userId) : null
		})();
	}

	public async find(filter: FoldersFilter): Promise<Folder[]> {
		const filterExpression = [];
		filterExpression.push((filter.ids || []).map((id, index) => `id = :id${index}`).join(' OR '));
		filterExpression.push((filter.parentIds || []).map((id, index) => `parentId = :parentId${index}`).join(' OR '));
		filterExpression.push((filter.userIds || []).map((id, index) => `userId = :userId${index}`).join(' OR '));
		if (filter.onlyRoot) {
			filterExpression.push('attribute_not_exists(parentId) OR parentId = :emptyString OR parentId = :nulValue');
		}
		const queryStr = filterExpression.filter(i => !!i).map(i => `(${i})`).join(' AND ');

		// Create ExpressionAttributeValues
		const expressionAttributeValues = {
			...(filter.ids || []).reduce((acc, id, index) => ({...acc, [`:id${index}`]: {N: String(id)}}), {}),
			...(filter.parentIds || []).reduce((acc, parentId, index) => ({
				...acc,
				[`:parentId${index}`]: {N: String(parentId)}
			}), {}),
			...(filter.userIds || []).reduce((acc, userId, index) => ({
				...acc,
				[`:userId${index}`]: {N: String(userId)}
			}), {}),
			...(filter.onlyRoot ? {
				[':emptyString']: {S: ''},
				[':nulValue']: {S: 'null'}
			} : {})
		};

		const params: ScanCommandInput = {
			TableName: tableName,
			FilterExpression: queryStr,
			ExpressionAttributeValues: expressionAttributeValues
		};

		const data: ScanCommandOutput = await this.client.send(new ScanCommand(params), {requestTimeout: 30000});

		return (data.Items || []).map(responseItem => {
			const id: number | undefined = responseItem?.id?.N ? parseInt(responseItem?.id?.N) : undefined;
			const userId: number | undefined = responseItem?.userId?.N ? parseInt(responseItem?.userId?.N) : undefined;
			const parentId: number | undefined | null =
				responseItem?.parentId?.N
					? parseInt(responseItem?.parentId?.N)
					: responseItem?.parentId?.N === null || responseItem?.parentId?.N === 'null' || responseItem?.parentId?.N === 'NULL' ? null : undefined;
			const name: string | undefined = responseItem?.name?.S ? String(responseItem?.name?.S) : undefined;

			return new Folder(
				id, name, parentId, userId
			);
		});
	}

}
