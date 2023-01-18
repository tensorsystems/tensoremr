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

package service_test

import (
	"net/http"
	"testing"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/stretchr/testify/assert"
	fhir_rest "github.com/tensorsystems/tensoremr/apps/core/internal/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

func TestCreatePatient(t *testing.T) {

	fhirService := fhir_rest.FhirService{Client: http.Client{}, FhirBaseURL: "http://localhost:8081" + "/fhir-server/api/v4/"}
	patientRepository := repository.PatientRepository{FhirService: fhirService}
	patientService := service.PatientService{PatientRepository: patientRepository}

	id := "1"
	familyName := "Test"
	givenName := "Patient"

	patient := fhir.Patient{
		Id: &id,
		Name: []fhir.HumanName{
			{
				Family: &familyName,
				Given:  []string{givenName},
			},
		},
	}

	result, err := patientService.CreatePatient(patient)
	assert.NoError(t, err)

	t.Cleanup(func() {
		_, _, err := fhirService.DeleteResource("Patient", *result.Id)

		if err != nil {
			t.Fatal(err)
		}
	})
}
