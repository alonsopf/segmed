package goutil
import (
	"crypto/sha512"
	"encoding/base64"
)

func ToSha512(str []byte) string {
	hasher := sha512.New()
    hasher.Write(str)
	return base64.StdEncoding.EncodeToString(hasher.Sum(nil))
}