import UserFilter from "../../domain/user/UserFilter";

export default class UsersFilterRequest {
  ids?: number[];

  public static map(data: UsersFilterRequest): UserFilter {
    const filter = new UserFilter();

    if (data.ids) {
      filter.byIds(data.ids);
    }

    return filter;
  }

}
