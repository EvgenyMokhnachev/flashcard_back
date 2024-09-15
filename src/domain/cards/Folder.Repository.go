package cards

type FolderRepository interface {
	Insert(folder *Folder) (*Folder, error)
	Update(folder *Folder) (*Folder, error)
	Find(filter FolderFilter) (*[]*Folder, error)
	FindById(id *int) (*Folder, error)
	FindByParentId(id *int) (*[]*Folder, error)
	Delete(folderId *int) (bool, error)
}
