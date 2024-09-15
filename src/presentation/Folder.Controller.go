package presentation

import (
	"encoding/json"
	"flashcards_backend/src"
	"flashcards_backend/src/domain/cards"
	"net/http"
)

func FolderController(w http.ResponseWriter, r *http.Request) {
	switch r.RequestURI {
	case "/api/folders/get":
		AuthFilter(w, r, foldersGet)
		break
	case "/api/folders/get/tree":
		AuthFilter(w, r, foldersTree)
		break
	case "/api/folders/delete":
		AuthFilter(w, r, foldersDelete)
		break
	case "/api/folders/update":
		AuthFilter(w, r, foldersUpdate)
		break
	case "/api/folders/create":
		AuthFilter(w, r, foldersCreate)
		break
	default:
		{
			http.Error(w, http.StatusText(http.StatusNotFound), http.StatusNotFound)
		}
	}
}

type FoldersFilterPayload struct {
	Ids       *[]int `json:"ids"`
	ParentIds *[]int `json:"parentIds"`
	UserIds   *[]int `json:"userIds"`
	OnlyRoot  *bool  `json:"onlyRoot"`
	Limit     *int   `json:"limit"`
	Offset    *int   `json:"offset"`
}

func foldersGet(w http.ResponseWriter, r *http.Request, userId *int) {
	var payload FoldersFilterPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := src.DI.FolderRepository().Find(cards.FolderFilter{
		Ids:       payload.Ids,
		ParentIds: payload.ParentIds,
		UserIds:   payload.UserIds,
		OnlyRoot:  payload.OnlyRoot,
		Limit:     payload.Limit,
		Offset:    payload.Offset,
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

	json.NewEncoder(w).Encode(PaginationResponse[*cards.Folder]{Items: *result, Total: totalResponse})
}

func foldersTree(w http.ResponseWriter, r *http.Request, userId *int) {
	var payload FoldersFilterPayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := src.DI.FolderTreeService().GetTree(cards.FolderFilter{
		Ids:       payload.Ids,
		ParentIds: payload.ParentIds,
		UserIds:   payload.UserIds,
		OnlyRoot:  payload.OnlyRoot,
		Limit:     payload.Limit,
		Offset:    payload.Offset,
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

	jsonResult, err := json.Marshal(PaginationResponse[*cards.FolderTree]{Items: *result, Total: totalResponse})
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}
	w.Write(jsonResult)
}

type FoldersDeletePayload struct {
	FolderId *int
}

type foldersDeleteResponse struct {
	Success bool `json:"success"`
}

func foldersDelete(w http.ResponseWriter, r *http.Request, userId *int) {
	var payload FoldersDeletePayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := src.DI.FolderService().DeleteFolder(payload.FolderId, userId)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(foldersDeleteResponse{Success: result})
}

type FoldersUpdatePayload struct {
	Id       *int
	Name     *string
	UserId   *int
	ParentId *int
}

func foldersUpdate(w http.ResponseWriter, r *http.Request, userId *int) {
	var payload FoldersUpdatePayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := src.DI.FolderService().UpdateFolder(payload.Id, payload.ParentId, payload.UserId, payload.Name, userId)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(result)
}

type FoldersCreatePayload struct {
	Name     *string `json:"name"`
	ParentId *int    `json:"parentId"`
}

func foldersCreate(w http.ResponseWriter, r *http.Request, userId *int) {
	var payload FoldersCreatePayload
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	result, err := src.DI.FolderService().CreateFolder(payload.Name, payload.ParentId, userId)

	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	json.NewEncoder(w).Encode(result)
}
