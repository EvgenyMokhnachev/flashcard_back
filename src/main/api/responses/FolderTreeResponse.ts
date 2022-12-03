import {FolderResponse} from "./FolderResponse";
import {FolderTreeParentResponse} from "./FolderTreeParentResponse";

export class FolderTreeResponse extends FolderResponse {
  public parent?: FolderTreeParentResponse;
  public children?: FolderTreeResponse[];

  constructor(id?: number, name?: string, parentId?: number | null, userId?: number, parent?: FolderTreeParentResponse, children?: FolderTreeResponse[]) {
    super(id, name, parentId, userId);
    this.parent = parent;
    this.children = children;
  }
}
