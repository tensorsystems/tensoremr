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
	"encoding/json"
	"errors"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	fhir_rest "github.com/tensorsystems/tensoremr/apps/core/internal/fhir"
)

type AppointmentRepository struct {
	FhirService fhir_rest.FhirService
}

func NewAppointmentRepository(fhirService fhir_rest.FhirService) AppointmentRepository {
	return AppointmentRepository{
		FhirService: fhirService,
	}
}

// GetAppointment ...
func (a *AppointmentRepository) GetAppointment(ID string) (*fhir.Appointment, error) {
	returnPref := "return=representation"
	body, statusCode, err := a.FhirService.Request("Appointment/"+ID, "GET", nil, &returnPref)

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

	var appointment fhir.Appointment
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&appointment)

	return &appointment, nil
}

// CreateAppointment ...
func (a *AppointmentRepository) CreateAppointment(p fhir.Appointment) (*fhir.Appointment, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := p.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, statusCode, err := a.FhirService.Request("Appointment", "POST", b, &returnPref)
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

	var appointment fhir.Appointment
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&appointment)

	return &appointment, nil
}

// UpdateAppointment ...
func (a *AppointmentRepository) UpdateAppointment(p fhir.Appointment) (*fhir.Appointment, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := p.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, statusCode, err := a.FhirService.Request("Appointment", "POST", b, &returnPref)
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

	var appointment fhir.Appointment
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&appointment)

	return &appointment, nil
}

// CreateAppointmentResponse ...
func (a *AppointmentRepository) CreateAppointmentResponse(p fhir.AppointmentResponse) (*fhir.AppointmentResponse, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := p.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, statusCode, err := a.FhirService.Request("AppointmentResponse", "POST", b, &returnPref)
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

	var appointmentResponse fhir.AppointmentResponse
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&appointmentResponse)

	return &appointmentResponse, nil
}

// GetBySlotCount ...
func (s *AppointmentRepository) GetBySlot_Count(slotId string) (*float64, error) {
	returnPref := "return=representation"
	body, statusCode, err := s.FhirService.Request("Appointment?_summary=count&slot="+slotId, "GET", nil, &returnPref)

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

	total := aResult["total"].(float64)

	return &total, nil
}
