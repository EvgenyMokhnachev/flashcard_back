export class FolderParentInCycleError extends Error {
  private static message: string = 'New Parent folder is cycled';
  private static code: number = 106;

  constructor() {
    super(FolderParentInCycleError.message);
  }
}
