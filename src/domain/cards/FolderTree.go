package cards

type FolderTree struct {
	*Folder
	Parent   *FolderTree   `json:"parent"`
	Children *[]FolderTree `json:"children"`
}
