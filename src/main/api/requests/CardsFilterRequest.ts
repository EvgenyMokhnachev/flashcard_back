import CardFilter from "../../domain/cards/CardFilter";

export default class CardsFilterRequest {
  ids?: number[];
  userIds?: number[];
  folderIds?: number[];

  public static map(request: CardsFilterRequest): CardFilter {
    const filter = new CardFilter();
    if (request.ids && request.ids.length) {
      filter.byIds(request.ids);
    }
    if (request.userIds && request.userIds.length) {
      filter.byUserIds(request.userIds);
    }
    if (request.folderIds && request.folderIds.length) {
      filter.byFolderIds(request.folderIds);
    }
    return filter;
  }
}
