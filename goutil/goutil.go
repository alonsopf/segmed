package goutil
import (
	"crypto/sha512"
	"encoding/base64"
	"strconv"
	"bytes"
	"encoding/json"
	"net/http"
	"io"
	"os"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
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

func SearchPhotosByWord(word, page string) (*map[int]*Photos, error, int , int) {
	configuration := config.GetConfig("prod")
	view := "https://api.unsplash.com/search/photos/?per_page=9&page="+page+"&query="+word+"&client_id="+configuration.UNSPLASH_ACCESS_KEY
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
	json.Unmarshal([]byte(s2), &result)
	PhotosList := make(map[int]*Photos)
	count := 0
	var desc string
	for _, photo := range result.Results {
		desc = ""
		if photo.Description != nil {
			desc = photo.Description.(string)
		}
		PhotosList[count] = &Photos{photo.ID, photo.Urls.Regular, desc, photo.AltDescription, strconv.Itoa(photo.Likes), photo.User.Name}
        count++
    }
	return &PhotosList, nil, result.Total, result.TotalPages
}

// UploadFileToS3 saves a file to aws bucket and returns the url to // the file and an error if there's any
func uploadFileToS3(s *session.Session, file *os.File, size int64, filepath string) (string, error) {
  buffer := make([]byte, size)
  file.Read(buffer)	
  // config settings: this is where you choose the bucket,
  // filename, content-type and storage class of the file
  // you're uploading
  _, err := s3.New(s).PutObject(&s3.PutObjectInput{
     Bucket:               aws.String("alonsopf-segmed"),
     Key:                  aws.String(filepath),
     ACL:                  aws.String("public-read"),
     Body:                 bytes.NewReader(buffer),
     ContentLength:        aws.Int64(size),
     ContentType:        aws.String(http.DetectContentType(buffer)),
     ContentDisposition:   aws.String("attachment"),
     ServerSideEncryption: aws.String("AES256"),
     StorageClass:         aws.String("INTELLIGENT_TIERING"),
  })
  if err != nil {
     return "6", err
  }
  return filepath, err
}

func DownloadAndUploadToCloud(filepath string, url string) (string, error) {
	configuration := config.GetConfig("prod")
	resp, err := http.Get(url)
	if err != nil {
		return "0", err
	}
	defer resp.Body.Close()
	out, err := os.Create(filepath)
	if err != nil {
		return "1", err
	}
	defer out.Close()
	_, err = io.Copy(out, resp.Body)
	file, err := os.OpenFile(filepath, os.O_RDWR, 0755)
	if err != nil {
		return "2", err
	}
	s, err := session.NewSession(&aws.Config{
		Region: aws.String("us-west-1"),
		Credentials: credentials.NewStaticCredentials(
			configuration.AWS_ID,  configuration.AWS_SECRET ,  ""),  // token can be left blank for now
	})
	if err != nil {
		return "3", err
	}
	fi, err := file.Stat()
	if err != nil {
  		return "4", err
	}

	fileName, err := uploadFileToS3(s, file, fi.Size(), filepath)
	if err != nil {
		return "5", err
	}
	return fileName , nil
}