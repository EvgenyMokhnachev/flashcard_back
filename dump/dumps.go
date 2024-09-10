package dump

import (
	"crypto/sha256"
	"embed"
	"encoding/csv"
	"encoding/hex"
	"encoding/json"
	"flashcards_backend/src"
	"flashcards_backend/src/domain/cards"
	"flashcards_backend/src/domain/management"
	"strconv"
	"time"
)

//go:embed dumps/*
var dumps embed.FS

func hashSHA256(data string) string {
	hasher := sha256.New()
	hasher.Write([]byte(data))
	return hex.EncodeToString(hasher.Sum(nil))
}

var usersIdsMap = make(map[int]int)
var foldersIdsMap = make(map[int]int)

func StartUsersDump() {
	users1File, err := dumps.Open("dumps/users1.csv")
	if err != nil {
		println(err.Error())
		return
	}

	users1FileCsvReader := csv.NewReader(users1File)

	// Читаем все строки из файла
	usersRows, err := users1FileCsvReader.ReadAll()
	if err != nil {
		println(err.Error())
		return
	}

	usersRows = usersRows[1:]
	users := make([]management.User, len(usersRows), len(usersRows))
	// Обрабатываем данные
	for index, userRow := range usersRows {
		id, err := strconv.Atoi(userRow[0])
		if err != nil {
			println(err.Error())
			return
		}
		email := userRow[1]
		pass := userRow[2]

		passHash := hashSHA256(pass)

		users[index].Id = &id
		users[index].Email = &email
		users[index].Pass = &passHash
	}

	for _, user := range users {
		oldId := *user.Id
		user.Id = nil
		savedUser, err := src.DI.UserRepository().Insert(&user)
		if err != nil {
			println(err.Error(), *user.Email)
			continue
		}
		if savedUser == nil || savedUser.Id == nil {
			userJson, _ := json.Marshal(user)
			println("User doesn't saved", string(userJson))
			continue
		}

		usersIdsMap[oldId] = *savedUser.Id
	}

	res, _ := json.Marshal(usersIdsMap)
	println(string(res))
}

func StartFoldersDump() {
	folders1File, err := dumps.Open("dumps/folders1.csv")
	if err != nil {
		println(err.Error())
		return
	}

	folders1FileCsvReader := csv.NewReader(folders1File)

	// Читаем все строки из файла
	foldersRows, err := folders1FileCsvReader.ReadAll()
	if err != nil {
		println(err.Error())
		return
	}

	foldersRows = foldersRows[1:]
	folders := make([]cards.Folder, len(foldersRows), len(foldersRows))
	// Обрабатываем данные
	for index, folderRow := range foldersRows {
		id, err := strconv.Atoi(folderRow[0])
		if err != nil {
			println(err.Error())
			return
		}

		name := folderRow[1]

		var parentId *int = nil
		parsedParentId, err := strconv.Atoi(folderRow[2])
		if err == nil {
			parentId = &parsedParentId
		}

		var userId *int = nil
		parsedUserId, err := strconv.Atoi(folderRow[3])
		if err == nil {
			userIdFromMap := usersIdsMap[parsedUserId]
			userId = &userIdFromMap
		}

		folders[index].Id = &id
		folders[index].Name = &name
		folders[index].ParentId = parentId
		folders[index].UserId = userId
	}

	SaveFolders(folders)

	res, _ := json.Marshal(foldersIdsMap)
	println(string(res))
}

func SaveFolders(folders []cards.Folder) {
	foldersToRepeat := make([]cards.Folder, 0)

	for _, folder := range folders {
		oldId := *folder.Id

		parentId := folder.ParentId
		var newParentId *int = nil
		if parentId != nil {
			newParentIdInt, exists := foldersIdsMap[*parentId]
			if !exists {
				foldersToRepeat = append(foldersToRepeat, folder)
				continue
			}
			newParentId = &newParentIdInt
		}
		folder.ParentId = newParentId

		savedFolder, err := src.DI.FolderRepository().Insert(&folder)
		if err != nil {
			println(err.Error())
			continue
		}

		if savedFolder == nil || savedFolder.Id == nil {
			folderJson, _ := json.Marshal(folder)
			println("Folder doesn't saved", string(folderJson))
			continue
		}

		foldersIdsMap[oldId] = *savedFolder.Id
	}

	if len(foldersToRepeat) != 0 {
		SaveFolders(foldersToRepeat)
	}
}

