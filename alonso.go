package main

import (
    "net/http"
    "log"
    "io/ioutil"
    "flag"
    "strings"
    "time"
    "fmt"
    "encoding/json"
    "strconv"
    "math/rand"
    db "github.com/alonsopf/segmed/db"
    goutil "github.com/alonsopf/segmed/goutil"
    config "github.com/alonsopf/segmed/config"
)

func addCookie(w http.ResponseWriter, name, value string, ttl time.Duration) {
    expire := time.Now().Add(ttl)
    cookie := http.Cookie{
        Name:    name,
        Value:   value,
        Expires: expire,
    }
    http.SetCookie(w, &cookie)
}

func HealthCheckServer(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "text/html")
    w.Write([]byte("<html><head></head><body><h1>Health Check</h1></body></html>"))
}

func HelloServer(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "text/plain")
    w.Write([]byte("This is an example server.\n"))
}



func RegisterServer(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "text/html")
    dat, _ := ioutil.ReadFile("segmed_register.tpl")
    w.Write(dat)
}

func SegmedServer(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "text/html")
    dat, _ := ioutil.ReadFile("segmed_login.tpl")
    w.Write(dat)
}

func SignInServer(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    name := req.PostFormValue("alias")
    email := req.PostFormValue("correo")
    pass := req.PostFormValue("pass")
    if db.InsertUser(name,email,pass) {
        w.Write([]byte(`{"success" : 1}`))     
        return
    }
    w.Write([]byte(`{"success" : 0}`)) 
}

func ConfirmSMSServer(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    phone := req.PostFormValue("phone")
    confirm := req.PostFormValue("confirm")
    if db.MatchSMS(phone,confirm) {
        w.Write([]byte(`{"success" : 1}`)) 
        return
    }
    w.Write([]byte(`{"success" : 0}`)) 
}
func SendSMSServer(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    rand.Seed(time.Now().Unix())
    uno := rand.Intn(10)
    dos := rand.Intn(10)
    tres := rand.Intn(10)
    cuatro := rand.Intn(10)
    cinco := rand.Intn(10)
    seis := rand.Intn(10)
    confirm := strconv.Itoa(uno)+strconv.Itoa(dos)+strconv.Itoa(tres)+strconv.Itoa(cuatro)+strconv.Itoa(cinco)+strconv.Itoa(seis)
    message := "SEGMED - Your confirm number is: "+confirm
    phone := req.PostFormValue("phone")
    sent, err := goutil.SendSMS(message, phone)
    if err != nil {
        fmt.Println(err)
        w.Write([]byte(`{"success" : 0}`)) 
        return
    }
    if sent {
        if db.InsertSMS(phone, confirm) {
            w.Write([]byte(`{"success" : 1}`)) 
            return
        }
    }
    w.Write([]byte(`{"success" : 2}`)) 
}

func LikeServer(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    cookie, _ := req.Cookie("log")
    idUsuario, _, err := db.CheckToken(cookie.Value)
    if err != nil {
        dat, _ := ioutil.ReadFile("segmed_login.tpl")
        w.Write(dat)
        return
    }
    idUnsplash := req.PostFormValue("idUnsplash")
    UnsplashID := req.PostFormValue("UnsplashID")
    
    urlImg := req.PostFormValue("urlImg")
    status := req.PostFormValue("status")
    exist, idImage, s3url, err := db.ExistID(UnsplashID, idUsuario)
    if err != nil {
        fmt.Println(err)
        w.Write([]byte(`{"success" : -1}`)) 
        return
    }
    if exist && idImage!=0 {//change status
        if status == "1" {
            status = "0"
        } else {
            status = "1"
        }
        if db.ChangeStatusLike(status, idImage) {
            w.Write([]byte(`{"success" : 1}`)) 
            return
        }
    }
    if exist && idImage==0 {//insert with idUsuario
        if db.InsertExistingImage(s3url, idUnsplash, idUsuario) {
            w.Write([]byte(`{"success" : 1}`)) 
            return
        }
    }
    if !exist {//upload to s3, then insert
        currentTime := int64(time.Now().Unix())
        currentTimeString := strconv.FormatInt(currentTime, 10)     
        filename := strconv.Itoa(idUsuario)+"-"+currentTimeString
        s3url, err = goutil.DownloadAndUploadToCloud(filename,urlImg)
        if err != nil {
            fmt.Println(s3url)//number of error
            fmt.Println(err)
            w.Write([]byte(`{"success" : -2}`)) 
            return
        }
        if db.InsertExistingImage(s3url, idUnsplash, idUsuario) {
            w.Write([]byte(`{"success" : 1}`)) 
            return
        }
    }
}

