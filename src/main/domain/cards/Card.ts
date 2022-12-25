import CardDifficultType from "./CardDifficultType";

export default class {
  public id?: number;
  public folderId?: number | null;
  public userId?: number;
  public frontSide?: string;
  public backSide?: string;
  public difficult?: CardDifficultType;
  public difficultChangeTime?: Date;
  public createdAt?: Date;
  public bookmarked?: boolean;

  constructor(id?: number,
              folderId?: number | null, userId?: number,
              frontSide?: string, backSide?: string,
              difficult?: CardDifficultType, difficultChangeTime?: Date,
              createdAt?: Date,
              bookmarked?: boolean
  ) {
    this.id = id;
    this.folderId = folderId;
    this.userId = userId;
    this.frontSide = frontSide;
    this.backSide = backSide;
    this.difficult = difficult;
    this.difficultChangeTime = difficultChangeTime;
    this.createdAt = createdAt;
    this.bookmarked= bookmarked;
  }
}
