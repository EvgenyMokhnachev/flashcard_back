import CardFilter from "../../domain/cards/CardFilter";
import CardDifficultType from "../../domain/cards/CardDifficultType";

export default class CardsFilterRequest {
  ids?: number[];
  userIds?: number[];
  folderIds?: number[];
  difficultTypes?: CardDifficultType[];

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
    return filter;
  }
}
