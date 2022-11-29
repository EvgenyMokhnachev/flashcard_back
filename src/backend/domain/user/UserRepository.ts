import User from "./User";
import UserFilter from "./UserFilter";

export default interface UserRepository {
  save(user: User): Promise<User>
  find(filter: UserFilter): Promise<User[]>;
}
