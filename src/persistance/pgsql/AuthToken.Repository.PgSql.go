package pgsql

import (
	"context"
	"database/sql"
	"errors"
	. "flashcards_backend/src/domain/management"
	pgsql "flashcards_backend/src/persistance/pgsql/pool"
	"flashcards_backend/src/utils"
)

type AuthTokenRepositoryPgSql struct {
}

func (AuthTokenRepositoryPgSql) Insert(authToken *AuthToken) (*AuthToken, error) {
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

		tokenWasEmpty := false
		err = (func() error {
			if authToken.Token == nil {
				tokenWasEmpty = true
				uuid, err := utils.GenerateUUID()
				if err != nil {
					return err
				}

				authToken.Token = uuid
			}

			_, err = tx.Query("INSERT INTO auth_tokens(token, user_id) VALUES ($1, $2)", &authToken.Token, &authToken.UserId)
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
			if tokenWasEmpty {
				authToken.Token = nil
			}
			authToken.Token = nil
			rollbackErr := tx.Rollback()
			if rollbackErr != nil {
				return errors.Join(err, rollbackErr)
			}
			return err
		}

		return nil
	})()

	return authToken, err
}

func (AuthTokenRepositoryPgSql) Update(authToken *AuthToken) (*AuthToken, error) {
	err := (func() error {
		if authToken == nil {
			return errors.New("authToken is nil")
		}

		if authToken.Token == nil {
			return errors.New("authToken Token is nil")
		}

		db, err := pgsql.TakePgSqlConn()
		defer func() {
			if db != nil {
				pgsql.ReleasePgSqlConn(db)
			}
		}()

		err = (func() error {
			result, err := db.Exec("UPDATE auth_tokens SET user_id = $2 WHERE token = $1", &authToken.Token, &authToken.UserId)
			updatedCount, err := result.RowsAffected()
			if err != nil {
				return err
			}
			if updatedCount == 0 {
				return errors.New("Could not update authToken (Token: " + *authToken.Token + "). Updated AuthTokens count is 0.")
			}

			return nil
		})()
		if err != nil {
			return err
		}

		return nil
	})()

	return authToken, err
}

func (AuthTokenRepositoryPgSql) FindByToken(token *string) (*AuthToken, error) {
	if token == nil || len(*token) == 0 {
		return nil, errors.New("provided token is nil")
	}

	var sqlQuery = "SELECT token, user_id FROM auth_tokens WHERE token = $1"

	db, err := pgsql.TakePgSqlConn()
	defer func() {
		if db != nil {
			pgsql.ReleasePgSqlConn(db)
		}
	}()
	if err != nil {
		return nil, err
	}

	row := db.QueryRow(sqlQuery, token)

	if row == nil {
		return nil, nil
	}

	var authToken *AuthToken = new(AuthToken)
	err = row.Scan(&authToken.Token, &authToken.UserId)
	if err != nil {
		return nil, err
	}

	return authToken, nil
}
