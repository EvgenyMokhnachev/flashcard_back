package management

type User struct {
	Id    *int    `json:"id"`
	Email *string `json:"email"`
	Pass  *string `json:"pass"`
}

func NewUser(id int, email string, pass string) *User {
	return &User{
		Id:    &id,
		Email: &email,
		Pass:  &pass,
	}
}
