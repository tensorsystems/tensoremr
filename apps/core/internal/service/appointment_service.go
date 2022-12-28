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
	"strings"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

type AppointmentService struct {
	FhirService FhirService
	UserService UserService
}

// GetAppointment ...
func (a *AppointmentService) GetAppointment(ID string) (*fhir.Appointment, error) {

	returnPref := "return=representation"
	body, statusCode, err := a.FhirService.FhirRequest("Appointment/"+ID, "GET", nil, &returnPref)

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
func (a *AppointmentService) CreateAppointment(p fhir.Appointment) (*fhir.Appointment, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	body, statusCode, err := a.FhirService.CreateAppointment(p, &returnPref)

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
func (a *AppointmentService) UpdateAppointment(p fhir.Appointment) (*fhir.Appointment, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	body, statusCode, err := a.FhirService.SaveAppointment(p, &returnPref)

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
func (a *AppointmentService) CreateAppointmentResponse(p fhir.AppointmentResponse) (*fhir.AppointmentResponse, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	body, statusCode, err := a.FhirService.CreateAppointmentResponse(p, &returnPref)

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

// SaveAppointmentResponse ...
func (a *AppointmentService) SaveAppointmentResponse(appointmentID string, participantID string, status fhir.ParticipationStatus, accessToken string) (*fhir.Appointment, error) {
	user, err := a.UserService.GetOneUser(participantID, accessToken)
	if err != nil {
		return nil, err
	}

	appointment, err := a.GetAppointment(appointmentID)
	if err != nil {
		return nil, err
	}

	for i, p := range appointment.Participant {
		t := strings.Split(*p.Actor.Reference, "/")
		if len(t) == 0 {
			return nil, errors.New("Could not get actor")
		}

		userId := user["id"].(*string)
		if *userId == t[1] {
			appointment.Participant[i].Status = status
		}
	}

	appointment, err = a.UpdateAppointment(*appointment)
	if err != nil {
		return nil, err
	}

	allAccepted := true
	for _, p := range appointment.Participant {
		if p.Required != nil {
			if *p.Required == fhir.ParticipantRequiredRequired && p.Status != fhir.ParticipationStatusAccepted {
				allAccepted = false
			}
		}
	}

	if allAccepted {
		appointment.Status = fhir.AppointmentStatusBooked
		appointment, err = a.UpdateAppointment(*appointment)
		if err != nil {
			return nil, err
		}
	}

	allDeclined := true
	for _, p := range appointment.Participant {
		if p.Status != fhir.ParticipationStatusDeclined {
			allDeclined = false
		}
	}

	if allDeclined {
		appointment.Status = fhir.AppointmentStatusCancelled
		appointment, err = a.UpdateAppointment(*appointment)
		if err != nil {
			return nil, err
		}
	}

	return appointment, nil
}
