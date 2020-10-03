package config

import (
  "github.com/tkanos/gonfig"
  "fmt"
)

type Configuration struct {
  DB_USERNAME string
  DB_PASSWORD string
  EMAIL     string
  EMAIL_PASS     string
  DB_NAME     string
  TWILIO_ID   string
  TWILIO_TOKEN   string
  TWILIO_NUMBER   string
  UNSPLASH_ACCESS_KEY string
  UNSPLASH_SECRET_KEY string
  SITE_URL  string
  AWS_ID  string
  AWS_SECRET string
  AWS_BASE_URL string
}

func GetConfig(params ...string) Configuration {
  configuration := Configuration{}
  env := "prod"
  if len(params) > 0 {
   env = params[0]
  }
  fileName := fmt.Sprintf("./%s_config.json", env)
  gonfig.GetConf(fileName, &configuration)
  return configuration
}