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

package service_test

import (
	"testing"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

func OrganizationTest(t *testing.T) {
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
