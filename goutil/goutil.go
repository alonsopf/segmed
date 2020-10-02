package goutil
import (
	"crypto/sha512"
	"encoding/base64"
	"golang.org/x/oauth2"
	"strconv"
	unsplash "github.com/hbagdi/go-unsplash/unsplash"
	config "github.com/alonsopf/segmed/config"
)

func ToSha512(str []byte) string {
	hasher := sha512.New()
    hasher.Write(str)
	return base64.StdEncoding.EncodeToString(hasher.Sum(nil))
}

type Photos struct {
	ID string
    Url string
    Description string
    AltDescription string
    Likes string
    Photographer string
    Country string
}

func SearchPhotosByWord(word string) (*map[int]*Photos, error) {
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
	count := 0
	PhotosList := make(map[int]*Photos)
	for _, photo := range *photos.Results {
		urlValue := *photo.Urls.Regular
		user := *photo.Photographer
        PhotosList[count] = &Photos{*photo.ID, urlValue.String(), *photo.Description, *photo.AltDescription, strconv.Itoa(*photo.Likes), user.String(), *photo.Location.Country}
        count++
    }
	return &PhotosList, nil
}