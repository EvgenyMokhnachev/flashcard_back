import {FolderNotFoundError} from "./FolderNotFoundError";

export class FolderParentNotFoundError extends FolderNotFoundError {
  constructor(parentId?: number) {
    super(parentId);
  }
}
