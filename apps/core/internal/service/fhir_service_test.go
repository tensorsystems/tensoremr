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

func TestGetResource(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	s := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	httpmock.RegisterResponder("GET", baseUrl+"/Appointment",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(200, fhir.Appointment{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	_, resp, err := s.GetResource("Appointment", nil, context.Background())

	assert.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)
	assert.Equal(t, 1, httpmock.GetTotalCallCount())
}

func TestCreateResource(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	s := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	httpmock.RegisterResponder("POST", baseUrl+"/Appointment",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(201, fhir.Appointment{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	_, resp, err := s.CreateResource("Appointment", nil, nil, context.Background())

	assert.NoError(t, err)
	assert.Equal(t, 201, resp.StatusCode)
	assert.Equal(t, 1, httpmock.GetTotalCallCount())
}

func TestUpdateResource(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	s := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	httpmock.RegisterResponder("PUT", baseUrl+"/Appointment",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(200, fhir.Appointment{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	_, resp, err := s.UpdateResource("Appointment", nil, nil, context.Background())

	assert.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)
	assert.Equal(t, 1, httpmock.GetTotalCallCount())
}

func TestDeleteResource(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	s := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	httpmock.RegisterResponder("DELETE", baseUrl+"/Appointment/1",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(202, fhir.Appointment{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	_, resp, err := s.DeleteResource("Appointment", "1", nil, context.Background())

	assert.NoError(t, err)
	assert.Equal(t, 202, resp.StatusCode)
	assert.Equal(t, 1, httpmock.GetTotalCallCount())
}

func TestCreateBundle(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	s := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	httpmock.RegisterResponder("POST", baseUrl,
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(200, fhir.Appointment{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	_, resp, err := s.CreateBundle(fhir.Bundle{}, nil, context.Background())

	assert.NoError(t, err)
	assert.Equal(t, 200, resp.StatusCode)
	assert.Equal(t, 1, httpmock.GetTotalCallCount())
}

func TestHaveConnection(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	s := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	httpmock.RegisterResponder("GET", baseUrl, httpmock.NewStringResponder(200, ""))
	resp := s.HaveConnection(context.Background())

	assert.Equal(t, true, resp)
	assert.Equal(t, 1, httpmock.GetTotalCallCount())
}
