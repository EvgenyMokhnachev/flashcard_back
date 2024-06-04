export default class User {
  constructor(
    public id: number | undefined,
    public email: string | undefined,
    public pass: string | undefined
  ) {}
}
