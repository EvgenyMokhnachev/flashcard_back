import { DynamoDBClient, ScanCommand, ScanCommandInput, ScanCommandOutput } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, NumberValue, PutCommand } from "@aws-sdk/lib-dynamodb";
import UserRepository from "../../../domain/user/UserRepository";
import User from "../../../domain/user/User";
import UserFilter from "../../../domain/user/UserFilter";

const tableName = "flashcards_users";

export default class UserRepositoryDynamoDB implements UserRepository {
	client: DynamoDBClient;
	dynamo: DynamoDBDocumentClient;

	constructor(client: DynamoDBClient, dynamo: DynamoDBDocumentClient) {
		this.client = client;
		this.dynamo = dynamo;
	}

	public async save(user: User): Promise<User> {
		user.id = user.id ? user.id : parseInt(new Date().getTime() + '' + Math.round(Math.random() * 10))
		await this.dynamo.send(
			new PutCommand({
				TableName: tableName,
				Item: {
					id: NumberValue.from(user.id),
					email: user.email,
					pass: user.pass
				},
			})
		);
		return user;
	}

	async findFirst(filter: UserFilter): Promise<User | undefined> {
		let result = undefined;
		let users = await this.find(filter);
		if (users && users.length) {
			result = users[0];
		}
		return result;
	}

	public async find(filter: UserFilter): Promise<User[]> {
		const filterExpression = [];
		filterExpression.push((filter.ids || []).map((id, index) => `id = :id${index}`).join(' OR '));
		filterExpression.push((filter.emails || []).map((email, index) => `email = :email${index}`).join(' OR '));
		const queryStr = filterExpression.filter(i => !!i).map(i => `(${i})`).join(' AND ');

		// Create ExpressionAttributeValues
		const expressionAttributeValues = {
			...(filter.ids || []).reduce((acc, id, index) => ({...acc, [`:id${index}`]: {N: String(id)}}), {}),
			...(filter.emails || []).reduce((acc, email, index) => ({...acc, [`:email${index}`]: {S: email}}), {})
		};

		const params: ScanCommandInput = {
			TableName: tableName,
			FilterExpression: queryStr,
			ExpressionAttributeValues: expressionAttributeValues
		};

		const data: ScanCommandOutput = await this.client.send(new ScanCommand(params));

		return (data.Items || []).map(responseItem => new User(
			responseItem?.id?.N ? parseInt(responseItem?.id?.N) : undefined,
			responseItem?.email?.S,
			responseItem?.pass?.S
		));
	}
}
