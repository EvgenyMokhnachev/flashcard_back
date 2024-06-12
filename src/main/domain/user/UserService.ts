import { authTokenRepository, userRepository } from "../../database/DatabaseBeanConfig";
import User from "./User";
import { AuthRequest } from "../../api/requests/AuthRequest";
import UserFilter from "./UserFilter";
import { randomUUID } from "crypto";
import AuthToken from "../auth/AuthToken";

class AuthService {

	public async checkToken(token?: string): Promise<number> {
		if (!token) {
			throw new Error("Token not found");
		}

		let userId = undefined;

		let authToken: AuthToken | null = await authTokenRepository.findOne(token);
		if (authToken && authToken.userId) {
			userId = authToken.userId;
		}

		if (!userId) {
			throw new Error("Token not found");
		}

		authTokenRepository.save(new AuthToken(token, userId));

		return userId;
	}

	private async generateAuthToken(user: User): Promise<AuthToken | null> {
		if (!user || !user.id) return null;
		let token: string = randomUUID();
		const tokenObj = new AuthToken(token, user.id);
		await authTokenRepository.save(tokenObj);
		return tokenObj;
	}

	public async auth(authData: AuthRequest): Promise<AuthToken | null | undefined> {
		if (!authData.email) {
			throw new Error("Email is required");
		}

		if (!authData.pass) {
			throw new Error("Password is required");
		}

		let users = [];
		try {
			users = await userRepository.find(UserFilter.create().byEmail(authData.email));
		} catch (e) {
			throw e;
		}

		if (users && users.length) {
			let foundUser = users.find(user => user.pass === authData.pass);
			if (foundUser) {
				return await this.generateAuthToken(foundUser);
			}

			if (!foundUser) {
				throw Error("User password doesn't match");
			}
		} else {
			let userToRegister = new User(
				undefined, authData.email, authData.pass
			);
			let registeredUser = await userRepository.save(userToRegister);

			return await this.generateAuthToken(registeredUser);
		}
	}

}

export const userService: AuthService = new AuthService();
export default userService;
