import {userRepository} from "../../database/DatabaseBeanConfig";
import User from "./User";
import {AuthRequest} from "../../api/requests/AuthRequest";
import UserFilter from "./UserFilter";
import {randomUUID} from "crypto";
import AuthToken from "../auth/AuthToken";

class AuthService {

  private authUsersMap: Map<string, number>  = new Map<string, number>();

  public checkToken(token?: string): number {
    if (!token) {
      throw new Error("Token not found");
    }

    let userId = this.authUsersMap.get(token);
    if (!userId) {
      throw new Error("Token not found");
    }
    return userId;
  }

  private generateAuthToken(user: User): AuthToken | undefined {
    if (!user || !user.id) return;
    let token: string = randomUUID();
    this.authUsersMap.set(token, user.id);
    return new AuthToken(token, user.id);
  }

  public async auth(authData: AuthRequest): Promise<AuthToken | undefined> {
    let users = await userRepository.find(UserFilter.create().byEmail(authData.email));

    if (users && users.length) {
      let foundUser = users.find(user => user.pass === authData.pass);
      if (foundUser) {
        return this.generateAuthToken(foundUser);
      }

      if (!foundUser) {
        throw Error("User password doesn't match");
      }
    } else {
      let userToRegister = new User();
      userToRegister.email = authData.email;
      userToRegister.pass = authData.pass;
      let registeredUser = await userRepository.save(userToRegister);

      return this.generateAuthToken(registeredUser);
    }
  }

}

export const userService: AuthService = new AuthService();
export default userService;
