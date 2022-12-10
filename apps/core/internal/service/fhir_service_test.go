package service_test

import (
	"encoding/json"
	"net/http"
	"testing"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

var testPractioners []map[string]interface{}

func setupFhir(t *testing.T) func(t *testing.T) {
	testPractioners = []map[string]interface{}{
		{
			"userId":        "1",
			"namePrefix":    "Dr.",
			"givenName":     "Test",
			"familyName":    "Doctor",
			"contactNumber": "0911000000",
			"email":         "test@doctor.com",
		},
		{
			"userId":        "2",
			"namePrefix":    "Dr.",
			"givenName":     "Test",
			"familyName":    "Doctor 2",
			"contactNumber": "0911000000",
			"email":         "test2@doctor.com",
		},
	}

	return func(t *testing.T) {
		testPractioners = []map[string]interface{}{}
	}
}

func TestCreateFhirPractitioner(t *testing.T) {
	s := setupFhir(t)
	defer s(t)

	fhirService := service.FhirService{
		Client:      http.Client{},
		FhirBaseURL: "http://localhost:8081" + "/fhir-server/api/v4/",
	}

	id := testPractioners[0]["userId"].(string)
	namePrefix := testPractioners[0]["namePrefix"].(string)
	givenName := testPractioners[0]["givenName"].(string)
	familyName := testPractioners[0]["familyName"].(string)
	contactNumber := testPractioners[0]["contactNumber"].(string)
	email := testPractioners[0]["email"].(string)

	phoneSystem := fhir.ContactPointSystemPhone
	emailSystem := fhir.ContactPointSystemEmail

	practioner := fhir.Practitioner{
		Id: &id,
		Name: []fhir.HumanName{
			{
				Prefix: []string{namePrefix},
				Given:  []string{givenName},
				Family: &familyName,
			},
		},
		Telecom: []fhir.ContactPoint{
			{
				System: &phoneSystem,
				Value:  &contactNumber,
			},
			{
				System: &emailSystem,
				Value:  &email,
			},
		},
	}

	// returnPref := "return=OperationOutcome"
	_, statusCode, err := fhirService.SaveFhirPractitioner(practioner, nil)
	// t.Log(string(body))
	// log.Println(body)

	assert.NoError(t, err)
	assert.Equal(t, 200, statusCode)
}

func TestUpdateFhirPractitioner(t *testing.T) {
	s := setupFhir(t)
	defer s(t)

	fhirService := service.FhirService{
		Client:      http.Client{},
		FhirBaseURL: "http://localhost:8081" + "/fhir-server/api/v4/",
	}

	id := testPractioners[0]["userId"].(string)
	namePrefix := testPractioners[0]["namePrefix"].(string)
	givenName := testPractioners[0]["givenName"].(string)
	familyName := testPractioners[0]["familyName"].(string)
	contactNumber := testPractioners[0]["contactNumber"].(string)
	email := testPractioners[0]["email"].(string)

	phoneSystem := fhir.ContactPointSystemPhone
	emailSystem := fhir.ContactPointSystemEmail

	practioner := fhir.Practitioner{
		Id: &id,
		Name: []fhir.HumanName{
			{
				Prefix: []string{namePrefix},
				Given:  []string{givenName},
				Family: &familyName,
			},
		},
		Telecom: []fhir.ContactPoint{
			{
				System: &phoneSystem,
				Value:  &contactNumber,
			},
			{
				System: &emailSystem,
				Value:  &email,
			},
		},
	}

	// Create user
	returnPref := "return=representation"
	_, statusCode, err := fhirService.SaveFhirPractitioner(practioner, &returnPref)
	assert.Equal(t, 200, statusCode)

	// Update user family name
	newDoctorFamilyName := "AmazingDoctor"
	practioner.Name[0].Family = &newDoctorFamilyName
	body, statusCode, err := fhirService.SaveFhirPractitioner(practioner, &returnPref)
	assert.NoError(t, err)
	assert.Equal(t, 200, statusCode)

	m := make(map[string]interface{})
	if err := json.Unmarshal(body, &m); err != nil {
		t.Fatal(err)
	}

	// Assert equal
	familyNameVal := m["name"].([]interface{})[0].(map[string]interface{})["family"].(string)
	assert.Equal(t, newDoctorFamilyName, familyNameVal)
}
