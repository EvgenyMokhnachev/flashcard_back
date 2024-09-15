package cards

type FolderTreeService struct {
	folderRepository FolderRepository
}

func NewFolderTreeService(folderRepository FolderRepository) FolderTreeService {
	return FolderTreeService{folderRepository: folderRepository}
}

func (s FolderTreeService) writeParents(folder *FolderTree) error {
	if folder == nil {
		return nil
	}

	if folder.ParentId == nil {
		return nil
	}

	parent, err := s.folderRepository.FindById(folder.ParentId)
	if err != nil {
		return err
	}

	if parent != nil {
		parentTree := new(FolderTree)
		parentTree.Folder = parent
		folder.Parent = parentTree
		return s.writeParents(parentTree)
	}

	return nil
}

func (s FolderTreeService) GetTree(filter FolderFilter) (*[]*FolderTree, error) {
	folders, err := s.folderRepository.Find(filter)
	if err != nil {
		return nil, err
	}

	if folders == nil {
		foldersEmptySlice := make([]*Folder, 0)
		folders = &foldersEmptySlice
	}

	resultFolderTrees := make([]*FolderTree, len(*folders), len(*folders))
	for i, folder := range *folders {
		resultFolderTree := new(FolderTree)
		resultFolderTrees[i] = resultFolderTree
		resultFolderTrees[i].Folder = folder
		err := s.writeParents(resultFolderTrees[i])
		if err != nil {
			return nil, err
		}
	}

	return &resultFolderTrees, nil
}
