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

var jsonResponse = &models.CodeSystemResponse{
	ResourceType: "CodeSystem",
	ID:           "some-type",
	Url:          "http://terminology.hl7.org/CodeSystem/code1",
	Version:      "1.0.0",
	Name:         "OrganizationType",
	Concept: []models.CodeSystemConcept{
		{Code: "CD1", Display: "Code 1", Definition: ""},
	},
}

func TestGetOrganizationTypes(t *testing.T) {
	srv := httptest.NewServer(http.HandlerFunc(func(rw http.ResponseWriter, req *http.Request) {
		r, err := json.Marshal(&jsonResponse)
		assert.NoError(t, err)

		rw.Write(r)
	}))

	defer srv.Close()

	service := services.NewCodeSystemService(srv.Client())

	resp, err := service.GetOrganizationTypes(srv.URL)
	assert.NoError(t, err)

	var got models.CodeSystemResponse

	err = json.Unmarshal(resp, &got)
	assert.NoError(t, err)

	assert.Equal(t, jsonResponse, &got)
}
