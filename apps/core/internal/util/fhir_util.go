package util

import (
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

func CreateAccessionIdentifier(id string) fhir.Identifier {
	use := fhir.IdentifierUseUsual
	code := "ACSN"
	display := "Accession ID"
	system := "http://hl7.org/fhir/ValueSet/identifier-type"

	return fhir.Identifier{
		Use: &use,
		Type: &fhir.CodeableConcept{
			Coding: []fhir.Coding{
				{
					Code:    &code,
					Display: &display,
					System:  &system,
				},
			},
		},
		Value: &id,
	}
}

func CreateMrnIdentifier(id string) fhir.Identifier {
	use := fhir.IdentifierUseUsual
	code := "MR"
	display := "Medical record number"
	system := "http://hl7.org/fhir/ValueSet/identifier-type"

	return fhir.Identifier{
		Use: &use,
		Type: &fhir.CodeableConcept{
			Coding: []fhir.Coding{
				{
					Code:    &code,
					Display: &display,
					System:  &system,
				},
			},
		},
		Value: &id,
	}
}
