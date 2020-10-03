package db
import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"strconv"
	"time"
	"errors"
	"strings"
	"fmt"
	
	goutil "github.com/alonsopf/segmed/goutil"
	config "github.com/alonsopf/segmed/config"
)

type Users struct {
	IdUsuario int
    Name string
    Email string
}

type Image struct {
	IdImage int
    S3url string
    LikeTime string
}

func CheckToken(token string) (int, int, error) {
	configuration := config.GetConfig("prod")
	db, _ := sql.Open("mysql", configuration.DB_USERNAME+":"+configuration.DB_PASSWORD+"@/"+configuration.DB_NAME+"?charset=utf8")
	currentTime := int64(time.Now().Unix())			
	tm := strconv.FormatInt(currentTime, 10)		
	rows, _ := db.Query(`SELECT idUsuario FROM tokens WHERE token = '`+token+`' AND expiredAt >= `+tm)
	idUsuario := 0
	accountType := 0
	defer rows.Close()
	if rows.Next() {
		rows.Scan(&idUsuario)
		rows2, _ := db.Query(`SELECT accountType FROM users WHERE idUsuario = `+strconv.Itoa(idUsuario)+``)
		defer rows2.Close()
		if rows2.Next() {
			rows2.Scan(&accountType)
			db.Close()
			return idUsuario, accountType, nil
		}
	}
	return -1, -1, errors.New("token does not exist")
}

func ListImg(idUsuario string) (*map[int]*Image, error) {
	configuration := config.GetConfig("prod")
	db, err := sql.Open("mysql", configuration.DB_USERNAME+":"+configuration.DB_PASSWORD+"@/"+configuration.DB_NAME+"?charset=utf8")
	if err != nil {
		return nil, err
	}
	rows, err := db.Query(`SELECT idImage, s3url, likeTime FROM savedImages WHERE idUsuario = `+idUsuario+` AND status = 1 order by idImage asc`)
	if err != nil {
		db.Close()
		return nil, err
	}
	ImageList := make(map[int]*Image)
	idImage := 0
	s3url := ""
	likeTime := ""
	count := 0
	defer rows.Close()
	if rows.Next() {
		rows.Scan(&idImage, &s3url, &likeTime)
		ImageList[count] = &Image{idImage, s3url, likeTime}
        count++
	}
	db.Close()
    return &ImageList, nil
}

func ListUsers() (*map[int]*Users, error) {
	configuration := config.GetConfig("prod")
	db, err := sql.Open("mysql", configuration.DB_USERNAME+":"+configuration.DB_PASSWORD+"@/"+configuration.DB_NAME+"?charset=utf8")
	if err != nil {
		return nil, err
	}
	rows, err := db.Query(`SELECT idUsuario, name, email FROM users WHERE accountType = '1' order by idUsuario asc`)
	if err != nil {
		db.Close()
		return nil, err
	}
	UsersList := make(map[int]*Users)
	idUsuario := 0
	name := ""
	email := ""
	count := 0
	defer rows.Close()
	if rows.Next() {
		rows.Scan(&idUsuario, &name, &email)
		UsersList[count] = &Users{idUsuario, name, email}
        count++
	}
	db.Close()
    return &UsersList, nil
}

func Login(email, pass string) (string, string, error) {//if success, return token for cookie
	configuration := config.GetConfig("prod")
	db, _ := sql.Open("mysql", configuration.DB_USERNAME+":"+configuration.DB_PASSWORD+"@/"+configuration.DB_NAME+"?charset=utf8")
	rows, _ := db.Query(`SELECT idUsuario, name, accountType FROM users WHERE email = '`+email+`' AND pass = '`+pass+`'`)
	defer rows.Close()
	idUsuario := 0
	name := ""
	accountType := 0
	if rows.Next() {
	    rows.Scan(&idUsuario, &name, &accountType)
	    currentTime := int64(time.Now().Unix())
	    expiredAt := currentTime+36000 //10 hours
		expiredAtString := strconv.FormatInt(expiredAt, 10)
		tm := time.Unix(currentTime, 0)
		dateString := tm.Format(time.RFC3339)
		cryptoTextHashToken := goutil.ToSha512([]byte(email+"-"+dateString))	
		db.Exec(`DELETE FROM tokens WHERE idUsuario = `+strconv.Itoa(idUsuario)+``)
		stmtInsertToken, _ := db.Prepare("INSERT tokens SET idUsuario=?,token=?,expiredAt=?")
		cryptoTextHashToken = strings.Replace(cryptoTextHashToken, "+", "0", -1)
		result, _ := stmtInsertToken.Exec(idUsuario,cryptoTextHashToken,expiredAtString)
		stmtInsertToken.Close()
		affected, _ := result.RowsAffected()
		if affected == 1 {
			db.Close()
			return cryptoTextHashToken, strconv.Itoa(accountType), nil
		}
	}
	db.Close()
	return "", "", errors.New("email / password does not match")
}

