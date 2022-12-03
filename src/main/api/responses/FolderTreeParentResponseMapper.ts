import FolderTree from "../../domain/folders/FolderTree";
import {FolderTreeParentResponse} from "./FolderTreeParentResponse";

class FolderTreeParentResponseMapper {

  public map(folder?: FolderTree): FolderTreeParentResponse | undefined {
    if (!folder) return;
    return new FolderTreeParentResponse(
      folder.id,
      folder.name,
      folder.parentId,
      folder.userId,
      this.map(folder.parent)
    );
  }

}

export const folderTreeParentResponseMapper = new FolderTreeParentResponseMapper();
export default folderTreeParentResponseMapper;
