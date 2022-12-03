export class FolderNameEmptyError extends Error {
  private static message: string = 'Name of folder should be filled';
  private static code: number = 101;

  constructor() {
    super(FolderNameEmptyError.message);
  }
}
