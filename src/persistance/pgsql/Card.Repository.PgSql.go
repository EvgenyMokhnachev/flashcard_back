package pgsql

import (
	"context"
	"database/sql"
	"errors"
	"flashcards_backend/src/domain/cards"
	pgsql "flashcards_backend/src/persistance/pgsql/pool"
	"flashcards_backend/src/utils"
	"strconv"
	"strings"
)

type CardRepositoryPgSql struct {
}

func (CardRepositoryPgSql) Insert(card *cards.Card) (*cards.Card, error) {
	err := (func() error {
		if card == nil {
			return errors.New("provided card is nil")
		}

		if card.UserId == nil {
			return errors.New("provided card.userId is nil")
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
			card.Id = new(int)
			err = tx.QueryRow(`SELECT nextval('cards_id_seq')`).Scan(card.Id)
			if err != nil {
				return err
			}

			_, err = tx.Query(`INSERT INTO cards(
                  id, 
                  folder_id, 
                  user_id, 
                  front_side, 
                  back_side, 
                  difficult, 
                  difficult_change_time, 
                  created_at, 
                  bookmarked
                  ) VALUES ($1, $2, $3, $4, $5, $6, to_timestamp($7), to_timestamp($8), $9)`,
				card.Id,
				card.FolderId,
				card.UserId,
				card.FrontSide,
				card.BackSide,
				card.Difficult,
				utils.UnixOrNull(card.DifficultChangeTime),
				utils.UnixOrNull(card.CreatedAt),
				card.Bookmarked,
			)
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
			card.Id = nil
			rollbackErr := tx.Rollback()
			if rollbackErr != nil {
				return errors.Join(err, rollbackErr)
			}
			return err
		}

		return nil
	})()

	return card, err
}

