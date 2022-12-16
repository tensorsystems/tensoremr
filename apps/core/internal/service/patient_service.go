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
	"encoding/json"
	"errors"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

type PatientService struct {
	RedisService RedisService
	FhirService  FhirService
}

func (p *PatientService) CreatePatient(patient fhir.Patient) (map[string]interface{}, error) {
	// Create FHIR resource
	var body []byte
	var statusCode int
	var err error

	returnPref := "return=representation"
	if patient.Id != nil {
		body, statusCode, err = p.FhirService.SavePatient(patient, &returnPref)
		if err != nil {
			return nil, err
		}

		if statusCode != 200 {
			return nil, errors.New(string(body))
		}
	} else {
		body, statusCode, err = p.FhirService.CreatePatient(patient, &returnPref)
		if err != nil {
			return nil, err
		}

		if statusCode != 201 {
			return nil, errors.New(string(body))
		}
	}

	patientResult := make(map[string]interface{})
	if err := json.Unmarshal(body, &patientResult); err != nil {
		return nil, err
	}

	// Create redis user
	rp := map[string]interface{}{
		"id": patientResult["id"].(string),
	}

	if len(patient.Name) > 0 {
		familyName := patient.Name[0].Family
		if familyName != nil {
			rp["familyName"] = *familyName
		}

		if len(patient.Name[0].Given) > 0 {
			givenName := patient.Name[0].Given[0]
			rp["givenName"] = givenName
		}
	}

	if err := p.RedisService.CreatePatient(rp); err != nil {
		return nil, err
	}

	return patientResult, nil
}
