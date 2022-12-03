export default class FoldersFilter {
  private _ids?: number[];
  private _parentIds?: number[];
  private _userIds?: number[];
  private _onlyRoot?: boolean;

  public static create(): FoldersFilter {
    return new FoldersFilter();
  }

  public byId(id: number): FoldersFilter {
    this._ids = [id];
    return this;
  }

  public byIds(ids: number[]): FoldersFilter {
    this._ids = ids;
    return this;
  }

  public byUserId(userId: number): FoldersFilter {
    this._userIds = [userId];
    return this;
  }

  public byUserIds(userIds: number[]): FoldersFilter {
    this._userIds = userIds;
    return this;
  }

  public byParentId(parentId: number): FoldersFilter {
    this._parentIds = [parentId];
    return this;
  }

  public byParentIds(parentIds: number[]): FoldersFilter {
    this._parentIds = parentIds;
    return this;
  }

  public byOnlyRoot(onlyRoot: boolean): FoldersFilter {
    this._onlyRoot = onlyRoot;
    return this;
  }

  get ids(): number[] | undefined {
    return this._ids;
  }

  get parentIds(): number[] | undefined {
    return this._parentIds;
  }

  get userIds(): number[] | undefined {
    return this._userIds;
  }

  get onlyRoot(): boolean | undefined {
    return this._onlyRoot;
  }
}
