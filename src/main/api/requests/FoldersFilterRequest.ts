import FoldersFilter from "../../domain/folders/FoldersFilter";

export default class FoldersFilterRequest {
  ids?: number[];
  userIds?: number[];
  parentIds?: number[];
  onlyRoot?: boolean;

  public static map(data: FoldersFilterRequest): FoldersFilter {
    const filter = new FoldersFilter();

    if (data.ids) {
      filter.byIds(data.ids);
    }

    if (data.parentIds) {
      filter.byParentIds(data.parentIds);
    }

    if (data.userIds) {
      filter.byUserIds(data.userIds);
    }

    if (data.onlyRoot) {
      filter.byOnlyRoot(data.onlyRoot);
    }

    return filter;
  }

}
