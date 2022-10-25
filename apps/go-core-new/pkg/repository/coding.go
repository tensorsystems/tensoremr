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
	"database/sql"
	"fmt"
	"strings"

	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/models"
)

type CodingRepository struct {
	DB *sql.DB
}

func NewCodingRepository(db *sql.DB) *CodingRepository {
	return &CodingRepository{DB: db}
}

func (c *CodingRepository) Insert(coding *models.Coding) (sql.Result, error) {
	stmt, err := c.DB.Prepare("INSERT INTO codings (id, system, version, code, display, definition) VALUES (?, ?, ?, ?, ?, ?)")
	if err != nil {
		return nil, err
	}

	result, err := stmt.Exec(coding.ID, coding.System, coding.Version, coding.Code, coding.Display, coding.Definition)

	return result, err
}

func (c *CodingRepository) InsertBulk(codings []*models.Coding) (sql.Result, error) {
	valueStrings := make([]string, 0, len(codings))
	valueArgs := make([]interface{}, 0, len(codings)*6)

	for _, row := range codings {
		valueStrings = append(valueStrings, "(?, ?, ?, ?, ?, ?)")
		valueArgs = append(valueArgs, row.ID)
		valueArgs = append(valueArgs, row.System)
		valueArgs = append(valueArgs, row.Version)
		valueArgs = append(valueArgs, row.Code)
		valueArgs = append(valueArgs, row.Display)
		valueArgs = append(valueArgs, row.Definition)
	}

	stmt := fmt.Sprintf("INSERT INTO codings (id, system, version, code, display, definition) VALUES %s", strings.Join(valueStrings, ","))

	result, err := c.DB.Exec(stmt, valueArgs...)

	return result, err
}

func (s *CodingRepository) CountBySystem(system string) (int, error) {
	count := 0
	row := s.DB.QueryRow("SELECT COUNT(*) AS count FROM codings WHERE system = ?", system)
	err := row.Scan(&count)

	return count, err
}
