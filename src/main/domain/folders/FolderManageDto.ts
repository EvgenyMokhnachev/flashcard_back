export default class {
  id?: number;
  name?: string;
  userId?: number;
  parentId?: number;

  constructor(id?: number, name?: string, userId?: number, parentId?: number) {
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.parentId = parentId;
  }
}
