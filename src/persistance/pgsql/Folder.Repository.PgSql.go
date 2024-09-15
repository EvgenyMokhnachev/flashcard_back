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

type FolderRepositoryPgSql struct {
}

func (FolderRepositoryPgSql) Insert(folder *cards.Folder) (*cards.Folder, error) {
	err := (func() error {
		if folder == nil {
			return errors.New("provided folder is nil")
		}

		if folder.UserId == nil {
			return errors.New("provided folder.userId is nil")
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
			folder.Id = new(int)
			err = tx.QueryRow(`SELECT nextval('folders_id_seq')`).Scan(folder.Id)
			if err != nil {
				return err
			}

			_, err = tx.Query("INSERT INTO folders(id, name, parent_id, user_id) VALUES ($1, $2, $3, $4)", &folder.Id, &folder.Name, &folder.ParentId, &folder.UserId)
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
			folder.Id = nil
			rollbackErr := tx.Rollback()
			if rollbackErr != nil {
				return errors.Join(err, rollbackErr)
			}
			return err
		}

		return nil
	})()

	return folder, err
}

func (FolderRepositoryPgSql) Update(folder *cards.Folder) (*cards.Folder, error) {
	err := (func() error {
		if folder == nil {
			return errors.New("tried to update a folder is nil")
		}

		if folder.Id == nil {
			return errors.New("tried to update a folder with id is nil")
		}

		if folder.UserId == nil {
			return errors.New("tried to update a folder with userId is nil")
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
			result, err := db.Exec("UPDATE folders SET name = $2, parent_id = $3, user_id = $4 WHERE id = $1", folder.Id, folder.Name, folder.ParentId, folder.UserId)
			if err != nil {
				return err
			}
			updatedCount, err := result.RowsAffected()
			if updatedCount == 0 {
				return errors.New("Could not update folder (ID: " + utils.IntOrNull(folder.Id) + "). Updated folders count is 0.")
			}

			return nil
		})()
		if err != nil {
			return err
		}

		return nil
	})()

	return folder, err
}

func (FolderRepositoryPgSql) Find(filter cards.FolderFilter) (*[]*cards.Folder, error) {
	var sqlQuery = "SELECT id, name, parent_id, user_id FROM folders"

	var whereAndCases = make([]string, 0)
	var limit *int = nil
	var offset *int = nil

	if filter.Limit != nil {
		limit = filter.Limit
	}

	if filter.Offset != nil {
		offset = filter.Offset
	}

	argsEstimatedCount := 0
	if filter.Ids != nil {
		argsEstimatedCount += len(*filter.Ids)
	}
	if filter.ParentIds != nil {
		argsEstimatedCount += len(*filter.ParentIds)
	}
	if filter.UserIds != nil {
		argsEstimatedCount += len(*filter.UserIds)
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

	if filter.ParentIds != nil && len(*filter.ParentIds) > 0 {
		if len(*filter.ParentIds) == 1 {
			whereAndCases = append(whereAndCases, "parent_id = $"+strconv.Itoa(lastArgSeq+1))
			v := (*filter.ParentIds)[0]
			args[lastArgSeq] = interface{}(&v)
			lastArgSeq += 1
		}

		if len(*filter.ParentIds) > 1 {
			stringValues := make([]string, len(*filter.ParentIds))
			for i, v := range *filter.ParentIds {
				stringValues[i] = "$" + strconv.Itoa(lastArgSeq+1)
				args[lastArgSeq] = interface{}(&v)
				lastArgSeq += 1
			}
			joined := strings.Join(stringValues, ",")

			if joined != "" {
				whereAndCases = append(whereAndCases, "parent_id IN ("+joined+")")
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

	if filter.OnlyRoot != nil && *filter.OnlyRoot {
		whereAndCases = append(whereAndCases, "parent_id IS NULL")
	}

	if whereAndCases != nil && len(whereAndCases) > 0 {
		sqlQuery = sqlQuery + " WHERE " + strings.Join(whereAndCases, " AND ")
	}

	if limit != nil {
		sqlQuery = sqlQuery + " LIMIT " + strconv.Itoa(*limit)
	}

	if offset != nil {
		sqlQuery = sqlQuery + " OFFSET " + strconv.Itoa(*offset)
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

	folders := make([]*cards.Folder, 0, 1)
	for query.Next() {
		folder := new(cards.Folder)
		err := query.Scan(&folder.Id, &folder.Name, &folder.ParentId, &folder.UserId)
		if err != nil {
			return nil, err
		}
		folders = append(folders, folder)
	}

	return &folders, nil
}

func (FolderRepositoryPgSql) FindById(folderId *int) (*cards.Folder, error) {
	if folderId == nil {
		return nil, errors.New("can't find folder by provided ID is nil")
	}

	var sqlQuery = "SELECT id, name, parent_id, user_id FROM folders WHERE id = $1"

	db, err := pgsql.TakePgSqlConn()
	defer func() {
		if db != nil {
			pgsql.ReleasePgSqlConn(db)
		}
	}()
	if err != nil {
		return nil, err
	}

	row := db.QueryRow(sqlQuery, folderId)

	folder := new(cards.Folder)
	err = row.Scan(&folder.Id, &folder.Name, &folder.ParentId, &folder.UserId)
	if err != nil {
		return nil, err
	}

	return folder, nil
}

func (r FolderRepositoryPgSql) FindByParentId(parentFolderId *int) (*[]*cards.Folder, error) {
	if parentFolderId == nil {
		return nil, errors.New("can't find folder by provided parent ID is nil")
	}

	folders, err := r.Find(cards.FolderFilter{ParentIds: &[]int{*parentFolderId}})
	if err == nil {
		return nil, err
	}

	return folders, nil
}

func (FolderRepositoryPgSql) Delete(folderId *int) (bool, error) {
	if folderId == nil {
		return false, errors.New("can't delete folder if provided folderId is nil")
	}

	var sqlQuery = "DELETE FROM folders WHERE id = $1"

	db, err := pgsql.TakePgSqlConn()
	defer func() {
		if db != nil {
			pgsql.ReleasePgSqlConn(db)
		}
	}()
	if err != nil {
		return false, err
	}

	exec, err := db.Exec(sqlQuery, folderId)
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
