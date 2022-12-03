import {FolderResponse} from "./FolderResponse";

export class FolderTreeParentResponse extends FolderResponse {
  public parent?: FolderTreeParentResponse;

  constructor(id?: number, name?: string, parentId?: number | null, userId?: number, parent?: FolderTreeParentResponse) {
    super(id, name, parentId, userId);
    this.parent = parent;
  }
}
