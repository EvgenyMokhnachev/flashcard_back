import { APIGatewayProxyEvent } from 'aws-lambda/trigger/api-gateway-proxy';
import AuthToken from "../../../domain/auth/AuthToken";
import userService from "../../../domain/user/UserService";

// .POST("/auth"
export const AuthHandler = async (event: APIGatewayProxyEvent): Promise<AuthToken | object | undefined | null> => {
	try {
		const postData = JSON.parse(event.body || '{}');
		return await userService.auth(postData);
	} catch (error) {
		console.log('error', error);
		return {
			statusCode: 500,
			body: JSON.stringify({message: 'Internal Server Error', data: JSON.stringify(error)}),
		};
	}
};
