import FolderTree from "../../domain/folders/FolderTree";
import {FolderTreeResponse} from "./FolderTreeResponse";
import folderTreeParentResponseMapper from "./FolderTreeParentResponseMapper";

class FolderTreeResponseMapper {

  public map(folder?: FolderTree): FolderTreeResponse | undefined {
    if (!folder) return;
    return new FolderTreeResponse(
      folder.id,
      folder.name,
      folder.parentId,
      folder.userId,
      folderTreeParentResponseMapper.map(folder.parent),
      this.maps(folder.children)
    );
  }

  public maps(folders?: FolderTree[]): FolderTreeResponse[] | undefined {
    if (!folders) return;
    const result: FolderTreeResponse[] = [];
    folders.forEach(folder => {
      let folderResponse = this.map(folder);
      if (folderResponse) {
        result.push(folderResponse);
      }
    });
    return result;
  }

}

export const folderTreeResponseMapper = new FolderTreeResponseMapper();
export default folderTreeResponseMapper;
