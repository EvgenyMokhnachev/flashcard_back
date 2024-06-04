import { DynamoDBClient, GetItemCommand, GetItemCommandOutput } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, NumberValue, PutCommand } from "@aws-sdk/lib-dynamodb";
import AuthTokenRepository from "../../../domain/auth/AuthTokenRepository";
import AuthToken from "../../../domain/auth/AuthToken";
import { randomUUID } from "crypto";
import { AttributeValue } from "aws-lambda";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = "flashcards_auth_tokens";

export default class AuthTokenRepositoryDynamoDB implements AuthTokenRepository {

	public async save(authToken: AuthToken): Promise<AuthToken> {
		authToken.token = authToken.token ? authToken.token : randomUUID();
		await dynamo.send(
			new PutCommand({
				TableName: tableName,
				Item: {
					token: authToken.token,
					userId: NumberValue.from(authToken.userId)
				},
			})
		);
		return authToken;
	}

	public async findOne(token: string): Promise<AuthToken | null> {
		const params = new GetItemCommand({
			TableName: tableName,
			Key: {
				token: {S: token}
			}
		});

		const data: GetItemCommandOutput = await client.send(params);

		return (() => {
			const token: string | undefined = data.Item?.token?.S ? data.Item?.token?.S + '' : undefined;
			const userId: number | undefined = data.Item?.userId?.N ? parseInt(data.Item?.userId?.N) : undefined;
			return token && userId ? new AuthToken(token, userId) : null
		})();
	}
}
