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

	"github.com/jackc/pgx/v5"
)

type IdService struct {
	SqlDB *pgx.Conn
}

func NewIdService(db *pgx.Conn) IdService {
	return IdService{
		SqlDB: db,
	}
}

// Create patient id table
func (i *IdService) CreatePatientTable() error {
	_, err := i.SqlDB.Exec(context.Background(), "CREATE TABLE patients (id serial PRIMARY KEY, created_at timestamp)")
	return err
}

// Create encounter id table
func (i *IdService) CreateEncounterTable() error {
	_, err := i.SqlDB.Exec(context.Background(), "CREATE TABLE encounters (id serial PRIMARY KEY, created_at timestamp)")
	return err
}
