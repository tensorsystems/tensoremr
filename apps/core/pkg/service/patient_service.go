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
	"strconv"

	"github.com/jackc/pgx/v5"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/pkg/util"
)

type PatientService struct {
	FHIRService FHIRService
	SqlDB       *pgx.Conn
}

func NewPatientService(FHIRService FHIRService, db *pgx.Conn) PatientService {
	return PatientService{
		FHIRService: FHIRService,
		SqlDB:       db,
	}
}

// GetOneCareTeam ...
func (p *PatientService) GetOnePatient(ID string, context context.Context) (*fhir.Patient, error) {
	returnPref := "return=representation"
	body, resp, err := p.FHIRService.GetResource("Patient/"+ID, &returnPref, context)

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

	var patient fhir.Patient
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&patient)

	return &patient, nil
}

func (p *PatientService) CreatePatient(patient fhir.Patient, context context.Context) (*fhir.Patient, error) {
	tx, err := p.SqlDB.BeginTx(context, pgx.TxOptions{})
	if err != nil {
		return nil, err
	}

	patientId, err := p.CreatePatientID(tx)
	if err != nil {
		return nil, err
	}

	// MRN ID
	value := strconv.Itoa(patientId)
	patient.Identifier = []fhir.Identifier{
		util.CreateMrnIdentifier(value),
	}

	// Create FHIR resource
	returnPref := "return=representation"
	b, err := patient.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, resp, err := p.FHIRService.CreateResource("Patient", b, &returnPref, context)
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

	var result fhir.Patient
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&result)

	return &result, nil
}

func (p *PatientService) CreatePatientID(tx pgx.Tx) (int, error) {
	var patientId int
	if err := tx.QueryRow(context.Background(), "INSERT INTO patients(created_at) VALUES ($1) RETURNING id", "now()").Scan(&patientId); err != nil {
		return 0, err
	}

	return patientId, nil
}
