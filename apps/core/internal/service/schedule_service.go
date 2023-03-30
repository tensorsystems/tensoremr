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
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
)

type ScheduleService struct {
	ScheduleRepository repository.ScheduleRepository
}

func NewScheduleService(repository repository.ScheduleRepository) ScheduleService {
	return ScheduleService{
		ScheduleRepository: repository,
	}
}

// CreateSchedule ...
func (s *ScheduleService) CreateSchedule(sl fhir.Schedule) (*fhir.Schedule, error) {
	schedule, err := s.ScheduleRepository.CreateSchedule(sl)
	if err != nil {
		return nil, err
	}

	return schedule, nil
}
