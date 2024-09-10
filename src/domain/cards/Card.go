package cards

import "time"

type Card struct {
	Id                  *int       `json:"id"`
	FolderId            *int       `json:"folderId"`
	UserId              *int       `json:"userId"`
	FrontSide           *string    `json:"frontSide"`
	BackSide            *string    `json:"backSide"`
	Difficult           *int       `json:"difficult"`
	DifficultChangeTime *time.Time `json:"difficultChangeTime"`
	CreatedAt           *time.Time `json:"createdAt"`
	Bookmarked          *bool      `json:"bookmarked"`
}
