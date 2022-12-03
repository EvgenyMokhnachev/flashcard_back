export class FolderUserIdEmptyError extends Error {
  private static message: string = 'User id of folder should be filled';
  private static code: number = 100;

  constructor() {
    super(FolderUserIdEmptyError.message);
  }
}
