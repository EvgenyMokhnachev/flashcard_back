import { AuthHandler } from "./Auth.Handlers";
import { CreateCardHandler, DeleteCardHandler, GetCardsHandler, UpdateCardHandler } from "./Card.Handler";
import {
	CreateFolderHandler,
	DeleteFolderHandler,
	GetFoldersHandler,
	GetFoldersTreeHandler,
	UpdateFolderHandler
} from "./Folders.Handlers";
import { GetUsersHandler } from "./Users.Handler";
import { LambdaAuthHandler } from "../../LambdaAuthHandler";

export const handler = async (event: any): Promise<any> => {
	// try {
	// 	const userId = await LambdaAuthHandler(event);
	// 	return userId;
	// } catch (e) {
	// 	return 'error: ' + (e as any).message;
	// }

	try {
		switch (event.requestContext.http.path) {
			case '/auth':
				return await AuthHandler(event);
			case '/cards/create':
				return await CreateCardHandler(event);
			case '/cards/update':
				return await UpdateCardHandler(event);
			case '/cards/delete':
				return await DeleteCardHandler(event);
			case '/cards/get':
				return await GetCardsHandler(event);
			case '/folders/create':
				return await CreateFolderHandler(event);
			case '/folders/get':
				return await GetFoldersHandler(event);
			case '/folders/get/tree':
				return await GetFoldersTreeHandler(event);
			case '/folders/delete':
				return await DeleteFolderHandler(event);
			case '/folders/update':
				return await UpdateFolderHandler(event);
			case '/users/get':
				return await GetUsersHandler(event);
		}

		return {
			statusCode: 500,
			body: JSON.stringify({
				message: 'Internal Server Error',
				error: 'Handler is not found by path: ' + event.path
			})
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({
				message: 'Internal Server Error',
				error: JSON.stringify(error as any),
				errorMessage: (error as any)?.message || '',
			})
		};
	}
};
