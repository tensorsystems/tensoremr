package proxy

import (
	"bytes"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

type FhirProxy struct {
}

func (p FhirProxy) Proxy(c *gin.Context) {
	baseUrl := os.Getenv("FHIR_BASE_URL")

	remote, err := url.Parse(baseUrl)
	if err != nil {
		panic(err)
	}

	proxy := httputil.NewSingleHostReverseProxy(remote)
	proxy.Transport = &transport{http.DefaultTransport}
	originalDirector := proxy.Director

	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		modifyRequest(req)
	}

	proxy.ModifyResponse = modifyResponse()
	proxy.ErrorHandler = errorHandler()

	proxy.ServeHTTP(c.Writer, c.Request)
}

func (p FhirProxy) Logger() gin.HandlerFunc {
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

type transport struct {
	http.RoundTripper
}

func (t *transport) RoundTrip(req *http.Request) (resp *http.Response, err error) {
	resp, err = t.RoundTripper.RoundTrip(req)
	if err != nil {
		return nil, err
	}
	b, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}
	err = resp.Body.Close()
	if err != nil {
		return nil, err
	}
	b = bytes.Replace(b, []byte("server"), []byte("schmerver"), -1)
	body := ioutil.NopCloser(bytes.NewReader(b))
	resp.Body = body
	resp.ContentLength = int64(len(b))
	resp.Header.Set("Content-Length", strconv.Itoa(len(b)))
	return resp, nil
}
