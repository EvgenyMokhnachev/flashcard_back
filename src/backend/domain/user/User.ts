export default class User {
  public id?: number;
  public email?: string;
  public pass?: string;

  constructor(id?: number, email?: string, pass?: string) {
    this.id = id || undefined;
    this.email = email || undefined;
    this.pass = pass || undefined;
  }

}
