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

	"github.com/go-redis/redismock/v8"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

func TestCreatePatient(t *testing.T) {
	db, mock := redismock.NewClientMock()

	fhirService := service.FhirService{Client: http.Client{}, FhirBaseURL: "http://localhost:8081" + "/fhir-server/api/v4/"}
	redisService := service.RedisService{RedisClient: db}
	patientService := service.PatientService{FhirService: fhirService, RedisService: redisService}

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

	rp := map[string]interface{}{
		"id": id,
		"familyName": familyName,
		"givenName": givenName,
		"mrn": int64(1),
	}

	mock.ExpectWatch("patient:1")
	mock.ExpectIncr("mrn").SetVal(1)
	mock.ExpectHSet("patient:1", rp).SetVal(1)

	result, err := patientService.CreatePatient(patient)
	assert.NoError(t, err)

	t.Cleanup(func() {
		_, _, err := fhirService.DeleteResource("Patient", result["id"].(string))

		if err != nil {
			t.Fatal(err)
		}
	})
}
