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
	"net/http"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

func TestGetOrganizationTypes(t *testing.T) {
	fhirService := service.FhirService{
		Client:      http.Client{},
		FhirBaseURL: "http://localhost:8081" + "/fhir-server/api/v4/",
	}

	valueSetService := service.ValueSetService{FhirService: fhirService}

	_, err := valueSetService.GetOrganizationTypes()
	assert.NoError(t, err)
}
