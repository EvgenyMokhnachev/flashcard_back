package cards

type CardRepository interface {
	Insert(card *Card) (*Card, error)
	Update(card *Card) (*Card, error)
	Find(filter CardFilter) ([]Card, error)
	FindById(id *int) (*Card, error)
	Delete(cardId *int) (bool, error)
}
