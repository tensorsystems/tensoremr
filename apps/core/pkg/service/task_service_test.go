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

func TestGetOneTask(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	taskService := service.TaskService{
		FHIRService: fhirService,
	}

	httpmock.RegisterResponder("GET", baseUrl+"/Task/1",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(200, fhir.Task{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	resp, err := taskService.GetOneTask("1", context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
	assert.NotNil(t, resp)
}

func TestCreateTask(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	taskService := service.TaskService{
		FHIRService: fhirService,
	}

	httpmock.RegisterResponder("POST", baseUrl+"/Task",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(201, fhir.Encounter{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	resp, err := taskService.CreateTask(fhir.Task{}, context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
	assert.NotNil(t, resp)
}

func TestUpdateTask(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	taskService := service.TaskService{
		FHIRService: fhirService,
	}

	t.Run("successful if id is provided", func(t *testing.T) {
		httpmock.RegisterResponder("PUT", baseUrl+"/Task/1",
			func(req *http.Request) (*http.Response, error) {
				id := "1"
				resp, err := httpmock.NewJsonResponse(200, fhir.Task{Id: &id})
				if err != nil {
					return httpmock.NewStringResponse(500, ""), nil
				}
				return resp, nil
			})

		id := "1"
		resp, err := taskService.UpdateTask(fhir.Task{Id: &id}, context.Background())

		assert.Equal(t, 1, httpmock.GetTotalCallCount())
		assert.NoError(t, err)
		assert.NotNil(t, resp)
	})

	t.Run("fails if id is not provided", func(t *testing.T) {
		httpmock.RegisterResponder("PUT", baseUrl+"/Task/1",
			func(req *http.Request) (*http.Response, error) {
				resp, err := httpmock.NewJsonResponse(200, fhir.CareTeam{})
				if err != nil {
					return httpmock.NewStringResponse(500, ""), nil
				}
				return resp, nil
			})

		resp, err := taskService.UpdateTask(fhir.Task{}, context.Background())

		assert.Equal(t, 1, httpmock.GetTotalCallCount())
		assert.Error(t, err)
		assert.Nil(t, resp)
	})
}
