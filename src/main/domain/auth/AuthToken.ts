export default class AuthToken {
  public token: string;
  public userId: number;

  constructor(token: string, userId: number) {
    this.token = token;
    this.userId = userId;
  }
}
