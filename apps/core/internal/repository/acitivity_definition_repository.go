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
	"github.com/tensorsystems/tensoremr/apps/core/internal/keycloak"
)

type ActivityDefinitionRepository struct {
	FhirService     fhir_rest.FhirService
	KeycloakService keycloak.KeycloakService
}

// GetActivityDefinition ...
func (a *ActivityDefinitionRepository) GetActivityDefinition(ID string) (*fhir.ActivityDefinition, error) {
	returnPref := "return=representation"
	body, statusCode, err := a.FhirService.FhirRequest("ActivityDefinition/"+ID, "GET", nil, &returnPref)

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

	var activityDefinition fhir.ActivityDefinition
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&activityDefinition)

	return &activityDefinition, nil
}

// CreateActivityDefinition ...
func (a *ActivityDefinitionRepository) CreateActivityDefinition(activityDefinition fhir.ActivityDefinition) (*fhir.ActivityDefinition, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := activityDefinition.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, statusCode, err := a.FhirService.FhirRequest("ActivityDefinition", "POST", b, &returnPref)
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

	var result fhir.ActivityDefinition
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&result)

	return &result, nil
}

// UpdateActivityDefinition ...
func (a *ActivityDefinitionRepository) UpdateActivityDefinition(activityDefinition fhir.ActivityDefinition) (*fhir.ActivityDefinition, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := activityDefinition.MarshalJSON()
	if err != nil {
		return nil, err
	}

	if activityDefinition.Id == nil {
		return nil, errors.New("Activity definition ID is required")
	}

	body, statusCode, err := a.FhirService.FhirRequest("ActivityDefinition/"+*activityDefinition.Id, "PUT", b, &returnPref)
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

	var result fhir.ActivityDefinition
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&result)

	return &result, nil
}

// GetActiveDefinitionByName...
func (e *ActivityDefinitionRepository) GetActivityDefinitionByName(name string) (*fhir.Bundle, error) {
	returnPref := "return=representation"
	body, statusCode, err := e.FhirService.FhirRequest("ActivityDefinition?name="+name, "GET", nil, &returnPref)

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

	var activityDefinition fhir.Bundle
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&activityDefinition)

	return &activityDefinition, nil
}
