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

type PractitionerRepository struct {
	FhirService fhir_rest.FhirService
}

func NewPractitionerRepository(fhirService fhir_rest.FhirService) PractitionerRepository {
	return PractitionerRepository{
		FhirService: fhirService,
	}
}

// GetOnePractitioner ...
func (p *PractitionerRepository) GetOnePractitioner(ID string) (*fhir.Practitioner, error) {
	returnPref := "return=representation"
	body, statusCode, err := p.FhirService.Request("Practitioner/"+ID, "GET", nil, &returnPref)

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

	var result fhir.Practitioner
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&result)

	return &result, nil
}
