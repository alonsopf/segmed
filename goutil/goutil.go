package goutil
import (
	"crypto/sha512"
	"encoding/base64"
	"golang.org/x/oauth2"
	unsplash "github.com/hbagdi/go-unsplash/unsplash"
	config "github.com/alonsopf/segmed/config"
)

func ToSha512(str []byte) string {
	hasher := sha512.New()
    hasher.Write(str)
	return base64.StdEncoding.EncodeToString(hasher.Sum(nil))
}

func SearchPhotosByWord(word string) (*unsplash.PhotoSearchResult, error) {
	configuration := config.GetConfig("prod")
	ts := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: configuration.UNSPLASH_ACCESS_KEY},
	)
	client := oauth2.NewClient(oauth2.NoContext, ts)
	unsclient := unsplash.New(client)  
	searchOpt := &unsplash.SearchOpt {Query : word}
	photos, _, err := unsclient.Search.Photos(searchOpt)
	if err != nil {
	  return nil, err
	}
	return photos, nil
}