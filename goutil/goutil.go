package goutil
import (
	"crypto/sha512"
	"encoding/base64"
	"golang.org/x/oauth2"
	"strconv"
	"fmt"
	config "github.com/alonsopf/segmed/config"
)

func ToSha512(str []byte) string {
	hasher := sha512.New()
    hasher.Write(str)
	return base64.StdEncoding.EncodeToString(hasher.Sum(nil))
}

type PhotoResponse []struct {
	ID             string      `json:"id"`
	CreatedAt      string      `json:"created_at"`
	UpdatedAt      string      `json:"updated_at"`
	PromotedAt     interface{} `json:"promoted_at"`
	Width          int         `json:"width"`
	Height         int         `json:"height"`
	Color          string      `json:"color"`
	BlurHash       string      `json:"blur_hash"`
	Description    string      `json:"description"`
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
		LastName        interface{} `json:"last_name"`
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
	Exif struct {
		Make         interface{} `json:"make"`
		Model        interface{} `json:"model"`
		ExposureTime string      `json:"exposure_time"`
		Aperture     interface{} `json:"aperture"`
		FocalLength  string      `json:"focal_length"`
		Iso          interface{} `json:"iso"`
	} `json:"exif"`
	Location struct {
		Title    interface{} `json:"title"`
		Name     interface{} `json:"name"`
		City     interface{} `json:"city"`
		Country  interface{} `json:"country"`
		Position struct {
			Latitude  interface{} `json:"latitude"`
			Longitude interface{} `json:"longitude"`
		} `json:"position"`
	} `json:"location"`
	Views     int `json:"views"`
	Downloads int `json:"downloads"`
}

type Photos struct {
	ID string
    Url string
    Description string
    AltDescription string
    Likes string
    Photographer string
}

func SearchPhotosByWord(word string) (*map[int]*Photos, error) {
	configuration := config.GetConfig("prod")
	req, err := http.NewRequest("GET", "https://api.unsplash.com/photos/random/?query="+word+"&client_id="+configuration.UNSPLASH_ACCESS_KEY, nil)
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()
	var result PhotoResponse
	buf2 := new(bytes.Buffer)
	buf2.ReadFrom(resp.Body)
	s2 := buf2.String()
	fmt.Println(s2)
	json.Unmarshal([]byte(s2), &result)
	PhotosList := make(map[int]*Photos)
	for _, photo := range result {
		PhotosList[count] = &Photos{photo.ID, photo.Urls.Regular, photo.Description.(string), photo.AltDescription, strconv.Itoa(photo.Likes), photo.User.Name}
        count++
    }
	return &PhotosList, nil
}