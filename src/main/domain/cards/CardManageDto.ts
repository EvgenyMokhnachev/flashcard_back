export default class {
  id?: number;
  userId?: number;
  folderId?: number;
  frontSide?: string;
  backSide?: string;

  constructor(id?: number, userId?: number, folderId?: number, frontSide?: string, backSide?: string) {
    this.id = id;
    this.userId = userId;
    this.folderId = folderId;
    this.frontSide = frontSide;
    this.backSide = backSide;
  }
}
