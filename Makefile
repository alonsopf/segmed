build-deps:
	GO111MODULE=off go get -u github.com/tkanos/gonfig
	GO111MODULE=off go get -u github.com/aws/aws-sdk-go/aws
	GO111MODULE=off go get -u github.com/aws/aws-sdk-go/aws/credentials
	GO111MODULE=off go get -u github.com/aws/aws-sdk-go/aws/session
	GO111MODULE=off go get -u github.com/aws/aws-sdk-go/service/s3
	GO111MODULE=off go get -u github.com/sfreiberg/gotwilio
	GO111MODULE=off go get -u github.com/go-sql-driver/mysql
	
test:
	go vet ./...
	golint -set_exit_status ./...