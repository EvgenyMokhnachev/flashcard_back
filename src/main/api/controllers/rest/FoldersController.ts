import {EndpointBuilder} from "../../HttpApiBuilder";
import {folderRepository} from "../../../database/DatabaseBeanConfig";
import PaginationResponse from "../../PaginationResponse";
import FolderManageDto from "../../../domain/folders/FolderManageDto";
import foldersService from "../../../domain/folders/FoldersService";
import FoldersFilterRequest from "../../requests/FoldersFilterRequest";
import Folder from "../../../domain/folders/Folder";
import foldersTreeService from "../../../domain/folders/FoldersTreeService";
import FolderTree from "../../../domain/folders/FolderTree";
import folderTreeResponseMapper from "../../responses/FolderTreeResponseMapper";
import {FolderTreeResponse} from "../../responses/FolderTreeResponse";

EndpointBuilder
  .POST("/folders/create", async (req, res) => {
    let createDto = new FolderManageDto(
      undefined,
      req.body.name,
      req.userId,
      req.body.parentId
    );
    let item = await foldersService.createFolder(createDto);
    res.json(item);
  })
  .authenticated()
  .build();

EndpointBuilder
  .POST("/folders/get", async (req, res) => {
    let filter = FoldersFilterRequest.map(req.body);
    let items: Folder[] = await folderRepository.find(filter);
    res.json(new PaginationResponse<Folder>(items, undefined));
  })
  .authenticated()
  .build();

EndpointBuilder
  .POST("/folders/get/tree", async (req, res) => {
    let filter = FoldersFilterRequest.map(req.body);
    let folderTrees: FolderTree[] = await foldersTreeService.getTree(filter);
    let foldersTreeResponses = folderTreeResponseMapper.maps(folderTrees);

    res.json(new PaginationResponse<FolderTreeResponse>(foldersTreeResponses, undefined));
  })
  .authenticated()
  .build();

EndpointBuilder
  .POST("/folders/delete", async (req, res) => {
    let success = await foldersService.deleteFolder(req.body.folderId, req.userId);
    res.json({success});
  })
  .authenticated()
  .build();

EndpointBuilder
  .POST("/folders/update", async (req, res) => {
    let manageDto = new FolderManageDto(
      req.body.id,
      req.body.name,
      req.userId,
      req.body.parentId
    );
    let item = await foldersService.updateFolder(manageDto, req.userId);
    res.json(item);
  })
  .authenticated()
  .build();
