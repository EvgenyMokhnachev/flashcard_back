export class FolderManagementForbiddenError extends Error {
  private static message: string = 'User can not manage folder';
  private static code: number = 104;

  constructor(userId?: number) {
    super(FolderManagementForbiddenError.message + userId ? (": " + userId) : '');
  }
}
