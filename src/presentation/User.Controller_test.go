package presentation

import (
	"bytes"
	"context"
	"encoding/json"
	"flashcards_backend/src/domain/management"
	"flashcards_backend/src/persistance/pgsql"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"testing"
)

func TestUserController(t *testing.T) {
	pgsql.RunMigrations()

	http.HandleFunc("/auth", AuthController)
	http.HandleFunc("/users/", UserController)

	srv := &http.Server{
		Addr: ":9902",
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	sendAuth("test1@test.test", "testpass1", "9902")
	sendAuth("test2@test.test", "testpass2", "9902")
	authResponse, _ := sendAuth("test3@test.test", "testpass3", "9902")

	var authToken management.AuthToken
	if err := json.Unmarshal([]byte(*authResponse), &authToken); err != nil {
		log.Fatal(err)
		return
	}

	limit := 1
	usersJson, err := sendGetUsers(UserFilterPayload{Limit: &limit}, *authToken.Token, "9902")
	if err != nil {
		log.Fatal(err)
		return
	}

	if !strings.Contains(*usersJson, `"total":1`) {
		t.Errorf("Authentication is wrong")
	}

	srv.Shutdown(context.Background())
}

func sendGetUsers(filter UserFilterPayload, token string, port string) (*string, error) {
	filterJsonBytes, err := json.Marshal(filter)
	if err != nil {
		return nil, err
	}

	c := http.Client{}
	req, err := http.NewRequest("POST", `http://localhost:`+port+`/users/get`, bytes.NewBuffer(filterJsonBytes))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", token)
	resp, err := c.Do(req)

	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	result := string(body)

	return &result, nil
}
