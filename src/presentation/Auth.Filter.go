package presentation

import (
	"flashcards_backend/src"
	"net/http"
)

func AuthFilter(w http.ResponseWriter, r *http.Request, f func(w http.ResponseWriter, r *http.Request, userId *int)) {
	authToken := r.Header.Get("Authorization")
	if authToken == "" {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Unauthorized"))
		return
	}

	userId, err := src.DI.AuthService().CheckToken(&authToken)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		w.Write([]byte("Unauthorized: " + err.Error()))
		return
	}

	f(w, r, userId)
}
