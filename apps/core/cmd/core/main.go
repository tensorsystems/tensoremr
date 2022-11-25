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
	"github.com/tensorsystems/tensoremr/apps/core/internal/controller"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

func main() {
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

	appMode := os.Getenv("APP_MODE")
	port := os.Getenv("APP_PORT")

	if appMode == "release" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	// Services
	keycloakService := service.KeycloakService{Client: client, Token: token.AccessToken, Realm: clientAppRealm}
	fhirService := service.FhirService{
		Client: http.Client{},
	}

	// Controllers
	userController := controller.UserController{
		KeycloakService: keycloakService,
		FhirService:     fhirService,
	}

	r := gin.Default()
	r.SetTrustedProxies([]string{"127.0.0.1", "localhost"})
	r.Any("/fhir-server/api/v4/*fhir", fhirProxy, Logger())
	r.POST("/users", userController.CreateUser)
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
