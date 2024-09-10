package management

type AuthToken struct {
	Token  *string `json:"token"`
	UserId *int    `json:"userId"`
}

func NewAuthToken(token string, userId int) *AuthToken {
	return &AuthToken{
		Token:  &token,
		UserId: &userId,
	}
}
