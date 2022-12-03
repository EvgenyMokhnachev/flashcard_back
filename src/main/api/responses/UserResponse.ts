export class UserResponse {
  public id?: number;
  public email?: string;

  constructor(id?: number, email?: string) {
    this.id = id;
    this.email = email;
  }
}
