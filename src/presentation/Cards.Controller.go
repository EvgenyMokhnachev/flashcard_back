package presentation

import (
	"encoding/json"
	"flashcards_backend/src"
	"flashcards_backend/src/domain/cards"
	"net/http"
	"time"
)

func CardsController(w http.ResponseWriter, r *http.Request) {
	switch r.RequestURI {
	case "/api/cards/get":
		AuthFilter(w, r, cardsGet)
		break
	case "/api/cards/delete":
		AuthFilter(w, r, cardsDelete)
		break
	case "/api/cards/update":
		AuthFilter(w, r, cardsUpdate)
		break
	case "/api/cards/create":
		AuthFilter(w, r, cardsCreate)
		break
	default:
		{
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		}
	}
}

type CardsFilterPayload struct {
	Ids            *[]int `json:"ids"`
	UserIds        *[]int `json:"userIds"`
	FolderIds      *[]int `json:"folderIds"`
	DifficultTypes *[]int `json:"difficultTypes"`
	Bookmarked     *bool  `json:"bookmarked"`
	CreatedAtFrom  *int64 `json:"createdAtFrom"`
	CreatedAtTo    *int64 `json:"createdAtTo"`
	Limit          *int   `json:"limit"`
	Offset         *int   `json:"offset"`
}

func cardsGet(w http.ResponseWriter, r *http.Request, userId *int) {
	var payload CardsFilterPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	var CreatedAtFrom *time.Time = nil
	if payload.CreatedAtFrom != nil {
		var createdAtFrom time.Time = time.UnixMicro(*payload.CreatedAtFrom)
		CreatedAtFrom = &createdAtFrom
	}

	var CreatedAtTo *time.Time = nil
	if payload.CreatedAtTo != nil {
		var createdAtTo time.Time = time.UnixMicro(*payload.CreatedAtTo)
		CreatedAtTo = &createdAtTo
	}

	result, err := src.DI.CardRepository().Find(cards.CardFilter{
		Ids:            payload.Ids,
		UserIds:        payload.UserIds,
		FolderIds:      payload.FolderIds,
		DifficultTypes: payload.DifficultTypes,
		Bookmarked:     payload.Bookmarked,
		CreatedAtFrom:  CreatedAtFrom,
		CreatedAtTo:    CreatedAtTo,
		Limit:          payload.Limit,
		Offset:         payload.Offset,
	})

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

	json.NewEncoder(w).Encode(PaginationResponse[cards.Card]{Items: result, Total: totalResponse})
}

type CardsDeletePayload struct {
	Id *int
}

func cardsDelete(w http.ResponseWriter, r *http.Request, userId *int) {
	var payload CardsDeletePayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := src.DI.CardService().DeleteCard(payload.Id, userId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(result)
}

type CardsUpdatePayload struct {
	Id         *int    `json:"id"`
	UserId     *int    `json:"userId"`
	FolderId   *int    `json:"folderId"`
	FrontSide  *string `json:"frontSide"`
	BackSide   *string `json:"backSide"`
	Bookmarked *bool   `json:"bookmarked"`
	Difficult  *int    `json:"difficult"`
}

func cardsUpdate(w http.ResponseWriter, r *http.Request, userId *int) {
	var payload CardsUpdatePayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := src.DI.CardService().UpdateCard(cards.CardManageDto{
		Id:         payload.Id,
		UserId:     payload.UserId,
		FolderId:   payload.FolderId,
		FrontSide:  payload.FrontSide,
		BackSide:   payload.BackSide,
		Bookmarked: payload.Bookmarked,
		Difficult:  payload.Difficult,
	}, userId)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(result)
}

type CardsCreatePayload struct {
	UserId     *int    `json:"userId"`
	FolderId   *int    `json:"folderId"`
	FrontSide  *string `json:"frontSide"`
	BackSide   *string `json:"backSide"`
	Bookmarked *bool   `json:"bookmarked"`
	Difficult  *int    `json:"difficult"`
}

func cardsCreate(w http.ResponseWriter, r *http.Request, userId *int) {
	var payload CardsCreatePayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	userIdToStore := userId
	if payload.UserId != nil {
		userIdToStore = payload.UserId
	}

	result, err := src.DI.CardService().CreateCard(cards.CardManageDto{
		UserId:     userIdToStore,
		FolderId:   payload.FolderId,
		FrontSide:  payload.FrontSide,
		BackSide:   payload.BackSide,
		Bookmarked: payload.Bookmarked,
		Difficult:  payload.Difficult,
	}, userId)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(result)
}
