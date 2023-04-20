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

func TestCreateSchedule(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	scheduleService := service.ScheduleService{
		FHIRService: fhirService,
	}

	httpmock.RegisterResponder("POST", baseUrl+"/Schedule",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(201, fhir.Schedule{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	resp, err := scheduleService.CreateSchedule(fhir.Schedule{}, context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
	assert.NotNil(t, resp)
}
