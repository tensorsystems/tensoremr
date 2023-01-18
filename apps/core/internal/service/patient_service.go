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
	"database/sql"
	"strconv"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
	"github.com/tensorsystems/tensoremr/apps/core/internal/util"
)

type PatientService struct {
	PatientRepository repository.PatientRepository
	SqlDB             *sql.DB
}

func (p *PatientService) CreatePatient(patient fhir.Patient) (*fhir.Patient, error) {
	stmt, err := p.SqlDB.Prepare("INSERT INTO patients(created_at) VALUES (?)")
	if err != nil {
		return nil, err
	}

	tx, err := p.SqlDB.Begin()
	if err != nil {
		return nil, err
	}

	sqlResult, err := tx.Stmt(stmt).Exec("datetime('now')")

	if err != nil {
		return nil, err
	}

	id, err := sqlResult.LastInsertId()
	if err != nil {
		return nil, err
	}

	// MRN ID
	value := strconv.Itoa(int(id))
	patient.Identifier = []fhir.Identifier{
		util.CreateMrnIdentifier(value),
	}

	result, err := p.PatientRepository.CreatePatient(patient)
	if err != nil {
		return nil, err
	}

	return result, err

}
