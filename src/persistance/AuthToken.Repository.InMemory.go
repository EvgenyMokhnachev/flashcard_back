package persistance

import (
	"errors"
	. "flashcards_backend/src/domain/management"
	"flashcards_backend/src/utils"
)

type AuthTokenRepositoryInMemory struct {
}

var inMemoryCache = make(map[string]*int)

func (*AuthTokenRepositoryInMemory) Insert(authToken *AuthToken) (*AuthToken, error) {
	if authToken == nil {
		return nil, errors.New("authToken is nil")
	}

	if authToken.UserId == nil {
		return nil, errors.New("authToken.UserId is nil")
	}

	if authToken.Token == nil {
		uuid, err := utils.GenerateUUID()
		if err != nil {
			return nil, err
		}
		authToken.Token = uuid
	}

	inMemoryCache[*authToken.Token] = authToken.UserId

	return authToken, nil
}

func (*AuthTokenRepositoryInMemory) Update(authToken *AuthToken) (*AuthToken, error) {
	if authToken == nil {
		return nil, errors.New("authToken is nil")
	}

	if authToken.Token == nil {
		return nil, errors.New("authToken.Token is nil")
	}

	if authToken.UserId == nil {
		return nil, errors.New("authToken.UserId is nil")
	}

	inMemoryCache[*authToken.Token] = authToken.UserId

	return authToken, nil
}

func (*AuthTokenRepositoryInMemory) FindByToken(token *string) (*AuthToken, error) {
	if token == nil {
		return nil, errors.New("token is nil")
	}

	userId := inMemoryCache[*token]

	if userId == nil {
		return nil, nil
	}

	authToken := AuthToken{}
	authToken.Token = token
	authToken.UserId = userId
	return &authToken, nil
}
