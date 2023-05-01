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
	"context"
	"net/http"
	"testing"

	"github.com/jarcoal/httpmock"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/core/pkg/service"
)

func TestGetOneQuestionnaire(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	questionnaireService := service.QuestionnaireService{
		FHIRService: fhirService,
	}

	httpmock.RegisterResponder("GET", baseUrl+"/Questionnaire/1",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(200, fhir.Encounter{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	resp, err := questionnaireService.GetOneQuestionnaire("1", context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
	assert.NotNil(t, resp)
}

func TestCreateQuestionnaire(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	questionnaireService := service.QuestionnaireService{
		FHIRService: fhirService,
	}

	httpmock.RegisterResponder("POST", baseUrl+"/Questionnaire",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(201, fhir.Encounter{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	resp, err := questionnaireService.CreateQuestionnaire(fhir.Questionnaire{}, context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
	assert.NotNil(t, resp)
}

func TestUpdateQuestionnaire(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	questionnaireService := service.QuestionnaireService{
		FHIRService: fhirService,
	}

	t.Run("successful if id is provided", func(t *testing.T) {
		httpmock.RegisterResponder("PUT", baseUrl+"/Questionnaire/1",
			func(req *http.Request) (*http.Response, error) {
				id := "1"
				resp, err := httpmock.NewJsonResponse(200, fhir.Questionnaire{Id: &id})
				if err != nil {
					return httpmock.NewStringResponse(500, ""), nil
				}
				return resp, nil
			})

		id := "1"
		resp, err := questionnaireService.UpdateQuestionnaire(fhir.Questionnaire{Id: &id}, context.Background())

		assert.Equal(t, 1, httpmock.GetTotalCallCount())
		assert.NoError(t, err)
		assert.NotNil(t, resp)
	})

	t.Run("fails if id is not provided", func(t *testing.T) {
		httpmock.RegisterResponder("PUT", baseUrl+"/Questionnaire/1",
			func(req *http.Request) (*http.Response, error) {
				resp, err := httpmock.NewJsonResponse(200, fhir.Questionnaire{})
				if err != nil {
					return httpmock.NewStringResponse(500, ""), nil
				}
				return resp, nil
			})

		resp, err := questionnaireService.UpdateQuestionnaire(fhir.Questionnaire{}, context.Background())

		assert.Equal(t, 1, httpmock.GetTotalCallCount())
		assert.Error(t, err)
		assert.Nil(t, resp)
	})
}
