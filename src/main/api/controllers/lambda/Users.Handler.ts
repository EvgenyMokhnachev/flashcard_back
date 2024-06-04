import UsersFilterRequest from "../../requests/UsersFilterRequest";
import { userRepository } from "../../../database/DatabaseBeanConfig";
import User from "../../../domain/user/User";
import PaginationResponse from "../../PaginationResponse";
import userResponseMapper from "../../responses/UserResponseMapper";
import { UserResponse } from "../../responses/UserResponse";
import { LambdaAuthHandler } from "../../LambdaAuthHandler";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";

// .POST("/users/get"
export const GetUsersHandler = async (event: APIGatewayProxyEvent): Promise<PaginationResponse<UserResponse> | object | undefined | null> => {
	const userId = await LambdaAuthHandler(event);
	const body = JSON.parse(event.body || '{}');

	let filter = UsersFilterRequest.map(body);
	const users: User[] = await userRepository.find(filter);
	return (new PaginationResponse<UserResponse>(userResponseMapper.maps(users)));
};
