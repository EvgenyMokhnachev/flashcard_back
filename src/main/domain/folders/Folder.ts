export default class Folder {
  public id?: number;
  public name?: string;
  public parentId?: number | null;
  public userId?: number;

  constructor(id?: number, name?: string, parentId?: number | null, userId?: number) {
    this.id = id;
    this.name = name;
    this.parentId = parentId;
    this.userId = userId;
  }
}
