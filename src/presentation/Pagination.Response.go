package presentation

type PaginationResponse[I interface{}] struct {
	Items []I `json:"items"`
	Total int `json:"total"`
}
