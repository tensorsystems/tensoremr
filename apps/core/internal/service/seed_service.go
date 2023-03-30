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
	"encoding/json"
	"os"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

type SeedService struct {
	ValueSetService           ValueSetService
	OrganizationService       OrganizationService
	ActivityDefinitionService ActivityDefinitionService
}

func NewSeedService(valueSetService ValueSetService, organizationService OrganizationService, activityDefinitionService ActivityDefinitionService) SeedService {
	return SeedService{
		ValueSetService:           valueSetService,
		OrganizationService:       organizationService,
		ActivityDefinitionService: activityDefinitionService,
	}
}

func (i SeedService) InitOrganization() error {
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

	existing, err := i.OrganizationService.GetOrganizationByIdentifier(organizationId)
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

func (i SeedService) InitActivityDefinition() error {
	// Create triage
	if err := i.InitCreateTriageActivityDefinition(); err != nil {
		return err
	}

	// Create examination
	if err := i.InitCreateExaminationActivityDefinition(); err != nil {
		return err
	}

	return nil
}

func (i SeedService) InitCreateTriageActivityDefinition() error {
	searchName := "triage"
	existing, err := i.ActivityDefinitionService.GetActivityDefinitionByName(searchName)
	if err != nil {
		return err
	}

	if *existing.Total > 0 {
		return nil
	}

	organizationId := os.Getenv("ORGANIZATION_ID")
	currentOrganizationBundle, err := i.OrganizationService.GetOrganizationByIdentifier(organizationId)
	if err != nil {
		return err
	}

	var publisher string
	if len(currentOrganizationBundle.Entry) > 0 {
		bytes, err := currentOrganizationBundle.Entry[0].Resource.MarshalJSON()
		if err != nil {
			return err
		}

		resource := make(map[string]interface{})
		if err := json.Unmarshal(bytes, &resource); err != nil {
			return err
		}

		publisher = resource["name"].(string)
	}

	version := "1.0.0"
	name := "triage"
	title := "Triage"
	description := "Preliminary assessment of patients"

	// Triage Code
	triageCode := "225390008"
	triageSystem := "http://hl7.org/fhir/ValueSet/procedure-code"
	triageVersion := "4.3.0"
	triageDisplay := "Triage"

	// Triage subject type
	subjectTypeCode := "Practitioner"
	subjectTypeSystem := "http://hl7.org/fhir/ValueSet/subject-type"
	subjectTypeVersion := "4.3.0"
	subjectTypeDisplay := "Practitioner"

	// Nurse participant
	nurseParticipantCode := "nurse"
	nurseParticipantSystem := "http://terminology.hl7.org/CodeSystem/practitioner-role"
	nurseParticipantVersion := "0.1.0"
	nurseParticipantDisplay := "nurse"

	// Doctor participant
	doctorParticipantCode := "doctor"
	doctorParticipantSystem := "http://terminology.hl7.org/CodeSystem/practitioner-role"
	doctorParticipantVersion := "0.1.0"
	doctorParticipantDisplay := "doctor"

	// Create triage activity
	triage := fhir.ActivityDefinition{
		Name:        &name,
		Title:       &title,
		Version:     &version,
		Status:      fhir.PublicationStatusActive,
		Description: &description,
		Publisher:   &publisher,

		Code: &fhir.CodeableConcept{
			Coding: []fhir.Coding{
				{
					System:  &triageSystem,
					Version: &triageVersion,
					Code:    &triageCode,
					Display: &triageDisplay,
				},
			},
			Text: &triageDisplay,
		},
		SubjectCodeableConcept: &fhir.CodeableConcept{
			Coding: []fhir.Coding{
				{
					System:  &subjectTypeSystem,
					Version: &subjectTypeVersion,
					Code:    &subjectTypeCode,
					Display: &subjectTypeDisplay,
				},
			},
			Text: &subjectTypeDisplay,
		},
		Participant: []fhir.ActivityDefinitionParticipant{
			{
				Type: fhir.ActionParticipantTypePractitioner,
				Role: &fhir.CodeableConcept{
					Coding: []fhir.Coding{
						{
							System:  &nurseParticipantSystem,
							Version: &nurseParticipantVersion,
							Code:    &nurseParticipantCode,
							Display: &nurseParticipantDisplay,
						},
						{
							System:  &doctorParticipantSystem,
							Version: &doctorParticipantVersion,
							Code:    &doctorParticipantCode,
							Display: &doctorParticipantDisplay,
						},
					},
				},
			},
		},
	}

	if _, err := i.ActivityDefinitionService.CreateActivityDefinition(triage); err != nil {
		return err
	}

	return nil
}

func (i SeedService) InitCreateExaminationActivityDefinition() error {
	searchName := "examination"
	existing, err := i.ActivityDefinitionService.GetActivityDefinitionByName(searchName)
	if err != nil {
		return err
	}

	if *existing.Total > 0 {
		return nil
	}

	organizationId := os.Getenv("ORGANIZATION_ID")
	currentOrganizationBundle, err := i.OrganizationService.GetOrganizationByIdentifier(organizationId)
	if err != nil {
		return err
	}

	var publisher string
	if len(currentOrganizationBundle.Entry) > 0 {
		bytes, err := currentOrganizationBundle.Entry[0].Resource.MarshalJSON()
		if err != nil {
			return err
		}

		resource := make(map[string]interface{})
		if err := json.Unmarshal(bytes, &resource); err != nil {
			return err
		}

		publisher = resource["name"].(string)
	}

	version := "1.0.0"
	name := "examination"
	title := "Examination"
	description := "Physical Examination"

	// Examination Code
	examinationCode := "5880005"
	examinationSystem := "http://snomed.info/sct"
	examinationVersion := "4.3.0"
	examinationDisplay := "Physical Examination"

	// Examination subject type
	subjectTypeCode := "Practitioner"
	subjectTypeSystem := "http://hl7.org/fhir/ValueSet/subject-type"
	subjectTypeVersion := "4.3.0"
	subjectTypeDisplay := "Practitioner"

	// Doctor participant
	doctorParticipantCode := "doctor"
	doctorParticipantSystem := "http://terminology.hl7.org/CodeSystem/practitioner-role"
	doctorParticipantVersion := "0.1.0"
	doctorParticipantDisplay := "doctor"

	// Create examination activity
	examination := fhir.ActivityDefinition{
		Name:        &name,
		Title:       &title,
		Version:     &version,
		Status:      fhir.PublicationStatusActive,
		Description: &description,
		Publisher:   &publisher,

		Code: &fhir.CodeableConcept{
			Coding: []fhir.Coding{
				{
					System:  &examinationSystem,
					Version: &examinationVersion,
					Code:    &examinationCode,
					Display: &examinationDisplay,
				},
			},
			Text: &examinationDisplay,
		},
		SubjectCodeableConcept: &fhir.CodeableConcept{
			Coding: []fhir.Coding{
				{
					System:  &subjectTypeSystem,
					Version: &subjectTypeVersion,
					Code:    &subjectTypeCode,
					Display: &subjectTypeDisplay,
				},
			},
			Text: &subjectTypeDisplay,
		},
		Participant: []fhir.ActivityDefinitionParticipant{
			{
				Type: fhir.ActionParticipantTypePractitioner,
				Role: &fhir.CodeableConcept{
					Coding: []fhir.Coding{
						{
							System:  &doctorParticipantSystem,
							Version: &doctorParticipantVersion,
							Code:    &doctorParticipantCode,
							Display: &doctorParticipantDisplay,
						},
					},
				},
			},
		},
	}

	if _, err := i.ActivityDefinitionService.CreateActivityDefinition(examination); err != nil {
		return err
	}

	return nil
}
