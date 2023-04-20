package service_test

import (
	"context"
	"net/http"
	"testing"

	"github.com/jarcoal/httpmock"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

func TestGetOneEncounter(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	encounterService := service.EncounterService{
		FHIRService: fhirService,
	}

	httpmock.RegisterResponder("GET", baseUrl+"/Encounter/1",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(200, fhir.Encounter{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	resp, err := encounterService.GetOneEncounter("1", context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
	assert.NotNil(t, resp)
}

func TestCreateEncounter(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	encounterService := service.EncounterService{
		FHIRService: fhirService,
	}

	httpmock.RegisterResponder("POST", baseUrl+"/Encounter",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(201, fhir.Encounter{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	resp, err := encounterService.CreateEncounter(fhir.Encounter{}, context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
	assert.NotNil(t, resp)
}

func TestUpdateEncounter(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	encounterService := service.EncounterService{
		FHIRService: fhirService,
	}

	t.Run("successful if id is provided", func(t *testing.T) {
		httpmock.RegisterResponder("PUT", baseUrl+"/Encounter/1",
			func(req *http.Request) (*http.Response, error) {
				id := "1"
				resp, err := httpmock.NewJsonResponse(200, fhir.Encounter{Id: &id})
				if err != nil {
					return httpmock.NewStringResponse(500, ""), nil
				}
				return resp, nil
			})

		id := "1"
		resp, err := encounterService.UpdateEncounter(fhir.Encounter{Id: &id}, context.Background())

		assert.Equal(t, 1, httpmock.GetTotalCallCount())
		assert.NoError(t, err)
		assert.NotNil(t, resp)
	})

	t.Run("fails if id is not provided", func(t *testing.T) {
		httpmock.RegisterResponder("PUT", baseUrl+"/Encounter/1",
			func(req *http.Request) (*http.Response, error) {
				resp, err := httpmock.NewJsonResponse(200, fhir.CareTeam{})
				if err != nil {
					return httpmock.NewStringResponse(500, ""), nil
				}
				return resp, nil
			})

		resp, err := encounterService.UpdateEncounter(fhir.Encounter{}, context.Background())

		assert.Equal(t, 1, httpmock.GetTotalCallCount())
		assert.Error(t, err)
		assert.Nil(t, resp)
	})
}

func TestGetOneEncounterByAppointment(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	encounterService := service.EncounterService{
		FHIRService: fhirService,
	}

	httpmock.RegisterResponder("GET", baseUrl+"/Encounter?appointment=1",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(200, fhir.Encounter{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	resp, err := encounterService.GetOneEncounterByAppointment("1", context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
	assert.NotNil(t, resp)
}