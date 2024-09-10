package pgsql

import (
	"context"
	"database/sql"
	"errors"
	. "flashcards_backend/src/domain/management"
	pgsql "flashcards_backend/src/persistance/pgsql/pool"
	"strconv"
	"strings"
)

type UserRepositoryPgSql struct {
}

func (UserRepositoryPgSql) Insert(user *User) (*User, error) {
	err := (func() error {
		db, err := pgsql.TakePgSqlConn()
		defer func() {
			if db != nil {
				pgsql.ReleasePgSqlConn(db)
			}
		}()
		if err != nil {
			return err
		}

		tx, err := db.BeginTx(context.Background(), &sql.TxOptions{Isolation: sql.LevelReadCommitted})
		if err != nil {
			return err
		}

		err = (func() error {
			user.Id = new(int)
			err = tx.QueryRow(`SELECT nextval('users_id_seq')`).Scan(user.Id)
			if err != nil {
				return err
			}

			_, err = tx.Query("INSERT INTO users(id, email, pass) VALUES ($1, $2, $3)", &user.Id, &user.Email, &user.Pass)
			if err != nil {
				return err
			}

			err = tx.Commit()
			if err != nil {
				return err
			}

			return nil
		})()
		if err != nil {
			user.Id = nil
			rollbackErr := tx.Rollback()
			if rollbackErr != nil {
				return errors.Join(err, rollbackErr)
			}
			return err
		}

		return nil
	})()

	return user, err
}

func (UserRepositoryPgSql) Update(user *User) (*User, error) {
	err := (func() error {
		if user == nil {
			return errors.New("user is nil")
		}

		if user.Id == nil {
			return errors.New("user ID is nil")
		}

		db, err := pgsql.TakePgSqlConn()
		defer func() {
			if db != nil {
				pgsql.ReleasePgSqlConn(db)
			}
		}()
		if err != nil {
			return err
		}

		tx, err := db.BeginTx(context.Background(), &sql.TxOptions{Isolation: sql.LevelReadCommitted})
		if err != nil {
			return err
		}

		err = (func() error {
			result, err := tx.Exec("UPDATE users SET email = $2, pass = $3 WHERE id = $1", &user.Id, &user.Email, &user.Pass)
			updatedCount, err := result.RowsAffected()
			if err != nil {
				return err
			}
			if updatedCount == 0 {
				return errors.New("Could not update user (ID: " + strconv.Itoa(*user.Id) + "). Updated users count is 0.")
			}

			err = tx.Commit()
			if err != nil {
				return err
			}

			return nil
		})()
		if err != nil {
			rollbackErr := tx.Rollback()
			if rollbackErr != nil {
				return errors.Join(err, rollbackErr)
			}
			return err
		}

		return nil
	})()

	return user, err
}

func (UserRepositoryPgSql) Find(filter UserFilter) ([]*User, error) {
	var sqlQuery = "SELECT id, email, pass FROM users"

	var whereAndCases []string = make([]string, 0)
	var limit *int = filter.Limit

	argsEstimatedCount := 0
	if filter.Ids != nil {
		argsEstimatedCount += len(*filter.Ids)
	}
	if filter.Emails != nil {
		argsEstimatedCount += len(*filter.Emails)
	}
	var args []interface{} = make([]interface{}, argsEstimatedCount)
	var lastArgSeq int = 0

	if filter.Ids != nil {
		length := len(*filter.Ids)

		if length > 0 {
			limit = &(length)

			if len(*filter.Ids) == 1 {
				whereAndCases = append(whereAndCases, "id = $"+strconv.Itoa(lastArgSeq+1))
				v := (*filter.Ids)[0]
				args[lastArgSeq] = interface{}(&v)
				lastArgSeq += 1
			}

			if len(*filter.Ids) > 1 {
				stringValues := make([]string, len(*filter.Ids))
				for i, v := range *filter.Ids {
					stringValues[i] = "$" + strconv.Itoa(lastArgSeq+1)
					args[lastArgSeq] = interface{}(&v)
					lastArgSeq += 1
				}
				joined := strings.Join(stringValues, ",")

				if joined != "" {
					whereAndCases = append(whereAndCases, "id IN ("+joined+")")
				}
			}
		}
	}

	if filter.Emails != nil && len(*filter.Emails) > 0 {
		if len(*filter.Emails) == 1 {
			whereAndCases = append(whereAndCases, "email = $"+strconv.Itoa(lastArgSeq+1))
			v := (*filter.Emails)[0]
			args[lastArgSeq] = interface{}(&v)
			lastArgSeq += 1
		}

		if len(*filter.Emails) > 1 {
			stringValues := make([]string, len(*filter.Emails))
			for i, v := range *filter.Emails {
				stringValues[i] = "$" + strconv.Itoa(lastArgSeq+1)
				args[lastArgSeq] = interface{}(&v)
				lastArgSeq += 1
			}
			joined := strings.Join(stringValues, ",")

			if joined != "" {
				whereAndCases = append(whereAndCases, "email IN ("+joined+")")
			}
		}
	}

	if whereAndCases != nil && len(whereAndCases) > 0 {
		sqlQuery = sqlQuery + " WHERE " + strings.Join(whereAndCases, " AND ")
	}

	if limit != nil {
		sqlQuery = sqlQuery + " LIMIT " + strconv.Itoa(int(*limit))
	}

	db, err := pgsql.TakePgSqlConn()
	defer func() {
		if db != nil {
			pgsql.ReleasePgSqlConn(db)
		}
	}()
	if err != nil {
		return nil, err
	}

	query, err := db.Query(sqlQuery, args...)
	if err != nil {
		return nil, err
	}

	users := make([]*User, 0, 1)
	for query.Next() {
		user := new(User)
		err := query.Scan(&user.Id, &user.Email, &user.Pass)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

func (r UserRepositoryPgSql) FindById(userId *int) (*User, error) {
	if userId == nil {
		return nil, errors.New("userId is required for find users in database")
	}

	filterUserIds := make([]int, 1, 1)
	filterUserIds[0] = *userId
	users, err := r.Find(UserFilter{Ids: &filterUserIds})
	if err != nil {
		return nil, err
	}

	if len(users) == 0 {
		return nil, nil
	}

	return users[0], nil
}
