# Prerequisites
- have a letsencrypt ssl certificate
- golang installed in a linux server
- mysql installed

# Installation
1. 
```bash
go get github.com/alonsopf/segmed 
```
2. execute segmed.sql
3. fill your prod_config.json with your keys and data
4. 
```bash
cd $GOPATH/src/github.com/alonsopf/segmed
```
5. go run alonso.go
6. test in:  yoururl.com/segmed.ai/
7. default user: alonsopf@gmail.com  /  segmedai
8. default admin user: adam@segmed.ai  /  segmedai
9. Example in: [https://alonsopf.com/segmed.ai/](https://alonsopf.com/segmed.ai/)

NOTE: I used mysql_native_password, so this is needed:
```bash
CREATE USER 'usersegmed'@'localhost' IDENTIFIED BY 'mypass';

GRANT ALL PRIVILEGES ON segmed.* TO 'usersegmed'@'localhost';
ALTER USER 'usersegmed'@'localhost' IDENTIFIED WITH mysql_native_password BY 'mypass';
```