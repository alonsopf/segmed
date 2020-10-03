
package main

import (
    "github.com/graarh/golang-socketio"
    "github.com/graarh/golang-socketio/transport"
    "log"
    "fmt"
    "net/http"
    "net/url"
    "strings"
)

func main() {
   //connect to server, you can use your own transport settings
	c, err := gosocketio.Dial(
		gosocketio.GetUrl("https://api-demo.fxcm.com", 443, true),
		transport.GetDefaultWebsocketTransport(),
	)

	//handle connected
	c.On(gosocketio.OnConnection, func(c *gosocketio.Channel) {
		log.Println("New client connected")
		//join them to room
		//c.Join("chat")
	})
	// Block to give client time to connect 
    select {}

	//c.Close()
}