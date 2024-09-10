package presentation

import (
	"encoding/json"
	"flashcards_backend/src"
	"flashcards_backend/src/domain/management"
	"net/http"
)

func UserController(w http.ResponseWriter, r *http.Request) {
	switch r.RequestURI {
	case "/api/users/get":
		{
			AuthFilter(w, r, get)
			break
		}
	default:
		{
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		}
	}
}

type UserFilterPayload struct {
	Ids    *[]int    `json:"ids"`
	Emails *[]string `json:"emails"`
	Limit  *int      `json:"limit"`
}

type UserResponse struct {
	Id    *int    `json:"id"`
	Email *string `json:"email"`
}

type PaginatedResponse struct {
	Items []UserResponse `json:"items"`
	Total int            `json:"total"`
}

func mapUsersToResponses(users []*management.User) []UserResponse {
	var responses []UserResponse
	for _, user := range users {
		if user == nil {
			continue
		}
		responses = append(responses, UserResponse{Id: user.Id, Email: user.Email})
	}
	return responses
}

func get(w http.ResponseWriter, r *http.Request, userId *int) {
	var payload UserFilterPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := src.DI.UserRepository().Find(management.UserFilter{Ids: payload.Ids, Emails: payload.Emails, Limit: payload.Limit})
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	totalResponse := 0
	if payload.Limit != nil {
		totalResponse = *payload.Limit
	}
	json.NewEncoder(w).Encode(PaginatedResponse{Items: mapUsersToResponses(result), Total: totalResponse})
}
