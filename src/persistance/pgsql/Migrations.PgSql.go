package pgsql

import (
	"database/sql"
	"embed"
	pgsql "flashcards_backend/src/persistance/pgsql/pool"
	"fmt"
	"strings"
)

//go:embed migrations/*
var migrationFiles embed.FS

func RunMigrations() {
	connection, err := pgsql.TakePgSqlConn()
	if err != nil {
		panic(err)
	}

	initErr := initMigrationsTable(connection)
	if initErr != nil {
		pgsql.ReleasePgSqlConn(connection)
		panic(initErr)
	}

	appliedMigrations := getAlreadyAppliedMigrations(connection)

	migrations := readMigrations()

	tx, err := connection.Begin()
	if err != nil {
		pgsql.ReleasePgSqlConn(connection)
		panic(err)
	}

	for _, migration := range migrations {
		isAlreadyApplied := false
		for _, appliedMigration := range appliedMigrations {
			if migration.Name == appliedMigration {
				isAlreadyApplied = true
			}
		}

		if isAlreadyApplied {
			continue
		}

		err := applyMigration(tx, &migration)
		if err != nil {
			err2 := tx.Rollback()
			if err2 != nil {
				pgsql.ReleasePgSqlConn(connection)
				panic(err2)
			}

			pgsql.ReleasePgSqlConn(connection)
			panic(err)
		}
	}

	err = tx.Commit()
	if err != nil {
		pgsql.ReleasePgSqlConn(connection)
		panic(err)
	}
}

func initMigrationsTable(con *sql.DB) error {
	_, err := con.Exec(
		`CREATE TABLE IF NOT EXISTS migrations (
    				name varchar(255) NOT NULL PRIMARY KEY,
    				created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                )`,
	)

	if err != nil {
		return err
	}

	return nil
}

func getAlreadyAppliedMigrations(con *sql.DB) []string {
	query, err := con.Query(`SELECT name FROM migrations`)
	if err != nil {
		panic(err)
	}

	migrations := make([]string, 0, 32)
	for query.Next() {
		var migrationName string
		err := query.Scan(&migrationName)
		if err != nil {
			panic(err)
		}
		migrations = append(migrations, migrationName)
	}

	return migrations
}

func applyMigration(con *sql.Tx, migration *Migration) error {
	_, err := con.Exec(migration.Content)
	if err != nil {
		return err
	}

	_, err2 := con.Exec(`INSERT INTO migrations(name) VALUES ($1)`, migration.Name)
	if err2 != nil {
		return err2
	}

	fmt.Println("Migration applied successfully: ", migration.Name)

	return nil
}

type Migration struct {
	Name    string
	Content string
}

func readMigrations() []Migration {
	dir, _ := migrationFiles.ReadDir("migrations")

	migrationsResult := make([]Migration, 0, cap(dir))

	for _, f := range dir {
		if f.IsDir() {
			continue
		}

		if !strings.Contains(dir[0].Name(), ".sql") {
			continue
		}

		fileBytes, err := migrationFiles.ReadFile("migrations/" + f.Name())
		if err != nil {
			panic(err)
		}

		migrationName := f.Name()
		migrationContent := string(fileBytes)

		migrationsResult = append(migrationsResult, Migration{migrationName, migrationContent})
	}

	return migrationsResult
}
