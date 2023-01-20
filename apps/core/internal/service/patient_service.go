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
	"context"
	"strconv"

	"github.com/jackc/pgx/v5"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
	"github.com/tensorsystems/tensoremr/apps/core/internal/util"
)

type PatientService struct {
	PatientRepository repository.PatientRepository
	SqlDB             *pgx.Conn
}

func (p *PatientService) CreatePatient(patient fhir.Patient) (*fhir.Patient, error) {
	tx, err := p.SqlDB.BeginTx(context.Background(), pgx.TxOptions{})
	if err != nil {
		return nil, err
	}

	var patientId int
	if err := tx.QueryRow(context.Background(), "INSERT INTO patients(created_at) VALUES ($1) RETURNING id", "now()").Scan(&patientId); err != nil {
		return nil, err
	}

	// MRN ID
	value := strconv.Itoa(patientId)
	patient.Identifier = []fhir.Identifier{
		util.CreateMrnIdentifier(value),
	}

	result, err := p.PatientRepository.CreatePatient(patient)
	if err != nil {
		return nil, err
	}

	return result, err

}
