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

type SnomedProxy struct{}

func (p SnomedProxy) Proxy(c *gin.Context) {
	baseUrl := os.Getenv("SNOMEDCT_BASE_URL")

	remote, err := url.Parse(baseUrl)
	if err != nil {
		panic(err)
	}

	proxy := httputil.NewSingleHostReverseProxy(remote)
	proxy.Transport = &SnomedTransport{http.DefaultTransport}
	originalDirector := proxy.Director

	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		req.Header = c.Request.Header
		req.Host = remote.Host
		req.URL.Scheme = remote.Scheme
		req.URL.Host = remote.Host
		req.URL.Path = c.Param("proxyPath")
	}

	proxy.ModifyResponse = func(r *http.Response) error {
		r.Header.Del("Access-Control-Allow-Origin")
		return nil
	}

	proxy.ServeHTTP(c.Writer, c.Request)
}

func (p SnomedProxy) Logger() gin.HandlerFunc {
	return func(c *gin.Context) {
		// access the status we are sending
		status := c.Writer.Status()

		log.Println(status)

		test := c.Request.RequestURI
		log.Println(test)
	}
}

type SnomedTransport struct {
	http.RoundTripper
}

func (t *SnomedTransport) RoundTrip(req *http.Request) (resp *http.Response, err error) {
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
