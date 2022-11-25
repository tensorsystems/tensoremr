package service

import (
	"bytes"
	"crypto/tls"
	"encoding/json"
	"io"
	"log"
	"net/http"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

type OrganizationService struct {
}

type OrganizationInput struct {
	Use            fhir.IdentifierUse
	IdTypeSystem   string
	IdTypeVersion  string
	IdTypeCode     string
	IdTypeDisplay  string
	IdTypeSelected bool
	IdSystem       string
	IdValue        string
}

func (o *OrganizationService) Create(organization fhir.Organization) error {
	customTransport := http.DefaultTransport.(*http.Transport).Clone()
	customTransport.TLSClientConfig = &tls.Config{InsecureSkipVerify: true}
	client := http.Client{Transport: customTransport}

	url := "https://192.168.232.4:9443/fhir-server/api/v4/Identifier"
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(organization)

	req, err := http.NewRequest("POST", url, buf)
	if err != nil {
		return err
	}

	req.SetBasicAuth("fhiruser", "change-password")
	req.Header.Add("Content-Type", "application/json")

	resp, err := client.Do(req)
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
