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
	"context"
	"encoding/json"
	"errors"
	"os"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

type OrganizationService struct {
	FHIRService FHIRService
}

func NewOrganizationService(FHIRService FHIRService) OrganizationService {
	return OrganizationService{
		FHIRService: FHIRService,
	}
}

// GetOneOrganization ...
func (o *OrganizationService) GetOneOrganization(ID string, context context.Context) (*fhir.Organization, error) {
	returnPref := "return=representation"
	body, resp, err := o.FHIRService.GetResource("Organization/"+ID, &returnPref, context)

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

	var organization fhir.Organization
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&organization)

	return &organization, nil
}

// GetCurrentOrganization ...
func (o *OrganizationService) GetCurrentOrganization(context context.Context) (*fhir.Bundle, error) {
	organizationId := os.Getenv("ORGANIZATION_ID")

	returnPref := "return=representation"
	body, resp, err := o.FHIRService.GetResource("Organization?identifier="+organizationId, &returnPref, context)

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

	var organization fhir.Bundle
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&organization)

	return &organization, nil
}

// GetOneOrganization ...
func (o *OrganizationService) GetOrganizationByIdentifier(ID string, context context.Context) (*fhir.Bundle, error) {
	returnPref := "return=representation"
	body, resp, err := o.FHIRService.GetResource("Organization?identifier="+ID, &returnPref, context)

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

	var organization fhir.Bundle
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&organization)

	return &organization, nil
}

// CreateOrganization ...
func (o *OrganizationService) CreateOrganization(en fhir.Organization, context context.Context) (*fhir.Organization, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, resp, err := o.FHIRService.CreateResource("Organization", b, &returnPref, context)
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

	var organization fhir.Organization
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&organization)

	return &organization, nil
}

// UpdateOrganization ...
func (o *OrganizationService) UpdateOrganization(en fhir.Organization, context context.Context) (*fhir.Organization, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	if en.Id == nil {
		return nil, errors.New("Organization ID is required")
	}

	body, resp, err := o.FHIRService.UpdateResource("Organization/"+*en.Id, b, &returnPref, context)
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

	var organization fhir.Organization
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&organization)

	return &organization, nil
}
