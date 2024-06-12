import AuthTokenRepository from "../../../domain/auth/AuthTokenRepository";
import AuthToken from "../../../domain/auth/AuthToken";
import { randomUUID } from "crypto";

export default class AuthTokenRepositoryInMemory implements AuthTokenRepository {
	private cache: Record<string, number> = {};

	public async save(authToken: AuthToken): Promise<AuthToken> {
		authToken.token = authToken.token ? authToken.token : randomUUID();
		this.cache[authToken.token] = authToken.userId;
		return authToken;
	}

	public async findOne(token: string): Promise<AuthToken | null> {
		const userId = this.cache[token];
		if (userId) {
			return new AuthToken(token, userId);
		}
		return null;
	}
}
