package management

type UserRepository interface {
	Insert(user *User) (*User, error)
	Update(user *User) (*User, error)
	Find(filter UserFilter) ([]*User, error)
	FindById(userId *int) (*User, error)
}
