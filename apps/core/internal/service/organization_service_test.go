package service_test

import (
	"testing"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

func TestOrganizationTest(t *testing.T) {
	s := service.OrganizationService{}

	system := "http://terminology.hl7.org/CodeSystem/organization-type"
	version := "http://terminology.hl7.org/CodeSystem/organization-type|4.3.0"
	code := "dept"
	display := "Hospital Department"
	userSelected := true

	organizationType := []fhir.CodeableConcept{
		{
			Coding: []fhir.Coding{{
				System:       &system,
				Version:      &version,
				Code:         &code,
				Display:      &display,
				UserSelected: &userSelected,
			}},
			Text: &display,
		},
	}

	organizationId := "123"
	active := true
	orgName := "Biruh Vision Specialized Eye Care Center"

	organization := fhir.Organization{
		Id:     &organizationId,
		Active: &active,
		Type:   organizationType,
		Name:   &orgName,
	}

	err := s.Create(organization)
	assert.NoError(t, err)
}
