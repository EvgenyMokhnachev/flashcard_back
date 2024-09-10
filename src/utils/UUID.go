package utils

import (
	"crypto/rand"
	"fmt"
	"io"
)

// GenerateUUID generates a random unique UUID according to RFC 4122
func GenerateUUID() (*string, error) {
	uuid := make([]byte, 16)
	n, err := io.ReadFull(rand.Reader, uuid)
	if n != len(uuid) || err != nil {
		return nil, err
	}

	// Set the version to 4 (randomly generated UUID)
	uuid[6] = (uuid[6] & 0x0f) | 0x40

	// Set the variant to RFC 4122
	uuid[8] = (uuid[8] & 0x3f) | 0x80

	uuidStr := fmt.Sprintf("%08x-%04x-%04x-%04x-%012x",
		uuid[0:4],
		uuid[4:6],
		uuid[6:8],
		uuid[8:10],
		uuid[10:])

	return &uuidStr, nil
}
