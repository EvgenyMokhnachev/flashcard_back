package cards

type FolderTreeService struct {
	folderRepository FolderRepository
}

func NewFolderTreeService(folderRepository FolderRepository) FolderTreeService {
	return FolderTreeService{folderRepository: folderRepository}
}

func (s FolderTreeService) GetTree(filter FolderFilter) ([]FolderTree, error) {
	folders, err := s.folderRepository.Find(filter)
	if err != nil {
		return nil, err
	}

	if folders == nil {
		foldersEmptySlice := make([]Folder, 0)
		folders = foldersEmptySlice
	}

	foldersCache := make(map[int]*FolderTree)
	resultFolderTrees := make([]FolderTree, 0, len(folders))
	// just fill the foldersCache
	for _, folder := range folders {
		folderTree := foldersCache[*folder.Id]
		if folderTree == nil {
			folderTree = &FolderTree{Folder: folder}
			foldersCache[*folder.Id] = folderTree
			resultFolderTrees = append(resultFolderTrees, *folderTree)
		}

		var parentFolder *FolderTree
		if folder.ParentId != nil {
			parentFolder = foldersCache[*folder.ParentId]
			if parentFolder == nil {
				parentFolderFromRepo, err := s.folderRepository.FindById(folder.ParentId)
				if err == nil && parentFolderFromRepo != nil {
					parentFolder = &FolderTree{Folder: *parentFolderFromRepo}
					foldersCache[*parentFolder.Id] = parentFolder
				}
			}
		}
	}

	for _, folderTree := range resultFolderTrees {
		var parentFolderTree *FolderTree = nil
		if folderTree.ParentId != nil {
			parentFolderTree = foldersCache[*folderTree.ParentId]
		}

		s.ProcessFolder(&folderTree, parentFolderTree)
	}

	return resultFolderTrees, nil
}

func (s FolderTreeService) ProcessFolder(folder *FolderTree, parent *FolderTree) (*FolderTree, error) {
	if folder == nil || folder.Id == nil {
		return folder, nil
	}

	if parent != nil && folder.ParentId != nil && folder.ParentId == parent.Id {
		folder.Parent = parent
	}

	if folder.ParentId != nil && parent == nil {
		parentFolder, err := s.folderRepository.FindById(folder.ParentId)
		if err != nil {
			return nil, err
		}

		if parentFolder != nil {
			parentFolderTree := FolderTree{Folder: *parentFolder}
			processedParentFolderTree, err := s.ProcessFolder(&parentFolderTree, nil)
			if err != nil {
				return nil, err
			}
			folder.Parent = processedParentFolderTree
		}
	}

	childrenFolders, err := s.folderRepository.FindByParentId(folder.Id)
	if err != nil {
		return nil, err
	}
	if childrenFolders != nil {
		childrenFoldersLen := len(*childrenFolders)
		childrenFolderTrees := make([]FolderTree, childrenFoldersLen, childrenFoldersLen)

		for _, childFolder := range *childrenFolders {
			childFolderTree := FolderTree{Folder: childFolder}
			processedChildFolderTree, err := s.ProcessFolder(&childFolderTree, folder)
			if err != nil {
				return nil, err
			}
			childrenFolderTrees = append(childrenFolderTrees, *processedChildFolderTree)
		}

		folder.Children = &childrenFolderTrees
	}

	return folder, nil
}
