import Folder from "./Folder";
import FoldersFilter from "./FoldersFilter";

export default interface FolderRepository {
  save(folder: Folder): Promise<Folder>
  find(filter: FoldersFilter): Promise<Folder[]>;
  findById(id: number): Promise<Folder | null>;
  delete(id: number): Promise<boolean>;
}
