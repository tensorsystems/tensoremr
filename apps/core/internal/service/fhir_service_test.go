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
var testPractionerRole map[string]interface{}

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

	testPractionerRole = map[string]interface{}{
		"practionerType":      "Practitioner",
		"practionerReference": "1",
		"role":                "phyisician",
	}

	return func(t *testing.T) {
		testPractioners = []map[string]interface{}{}
		testPractionerRole = map[string]interface{}{}
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

	_, statusCode, err := fhirService.SavePractitioner(practioner, nil)
	assert.NoError(t, err)
	assert.Equal(t, 201, statusCode)

	t.Cleanup(func() {
		_, _, err := fhirService.DeleteResource("Practitioner", id)

		if err != nil {
			t.Fatal(err)
		}
	})
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
	_, statusCode, err := fhirService.SavePractitioner(practioner, &returnPref)
	assert.Equal(t, 201, statusCode)

	// Update user family name
	newDoctorFamilyName := "AmazingDoctor"
	practioner.Name[0].Family = &newDoctorFamilyName
	body, statusCode, err := fhirService.SavePractitioner(practioner, &returnPref)
	assert.NoError(t, err)
	assert.Equal(t, 200, statusCode)

	m := make(map[string]interface{})
	if err := json.Unmarshal(body, &m); err != nil {
		t.Fatal(err)
	}

	// Assert equal
	familyNameVal := m["name"].([]interface{})[0].(map[string]interface{})["family"].(string)
	assert.Equal(t, newDoctorFamilyName, familyNameVal)

	t.Cleanup(func() {
		_, _, err := fhirService.DeleteResource("Practitioner", id)
		if err != nil {
			t.Fatal(err)
		}
	})
}

func TestCreatePractionerRole(t *testing.T) {
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

	_, statusCode, err := fhirService.SavePractitioner(practioner, nil)
	assert.NoError(t, err)
	assert.Equal(t, 201, statusCode)

	practionerType := testPractionerRole["practionerType"].(string)
	practionerReference := "Practitioner/" + testPractionerRole["practionerReference"].(string)
	role := testPractionerRole["role"].(string)

	practionerRole := fhir.PractitionerRole{
		Practitioner: &fhir.Reference{
			Type:      &practionerType,
			Reference: &practionerReference,
		},
		Code: []fhir.CodeableConcept{
			{
				Coding: []fhir.Coding{
					{
						Display: &role,
					},
				},
				Text: &role,
			},
		},
	}

	returnPref := "return=representation"
	body, statusCode, err := fhirService.SavePractitionerRole(practionerRole, &returnPref)
	practionerRoleResult := make(map[string]interface{})
	if err := json.Unmarshal(body, &practionerRoleResult); err != nil {
		t.Fatal(err)
	}

	assert.NoError(t, err)
	assert.Equal(t, 201, statusCode)

	t.Cleanup(func() {
		_, _, err := fhirService.DeleteResource("Practitioner", *practioner.Id)
		if err != nil {
			t.Fatal(err)
		}

		_, _, err = fhirService.DeleteResource("PractitionerRole", practionerRoleResult["id"].(string))
		if err != nil {
			t.Fatal(err)
		}
	})
}

func TestSaveBundles(t *testing.T) {
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

	_, statusCode, err := fhirService.SavePractitioner(practioner, nil)
	assert.NoError(t, err)
	assert.Equal(t, 201, statusCode)

	practionerType := testPractionerRole["practionerType"].(string)
	practionerReference := "Practitioner/" + testPractionerRole["practionerReference"].(string)
	role := testPractionerRole["role"].(string)

	active := true
	practionerRole := fhir.PractitionerRole{
		Active: &active,
		Practitioner: &fhir.Reference{
			Type:      &practionerType,
			Reference: &practionerReference,
		},
		Code: []fhir.CodeableConcept{
			{
				Coding: []fhir.Coding{
					{
						Display: &role,
					},
				},
				Text: &role,
			},
		},
	}

	returnPref := "return=representation"
	body, statusCode, err := fhirService.SavePractitionerRole(practionerRole, &returnPref)
	practionerRoleResult := make(map[string]interface{})
	if err := json.Unmarshal(body, &practionerRoleResult); err != nil {
		t.Fatal(err)
	}

	assert.NoError(t, err)
	assert.Equal(t, 201, statusCode)

	// Update user family name
	newDoctorFamilyName := "AmazingDoctor"
	practioner.Name[0].Family = &newDoctorFamilyName

	// Update Role status
	newStatus := false
	practionerRole.Active = &newStatus

	practionerBytes, err := practioner.MarshalJSON()
	if err != nil {
		t.Fatal(err)
	}

	practionerRoleBytes, err := practionerRole.MarshalJSON()
	if err != nil {
		t.Fatal(err)
	}

	// Update transactionaly
	bundle := fhir.Bundle{
		Type: fhir.BundleTypeTransaction,
		Entry: []fhir.BundleEntry{
			{
				Id:       practioner.Id,
				Resource: practionerBytes,
				Request: &fhir.BundleEntryRequest{
					Method: fhir.HTTPVerbPUT,
					Url:    "Practitioner/" + *practioner.Id,
				},
			},
			{
				Resource: practionerRoleBytes,
				Request: &fhir.BundleEntryRequest{
					Method: fhir.HTTPVerbPUT,
					Url:    "PractitionerRole?practitioner=" + practionerRoleResult["id"].(string),
				},
			},
		},
	}

	_, statusCode, err = fhirService.SaveBundle(bundle, nil)
	assert.NoError(t, err)
	assert.Equal(t, 200, statusCode)

	t.Cleanup(func() {
		_, _, err := fhirService.DeleteResource("Practitioner", *practioner.Id)
		if err != nil {
			t.Fatal(err)
		}

		_, _, err = fhirService.DeleteResource("PractitionerRole", practionerRoleResult["id"].(string))
		if err != nil {
			t.Fatal(err)
		}
	})
}

func TestGetOnePractitioner(t *testing.T) {
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

	returnPref := "return=representation"
	_, statusCode, err := fhirService.SavePractitioner(practioner, &returnPref)
	assert.NoError(t, err)
	assert.Equal(t, 201, statusCode)

	t.Run("successfully finds the practitioner", func(t *testing.T) {
		_, statusCode, err := fhirService.GetOnePractitioner(*practioner.Id, &returnPref)
		assert.NoError(t, err)
		assert.Equal(t, 200, statusCode)
	})

	t.Run("fails when practitioner is not found", func(t *testing.T) {
		_, statusCode, err := fhirService.GetOnePractitioner("-1", &returnPref)
		assert.NoError(t, err)
		assert.Equal(t, 404, statusCode)
	})

	t.Cleanup(func() {
		_, _, err := fhirService.DeleteResource("Practitioner", *practioner.Id)
		if err != nil {
			t.Fatal(err)
		}
	})
}
