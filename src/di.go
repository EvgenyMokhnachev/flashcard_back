package src

import (
	"flashcards_backend/src/domain/cards"
	"flashcards_backend/src/domain/management"
	"flashcards_backend/src/persistance/pgsql"
)

type diContainer struct {
	userRepository      management.UserRepository
	authTokenRepository management.AuthTokenRepository
	authService         management.AuthService
	folderRepository    cards.FolderRepository
	folderTreeService   cards.FolderTreeService
	folderService       cards.FolderService
	cardRepository      cards.CardRepository
	cardService         cards.CardService
}

func (d diContainer) UserRepository() management.UserRepository {
	return d.userRepository
}

func (d diContainer) AuthTokenRepository() management.AuthTokenRepository {
	return d.authTokenRepository
}

func (d diContainer) AuthService() management.AuthService {
	return d.authService
}

func (d diContainer) FolderRepository() cards.FolderRepository {
	return d.folderRepository
}

func (d diContainer) FolderTreeService() cards.FolderTreeService {
	return d.folderTreeService
}

func (d diContainer) FolderService() cards.FolderService {
	return d.folderService
}

func (d diContainer) CardRepository() cards.CardRepository {
	return d.cardRepository
}

func (d diContainer) CardService() cards.CardService {
	return d.cardService
}

func initDIContainer() diContainer {
	userRepository := pgsql.UserRepositoryPgSql{}
	authTokenRepository := pgsql.AuthTokenRepositoryPgSql{}

	authService := management.NewAuthService(authTokenRepository, userRepository)

	folderRepository := pgsql.FolderRepositoryPgSql{}
	folderTreeService := cards.NewFolderTreeService(folderRepository)

	cardRepository := pgsql.CardRepositoryPgSql{}

	folderService := cards.NewFolderService(folderRepository, cardRepository)

	cardService := cards.NewCardService(cardRepository, folderRepository, userRepository)

	return diContainer{
		userRepository:      userRepository,
		authTokenRepository: authTokenRepository,
		authService:         authService,
		folderRepository:    folderRepository,
		folderTreeService:   folderTreeService,
		folderService:       folderService,
		cardRepository:      cardRepository,
		cardService:         cardService,
	}
}

var DI = initDIContainer()
