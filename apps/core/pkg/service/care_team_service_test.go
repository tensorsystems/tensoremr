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

func TestGetOneCareTeam(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	careTeamService := service.CareTeamService{
		FHIRService: fhirService,
	}

	httpmock.RegisterResponder("GET", baseUrl+"/CareTeam/1",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(200, fhir.CareTeam{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	resp, err := careTeamService.GetOneCareTeam("1", context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
	assert.NotNil(t, resp)
}

func TestCreateCareTeam(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	careTeamService := service.CareTeamService{
		FHIRService: fhirService,
	}

	httpmock.RegisterResponder("POST", baseUrl+"/CareTeam",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(201, fhir.CareTeam{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	resp, err := careTeamService.CreateCareTeam(fhir.CareTeam{}, context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
	assert.NotNil(t, resp)
}

func TestUpdateCareTeam(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	careTeamService := service.CareTeamService{
		FHIRService: fhirService,
	}

	t.Run("successful if id is provided", func(t *testing.T) {
		httpmock.RegisterResponder("PUT", baseUrl+"/CareTeam/1",
			func(req *http.Request) (*http.Response, error) {
				id := "1"
				resp, err := httpmock.NewJsonResponse(200, fhir.CareTeam{Id: &id})
				if err != nil {
					return httpmock.NewStringResponse(500, ""), nil
				}
				return resp, nil
			})

		id := "1"
		resp, err := careTeamService.UpdateCareTeam(fhir.CareTeam{Id: &id}, context.Background())

		assert.Equal(t, 1, httpmock.GetTotalCallCount())
		assert.NoError(t, err)
		assert.NotNil(t, resp)
	})

	t.Run("fails if id is not provided", func(t *testing.T) {
		httpmock.RegisterResponder("PUT", baseUrl+"/CareTeam/1",
			func(req *http.Request) (*http.Response, error) {
				resp, err := httpmock.NewJsonResponse(200, fhir.CareTeam{})
				if err != nil {
					return httpmock.NewStringResponse(500, ""), nil
				}
				return resp, nil
			})

		resp, err := careTeamService.UpdateCareTeam(fhir.CareTeam{}, context.Background())

		assert.Equal(t, 1, httpmock.GetTotalCallCount())
		assert.Error(t, err)
		assert.Nil(t, resp)
	})
}

func TestCreateCareTeamBatch(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	careTeamService := service.CareTeamService{
		FHIRService: fhirService,
	}

	httpmock.RegisterResponder("POST", baseUrl,
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(200, fhir.CareTeam{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	resp, err := careTeamService.CreateCareTeamBatch([]fhir.CareTeam{}, context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
	assert.NotNil(t, resp)
}
