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
	"context"
	"encoding/json"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	fhir_rest "github.com/tensorsystems/tensoremr/apps/core/internal/fhir"
)

type PatientRepository struct {
	FhirService fhir_rest.FhirService
}

func NewPatientRepository(fhirService fhir_rest.FhirService) PatientRepository {
	return PatientRepository{
		FhirService: fhirService,
	}
}

func (p *PatientRepository) CreatePatient(patient fhir.Patient) (*fhir.Patient, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := patient.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, statusCode, err := p.FhirService.Request("Patient", "POST", b, &returnPref)
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

	var result fhir.Patient
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&result)

	return &result, nil
}

// CreatePatientID ...
func (e *PatientRepository) CreatePatientID(tx pgx.Tx) (int, error) {
	var patientId int
	if err := tx.QueryRow(context.Background(), "INSERT INTO patients(created_at) VALUES ($1) RETURNING id", "now()").Scan(&patientId); err != nil {
		return 0, err
	}

	return patientId, nil
}

// GetOnePatient ...
func (p *PatientRepository) GetOnePatient(ID string) (*fhir.Patient, error) {
	returnPref := "return=representation"
	body, statusCode, err := p.FhirService.Request("Patient/"+ID, "GET", nil, &returnPref)

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

	var patient fhir.Patient
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&patient)

	return &patient, nil
}

