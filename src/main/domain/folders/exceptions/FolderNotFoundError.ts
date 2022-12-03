export class FolderNotFoundError extends Error {
  private static message: string = 'Folder not found';
  private static code: number = 102;

  constructor(parentId?: number) {
    super(FolderNotFoundError.message + ": " + parentId);
  }
}
