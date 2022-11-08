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
	"time"
)

type ScheduleRepository struct {
	DB *sql.DB
}

func NewScheduleRepository(db *sql.DB) *ScheduleRepository {
	return &ScheduleRepository{DB: db}
}

func (s *ScheduleRepository) CountByEndPeriod(startPeriod, endPeriod time.Time) (int, error) {
	count := 0
	row := s.DB.QueryRow("SELECT COUNT(*) AS count FROM schedules WHERE DATE(endPeriod) >= ? AND DATE(endPeriod) <= ?", startPeriod, endPeriod)
	err := row.Scan(&count)

	return count, err
}
