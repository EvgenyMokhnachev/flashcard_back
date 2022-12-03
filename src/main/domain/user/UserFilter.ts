export default class UserFilter {
  private _ids?: number[];
  private _emails?: string[];

  public static create(): UserFilter {
    return new UserFilter();
  }

  public byEmail(email: string): UserFilter {
    this._emails = [email];
    return this;
  }

  public byId(id: number): UserFilter {
    this._ids = [id];
    return this;
  }

  public byIds(ids?: number[]): UserFilter {
    this._ids = ids;
    return this;
  }

  get emails(): string[] | undefined {
    return this._emails;
  }

  get ids(): number[] | undefined {
    return this._ids;
  }

}
