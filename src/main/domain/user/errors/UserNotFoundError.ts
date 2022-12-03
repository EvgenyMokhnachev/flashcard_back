export class UserNotFoundError extends Error {
  private static message: string = 'User not found';
  private static code: number = 300;

  constructor(id?: number) {
    super(UserNotFoundError.message + ": " + id);
  }
}
