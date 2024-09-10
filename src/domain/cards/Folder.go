package cards

type Folder struct {
	Id       *int    `json:"id"`
	Name     *string `json:"name"`
	ParentId *int    `json:"parentId"`
	UserId   *int    `json:"userId"`
}