func SearchByWordServer(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    cookie, _ := req.Cookie("log")
    idUsuario, _, err := db.CheckToken(cookie.Value)
    if err != nil {
        dat, _ := ioutil.ReadFile("segmed_login.tpl")
        w.Write(dat)
        return
    }
    word := req.PostFormValue("word")
    page := req.PostFormValue("page")
    Photos, err, total, totalPages := goutil.SearchPhotosByWord(word,page)
    var status string
    idUsuarioString := strconv.Itoa(idUsuario)
    for i:=0;i<len(*Photos);i++{
        photo := (*Photos)[i]
        status, _ = db.CheckStatusForImage(idUsuarioString,photo.ID)   
        photo.Status = status 
    }
    
    if err != nil {
        fmt.Println(err)
        w.Write([]byte(`{"success" : 0}`)) 
        return
    }
    example := map[string]interface{}{ "Success":1 , "Photos" : Photos, "Total" : total, "TotalPages" : totalPages}  
    js, _ := json.Marshal(example)
    w.Write(js)
}

func DownloadImgServer(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    cookie, _ := req.Cookie("log")
    _, accountType, err := db.CheckToken(cookie.Value)
    if err != nil {
        fmt.Println(err)
        w.Write([]byte(`{"success" : 0}`)) 
        return
    }
    if accountType == 3 || accountType == 1 {
        S3url := req.PostFormValue("S3url")
        base64, err := goutil.DownloadAndEncode(S3url)
        if err != nil {
            fmt.Println(err)
            w.Write([]byte(`{"success" : 0}`)) 
            return
        }
        example := map[string]interface{}{ "Success":1 , "Base64" : base64}  
        js, _ := json.Marshal(example)
        w.Write(js)
    }    
}


func GetImgUserServer(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    cookie, _ := req.Cookie("log")
    idUsuario, accountType, err := db.CheckToken(cookie.Value)
    if err != nil {
        fmt.Println(err)
        w.Write([]byte(`{"success" : 0}`)) 
        return
    }
    if accountType == 1 {
        idUsuarioString := strconv.Itoa(idUsuario)
        img, err := db.ListImg(idUsuarioString)
        if err != nil {
            fmt.Println(err)
            w.Write([]byte(`{"success" : 0}`)) 
            return
        }
        example := map[string]interface{}{ "Success":1 , "Img" : img}  
        js, _ := json.Marshal(example)
        w.Write(js)
    }    
}

func GetImgServer(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    cookie, _ := req.Cookie("log")
    _, accountType, err := db.CheckToken(cookie.Value)
    if err != nil {
        fmt.Println(err)
        w.Write([]byte(`{"success" : 0}`)) 
        return
    }
    if accountType == 3 {
        idUsuario := req.PostFormValue("idUsuario")
        img, err := db.ListImg(idUsuario)
        if err != nil {
            fmt.Println(err)
            w.Write([]byte(`{"success" : 0}`)) 
            return
        }
        example := map[string]interface{}{ "Success":1 , "Img" : img}  
        js, _ := json.Marshal(example)
        w.Write(js)
    }    
}

func ListUsersServer(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    cookie, _ := req.Cookie("log")
    _, accountType, err := db.CheckToken(cookie.Value)
    if err != nil {
        fmt.Println(err)
        w.Write([]byte(`{"success" : 0}`)) 
        return
    }
    if accountType == 3 {
        users, err := db.ListUsers()
        if err != nil {
            fmt.Println(err)
            w.Write([]byte(`{"success" : 0}`)) 
            return
        }
        example := map[string]interface{}{ "Success":1 , "Users" : users}  
        js, _ := json.Marshal(example)
        w.Write(js)
    }    
}