func StartCardsDump() {
	cards1File, err := dumps.Open("dumps/cards1.csv")
	if err != nil {
		println(err.Error())
		return
	}

	cards1FileCsvReader := csv.NewReader(cards1File)

	// Читаем все строки из файла
	cardsRows, err := cards1FileCsvReader.ReadAll()
	if err != nil {
		println(err.Error())
		return
	}

	cardsRows = cardsRows[1:]
	cardsItems := make([]cards.Card, len(cardsRows), len(cardsRows))
	// Обрабатываем данные
	for index, cardRow := range cardsRows {
		id, err := strconv.Atoi(cardRow[0])
		if err != nil {
			println(err.Error())
			return
		}

		backSide := cardRow[1]

		var bookmarked bool = false
		bookmarkedRowVal := cardRow[2]
		if bookmarkedRowVal == "1" {
			bookmarked = true
		}

		var createdAt *time.Time = nil
		createdAtRowVal := cardRow[3]
		if createdAtRowVal != "" {
			ms, err := strconv.ParseInt(createdAtRowVal, 10, 64)
			if err == nil {
				seconds := ms / 1000
				nanoseconds := (ms % 1000) * int64(time.Millisecond)
				t := time.Unix(seconds, nanoseconds)
				createdAt = &t
			}
		}

		var difficult int = 1
		difficultRowVal := cardRow[4]
		if difficultRowVal != "" {
			difficultInt, err := strconv.Atoi(difficultRowVal)
			if err == nil {
				difficult = difficultInt
			}
		}

		var difficultChangeTime *time.Time = nil
		difficultChangeTimeRowVal := cardRow[5]
		if difficultChangeTimeRowVal != "" {
			ms, err := strconv.ParseInt(difficultChangeTimeRowVal, 10, 64)
			if err == nil {
				seconds := ms / 1000
				nanoseconds := (ms % 1000) * int64(time.Millisecond)
				t := time.Unix(seconds, nanoseconds)
				difficultChangeTime = &t
			}
		}

		var folderId *int = nil
		folderIdParsedInt, err := strconv.Atoi(cardRow[6])
		if err == nil {
			folderIdFromMap, exists := foldersIdsMap[folderIdParsedInt]
			if exists {
				folderId = &folderIdFromMap
			}
		}

		frontSide := cardRow[7]

		var userId *int = nil
		userIdParsedInt, err := strconv.Atoi(cardRow[8])
		if err == nil {
			userIdFromMap, exists := usersIdsMap[userIdParsedInt]
			if exists {
				userId = &userIdFromMap
			}
		}

		cardsItems[index].Id = &id
		cardsItems[index].FrontSide = &frontSide
		cardsItems[index].BackSide = &backSide
		cardsItems[index].Difficult = &difficult
		cardsItems[index].UserId = userId
		cardsItems[index].FolderId = folderId
		cardsItems[index].CreatedAt = createdAt
		cardsItems[index].Bookmarked = &bookmarked
		cardsItems[index].DifficultChangeTime = difficultChangeTime
	}

	SaveCards(cardsItems)

	res, _ := json.Marshal(foldersIdsMap)
	println(string(res))
}

func SaveCards(cardsItems []cards.Card) {
	for _, card := range cardsItems {
		savedCard, err := src.DI.CardRepository().Insert(&card)
		if err != nil {
			println(err.Error())
			continue
		}

		if savedCard == nil || savedCard.Id == nil {
			cardJson, _ := json.Marshal(card)
			println("Card doesn't saved", string(cardJson))
			continue
		}
	}
}
