/*
  Copyright 2021 Kidus Tiliksew

  This file is part of Tensor EMR.

  Tensor EMR is free software: you can redistribute it and/or modify
  it under the terms of the version 2 of GNU General Public License as published by
  the Free Software Foundation.

  Tensor EMR is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

package service

import (
	"os"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

type InitService struct {
	ValueSetService     ValueSetService
	OrganizationService OrganizationService
}

func (i InitService) InitOrganization() error {
	organizationId := os.Getenv("ORGANIZATION_ID")
	organizationName := os.Getenv("ORGANIZATION_NAME")
	organizationTypeCode := os.Getenv("ORGANIZATION_TYPE_CODE")
	organizationPhone := os.Getenv("ORGANIZATION_CONTACT_PHONE")
	organizationEmail := os.Getenv("ORGANIZATION_CONTACT_EMAIL")
	organizationAddressLine1 := os.Getenv("ORGANIZATION_ADDRESS_LINE_1")
	organizationAddressLine2 := os.Getenv("ORGANIZATION_ADDRESS_LINE_2")
	organizationAddressCity := os.Getenv("ORGANIZATION_ADDRESS_CITY")
	organizationAddressDistrict := os.Getenv("ORGANIZATION_ADDRESS_DISTRICT")
	organizationAddressState := os.Getenv("ORGANIZATION_ADDRESS_STATE")
	organizationAddressPostalCode := os.Getenv("ORGANIZATION_ADDRESS_POSTAL_CODE")
	organizationAddressCountry := os.Getenv("ORGANIZATION_ADDRESS_COUNTRY")
	organizationContactGivenName := os.Getenv("ORGANIZATION_CONTACT_GIVEN_NAME")
	organizationContactFamilyName := os.Getenv("ORGANIZATION_CONTACT_FAMILY_NAME")
	organizationContactPhone := os.Getenv("ORGANIZATION_CONTACT_PHONE")
	organizationContactEmail := os.Getenv("ORGANIZATION_CONTACT_EMAIL")

	existing, err := i.OrganizationService.GetOneOrganizationByIdentifier(organizationId)
	if err != nil {
		return err
	}

	if *existing.Total > 0 {
		return nil
	}

	valueSet, err := i.ValueSetService.GetOrganizationTypes()
	if err != nil {
		return err
	}

	var organizationType fhir.ValueSetExpansionContains
	for _, value := range valueSet.Expansion.Contains {
		if *value.Code == organizationTypeCode {
			organizationType = value
		}
	}

	active := true
	phoneSystem := fhir.ContactPointSystemPhone
	emailSystem := fhir.ContactPointSystemEmail
	contactPointUseWork := fhir.ContactPointUseWork
	addressUseWork := fhir.AddressUseWork

	identifierUse := fhir.IdentifierUseUsual
	identifierSystem := "http://hl7.org/fhir/ValueSet/identifier-type"
	identifierVersion := "4.3.0"
	identifierCode := "XX"
	identifierDisplay := "Organization identifier"

	organization := fhir.Organization{
		Active: &active,
		Identifier: []fhir.Identifier{
			{
				Use: &identifierUse,
				Type: &fhir.CodeableConcept{
					Coding: []fhir.Coding{
						{
							System:  &identifierSystem,
							Version: &identifierVersion,
							Code:    &identifierCode,
							Display: &identifierDisplay,
						},
					},
				},
				Value: &organizationId,
			},
		},
		Type: []fhir.CodeableConcept{
			{
				Coding: []fhir.Coding{
					{
						System:  valueSet.Url,
						Version: valueSet.Version,
						Code:    organizationType.Code,
						Display: organizationType.Display,
					},
				},
				Text: organizationType.Display,
			},
		},
		Name: &organizationName,
		Telecom: []fhir.ContactPoint{
			{
				System: &phoneSystem,
				Value:  &organizationPhone,
				Use:    &contactPointUseWork,
			},
			{
				System: &emailSystem,
				Value:  &organizationEmail,
				Use:    &contactPointUseWork,
			},
		},
		Address: []fhir.Address{
			{
				Use: &addressUseWork,
				Line: []string{
					organizationAddressLine1,
					organizationAddressLine2,
				},
				City:       &organizationAddressCity,
				District:   &organizationAddressDistrict,
				State:      &organizationAddressState,
				PostalCode: &organizationAddressPostalCode,
				Country:    &organizationAddressCountry,
			},
		},
		Contact: []fhir.OrganizationContact{
			{
				Name: &fhir.HumanName{
					Family: &organizationContactFamilyName,
					Given:  []string{organizationContactGivenName},
				},
				Telecom: []fhir.ContactPoint{
					{
						System: &phoneSystem,
						Value:  &organizationContactPhone,
					},
					{
						System: &emailSystem,
						Value:  &organizationContactEmail,
					},
				},
			},
		},
	}

	_, err = i.OrganizationService.CreateOrganization(organization)
	if err != nil {
		return err
	}

	return nil
}
