package proxy

import (
	"bytes"
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

	proxy.ModifyResponse = func(r *http.Response) error {
		r.Header.Del("Access-Control-Allow-Origin")
		return nil
	}

	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		modifyRequest(req)
		req.Header = c.Request.Header
		req.Host = remote.Host
		req.URL.Scheme = remote.Scheme
		req.URL.Host = remote.Host
	}

	proxy.ServeHTTP(c.Writer, c.Request)
}

func (p FhirProxy) Logger() gin.HandlerFunc {
	return func(c *gin.Context) {

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
