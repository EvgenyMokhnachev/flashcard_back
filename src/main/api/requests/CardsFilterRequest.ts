import CardFilter from "../../domain/cards/CardFilter";
import CardDifficultType from "../../domain/cards/CardDifficultType";

export default class CardsFilterRequest {
  ids?: number[];
  userIds?: number[];
  folderIds?: number[];
  difficultTypes?: CardDifficultType[];
  private bookmarked?: boolean;
  private createdAtFrom?: Date;
  private createdAtTo?: Date;

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
    if (request.difficultTypes && request.difficultTypes.length) {
      filter.byDifficultTypes(request.difficultTypes);
    }
    if (request.bookmarked !== undefined && request.bookmarked !== null) {
      filter.byBookmarked(request.bookmarked);
    }
    if (request.createdAtFrom !== undefined && request.createdAtFrom !== null) {
      filter.byCreatedAtFrom(request.createdAtFrom);
    }
    if (request.createdAtTo !== undefined && request.createdAtTo !== null) {
      filter.byCreatedAtTo(request.createdAtTo);
    }
    return filter;
  }
}