func HomeServer(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "text/html")
    cookie, _ := req.Cookie("log")
    _, accountType, err := db.CheckToken(cookie.Value)
    if err != nil {
        dat, _ := ioutil.ReadFile("segmed_login.tpl")
        w.Write(dat)
        return
    }
    if accountType == 1 {//user normal
        dat, _ := ioutil.ReadFile("home.tpl")
        w.Write(dat)   
    }
    if accountType == 3 {//admin
        dat, _ := ioutil.ReadFile("home_admin.tpl")
        w.Write(dat)   
    }
}


func LoginServer(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "application/json")
    email := req.PostFormValue("email")
    pass := req.PostFormValue("pass")
    cryptoTextHash := goutil.ToSha512([]byte(pass))    
    hash, accountType, err := db.Login(email,cryptoTextHash)
    if err != nil {
        w.Write([]byte(`{"success" : 0}`))  
        return
    }
    if accountType == "1" {//user normal
        addCookie(w, "log", hash, 600*time.Minute)
        w.Write([]byte(`{"success" : 1}`))      
    }
    if accountType == "3" {//admin
        addCookie(w, "log", hash, 600*time.Minute)
        w.Write([]byte(`{"success" : 2}`))      
    }
    
}

func MainServer(w http.ResponseWriter, req *http.Request) {
    w.Header().Set("Content-Type", "text/html")
    dat, _ := ioutil.ReadFile("public/index.html")
    w.Write(dat)
}
//scp client.go root@128.199.11.21:/root/go/src/main/
//scp server.go root@128.199.11.21:/root/go/src/main/
//scp sil.red.proto root@128.199.11.21:/root/go/src/main/
//var c grpc.ClientConnInterface
func redirect(w http.ResponseWriter, req *http.Request) {
    http.Redirect(w, req,
            "https://" + req.Host + req.URL.String(),
            http.StatusMovedPermanently)
}
func main() {
	fmt.Println("alonsopf segmed started")
    //directory := flag.String("d", "./static", "the directory of static file to host")
    directory := flag.String("d", "./public/assets", "the directory of assets file to host")
    directory2 := flag.String("d2", "./static", "the directory of static file to host")
    flag.Parse()
    http.Handle("/static/", http.StripPrefix(strings.TrimRight("/static/", "/"), http.FileServer(http.Dir(*directory2))))
    http.Handle("/assets/", http.StripPrefix(strings.TrimRight("/assets/", "/"), http.FileServer(http.Dir(*directory))))

    go http.ListenAndServe(":80", http.HandlerFunc(redirect))
   
    http.HandleFunc("/hello", HelloServer)
    http.HandleFunc("/", MainServer)
    http.HandleFunc("/segmed.ai/", SegmedServer)
    http.HandleFunc("/segmed.ai/login", LoginServer)
    http.HandleFunc("/segmed.ai/app", RegisterServer)
    http.HandleFunc("/segmed.ai/register", SignInServer)
    http.HandleFunc("/segmed.ai/home", HomeServer)
    http.HandleFunc("/segmed.ai/searchByWord", SearchByWordServer)
    http.HandleFunc("/segmed.ai/like", LikeServer)
    http.HandleFunc("/segmed.ai/sendSMS", SendSMSServer)
    http.HandleFunc("/segmed.ai/confirmSMS", ConfirmSMSServer)
    http.HandleFunc("/segmed.ai/listUsers", ListUsersServer)
    http.HandleFunc("/segmed.ai/getImg", GetImgServer)
    http.HandleFunc("/segmed.ai/getImgUser", GetImgUserServer)
    http.HandleFunc("/segmed.ai/downloadImg", DownloadImgServer)
    http.HandleFunc("/health_check", HealthCheckServer)
    configuration := config.GetConfig("prod")
    err := http.ListenAndServeTLS(":443", "/etc/letsencrypt/live/"+configuration.SITE_URL+"/fullchain.pem", "/etc/letsencrypt/live/"+configuration.SITE_URL+"/privkey.pem", nil)
    if err != nil {
        log.Fatal("ListenAndServe: ", err)
    }
}