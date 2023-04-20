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

func TestGetAppointment(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "http://localhost:9080/fhir-server/api/v4"
	fhirService := service.FHIRService{
		Config: service.FHIRConfig{
			URL: baseUrl,
		},
	}

	appointmentService := service.AppointmentService{
		FHIRService: fhirService,
	}

	httpmock.RegisterResponder("GET", baseUrl+"/Appointment/1",
		func(req *http.Request) (*http.Response, error) {
			resp, err := httpmock.NewJsonResponse(200, fhir.Appointment{})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	resp, err := appointmentService.GetAppointment("1", context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
	assert.NotNil(t, resp)
}

func TestCreateAppointment(t *testing.T) {

}
