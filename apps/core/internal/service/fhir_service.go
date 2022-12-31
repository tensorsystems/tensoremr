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
	"errors"
	"io"
	"net/http"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

type FhirService struct {
	Client      http.Client
	FhirBaseURL string
}

func (f *FhirService) SavePractitioner(practioner fhir.Practitioner, returnPref *string) ([]byte, int, error) {
	b, err := practioner.MarshalJSON()
	if err != nil {
		return nil, 500, err
	}

	if practioner.Id == nil {
		return nil, 500, errors.New("User ID is required")
	}

	body, statusCode, err := f.FhirRequest("Practitioner/"+*practioner.Id, "PUT", b, returnPref)
	if err != nil {
		return nil, statusCode, err
	}

	return body, statusCode, nil
}

func (f *FhirService) SavePatient(patient fhir.Patient, returnPref *string) ([]byte, int, error) {
	b, err := patient.MarshalJSON()
	if err != nil {
		return nil, 500, err
	}

	if patient.Id == nil {
		return nil, 500, errors.New("Patient ID is required")
	}

	body, statusCode, err := f.FhirRequest("Patient/"+*patient.Id, "PUT", b, returnPref)
	if err != nil {
		return nil, statusCode, err
	}

	return body, statusCode, nil
}

func (f *FhirService) CreatePatient(patient fhir.Patient, returnPref *string) ([]byte, int, error) {
	b, err := patient.MarshalJSON()
	if err != nil {
		return nil, 500, err
	}

	body, statusCode, err := f.FhirRequest("Patient", "POST", b, returnPref)
	if err != nil {
		return nil, statusCode, err
	}

	return body, statusCode, nil
}



func (f *FhirService) SavePractitionerRole(practionerRole fhir.PractitionerRole, returnPref *string) ([]byte, int, error) {
	b, err := practionerRole.MarshalJSON()
	if err != nil {
		return nil, 500, err
	}

	body, statusCode, err := f.FhirRequest("PractitionerRole", "POST", b, returnPref)
	if err != nil {
		return nil, statusCode, err
	}

	return body, statusCode, nil
}

func (f *FhirService) GetOnePractitioner(ID string, returnPref *string) ([]byte, int, error) {
	return f.FhirRequest("Practitioner/"+ID, "GET", nil, returnPref)
}




func (f *FhirService) SaveAppointment(appointment fhir.Appointment, returnPref *string) ([]byte, int, error) {
	b, err := appointment.MarshalJSON()
	if err != nil {
		return nil, 500, err
	}

	if appointment.Id == nil {
		return nil, 500, errors.New("Appointment ID is required")
	}

	body, statusCode, err := f.FhirRequest("Appointment/"+*appointment.Id, "PUT", b, returnPref)
	if err != nil {
		return nil, statusCode, err
	}

	return body, statusCode, nil
}

func (f *FhirService) SaveAppointmentResponse(appointmentResponse fhir.AppointmentResponse, returnPref *string) ([]byte, int, error) {
	b, err := appointmentResponse.MarshalJSON()
	if err != nil {
		return nil, 500, err
	}

	if appointmentResponse.Id == nil {
		return nil, 500, errors.New("AppointmentRespoinse ID is required")
	}

	body, statusCode, err := f.FhirRequest("AppointmentResponse/"+*appointmentResponse.Id, "PUT", b, returnPref)
	if err != nil {
		return nil, statusCode, err
	}

	return body, statusCode, nil
}

func (f *FhirService) SaveBundle(bundle fhir.Bundle, returnPref *string) ([]byte, int, error) {
	b, err := bundle.MarshalJSON()
	if err != nil {
		return nil, 500, err
	}

	body, statusCode, err := f.FhirRequest("", "POST", b, returnPref)
	if err != nil {
		return nil, statusCode, err
	}

	return body, statusCode, nil
}

func (f *FhirService) DeleteResource(resourceType, id string) ([]byte, int, error) {
	return f.FhirRequest(resourceType+"/"+id, "DELETE", nil, nil)
}


func (f *FhirService) FhirRequest(resource string, method string, data []byte, returnPref *string) ([]byte, int, error) {
	url := f.FhirBaseURL + resource

	reader := bytes.NewReader(data)
	req, err := http.NewRequest(method, url, reader)
	if err != nil {
		return nil, 500, err
	}

	req.Header.Add("Content-Type", "application/fhir+json")
	if returnPref != nil {
		req.Header.Add("Prefer", *returnPref)
	}

	resp, err := f.Client.Do(req)
	if err != nil {
		return nil, 500, err
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, 500, err
	}

	return body, resp.StatusCode, err
}
