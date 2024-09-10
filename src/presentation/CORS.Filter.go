package presentation

import (
	"net/http"
)

func CORSFilter(w http.ResponseWriter, r *http.Request, f func(w http.ResponseWriter, r *http.Request)) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	if r.Method == "OPTIONS" {
		return
	}

	f(w, r)
}
