export default class {
  public id?: number;
  public folderId?: number | null;
  public userId?: number;
  public frontSide?: string;
  public backSide?: string;

  constructor(id?: number, folderId?: number | null, userId?: number, frontSide?: string, backSide?: string) {
    this.id = id;
    this.folderId = folderId;
    this.userId = userId;
    this.frontSide = frontSide;
    this.backSide = backSide;
  }
}
