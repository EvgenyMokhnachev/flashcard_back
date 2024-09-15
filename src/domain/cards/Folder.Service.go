package cards

import (
	"errors"
)

type FolderService struct {
	folderRepository FolderRepository
	cardRepository   CardRepository
}

func NewFolderService(folderRepository FolderRepository, cardRepository CardRepository) FolderService {
	return FolderService{folderRepository: folderRepository, cardRepository: cardRepository}
}

func (s FolderService) CreateFolder(name *string, parentId *int, userId *int) (folder *Folder, err error) {
	if userId == nil {
		return nil, errors.New("userId is required")
	}

	if name == nil {
		return nil, errors.New("name is required")
	}

	if parentId != nil {
		parentFolder, err := s.folderRepository.FindById(parentId)
		if err != nil {
			return nil, err
		}

		if parentFolder == nil {
			return nil, errors.New("parent folder not found")
		}
	}

	folder = &Folder{
		Id:       nil,
		Name:     name,
		ParentId: parentId,
		UserId:   userId,
	}

	folder, err = s.folderRepository.Insert(folder)
	if err != nil {
		return nil, err
	}

	return folder, nil
}

func (s FolderService) GetAllParentIds(folder *Folder, ids *[]int) (parentIds *[]int, err error) {
	if ids == nil {
		idsSlice := make([]int, 0)
		ids = &idsSlice
	}

	if folder == nil {
		return ids, nil
	}

	var parentFolder *Folder = nil
	if folder.ParentId != nil {
		parentFolder, err = s.folderRepository.FindById(folder.ParentId)
		if err != nil {
			return nil, err
		}
	}

	return s.GetAllParentIds(parentFolder, ids)
}

func (s FolderService) findFoldersCycle(folder *Folder, parentFolder *Folder) (bool, error) {
	if parentFolder == nil {
		return false, nil
	}
	if folder == nil {
		return false, nil
	}
	if folder.Id == nil {
		return false, nil
	}

	parentFoldersIds := make([]int, 0)
	allParentIds, err := s.GetAllParentIds(parentFolder, &parentFoldersIds)
	if err != nil {
		return true, err
	}

	if allParentIds == nil {
		return false, nil
	}

	for _, parentFolderId := range *allParentIds {
		if parentFolderId == *folder.Id {
			return true, nil
		}
	}

	return false, nil
}

func (s FolderService) UpdateFolder(folderId *int, parentId *int, userId *int, name *string, actorUserId *int) (folder *Folder, err error) {
	if folderId == nil {
		return nil, errors.New("folderId is required")
	}

	folder, err = s.folderRepository.FindById(folderId)
	if err != nil {
		return nil, err
	}
	if folder == nil {
		return nil, errors.New("folder not found")
	}

	if parentId != nil {
		parentFolder, err := s.folderRepository.FindById(parentId)
		if err != nil {
			return nil, err
		}
		if parentFolder == nil {
			return nil, errors.New("parent folder not found")
		}

		treeIsCycle, err := s.findFoldersCycle(folder, parentFolder)
		if err != nil {
			return nil, err
		}

		if treeIsCycle {
			return nil, errors.New("folder cycle found")
		}
	}

	if actorUserId != nil && folder.UserId != nil {
		if *folder.UserId != *actorUserId {
			return nil, errors.New("actor is not a owner of folder")
		}
	}

	if userId != nil {
		folder.UserId = userId
	}

	if parentId != nil {
		folder.ParentId = parentId
	}

	if name != nil {
		if len(*name) < 1 {
			return nil, errors.New("name is required")
		}
		folder.Name = name
	}

	folder, err = s.folderRepository.Update(folder)
	if err != nil {
		return nil, err
	}

	return folder, nil
}

func (s FolderService) DeleteFolder(folderId *int, actorUserId *int) (bool, error) {
	if folderId == nil {
		return false, errors.New("folderId is required")
	}

	folder, err := s.folderRepository.FindById(folderId)
	if err != nil {
		return false, err
	}
	if folder == nil {
		return false, errors.New("folder not found")
	}

	if actorUserId != nil {
		if folder.UserId != nil {
			if *folder.UserId != *actorUserId {
				return false, errors.New("actor is not a owner of folder")
			}
		}
	}

	//var subsClearWG sync.WaitGroup
	//subsClearWG.Add(1)
	//go (func() {})
	// todo use go rutine
	childFolders, err := s.folderRepository.Find(FolderFilter{ParentIds: &([]int{*folderId})})
	if err != nil {
		return false, err
	}

	if childFolders != nil && (len(*childFolders) > 0) {
		for _, childFolder := range *childFolders {
			childFolder.ParentId = nil
			// TODO тут сделать транзакцию
			_, err := s.folderRepository.Update(childFolder)
			if err != nil {
				return false, err
			}
		}
	}

	// todo use go rutine
	cardsByFolder, err := s.cardRepository.Find(CardFilter{FolderIds: &([]int{*folderId})})
	if err != nil {
		return false, err
	}
	if cardsByFolder != nil && len(cardsByFolder) > 0 {
		for _, card := range cardsByFolder {
			card.FolderId = nil
			_, err := s.cardRepository.Update(&card)
			if err != nil {
				return false, err
			}
		}
	}

	folderIsDeleted, err := s.folderRepository.Delete(folderId)
	if err != nil {
		return false, err
	}

	return folderIsDeleted, nil
}
