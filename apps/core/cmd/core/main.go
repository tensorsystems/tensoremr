package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.SetTrustedProxies([]string{"127.0.0.1"})
	r.Any("/fhir-server/api/v4/*fhir", fhirProxy, Logger())

	r.Run(":8080")
}

func fhirProxy(c *gin.Context) {
	remote, err := url.Parse("http://34.170.68.247:9080")
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
	req.Header.Set("X-Proxy", "fhir-Reverse-Proxy")
	req.SetBasicAuth("fhiruser", "change-password")
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
