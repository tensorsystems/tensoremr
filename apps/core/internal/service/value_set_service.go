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

	fhir_rest "github.com/tensorsystems/tensoremr/apps/core/internal/fhir"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

type ValueSetService struct {
	FhirService fhir_rest.FhirService
}

func NewValueSetService(fhirService fhir_rest.FhirService) ValueSetService {
	return ValueSetService{
		FhirService: fhirService,
	}
}

func (v *ValueSetService) GetOrganizationTypes() (*fhir.ValueSet, error) {
	returnPref := "return=representation"
	body, statusCode, err := v.FhirService.Request("ValueSet/$expand?url=http://hl7.org/fhir/ValueSet/organization-type", "GET", nil, &returnPref)

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

	var valueSet fhir.ValueSet
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&valueSet)

	return &valueSet, nil
}
