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
	"encoding/json"
	"errors"
	"io"
	"net/http"

	"github.com/RediSearch/redisearch-go/redisearch"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

type LoincService struct {
	Client            *redisearch.Client
	LoincFhirBaseURL  string
	LoincFhirUsername string
	LoincFhirPassword string
}

// SearchForms ...
func (l *LoincService) SearchForms(term string) ([]redisearch.Document, int, error) {
	return l.Client.Search(redisearch.NewQuery("@PanelType:Panel @LONG_COMMON_NAME:"+term).
		Limit(0, 20))
}

// GetLoincQuestionnaire ...
func (l *LoincService) GetLoincQuestionnaire(loincId string) (*json.RawMessage, error) {
	url := l.LoincFhirBaseURL + "/Questionnaire/?url=http://loinc.org/q/" + loincId
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Add("Content-Type", "application/json")
	req.SetBasicAuth(l.LoincFhirUsername, l.LoincFhirPassword)

	client := http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	result := make(map[string]interface{})
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, err
	}

	var bundle fhir.Bundle
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(result)
	json.NewDecoder(buf).Decode(&bundle)

	if len(bundle.Entry) > 0 {
		return &bundle.Entry[0].Resource, nil
	}

	return nil, errors.New("Questionnaire not found")
}