func MatchSMS(number, confirm string) bool {
	configuration := config.GetConfig("prod")
	db, err := sql.Open("mysql", configuration.DB_USERNAME+":"+configuration.DB_PASSWORD+"@/"+configuration.DB_NAME+"?charset=utf8")
	if err != nil {
		return false
	}
	rows, err := db.Query(`SELECT confirm FROM sendSMS WHERE number = '`+number+`'`)
	if err != nil {
		db.Close()
		return false
	}
	var confirmDB string
	defer rows.Close()
	if rows.Next() {
		rows.Scan(&confirmDB)
		if confirm == confirmDB {
			db.Close()
			return true
		}
	}
	db.Close()
    return true
}

func InsertUser(name, email, pass string) bool {
	configuration := config.GetConfig("prod")
	db, err := sql.Open("mysql", configuration.DB_USERNAME+":"+configuration.DB_PASSWORD+"@/"+configuration.DB_NAME+"?charset=utf8")
	if err != nil {
		return false
	}
	cryptoTextHash := goutil.ToSha512([]byte(pass))
	
	stmtInsertUser, err := db.Prepare("INSERT users SET name=?, email=?, confirm=?, pass=?, iosToken=?, androidToken=?, accountType=?, cellphone=?, cellphoneVerified=?, hashConfirm=?, hashReset=?, idFacebook=?")
	if err != nil {
		fmt.Println(err)
		return false
	}
	_, err = stmtInsertUser.Exec(name,email,"1",cryptoTextHash,"","","1","","","","","")
	if err != nil {
		fmt.Println(err)
		return false
	}
	stmtInsertUser.Close()
    db.Close()
    return true
}

func InsertSMS(number, confirm string) bool {
	configuration := config.GetConfig("prod")
	db, err := sql.Open("mysql", configuration.DB_USERNAME+":"+configuration.DB_PASSWORD+"@/"+configuration.DB_NAME+"?charset=utf8")
	if err != nil {
		return false
	}
	db.Exec(`DELETE FROM sendSMS WHERE number = '`+number+`'`)
	currentTime := int64(time.Now().Unix())
	currentTimeString := strconv.FormatInt(currentTime, 10)		
	stmtInsertImage, _ := db.Prepare("INSERT sendSMS SET number=?, confirm=?, timestamp=?")
	stmtInsertImage.Exec(number,confirm,currentTimeString)
	stmtInsertImage.Close()
    db.Close()
    return true
}

func InsertExistingImage(s3url, idUnsplash string, idUsuario int) bool {
	configuration := config.GetConfig("prod")
	db, err := sql.Open("mysql", configuration.DB_USERNAME+":"+configuration.DB_PASSWORD+"@/"+configuration.DB_NAME+"?charset=utf8")
	if err != nil {
		return false
	}
	currentTime := int64(time.Now().Unix())
	currentTimeString := strconv.FormatInt(currentTime, 10)		
	stmtInsertImage, _ := db.Prepare("INSERT savedImages SET UnsplashID=?, idUsuario=?, status=?, s3url=?, likeTime=?")
	stmtInsertImage.Exec(idUnsplash,idUsuario,"1",s3url,currentTimeString)
	stmtInsertImage.Close()
    db.Close()
    return true
}

func ChangeStatusLike(Status string, idImage int) bool {
	configuration := config.GetConfig("prod")
	db, err := sql.Open("mysql", configuration.DB_USERNAME+":"+configuration.DB_PASSWORD+"@/"+configuration.DB_NAME+"?charset=utf8")
	if err != nil {
		return false
	}
	stmt, _ := db.Prepare("UPDATE savedImages SET status=? WHERE idImage=?")
    stmt.Exec(Status, idImage)
    stmt.Close()
    db.Close()
    return true
}

func ExistID(ID string, idUsuario int) (bool, int, string, error) {
	configuration := config.GetConfig("prod")
	db, err := sql.Open("mysql", configuration.DB_USERNAME+":"+configuration.DB_PASSWORD+"@/"+configuration.DB_NAME+"?charset=utf8")
	if err != nil {
		return false, 0, "", err
	}
	rows, err := db.Query(`SELECT idImage, s3url FROM savedImages WHERE UnsplashID = '`+ID+`' AND idUsuario = `+strconv.Itoa(idUsuario))
	if err != nil {
		db.Close()
		return false, 0, "", err
	}
	var idImage int
	var s3url string
	defer rows.Close()
	if rows.Next() {
		rows.Scan(&idImage, &s3url)
		db.Close()
		return true, idImage, s3url,  nil
	}
	rows2, _ := db.Query(`SELECT s3url FROM savedImages WHERE UnsplashID = '`+ID+`'`)
	defer rows2.Close()
	if rows2.Next() {
		rows2.Scan(&s3url)
		db.Close()
		return true, 0, s3url,  nil
	}
	db.Close()
	return false, 0, "", nil
}