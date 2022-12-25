import CardDifficultType from "./CardDifficultType";

export default class {
  id?: number;
  userId?: number;
  folderId?: number;
  frontSide?: string;
  backSide?: string;
  difficult?: CardDifficultType;
  bookmarked?: boolean;

  constructor(id?: number, userId?: number, folderId?: number, frontSide?: string, backSide?: string,
              bookmarked?: boolean, difficult?: CardDifficultType
  ) {
    this.id = id;
    this.userId = userId;
    this.folderId = folderId;
    this.frontSide = frontSide;
    this.backSide = backSide;
    this.difficult = difficult;
    this.bookmarked = bookmarked;
  }
}
