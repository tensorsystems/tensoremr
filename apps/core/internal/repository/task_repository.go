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

package repository

import (
	"bytes"
	"encoding/json"
	"errors"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	fhir_rest "github.com/tensorsystems/tensoremr/apps/core/internal/fhir"
)

type TaskRepository struct {
	FhirService fhir_rest.FhirService
}

// GetOneTask ...
func (t *TaskRepository) GetOneTask(ID string) (*fhir.Task, error) {
	returnPref := "return=representation"
	body, statusCode, err := t.FhirService.Request("Task/"+ID, "GET", nil, &returnPref)

	if err != nil {
		return nil, err
	}

	if statusCode != 200 {
		return nil, errors.New(string(body))
	}

	aResult := make(map[string]interface{})
	if err := json.Unmarshal(body, &aResult); err != nil {
		return nil, err
	}

	var task fhir.Task
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&task)

	return &task, nil
}

// CreateTask ...
func (e *TaskRepository) CreateTask(ts fhir.Task) (*fhir.Task, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := ts.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, statusCode, err := e.FhirService.Request("Task", "POST", b, &returnPref)
	if err != nil {
		return nil, err
	}

	if statusCode != 201 && statusCode != 200 {
		return nil, errors.New(string(body))
	}

	aResult := make(map[string]interface{})
	if err := json.Unmarshal(body, &aResult); err != nil {
		return nil, err
	}

	var task fhir.Task
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&task)

	return &task, nil
}

// CreateTask ...
func (e *TaskRepository) CreateTaskBatch(ts []fhir.Task) (*fhir.Bundle, error) {
	// Create FHIR resource
	var entries []fhir.BundleEntry
	for _, e := range ts {
		b, err := e.MarshalJSON()
		if err != nil {
			return nil, err
		}

		entry := fhir.BundleEntry{
			Request: &fhir.BundleEntryRequest{
				Method: fhir.HTTPVerbPOST,
				Url:    "Task",
			},
			Resource: b,
		}

		entries = append(entries, entry)
	}

	bundle := fhir.Bundle{
		Type:  fhir.BundleTypeTransaction,
		Entry: entries,
	}

	returnPref := "return=representation"
	b, err := bundle.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, statusCode, err := e.FhirService.Request("", "POST", b, &returnPref)
	if err != nil {
		return nil, err
	}

	if statusCode != 201 && statusCode != 200 {
		return nil, errors.New(string(body))
	}

	aResult := make(map[string]interface{})
	if err := json.Unmarshal(body, &aResult); err != nil {
		return nil, err
	}

	var result fhir.Bundle
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&result)

	return &result, nil
}

// UpdateTask ...
func (s *TaskRepository) UpdateTask(en fhir.Task) (*fhir.Task, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	if en.Id == nil {
		return nil, errors.New("Task ID is required")
	}

	body, statusCode, err := s.FhirService.Request("Task/"+*en.Id, "PUT", b, &returnPref)
	if err != nil {
		return nil, err
	}

	if statusCode != 201 && statusCode != 200 {
		return nil, errors.New(string(body))
	}

	aResult := make(map[string]interface{})
	if err := json.Unmarshal(body, &aResult); err != nil {
		return nil, err
	}

	var task fhir.Task
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&task)

	return &task, nil
}
