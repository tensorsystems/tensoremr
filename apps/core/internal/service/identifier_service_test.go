package service_test

import (
	"testing"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

func TestCreate(t *testing.T) {
	s := service.IdentifierService{}

	use := fhir.IdentifierUseUsual
	system := "http://terminology.hl7.org/CodeSystem/v2-0203"
	version := "http://terminology.hl7.org/CodeSystem/v2-0203|2.9.0"
	code := "XX"
	display := "Organization identifier"
	userSelected := false

	coding := fhir.Coding{
		System:       &system,
		Version:      &version,
		Code:         &code,
		Display:      &display,
		UserSelected: &userSelected,
	}

	identifier := fhir.Identifier{
		Use: &use,
		Type: &fhir.CodeableConcept{
			Coding: []fhir.Coding{coding},
			Text:   coding.Display,
		},
		System: coding.System,
		Value:  coding.Code,
	}

	err := s.CreateIdentifer(identifier)
	assert.NoError(t, err)
}
