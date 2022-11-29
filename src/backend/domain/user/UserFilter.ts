export default class UserFilter {
  private _emails: string[];

  public static create(): UserFilter {
    return new UserFilter();
  }

  public byEmail(email: string): UserFilter {
    this._emails = [email];
    return this;
  }


  get emails(): string[] {
    return this._emails;
  }
}
