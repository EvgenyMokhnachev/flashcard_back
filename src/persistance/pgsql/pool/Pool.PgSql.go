package pgsql

import (
	"context"
	"database/sql"
	_ "github.com/lib/pq"
	"os"
	"strings"
	"time"
)

var connectionsPoolChan = make(chan *sql.DB, 6)

func TakePgSqlConn() (*sql.DB, error) {
	if len(connectionsPoolChan) == 0 {
		go (func() {
			conn, err := CreatePgSqlConn()
			if err != nil {
				panic(err)
			}

			ReleasePgSqlConn(conn)
		})()
	}

	return <-connectionsPoolChan, nil
}

func ReleasePgSqlConn(conn *sql.DB) {
	poolCurrLen := len(connectionsPoolChan)
	if poolCurrLen >= 6 {
		err := conn.Close()
		if err != nil {
			panic(err)
		}
	} else {
		connectionsPoolChan <- conn
	}
}

func CreatePgSqlConn() (*sql.DB, error) {
	host := os.Getenv("DATABASE_HOST")
	port := os.Getenv("DATABASE_PORT")
	username := os.Getenv("DATABASE_USER")
	userpass := os.Getenv("DATABASE_PASS")
	dbname := os.Getenv("DATABASE_NAME")

	connStr := "postgres://" + username + ":" + userpass + "@" + host + ":" + port + "/" + dbname + "?sslmode=disable"

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	pingErr := db.Ping()
	if pingErr != nil {
		isConnectionError := strings.Contains(pingErr.Error(), "dial tcp")

		if isConnectionError {
			closeErr := db.Close()
			if closeErr != nil {
				println(closeErr.Error())
			}
			println(pingErr.Error())

			timeout, cancelTimeoutCtx := context.WithTimeout(context.Background(), 5*time.Second)
			<-timeout.Done()
			cancelTimeoutCtx()

			return CreatePgSqlConn()
		}

		return nil, pingErr
	}

	return db, nil
}