package services_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/models"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/services"
)

var codeSystemJsonResponse = &models.CodeSystemResponse{
	ResourceType: "CodeSystem",
	ID:           "some-type",
	Url:          "http://terminology.hl7.org/CodeSystem/code1",
	Version:      "1.0.0",
	Name:         "OrganizationType",
	Concept: []models.CodeSystemConcept{
		{Code: "CD1", Display: "Code 1", Definition: ""},
	},
}

var valueSetJsonResponse = &models.ValueSetResponse{
	ResourceType: "ValueSet",
	ID:           "c80-practice-codes",
	Url:          "http://hl7.org/fhir/ValueSet/c80-practice-codes",
	Version:      "4.3.0",
	Name:         "PracticeSettingCodeValueSet",
	Compose: models.ValueSetCompose{
		Include: []models.ValueSetInclude{
			{System: "http://snomed.info/sct", Concept: []models.CodeSystemConcept{
				{Code: "408467006", Display: "Adult mental illness"},
			}},
		},
	},
}

func TestGetCodeSystem(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		r, err := json.Marshal(&codeSystemJsonResponse)
		assert.NoError(t, err)

		rw.Write(r)
	}))

	defer srv.Close()

	service := services.NewCodeSystemService(srv.Client())

	resp, err := service.GetCodes(srv.URL)
	assert.NoError(t, err)

	var got models.CodeSystemResponse

	err = json.Unmarshal(resp, &got)
	assert.NoError(t, err)

	assert.Equal(t, codeSystemJsonResponse, &got)
}

func TestGetValueSet(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		r, err := json.Marshal(&valueSetJsonResponse)
		assert.NoError(t, err)

		rw.Write(r)
	}))

	defer srv.Close()

	service := services.NewCodeSystemService(srv.Client())
	resp, err := service.GetCodes(srv.URL)
	assert.NoError(t, err)

	var got models.ValueSetResponse

	err = json.Unmarshal(resp, &got)
	assert.NoError(t, err)

	assert.Equal(t, valueSetJsonResponse, &got)
}
