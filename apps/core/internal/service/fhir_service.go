package service

import (
	"bytes"
	"io"
	"log"
	"net/http"
	"os"
)

type FhirService struct {
	Client http.Client
}

func (f *FhirService) FhirRequest(resource string, method string, data []byte) error {
	url := "http://localhost:" + os.Getenv("APP_PORT") + "/fhir-server/api/v4/" + resource

	reader := bytes.NewReader(data)
	req, err := http.NewRequest(method, url, reader)
	if err != nil {
		return err
	}

	req.Header.Add("Content-Type", "application/fhir+json")

	resp, err := f.Client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	log.Println(string(body))

	return nil
}
