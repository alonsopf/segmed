package db
import (
	"database/sql"
	_ "github.com/go-sql-driver/mysql"
	"strconv"
	"time"
	"errors"
	"strings"
	
	goutil "github.com/alonsopf/segmed/goutil"
	config "github.com/alonsopf/segmed/config"
)
func CheckToken(token string) (int, error) {
	configuration := config.GetConfig("prod")
	db, _ := sql.Open("mysql", configuration.DB_USERNAME+":"+configuration.DB_PASSWORD+"@/"+configuration.DB_NAME+"?charset=utf8")
	currentTime := int64(time.Now().Unix())			
	tm := strconv.FormatInt(currentTime, 10)		
	rows, _ := db.Query(`SELECT idUsuario FROM tokens WHERE token = '`+token+`' AND expiredAt >= `+tm)
	idUsuario := 0
	defer rows.Close()
	if rows.Next() {
		rows.Scan(&idUsuario)
		db.Close()
		return idUsuario, nil
	}
	return -1, errors.New("token does not exist")
}
func Login(email, pass string) (string, error) {//if success, return token for cookie
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
			return cryptoTextHashToken, nil
		}
	}
	db.Close()
	return "", errors.New("email / password does not match")
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