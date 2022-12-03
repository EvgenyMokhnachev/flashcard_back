import User from "../../domain/user/User";
import {UserResponse} from "./UserResponse";

class UserResponseMapper {

  public map(user?: User): UserResponse | undefined {
    if (!user) return;
    return new UserResponse(
      user.id,
      user.email
    );
  }

  public maps(users?: User[]): UserResponse[] {
    const result: UserResponse[] = [];
    if (users && users.length) {
      users.forEach(user => {
        let userResponse = this.map(user);
        if (userResponse) {
          result.push(userResponse);
        }
      })
    }
    return result;
  }

}

export const userResponseMapper = new UserResponseMapper();
export default userResponseMapper;
