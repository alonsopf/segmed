package goutil
import (
	"crypto/sha512"
	"encoding/base64"
	"strconv"
	"bytes"
	"encoding/json"
	"net/http"
	"fmt"
	config "github.com/alonsopf/segmed/config"
)

func ToSha512(str []byte) string {
	hasher := sha512.New()
    hasher.Write(str)
	return base64.StdEncoding.EncodeToString(hasher.Sum(nil))
}

type PhotoResponse struct {
	Total      int `json:"total"`
	TotalPages int `json:"total_pages"`
	Results    []struct {
		ID             string      `json:"id"`
		CreatedAt      string      `json:"created_at"`
		UpdatedAt      string      `json:"updated_at"`
		PromotedAt     interface{} `json:"promoted_at"`
		Width          int         `json:"width"`
		Height         int         `json:"height"`
		Color          string      `json:"color"`
		BlurHash       string      `json:"blur_hash"`
		Description    interface{} `json:"description"`
		AltDescription string      `json:"alt_description"`
		Urls           struct {
			Raw     string `json:"raw"`
			Full    string `json:"full"`
			Regular string `json:"regular"`
			Small   string `json:"small"`
			Thumb   string `json:"thumb"`
		} `json:"urls"`
		Links struct {
			Self             string `json:"self"`
			HTML             string `json:"html"`
			Download         string `json:"download"`
			DownloadLocation string `json:"download_location"`
		} `json:"links"`
		Categories             []interface{} `json:"categories"`
		Likes                  int           `json:"likes"`
		LikedByUser            bool          `json:"liked_by_user"`
		CurrentUserCollections []interface{} `json:"current_user_collections"`
		Sponsorship            interface{}   `json:"sponsorship"`
		User                   struct {
			ID              string      `json:"id"`
			UpdatedAt       string      `json:"updated_at"`
			Username        string      `json:"username"`
			Name            string      `json:"name"`
			FirstName       string      `json:"first_name"`
			LastName        string      `json:"last_name"`
			TwitterUsername interface{} `json:"twitter_username"`
			PortfolioURL    string      `json:"portfolio_url"`
			Bio             string      `json:"bio"`
			Location        interface{} `json:"location"`
			Links           struct {
				Self      string `json:"self"`
				HTML      string `json:"html"`
				Photos    string `json:"photos"`
				Likes     string `json:"likes"`
				Portfolio string `json:"portfolio"`
				Following string `json:"following"`
				Followers string `json:"followers"`
			} `json:"links"`
			ProfileImage struct {
				Small  string `json:"small"`
				Medium string `json:"medium"`
				Large  string `json:"large"`
			} `json:"profile_image"`
			InstagramUsername interface{} `json:"instagram_username"`
			TotalCollections  int         `json:"total_collections"`
			TotalLikes        int         `json:"total_likes"`
			TotalPhotos       int         `json:"total_photos"`
			AcceptedTos       bool        `json:"accepted_tos"`
		} `json:"user"`
		Tags []struct {
			Type  string `json:"type"`
			Title string `json:"title"`
		} `json:"tags"`
	} `json:"results"`
}

type Photos struct {
	ID string
    Url string
    Description string
    AltDescription string
    Likes string
    Photographer string
}

func SearchPhotosByWord(word string) (*map[int]*Photos, error, int , int) {
	configuration := config.GetConfig("prod")
	view := "https://api.unsplash.com/search/photos/?query="+word+"&client_id="+configuration.UNSPLASH_ACCESS_KEY
	fmt.Println(view)
	req, err := http.NewRequest("GET", view , nil)
	if err != nil {
		return nil, err, 0, 0
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err, 0, 0
	}
	var result PhotoResponse
	buf2 := new(bytes.Buffer)
	buf2.ReadFrom(resp.Body)
	defer resp.Body.Close()
	s2 := buf2.String()
	fmt.Println(s2)
	json.Unmarshal([]byte(s2), &result)
	PhotosList := make(map[int]*Photos)
	count := 0
	for _, photo := range result.Results {
		PhotosList[count] = &Photos{photo.ID, photo.Urls.Regular, photo.Description, photo.AltDescription, strconv.Itoa(photo.Likes), photo.User.Name}
        count++
    }
	return &PhotosList, nil
}