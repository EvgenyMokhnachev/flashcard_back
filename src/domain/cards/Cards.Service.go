package cards

import (
	"errors"
	"flashcards_backend/src/domain/management"
	"time"
)

type CardService struct {
	cardRepository   CardRepository
	folderRepository FolderRepository
	userRepository   management.UserRepository
}

func NewCardService(cardRepository CardRepository, folderRepository FolderRepository, userRepository management.UserRepository) CardService {
	return CardService{cardRepository: cardRepository, folderRepository: folderRepository, userRepository: userRepository}
}

func (s CardService) DeleteCard(cardId *int, actorUserId *int) (bool, error) {
	if cardId == nil {
		return false, errors.New("card id is required")
	}

	card, err := s.cardRepository.FindById(cardId)
	if err != nil {
		return false, err
	}

	if card == nil {
		return false, errors.New("card not found")
	}

	if actorUserId != nil {
		if *card.UserId != *actorUserId {
			return false, errors.New("You can't manage the card")
		}
	}

	return s.cardRepository.Delete(cardId)
}

type CardManageDto struct {
	Id         *int    `json:"id"`
	FolderId   *int    `json:"folderId"`
	UserId     *int    `json:"userId"`
	FrontSide  *string `json:"frontSide"`
	BackSide   *string `json:"backSide"`
	Bookmarked *bool   `json:"bookmarked"`
	Difficult  *int    `json:"difficult"`
}

func (s CardService) UpdateCard(data CardManageDto, actorUserId *int) (*Card, error) {
	if data.Id == nil {
		return nil, errors.New("card id is required")
	}

	card, err := s.cardRepository.FindById(data.Id)
	if err != nil {
		return nil, err
	}
	if card == nil {
		return nil, errors.New("card not found")
	}

	if actorUserId != nil {
		if *card.UserId != *actorUserId {
			return nil, errors.New("You can't manage the card")
		}
	}

	if data.FolderId != nil {
		folder, err := s.folderRepository.FindById(data.FolderId)
		if err != nil {
			return nil, err
		}
		if folder == nil {
			return nil, errors.New("folder not found")
		}
		card.FolderId = data.FolderId
	}

	if data.UserId != nil {
		user, err := s.userRepository.FindById(data.UserId)
		if err != nil {
			return nil, err
		}
		if user == nil {
			return nil, errors.New("User not found")
		}
		card.UserId = data.UserId
	}

	if data.FrontSide != nil {
		card.FrontSide = data.FrontSide
	}

	if data.BackSide != nil {
		card.BackSide = data.BackSide
	}

	if data.Bookmarked != nil {
		card.Bookmarked = data.Bookmarked
	}

	if data.Difficult != nil {
		card.Difficult = data.Difficult
		now := time.Now()
		card.DifficultChangeTime = &now
	}

	return s.cardRepository.Update(card)
}

func (s CardService) CreateCard(data CardManageDto, actorUserId *int) (*Card, error) {
	if actorUserId == nil {
		return nil, errors.New("actor user id is required")
	}
	data.UserId = actorUserId

	if data.FolderId == nil {
		return nil, errors.New("folder id is required")
	}

	folder, err := s.folderRepository.FindById(data.FolderId)
	if err != nil {
		return nil, err
	}
	if folder == nil {
		return nil, errors.New("folder not found")
	}

	if *folder.UserId != *data.UserId {
		return nil, errors.New("You can't manage the card")
	}

	difficultToStore := 1
	if data.Difficult != nil {
		difficultToStore = *data.Difficult
	}

	bookmarkedToStore := false
	if data.Bookmarked != nil {
		bookmarkedToStore = *data.Bookmarked
	}

	now := time.Now()

	card := Card{
		Id:                  nil,
		FolderId:            data.FolderId,
		UserId:              data.UserId,
		FrontSide:           data.FrontSide,
		BackSide:            data.BackSide,
		Bookmarked:          &bookmarkedToStore,
		Difficult:           &difficultToStore,
		DifficultChangeTime: &now,
		CreatedAt:           &now,
	}

	return s.cardRepository.Insert(&card)
}
