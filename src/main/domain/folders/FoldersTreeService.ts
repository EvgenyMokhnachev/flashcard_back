import {folderRepository} from "../../database/DatabaseBeanConfig";
import FoldersFilter from "./FoldersFilter";
import FolderTree from "./FolderTree";
import Folder from "./Folder";

class FoldersTreeService {

  public async getTree(filter: FoldersFilter): Promise<FolderTree[]> {
    // filter = filter.byOnlyRoot(true);
    let folders = await folderRepository.find(filter);

    if (!folders || !folders.length) {
      folders = [];
    }

    return await Promise.all(folders.map(async (folder: Folder) => {
      let parentFolder = folders.find(parentFolder => parentFolder.id == folder.parentId);
      return await this.processFolder(
        folder,
        parentFolder
      )
    }));
  }

  private async processFolder(folder: FolderTree, parent?: FolderTree): Promise<FolderTree> {
    if (!folder || !folder.id) {
      return folder;
    }

    if (parent && folder.parentId && folder.parentId == parent.id) {
      folder.parent = parent;
    }

    if (folder.parentId && !parent) {
      let parentFolders = await folderRepository.find(FoldersFilter.create().byId(folder.parentId));
      if (parentFolders && parentFolders.length) {
        const parentFolder = parentFolders[0];
        folder.parent = await this.processFolder(parentFolder);
      }
    }

    folder.children = (await folderRepository.find(FoldersFilter.create().byParentId(folder.id)));

    if (folder.children && folder.children.length) {
      await Promise.all(folder.children.map((children) => this.processFolder(children, folder)));
    }

    return folder;
  }

}

export const foldersTreeService = new FoldersTreeService();
export default foldersTreeService;
