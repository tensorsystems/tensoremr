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

type OrganizationService struct {
	FhirService FhirService
}

// GetOneOrganization ...
func (e *OrganizationService) GetOneOrganization(ID string) (*fhir.Organization, error) {
	returnPref := "return=representation"
	body, statusCode, err := e.FhirService.FhirRequest("Organization/"+ID, "GET", nil, &returnPref)

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

	var organization fhir.Organization
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&organization)

	return &organization, nil
}

// GetOneOrganization ...
func (e *OrganizationService) GetOneOrganizationByIdentifier(ID string) (*fhir.Bundle, error) {
	returnPref := "return=representation"
	body, statusCode, err := e.FhirService.FhirRequest("Organization?identifier="+ID, "GET", nil, &returnPref)

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

	var organization fhir.Bundle
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&organization)

	return &organization, nil
}

// CreateOrganization ...
func (e *OrganizationService) CreateOrganization(en fhir.Organization) (*fhir.Organization, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, statusCode, err := e.FhirService.FhirRequest("Organization", "POST", b, &returnPref)
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

	var organization fhir.Organization
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&organization)

	return &organization, nil
}

// UpdateOrganization ...
func (s *OrganizationService) UpdateOrganization(en fhir.Organization) (*fhir.Organization, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	if en.Id == nil {
		return nil, errors.New("Organization ID is required")
	}

	body, statusCode, err := s.FhirService.FhirRequest("Organization/"+*en.Id, "PUT", b, &returnPref)
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

	var organization fhir.Organization
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&organization)

	return &organization, nil
}
