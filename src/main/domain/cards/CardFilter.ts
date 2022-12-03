export default class CardFilter {
  private _ids?: number[];
  private _userIds?: number[];
  private _folderIds?: number[];

  public static create(): CardFilter {
    return new CardFilter();
  }

  public byId(id: number): CardFilter {
    this._ids = [id];
    return this;
  }

  public byIds(ids: number[]): CardFilter {
    this._ids = ids;
    return this;
  }

  public byUserId(userId: number): CardFilter {
    this._userIds = [userId];
    return this;
  }

  public byUserIds(userIds: number[]): CardFilter {
    this._userIds = userIds;
    return this;
  }

  public byFolderIds(folderIds: number[]): CardFilter {
    this._folderIds = folderIds;
    return this;
  }

  public byFolderId(folderId: number): CardFilter {
    this._folderIds = [folderId];
    return this;
  }

  get ids(): number[] | undefined {
    return this._ids;
  }

  get userIds(): number[] | undefined {
    return this._userIds;
  }

  get folderIds(): number[] | undefined {
    return this._folderIds;
  }
}
