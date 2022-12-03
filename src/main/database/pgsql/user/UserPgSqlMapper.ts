import User from "../../../domain/user/User";
import UserPgSql from "./UserPgSql";

class UserPgSqlMapper {

  public toDb(user: User): UserPgSql {
    return new UserPgSql(
      user.id,
      user.email,
      user.pass
    )
  }

  public toDto(user: UserPgSql): User {
    return new User(
      user.id,
      user.email,
      user.pass
    );
  }

}

export default new UserPgSqlMapper();
