import Folder from "../../../domain/folders/Folder";
import FolderPgSql from "./FolderPgSql";

class FolderPgSqlMapper {

  public toDb(data: Folder): FolderPgSql {
    return new FolderPgSql(
      data.id,
      data.name,
      data.parentId,
      data.userId
    )
  }

  public toDto(data: FolderPgSql): Folder {
    return new Folder(
      data.id,
      data.name,
      data.parentId,
      data.userId
    );
  }

}

export const folderPgSqlMapper = new FolderPgSqlMapper();
export default folderPgSqlMapper;
