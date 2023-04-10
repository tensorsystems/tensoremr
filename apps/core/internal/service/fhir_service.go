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

package service

import (
	"bytes"
	"io"
	"net/http"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

type FHIRConfig struct {
	URL      string
	Username string
	Password string
}

type FHIRService struct {
	Config FHIRConfig
}

func NewFHIRService(config FHIRConfig) FHIRService {
	return FHIRService{
		Config: config,
	}
}

func (f *FHIRService) GetResource(resourceType string, pref *string) ([]byte, *http.Response, error) {
	url := f.Config.URL + "/" + resourceType

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, nil, err
	}

	req.Header.Add("Content-Type", "application/fhir+json")
	if pref != nil {
		req.Header.Add("Prefer", *pref)
	}

	req.SetBasicAuth(f.Config.Username, f.Config.Password)

	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, nil, err
	}

	defer resp.Body.Close()
	r, err := io.ReadAll(resp.Body)

	return r, resp, err
}

func (f *FHIRService) CreateResource(resourceType string, body []byte, pref *string) ([]byte, *http.Response, error) {
	url := f.Config.URL + "/" + resourceType

	reader := bytes.NewReader(body)
	req, err := http.NewRequest("POST", url, reader)
	if err != nil {
		return nil, nil, err
	}

	req.Header.Add("Content-Type", "application/fhir+json")
	if pref != nil {
		req.Header.Add("Prefer", *pref)
	}

	req.SetBasicAuth(f.Config.Username, f.Config.Password)

	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, nil, err
	}

	defer resp.Body.Close()
	r, err := io.ReadAll(resp.Body)

	return r, resp, err
}

func (f *FHIRService) UpdateResource(resourceType string, body []byte, pref *string) ([]byte, *http.Response, error) {
	url := f.Config.URL + "/" + resourceType

	reader := bytes.NewReader(body)
	req, err := http.NewRequest("PUT", url, reader)
	if err != nil {
		return nil, nil, err
	}

	req.Header.Add("Content-Type", "application/fhir+json")
	if pref != nil {
		req.Header.Add("Prefer", *pref)
	}

	req.SetBasicAuth(f.Config.Username, f.Config.Password)

	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, nil, err
	}

	defer resp.Body.Close()
	r, err := io.ReadAll(resp.Body)

	return r, resp, err
}

func (f *FHIRService) DeleteResource(resourceType string, ID string, pref *string) ([]byte, *http.Response, error) {
	url := f.Config.URL + "/" + resourceType + "/" + ID

	req, err := http.NewRequest("DELETE", url, nil)
	if err != nil {
		return nil, nil, err
	}

	req.Header.Add("Content-Type", "application/fhir+json")
	if pref != nil {
		req.Header.Add("Prefer", *pref)
	}

	req.SetBasicAuth(f.Config.Username, f.Config.Password)

	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, nil, err
	}

	defer resp.Body.Close()
	r, err := io.ReadAll(resp.Body)

	return r, resp, err
}

func (f *FHIRService) CreateBundle(bundle fhir.Bundle, pref *string) ([]byte, *http.Response, error) {
	b, err := bundle.MarshalJSON()
	if err != nil {
		return nil, nil, err
	}

	reader := bytes.NewReader(b)
	req, err := http.NewRequest("POST", f.Config.URL, reader)
	if err != nil {
		return nil, nil, err
	}

	req.Header.Add("Content-Type", "application/fhir+json")
	if pref != nil {
		req.Header.Add("Prefer", *pref)
	}

	req.SetBasicAuth(f.Config.Username, f.Config.Password)

	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, nil, err
	}

	defer resp.Body.Close()
	r, err := io.ReadAll(resp.Body)

	return r, resp, err
}

func (f *FHIRService) HaveConnection() bool {
	url := f.Config.URL

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return false
	}

	req.Header.Add("Content-Type", "application/fhir+json")

	req.SetBasicAuth(f.Config.Username, f.Config.Password)

	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return false
	}

	if resp.StatusCode != 200 {
		return false
	}

	return true
}
