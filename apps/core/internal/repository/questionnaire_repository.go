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

type QuestionnaireRepository struct {
	FhirService fhir_rest.FhirService
}

// GetOneQuestionnaire ...
func (e *QuestionnaireRepository) GetOneQuestionnaire(ID string) (*fhir.Questionnaire, error) {
	returnPref := "return=representation"
	body, statusCode, err := e.FhirService.Request("Questionnaire/"+ID, "GET", nil, &returnPref)

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

	var questionnaire fhir.Questionnaire
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&questionnaire)

	return &questionnaire, nil
}

// GetCurrentQuestionnaire ...
func (e *QuestionnaireRepository) GetCurrentQuestionnaire(questionnaireId string) (*fhir.Bundle, error) {
	returnPref := "return=representation"
	body, statusCode, err := e.FhirService.Request("Questionnaire?identifier="+questionnaireId, "GET", nil, &returnPref)

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

	var questionnaire fhir.Bundle
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&questionnaire)

	return &questionnaire, nil
}

// CreateQuestionnaire ...
func (e *QuestionnaireRepository) CreateQuestionnaire(en fhir.Questionnaire) (*fhir.Questionnaire, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, statusCode, err := e.FhirService.Request("Questionnaire", "POST", b, &returnPref)
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

	var questionnaire fhir.Questionnaire
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&questionnaire)

	return &questionnaire, nil
}

// UpdateQuestionnaire ...
func (s *QuestionnaireRepository) UpdateQuestionnaire(en fhir.Questionnaire) (*fhir.Questionnaire, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	if en.Id == nil {
		return nil, errors.New("Questionnaire ID is required")
	}

	body, statusCode, err := s.FhirService.Request("Questionnaire/"+*en.Id, "PUT", b, &returnPref)
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

	var questionnaire fhir.Questionnaire
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&questionnaire)

	return &questionnaire, nil
}
