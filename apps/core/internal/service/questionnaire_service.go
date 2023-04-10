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

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

type QuestionnaireService struct {
	FHIRService FHIRService
}

func NewQuestionnaireService(FHIRService FHIRService) QuestionnaireService {
	return QuestionnaireService{
		FHIRService: FHIRService,
	}
}

// GetOneQuestionnaire ...
func (q *QuestionnaireService) GetOneQuestionnaire(ID string) (*fhir.Questionnaire, error) {
	returnPref := "return=representation"
	body, resp, err := q.FHIRService.GetResource("Questionnaire/"+ID, &returnPref)

	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 200 {
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

// CreateQuestionnaire ...
func (q *QuestionnaireService) CreateQuestionnaire(qu fhir.Questionnaire) (*fhir.Questionnaire, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := qu.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, resp, err := q.FHIRService.CreateResource("Questionnaire", b, &returnPref)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 201 && resp.StatusCode != 200 {
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
func (q *QuestionnaireService) UpdateQuestionnaire(qu fhir.Questionnaire) (*fhir.Questionnaire, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := qu.MarshalJSON()
	if err != nil {
		return nil, err
	}

	if qu.Id == nil {
		return nil, errors.New("Questionnaire ID is required")
	}

	body, resp, err := q.FHIRService.UpdateResource("Questionnaire/"+*qu.Id, b, &returnPref)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 201 && resp.StatusCode != 200 {
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
