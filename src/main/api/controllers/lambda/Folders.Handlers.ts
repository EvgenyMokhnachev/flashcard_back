import { folderRepository } from "../../../database/DatabaseBeanConfig";
import PaginationResponse from "../../PaginationResponse";
import FolderManageDto from "../../../domain/folders/FolderManageDto";
import foldersService from "../../../domain/folders/FoldersService";
import FoldersFilterRequest from "../../requests/FoldersFilterRequest";
import Folder from "../../../domain/folders/Folder";
import foldersTreeService from "../../../domain/folders/FoldersTreeService";
import FolderTree from "../../../domain/folders/FolderTree";
import folderTreeResponseMapper from "../../responses/FolderTreeResponseMapper";
import { FolderTreeResponse } from "../../responses/FolderTreeResponse";
import { APIGatewayProxyEvent } from "aws-lambda/trigger/api-gateway-proxy";
import { LambdaAuthHandler } from "../../LambdaAuthHandler";

// .POST("/folders/create"
export const CreateFolderHandler = async (event: APIGatewayProxyEvent): Promise<Folder | object | undefined | null> => {
	const userId = await LambdaAuthHandler(event);
	const body = JSON.parse(event.body || '{}');

	let createDto = new FolderManageDto(
		undefined,
		body.name,
		userId,
		body.parentId
	);
	return await foldersService.createFolder(createDto);
};

// POST("/folders/get"
export const GetFoldersHandler = async (event: APIGatewayProxyEvent): Promise<PaginationResponse<Folder> | object | undefined | null> => {
	const userId = await LambdaAuthHandler(event);
	const body = JSON.parse(event.body || '{}');

	let filter = FoldersFilterRequest.map(body);
	let items: Folder[] = await folderRepository.find(filter);
	return new PaginationResponse<Folder>(items, undefined);
};

// .POST("/folders/get/tree"
export const GetFoldersTreeHandler = async (event: APIGatewayProxyEvent): Promise<PaginationResponse<FolderTreeResponse> | object | undefined | null> => {
	const userId = await LambdaAuthHandler(event);
	const body = JSON.parse(event.body || '{}');

	let filter = FoldersFilterRequest.map(body);
	let folderTrees: FolderTree[] = await foldersTreeService.getTree(filter);
	let foldersTreeResponses = folderTreeResponseMapper.maps(folderTrees);

	return (new PaginationResponse<FolderTreeResponse>(foldersTreeResponses, undefined));
};

// .POST("/folders/delete"
export const DeleteFolderHandler = async (event: APIGatewayProxyEvent): Promise<{
	success: boolean
} | object | undefined | null> => {
	const userId = await LambdaAuthHandler(event);
	const body = JSON.parse(event.body || '{}');

	let success = await foldersService.deleteFolder(body.folderId, userId);
	return ({success});
};

// .POST("/folders/update"
export const UpdateFolderHandler = async (event: APIGatewayProxyEvent): Promise<Folder | object | undefined | null> => {
	const userId = await LambdaAuthHandler(event);
	const body = JSON.parse(event.body || '{}');

	let manageDto = new FolderManageDto(
		body.id,
		body.name,
		userId,
		body.parentId
	);
	let item = await foldersService.updateFolder(manageDto, userId);
	return (item);
};
