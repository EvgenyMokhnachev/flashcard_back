import Folder from "./Folder";

export default class FolderTree extends Folder {
  public parent?: FolderTree;
  public children?: FolderTree[];

  constructor(folder: Folder);
  constructor(folder: Folder, parent?: FolderTree, children?: FolderTree[]) {
    super(folder.id, folder.name, folder.parentId, folder.userId);
    this.parent = parent;
    this.children = children;
  }
}
