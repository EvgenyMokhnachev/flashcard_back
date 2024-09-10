package persistance

import (
	. "flashcards_backend/src/domain/management"
)

type AuthTokenRepositoryCacheManager struct {
	cacheRepo       AuthTokenRepository
	persistenceRepo AuthTokenRepository
}

func (m *AuthTokenRepositoryCacheManager) Insert(authToken *AuthToken) (*AuthToken, error) {
	persistenceInsert, err := m.persistenceRepo.Insert(authToken)
	if err != nil {
		return nil, err
	}

	cacheInsert, err := m.cacheRepo.Insert(persistenceInsert)
	if err != nil {
		return nil, err
	}

	return cacheInsert, nil
}

func (m *AuthTokenRepositoryCacheManager) Update(authToken *AuthToken) (*AuthToken, error) {
	persistenceInsert, err := m.persistenceRepo.Update(authToken)
	if err != nil {
		return nil, err
	}

	cacheInsert, err := m.cacheRepo.Update(persistenceInsert)
	if err != nil {
		return nil, err
	}

	return cacheInsert, nil
}

func (m *AuthTokenRepositoryCacheManager) FindByToken(token *string) (*AuthToken, error) {
	tokenFromCache, err := m.cacheRepo.FindByToken(token)
	if err != nil {
		return nil, err
	}

	if tokenFromCache != nil {
		return tokenFromCache, nil
	}

	tokenFromPersistence, err := m.persistenceRepo.FindByToken(token)
	if err != nil {
		return nil, err
	}

	go m.cacheRepo.Insert(tokenFromPersistence)

	return tokenFromPersistence, nil
}
