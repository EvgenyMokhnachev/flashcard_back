package utils

import (
	"errors"
	"os"
	"strings"
)

type ENV struct {
	DATABASE_HOST      string
	DATABASE_PORT      string
	DATABASE_USER      string
	DATABASE_PASS      string
	DATABASE_NAME      string
	GOLANG_SERVER_PORT string
}

var env *ENV

func GetENV() ENV {
	if env != nil {
		return *env
	}

	var envVals, _ = readEnvFile()
	env = new(ENV)

	env.DATABASE_HOST = getEnvVal("DATABASE_HOST", &envVals)
	env.DATABASE_PORT = getEnvVal("DATABASE_PORT", &envVals)
	env.DATABASE_USER = getEnvVal("DATABASE_USER", &envVals)
	env.DATABASE_PASS = getEnvVal("DATABASE_PASS", &envVals)
	env.DATABASE_NAME = getEnvVal("DATABASE_NAME", &envVals)
	env.GOLANG_SERVER_PORT = getEnvVal("GOLANG_SERVER_PORT", &envVals)

	return *env
}

func getEnvVal(key string, vals *map[string]string) string {
	var val = os.Getenv(key)
	if val == "" {
		if vals == nil || (*vals)[key] == "" {
			panic(errors.New(key + " is not presented in OS and in .env file"))
		}
		return (*vals)[key]
	}
	return val
}

func readEnvFile() (map[string]string, error) {
	var resultMap = make(map[string]string)

	file, err := os.ReadFile("./.env")
	if err != nil {
		return nil, err
	}

	var envFileValue = string(file)
	rows := strings.Split(envFileValue, "\n")

	for _, row := range rows {
		row = strings.TrimSpace(row)
		if row == "" {
			continue
		}
		if (row[0] == '/') || (row[0] == ';') || (row[0] == '#') {
			continue
		}
		if !strings.Contains(row, "=") {
			continue
		}
		var equalIndex = strings.Index(row, "=")
		var envName = row[:equalIndex]
		var envVal = row[equalIndex+1:]
		resultMap[envName] = envVal
	}

	return resultMap, nil
}
