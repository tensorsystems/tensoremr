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

func TestGetOnePatient(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	patientService := service.PatientService{
		FHIRService: fhirService,
	}

	httpmock.RegisterResponder("GET", baseUrl+"/Patient/1",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(200, fhir.CareTeam{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	resp, err := patientService.GetOnePatient("1", context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
	assert.NotNil(t, resp)
}

// func TestCreatePatient(t *testing.T) {
// 	httpmock.Activate()
// 	defer httpmock.DeactivateAndReset()

// 	baseUrl := "http://localhost:9080/fhir-server/api/v4"
// 	fhirService := service.FHIRService{
// 		Config: service.FHIRConfig{
// 			URL: baseUrl,
// 		},
// 	}

// 	patientService := service.PatientService{
// 		FHIRService: fhirService,
// 	}

// 	httpmock.RegisterResponder("POST", baseUrl+"/Patient",
// 		func(req *http.Request) (*http.Response, error) {
// 			resp, err := httpmock.NewJsonResponse(201, fhir.Patient{})
// 			if err != nil {
// 				return httpmock.NewStringResponse(500, ""), nil
// 			}
// 			return resp, nil
// 		})

// 	resp, err := patientService.CreatePatient(fhir.Patient{}, context.Background())

// 	assert.Equal(t, 1, httpmock.GetTotalCallCount())
// 	assert.NoError(t, err)
// 	assert.NotNil(t, resp)
// }
