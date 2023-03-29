/*
  Copyright 2021 Kidus Tiliksew

  This file is part of Tensor EMR.

  Tensor EMR is free software: you can redistribute it and/or modify
  it under the terms of the version 2 of GNU General Public License as published by
  the Free Software Foundation.

  Tensor EMR is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

package fhir

import (
	"bytes"
	"io"
	"net/http"
	"os"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

type FhirService struct {
	Client      http.Client
	FhirBaseURL string
}

func (f *FhirService) SaveBundle(bundle fhir.Bundle, returnPref *string) ([]byte, int, error) {
	b, err := bundle.MarshalJSON()
	if err != nil {
		return nil, 500, err
	}

	body, statusCode, err := f.Request("", "POST", b, returnPref)
	if err != nil {
		return nil, statusCode, err
	}

	return body, statusCode, nil
}

func (f *FhirService) DeleteResource(resourceType, id string) ([]byte, int, error) {
	return f.Request(resourceType+"/"+id, "DELETE", nil, nil)
}

func (f *FhirService) Request(resource string, method string, data []byte, returnPref *string) ([]byte, int, error) {
	resourceUrl := ""
	if len(resource) != 0 {
		resourceUrl = "/" + resource
	}

	url := f.FhirBaseURL + resourceUrl

	reader := bytes.NewReader(data)
	req, err := http.NewRequest(method, url, reader)
	if err != nil {
		return nil, 500, err
	}

	req.Header.Add("Content-Type", "application/fhir+json")
	if returnPref != nil {
		req.Header.Add("Prefer", *returnPref)
	}

	username := os.Getenv("FHIR_USERNAME")
	password := os.Getenv("FHIR_PASSWORD")
	if len(username) > 0 {
		req.SetBasicAuth(username, password)
	}

	resp, err := f.Client.Do(req)
	if err != nil {
		return nil, 500, err
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, 500, err
	}

	return body, resp.StatusCode, err
}

func (f *FhirService) HaveConnection() bool {
	url := f.FhirBaseURL

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return false
	}

	req.Header.Add("Content-Type", "application/fhir+json")
	

	username := os.Getenv("FHIR_USERNAME")
	password := os.Getenv("FHIR_PASSWORD")
	if len(username) > 0 {
		req.SetBasicAuth(username, password)
	}

	resp, err := f.Client.Do(req)
	if err != nil {
		return false
	}

	if resp.StatusCode != 200 {
		return false
	}

	return true
}