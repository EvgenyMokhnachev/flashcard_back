package management

type AuthTokenRepository interface {
	Insert(token *AuthToken) (*AuthToken, error)
	Update(token *AuthToken) (*AuthToken, error)
	FindByToken(token *string) (*AuthToken, error)
}
