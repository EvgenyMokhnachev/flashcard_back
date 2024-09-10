package cards

import "time"

type CardFilter struct {
	Ids            *[]int
	UserIds        *[]int
	FolderIds      *[]int
	DifficultTypes *[]int
	Bookmarked     *bool
	CreatedAtFrom  *time.Time
	CreatedAtTo    *time.Time
	Limit          *int
	Offset         *int
}