func (CardRepositoryPgSql) Update(card *cards.Card) (*cards.Card, error) {
	err := (func() error {
		if card == nil {
			return errors.New("tried to update a card is nil")
		}

		if card.Id == nil {
			return errors.New("tried to update a card with id is nil")
		}

		if card.UserId == nil {
			return errors.New("tried to update a card with userId is nil")
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

		err = (func() error {
			result, err := db.Exec(`UPDATE cards SET 
                  folder_id = $2,
                  user_id = $3,
                  front_side = $4,
                  back_side = $5,
                  difficult = $6,
                  difficult_change_time = $7,
                  created_at = $8,
                  bookmarked = $9
             WHERE id = $1`,
				card.Id,
				card.FolderId,
				card.UserId,
				card.FrontSide,
				card.BackSide,
				card.Difficult,
				card.DifficultChangeTime,
				card.CreatedAt,
				card.Bookmarked,
			)
			if err != nil {
				return err
			}
			updatedCount, err := result.RowsAffected()
			if updatedCount == 0 {
				return errors.New("Could not update card (ID: " + utils.IntOrNull(card.Id) + "). Updated cards count is 0.")
			}

			return nil
		})()
		if err != nil {
			return err
		}

		return nil
	})()

	return card, err
}

func (CardRepositoryPgSql) Find(filter cards.CardFilter) ([]cards.Card, error) {
	var sqlQuery = `SELECT 
    					id,
       					folder_id, 
                  		user_id, 
                  		front_side, 
                  		back_side, 
                  		difficult, 
                  		difficult_change_time, 
                  		created_at, 
                  		bookmarked 
					FROM cards`

	var whereAndCases = make([]string, 0)
	var limit *int = nil

	argsEstimatedCount := 0
	if filter.Ids != nil {
		argsEstimatedCount += len(*filter.Ids)
	}
	if filter.FolderIds != nil {
		argsEstimatedCount += len(*filter.FolderIds)
	}
	if filter.UserIds != nil {
		argsEstimatedCount += len(*filter.UserIds)
	}
	if filter.DifficultTypes != nil {
		argsEstimatedCount += len(*filter.DifficultTypes)
	}
	if filter.CreatedAtFrom != nil {
		argsEstimatedCount += 1
	}
	if filter.CreatedAtTo != nil {
		argsEstimatedCount += 1
	}
	var args = make([]interface{}, argsEstimatedCount)
	var lastArgSeq = 0

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

	if filter.FolderIds != nil && len(*filter.FolderIds) > 0 {
		if len(*filter.FolderIds) == 1 {
			whereAndCases = append(whereAndCases, "folder_id = $"+strconv.Itoa(lastArgSeq+1))
			v := (*filter.FolderIds)[0]
			args[lastArgSeq] = interface{}(&v)
			lastArgSeq += 1
		}

		if len(*filter.FolderIds) > 1 {
			stringValues := make([]string, len(*filter.FolderIds))
			for i, v := range *filter.FolderIds {
				stringValues[i] = "$" + strconv.Itoa(lastArgSeq+1)
				args[lastArgSeq] = interface{}(&v)
				lastArgSeq += 1
			}
			joined := strings.Join(stringValues, ",")

			if joined != "" {
				whereAndCases = append(whereAndCases, "folder_id IN ("+joined+")")
			}
		}
	}

	if filter.UserIds != nil && len(*filter.UserIds) > 0 {
		if len(*filter.UserIds) == 1 {
			whereAndCases = append(whereAndCases, "user_id = $"+strconv.Itoa(lastArgSeq+1))
			v := (*filter.UserIds)[0]
			args[lastArgSeq] = interface{}(&v)
			lastArgSeq += 1
		}

		if len(*filter.UserIds) > 1 {
			stringValues := make([]string, len(*filter.UserIds))
			for i, v := range *filter.UserIds {
				stringValues[i] = "$" + strconv.Itoa(lastArgSeq+1)
				args[lastArgSeq] = interface{}(&v)
				lastArgSeq += 1
			}
			joined := strings.Join(stringValues, ",")

			if joined != "" {
				whereAndCases = append(whereAndCases, "user_id IN ("+joined+")")
			}
		}
	}

	if filter.DifficultTypes != nil && len(*filter.DifficultTypes) > 0 {
		if len(*filter.DifficultTypes) == 1 {
			whereAndCases = append(whereAndCases, "difficult = $"+strconv.Itoa(lastArgSeq+1))
			v := (*filter.DifficultTypes)[0]
			args[lastArgSeq] = interface{}(&v)
			lastArgSeq += 1
		}

		if len(*filter.DifficultTypes) > 1 {
			stringValues := make([]string, len(*filter.DifficultTypes))
			for i, v := range *filter.DifficultTypes {
				stringValues[i] = "$" + strconv.Itoa(lastArgSeq+1)
				args[lastArgSeq] = interface{}(&v)
				lastArgSeq += 1
			}
			joined := strings.Join(stringValues, ",")

			if joined != "" {
				whereAndCases = append(whereAndCases, "difficult IN ("+joined+")")
			}
		}
	}

	if filter.Bookmarked != nil {
		if *filter.Bookmarked {
			whereAndCases = append(whereAndCases, "bookmarked = TRUE")
		} else {
			whereAndCases = append(whereAndCases, "bookmarked = FALSE")
		}
	}

	if filter.CreatedAtFrom != nil {
		whereAndCases = append(whereAndCases, "created_at >= to_timestamp("+strconv.FormatInt(filter.CreatedAtFrom.UnixMilli(), 10)+")")
	}

	if filter.CreatedAtTo != nil {
		whereAndCases = append(whereAndCases, "created_at < to_timestamp("+strconv.FormatInt(filter.CreatedAtTo.UnixMilli(), 10)+")")
	}

	if whereAndCases != nil && len(whereAndCases) > 0 {
		sqlQuery = sqlQuery + " WHERE " + strings.Join(whereAndCases, " AND ")
	}

	if limit != nil {
		sqlQuery = sqlQuery + " LIMIT " + strconv.Itoa(*limit)
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

	cardsItems := make([]cards.Card, 0, 1)
	for query.Next() {
		card := new(cards.Card)
		err := query.Scan(&card.Id, &card.FolderId, &card.UserId, &card.FrontSide, &card.BackSide, &card.Difficult, &card.DifficultChangeTime, &card.CreatedAt, &card.Bookmarked)
		if err != nil {
			return nil, err
		}
		cardsItems = append(cardsItems, *card)
	}

	return cardsItems, nil
}

func (CardRepositoryPgSql) FindById(cardId *int) (*cards.Card, error) {
	if cardId == nil {
		return nil, errors.New("can't find card by provided ID is nil")
	}

	var sqlQuery = `SELECT 
    					id,
       					folder_id, 
                  		user_id, 
                  		front_side, 
                  		back_side, 
                  		difficult, 
                  		difficult_change_time, 
                  		created_at, 
                  		bookmarked 
					FROM cards WHERE id = $1`

	db, err := pgsql.TakePgSqlConn()
	defer func() {
		if db != nil {
			pgsql.ReleasePgSqlConn(db)
		}
	}()
	if err != nil {
		return nil, err
	}

	row := db.QueryRow(sqlQuery, cardId)

	card := new(cards.Card)
	err = row.Scan(&card.Id, &card.FolderId, &card.UserId, &card.FrontSide, &card.BackSide, &card.Difficult, &card.DifficultChangeTime, &card.CreatedAt, &card.Bookmarked)
	if err != nil {
		return nil, err
	}

	return card, nil
}

func (CardRepositoryPgSql) Delete(cardId *int) (bool, error) {
	if cardId == nil {
		return false, errors.New("can't delete card if provided cardId is nil")
	}

	var sqlQuery = "DELETE FROM cards WHERE id = $1"

	db, err := pgsql.TakePgSqlConn()
	defer func() {
		if db != nil {
			pgsql.ReleasePgSqlConn(db)
		}
	}()
	if err != nil {
		return false, err
	}

	exec, err := db.Exec(sqlQuery, cardId)
	if exec != nil {
		affected, err := exec.RowsAffected()
		if err != nil {
			return false, err
		}
		if affected == 0 {
			return false, nil
		}
	}
	if err != nil {
		return false, err
	}

	return true, nil
}
