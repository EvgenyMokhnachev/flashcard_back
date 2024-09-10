package cards

type FolderFilter struct {
	Ids       *[]int
	ParentIds *[]int
	UserIds   *[]int
	OnlyRoot  *bool
	Limit     *int
	Offset    *int
}
