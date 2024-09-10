package management

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"flashcards_backend/src/utils"
)

type AuthService struct {
	authTokenRepository AuthTokenRepository
	userRepository      UserRepository
}

func NewAuthService(
	authTokenRepository AuthTokenRepository,
	userRepository UserRepository,
) AuthService {
	return AuthService{
		authTokenRepository: authTokenRepository,
		userRepository:      userRepository,
	}
}

func (s AuthService) CheckToken(token *string) (userId *int, err error) {
	if token == nil {
		return nil, errors.New("token is not provided")
	}

	authToken, err := s.authTokenRepository.FindByToken(token)
	if err != nil {
		return nil, err
	}
	if authToken == nil {
		return nil, errors.New("auth token wasn't found")
	}

	return authToken.UserId, nil
}

func (s AuthService) GenerateAuthToken(user *User) (authToken *AuthToken, err error) {
	if user == nil {
		return nil, errors.New("user is not provided")
	}

	if user.Id == nil {
		return nil, errors.New("user.ID is not provided")
	}

	uuid, err := utils.GenerateUUID()
	if err != nil {
		return nil, err
	}

	authToken = &AuthToken{Token: uuid, UserId: user.Id}

	authToken, err = s.authTokenRepository.Insert(authToken)
	if err != nil {
		return nil, err
	}

	return authToken, nil
}

func (s AuthService) Auth(email *string, pass *string) (authToken *AuthToken, err error) {
	if email == nil {
		return nil, errors.New("email is not provided")
	}

	if pass == nil {
		return nil, errors.New("password is not provided")
	}

	passHash := hashSHA256(*pass)

	users, err := s.userRepository.Find(UserFilter{Emails: &[]string{*email}})
	if err != nil {
		return nil, err
	}

	if users == nil || len(users) == 0 {
		user := &User{Email: email, Pass: &passHash}
		user, err := s.userRepository.Insert(user)
		if err != nil {
			return nil, err
		}

		authToken, err := s.GenerateAuthToken(user)
		if err != nil {
			return nil, err
		}

		return authToken, nil
	} else {
		var passMatchedUser *User = nil
		for _, user := range users {
			if *user.Pass == passHash {
				passMatchedUser = user
				break
			}
		}

		if passMatchedUser != nil {
			authToken, err := s.GenerateAuthToken(passMatchedUser)
			if err != nil {
				return nil, err
			}

			return authToken, nil
		} else {
			return nil, errors.New("password is not correct")
		}
	}
}

func hashSHA256(data string) string {
	hasher := sha256.New()
	hasher.Write([]byte(data))
	return hex.EncodeToString(hasher.Sum(nil))
}
