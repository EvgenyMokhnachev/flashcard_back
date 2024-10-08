package main

import (
	"flashcards_backend/src/persistance/pgsql"
	"flashcards_backend/src/presentation"
	"flashcards_backend/src/utils"
	"fmt"
	"net/http"
)

func main() {
	// check environment variables
	env := utils.GetENV()

	pgsql.RunMigrations()

	// Регистрация обработчиков
	http.HandleFunc("/api/auth", func(w http.ResponseWriter, r *http.Request) {
		presentation.CORSFilter(w, r, presentation.AuthController)
	})
	http.HandleFunc("/api/users/", func(w http.ResponseWriter, r *http.Request) {
		presentation.CORSFilter(w, r, presentation.UserController)
	})
	http.HandleFunc("/api/folders/", func(w http.ResponseWriter, r *http.Request) {
		presentation.CORSFilter(w, r, presentation.FolderController)
	})
	http.HandleFunc("/api/cards/", func(w http.ResponseWriter, r *http.Request) {
		presentation.CORSFilter(w, r, presentation.CardsController)
	})

	// Запуск сервера
	serverPort := env.GOLANG_SERVER_PORT

	if serverPort == "" {
		panic("GOLANG_SERVER_PORT environment variable not set")
	}

	fmt.Println("Сервер запущен на порту " + serverPort)
	err := http.ListenAndServe(":"+serverPort, nil)
	if err != nil {
		fmt.Println("Ошибка при запуске сервера:", err)
	}
}
