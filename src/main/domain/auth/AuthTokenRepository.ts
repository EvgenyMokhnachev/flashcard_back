import AuthToken from "./AuthToken";

export default interface AuthTokenRepository {
	save(authToken: AuthToken): Promise<AuthToken>
	findOne(token: string): Promise<AuthToken | null>;
}
