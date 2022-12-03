import Folder from "./Folder";
import FoldersFilter from "./FoldersFilter";

export default interface FolderRepository {
  save(card: Folder): Promise<Folder>
  find(filter: FoldersFilter): Promise<Folder[]>;
  findById(id: number): Promise<Folder | undefined>;
  delete(id: number): Promise<boolean>;
}
