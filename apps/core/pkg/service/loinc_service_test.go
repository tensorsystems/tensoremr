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

func TestSearchForms(t *testing.T) {

}

func TestGetLoincQuestionnaire(t *testing.T) {
	httpmock.Activate()
	defer httpmock.DeactivateAndReset()

	baseUrl := "https://fhir.loinc.org"

	loincService := service.LoincService{
		LoincConnect: service.LouicConnect{
			LoincFhirBaseURL: baseUrl,
		},
	}

	httpmock.RegisterResponder("GET", baseUrl+"/Questionnaire/?url=http://loinc.org/q/1",
		func(req *http.Request) (*http.Response, error) {
			id := "1"
			resp, err := httpmock.NewJsonResponse(200, fhir.Bundle{
				Entry: []fhir.BundleEntry{
					{Id: &id},
				},
			})
			if err != nil {
				return httpmock.NewStringResponse(500, ""), nil
			}
			return resp, nil
		})

	_, err := loincService.GetLoincQuestionnaire("1", context.Background())

	assert.Equal(t, 1, httpmock.GetTotalCallCount())
	assert.NoError(t, err)
}
