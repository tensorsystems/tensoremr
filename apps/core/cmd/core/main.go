package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"

	"github.com/Nerzal/gocloak/v12"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	client := gocloak.NewClient("http://localhost:8080")
	ctx := context.Background()

	clientId := os.Getenv("KEYCLOAK_CLIENT_ID")
	clientSecret := os.Getenv("KEYCLOAK_CLIENT_SECRET")
	clientMasterRealm := os.Getenv("KEYCLOAK_CLIENT_SECRET_MASTER_REALM")
	clientAppRealm := os.Getenv("KEYCLOAK_CLIENT_SECRET_APP_REALM")

	token, err := client.LoginClient(ctx, clientId, clientSecret, clientMasterRealm)
	if err != nil {
		log.Fatal(err)
	}

	users, _ := client.GetUserGroups(ctx, token.AccessToken, clientAppRealm, "e81294b8-6878-4580-b40a-401e63d6344b", gocloak.GetGroupsParams{})

	fmt.Println(users)


	appMode := os.Getenv("APP_MODE")
	port := os.Getenv("APP_PORT")

	if appMode == "release" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	r := gin.Default()
	r.SetTrustedProxies([]string{"127.0.0.1"})
	r.Any("/fhir-server/api/v4/*fhir", fhirProxy, Logger())
	r.Run(":" + port)
}

func fhirProxy(c *gin.Context) {
	baseUrl := os.Getenv("FHIR_BASE_URL")

	remote, err := url.Parse(baseUrl)
	if err != nil {
		panic(err)
	}

	proxy := httputil.NewSingleHostReverseProxy(remote)

	originalDirector := proxy.Director

	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		modifyRequest(req)
	}

	proxy.ModifyResponse = modifyResponse()
	proxy.ErrorHandler = errorHandler()

	proxy.ServeHTTP(c.Writer, c.Request)
}

func Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		// access the status we are sending
		status := c.Writer.Status()
		log.Println(status)

		test := c.Request.RequestURI
		log.Println(test)
	}
}

func modifyRequest(req *http.Request) {
	username := os.Getenv("FHIR_USERNAME")
	password := os.Getenv("FHIR_PASSWORD")

	req.Header.Set("X-Proxy", "fhir-Reverse-Proxy")
	req.SetBasicAuth(username, password)
}

func errorHandler() func(http.ResponseWriter, *http.Request, error) {
	return func(w http.ResponseWriter, req *http.Request, err error) {
		fmt.Printf("Got error while modifying response: %v \n", err)
		return
	}
}

func modifyResponse() func(*http.Response) error {
	return func(resp *http.Response) error {
		return nil
	}
}
