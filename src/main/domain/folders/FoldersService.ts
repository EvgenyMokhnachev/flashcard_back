import {cardRepository, folderRepository} from "../../database/DatabaseBeanConfig";
import Folder from "./Folder";
import FolderManageDto from "./FolderManageDto";
import {FolderUserIdEmptyError} from "./exceptions/FolderUserIdEmptyError";
import {FolderNameEmptyError} from "./exceptions/FolderNameEmptyError";
import FoldersFilter from "./FoldersFilter";
import {FolderParentNotFoundError} from "./exceptions/FolderParentNotFoundError";
import {FolderNotFoundError} from "./exceptions/FolderNotFoundError";
import {FolderManagementForbiddenError} from "./exceptions/FolderManagementForbiddenError";
import CardFilter from "../cards/CardFilter";
import Card from "../cards/Card";
import {FolderParentInCycleError} from "./exceptions/FolderParentInCycleError";

class FoldersService {

  public async createFolder(data: FolderManageDto): Promise<Folder> {
    if (!data.userId) {
      throw new FolderUserIdEmptyError()
    }

    if (!data.name) {
      throw new FolderNameEmptyError();
    }

    if (data.parentId) {
      let parent = await folderRepository.find(FoldersFilter.create().byId(data.parentId));
      if (!parent) {
        throw new FolderParentNotFoundError(data.parentId);
      }
    }

    let item = new Folder(
      undefined,
      data.name,
      data.parentId,
      data.userId
    );

    return await folderRepository.save(item);
  }

  private async getAllParentIds(folder?: Folder | null, parentIds?: number[]): Promise<number[]> {
    const result = parentIds ? [...parentIds] : [];
    if (!folder) return result;

    let parentFolder = undefined;
    if (folder.parentId) {
      result.push(folder.parentId);
      parentFolder = await folderRepository.findById(folder.parentId);
    }

    return await this.getAllParentIds(parentFolder, result);
  }

  private async findFoldersCycle(folder: Folder, parentFolder: Folder): Promise<boolean> {
    if (!parentFolder) return false;
    if (!folder) return false;
    if (!folder.id) return false;
    let allParentIds: number[] = await this.getAllParentIds(parentFolder);
    return allParentIds.indexOf(folder.id) > -1;
  }

  public async updateFolder(updateData: FolderManageDto, actorUserId: number) {
    if (!updateData.id) {
      throw new FolderNotFoundError(updateData.id);
    }

    let folder: Folder | null = await folderRepository.findById(updateData.id);
    if (!folder) {
      throw new FolderNotFoundError(updateData.id);
    }

    if (updateData.parentId) {
      let parentFolder: Folder | null = await folderRepository.findById(updateData.parentId);
      parentFolder?.parentId
      if (!parentFolder) {
        throw new FolderNotFoundError(updateData.parentId);
      }

      let foundCycle = await this.findFoldersCycle(folder, parentFolder);
      if (foundCycle) {
        throw new FolderParentInCycleError();
      }
    }

    if (actorUserId && folder.userId != actorUserId) {
      throw new FolderManagementForbiddenError(actorUserId);
    }

    if (updateData.userId !== undefined) {
      folder.userId = updateData.userId;
    }

    if (updateData.parentId !== undefined) {
      folder.parentId = updateData.parentId;
    }

    if (updateData.name !== undefined) {
      if (!updateData.name) {
        throw new FolderNameEmptyError();
      }
      folder.name = updateData.name;
    }

    folder = await folderRepository.save(folder);
    return folder;
  }

  public async deleteFolder(id?: number, actorId?: number): Promise<boolean> {
    if (!id) {
      throw new FolderNotFoundError(id);
    }

    const folder = await folderRepository.findById(id);
    if (!folder) {
      throw new FolderNotFoundError(id);
    }

    if (actorId && folder.userId != actorId) {
      throw new FolderManagementForbiddenError(actorId);
    }

    const childFolders: Folder[] = await folderRepository.find(FoldersFilter.create().byParentId(id));
    if (childFolders && childFolders.length) {
      for (let childFolder of childFolders) {
        childFolder.parentId = folder.parentId || null;
        childFolder = await folderRepository.save(childFolder);
      }
    }

    const cardsByFolder: Card[] = await cardRepository.find(CardFilter.create().byFolderId(id));
    if (cardsByFolder && cardsByFolder.length) {
      for (let cardByFolder of cardsByFolder) {
        cardByFolder.folderId = folder.parentId || null;
        cardByFolder = await cardRepository.save(cardByFolder);
      }
    }

    return await folderRepository.delete(id);
  }

}

export const foldersService = new FoldersService();
export default foldersService;
