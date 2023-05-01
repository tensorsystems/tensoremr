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

func TestGetActivityDefinition(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	activityDefinitionService := service.ActivityDefinitionService{
		FHIRService: fhirService,
	}

	httpmock.RegisterResponder("GET", baseUrl+"/ActivityDefinition/1",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(200, fhir.ActivityDefinition{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	resp, err := activityDefinitionService.GetActivityDefinition("1", context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
	assert.NotNil(t, resp)
}

func TestCreateActivityDefinition(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	activityDefinitionService := service.ActivityDefinitionService{
		FHIRService: fhirService,
	}

	httpmock.RegisterResponder("POST", baseUrl+"/ActivityDefinition",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(201, fhir.ActivityDefinition{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	resp, err := activityDefinitionService.CreateActivityDefinition(fhir.ActivityDefinition{}, context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
	assert.NotNil(t, resp)
}

func TestUpdateActivityDefinition(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	activityDefinitionService := service.ActivityDefinitionService{
		FHIRService: fhirService,
	}

	t.Run("successful if id is provided", func(t *testing.T) {
		httpmock.RegisterResponder("PUT", baseUrl+"/ActivityDefinition/1",
			func(req *http.Request) (*http.Response, error) {
				id := "1"
				resp, err := httpmock.NewJsonResponse(200, fhir.ActivityDefinition{Id: &id})
				if err != nil {
					return httpmock.NewStringResponse(500, ""), nil
				}
				return resp, nil
			})

		id := "1"
		resp, err := activityDefinitionService.UpdateActivityDefinition(fhir.ActivityDefinition{Id: &id}, context.Background())

		assert.Equal(t, 1, httpmock.GetTotalCallCount())
		assert.NoError(t, err)
		assert.NotNil(t, resp)
	})

	t.Run("fails if id is not provided", func(t *testing.T) {
		httpmock.RegisterResponder("PUT", baseUrl+"/ActivityDefinition/1",
			func(req *http.Request) (*http.Response, error) {
				resp, err := httpmock.NewJsonResponse(200, fhir.ActivityDefinition{})
				if err != nil {
					return httpmock.NewStringResponse(500, ""), nil
				}
				return resp, nil
			})

		resp, err := activityDefinitionService.UpdateActivityDefinition(fhir.ActivityDefinition{}, context.Background())

		assert.Equal(t, 1, httpmock.GetTotalCallCount())
		assert.Error(t, err)
		assert.Nil(t, resp)
	})
}

func TestGetActivityDefinitionByName(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	activityDefinitionService := service.ActivityDefinitionService{
		FHIRService: fhirService,
	}

	httpmock.RegisterResponder("GET", baseUrl+"/ActivityDefinition?name=activity",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(200, fhir.ActivityDefinition{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	resp, err := activityDefinitionService.GetActivityDefinitionByName("activity", context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
	assert.NotNil(t, resp)
}
