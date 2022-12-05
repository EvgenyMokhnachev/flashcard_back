import CardDifficultType from "./CardDifficultType";

export default class {
  public id?: number;
  public folderId?: number | null;
  public userId?: number;
  public frontSide?: string;
  public backSide?: string;
  public difficult?: CardDifficultType;

  constructor(id?: number, folderId?: number | null, userId?: number, frontSide?: string, backSide?: string, difficult?: CardDifficultType) {
    this.id = id;
    this.folderId = folderId;
    this.userId = userId;
    this.frontSide = frontSide;
    this.backSide = backSide;
    this.difficult = difficult;
  }
}
