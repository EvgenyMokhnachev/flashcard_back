import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import userService from "../domain/user/UserService";
import HttpErrorResponse from "./HttpErrorResponse";

export const LambdaAuthHandler = async (event: APIGatewayProxyEvent): Promise<number> => {
  let token = event.headers['authorization'];

  if (!token) {
    token = event.headers['Authorization'];
  }

  try {
    return await userService.checkToken(token);
  } catch (e) {
    // res.status(403);
    // res.json(new HttpErrorResponse("You are not authorised", 100));
    throw new HttpErrorResponse(e as any, 100);
  }
}
