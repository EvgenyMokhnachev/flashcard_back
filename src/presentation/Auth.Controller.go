package presentation

import (
	"encoding/json"
	"flashcards_backend/src"
	"net/http"
)

type AuthPayload struct {
	Email string
	Pass  string
}

func AuthController(w http.ResponseWriter, r *http.Request) {
	var payload AuthPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	token, err := src.DI.AuthService().Auth(&payload.Email, &payload.Pass)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(token)
}
