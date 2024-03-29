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
	"encoding/json"
	"errors"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"golang.org/x/net/context"
)

type ScheduleService struct {
	FHIRService FHIRService
}

func NewScheduleService(FHIRService FHIRService) ScheduleService {
	return ScheduleService{
		FHIRService: FHIRService,
	}
}

// CreateSchedule ...
func (s *ScheduleService) CreateSchedule(sl fhir.Schedule, context context.Context) (*fhir.Schedule, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := sl.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, resp, err := s.FHIRService.CreateResource("Schedule", b, &returnPref, context)
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

	var schedule fhir.Schedule
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&schedule)

	return &schedule, nil
}
