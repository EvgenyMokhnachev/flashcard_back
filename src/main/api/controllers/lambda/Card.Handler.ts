import cardService from "../../../domain/cards/CardService";
import CardManageDto from "../../../domain/cards/CardManageDto";
import CardsFilterRequest from "../../requests/CardsFilterRequest";
import Card from "../../../domain/cards/Card";
import { cardRepository } from "../../../database/DatabaseBeanConfig";
import PaginationResponse from "../../PaginationResponse";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { LambdaAuthHandler } from "../../LambdaAuthHandler";

// .POST("/cards/create"
export const CreateCardHandler = async (event: APIGatewayProxyEvent): Promise<Card | object | undefined | null> => {
	const userId = await LambdaAuthHandler(event);
	const body = JSON.parse(event.body || '{}');

	let createCartDto = new CardManageDto(
		undefined,
		userId,
		body.folderId,
		body.frontSide,
		body.backSide,
		body.bookmarked,
	);
	let card = await cardService.createCard(createCartDto);
	return (card);
};

// .POST("/cards/update"
export const UpdateCardHandler = async (event: APIGatewayProxyEvent): Promise<Card | object | undefined | null> => {
	const userId = await LambdaAuthHandler(event);
	const body = JSON.parse(event.body || '{}');

	let manageCardDto = new CardManageDto(
		body.id,
		body.userId,
		body.folderId,
		body.frontSide,
		body.backSide,
		body.bookmarked,
		body.difficult,
	);
	let card = await cardService.updateCard(manageCardDto, userId);
	return (card);
};

// .POST("/cards/delete"
export const DeleteCardHandler = async (event: APIGatewayProxyEvent): Promise<{
	success: boolean
} | object | undefined | null> => {
	const userId = await LambdaAuthHandler(event);
	const body = JSON.parse(event.body || '{}');

	let cardId = body.id;
	let success = await cardService.delete(cardId, userId);
	return ({success});
};

// .POST("/cards/get"
export const GetCardsHandler = async (event: APIGatewayProxyEvent): Promise<PaginationResponse<Card> | object | undefined | null> => {
	const userId = await LambdaAuthHandler(event);
	const body = JSON.parse(event.body || '{}');

	let cardFilter = CardsFilterRequest.map(body);
	let cards: Card[] = await cardRepository.find(cardFilter);
	return (new PaginationResponse<Card>(cards, undefined));
};
