package presentation

import (
	"bytes"
	"context"
	"flashcards_backend/src/persistance/pgsql"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"testing"
)

func TestAuthController(t *testing.T) {
	pgsql.RunMigrations()

	http.HandleFunc("/auth", AuthController)

	srv := &http.Server{
		Addr: ":9901",
	}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	responseJson, err := sendAuth("test@test.test", "testpass", "9901")
	if err != nil {
		t.Errorf("Error sending auth response: %s\n", err.Error())
	}

	if !strings.Contains(*responseJson, `"token":"`) {
		t.Errorf("Authentication is wrong")
	}

	srv.Shutdown(context.Background())
}

func sendAuth(email string, pass string, port string) (*string, error) {
	resp, err := http.Post(`http://localhost:`+port+`/auth`, "application/json", bytes.NewBuffer([]byte(`{
		"email": "`+email+`",
		"pass": "`+pass+`"
	}`)))
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
