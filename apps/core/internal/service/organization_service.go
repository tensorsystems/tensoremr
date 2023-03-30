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
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
)

type OrganizationService struct {
	OrganizationRepository repository.OrganizationRepository
}

func NewOrganizationService(repository repository.OrganizationRepository) OrganizationService {
	return OrganizationService{
		OrganizationRepository: repository,
	}
}


// GetOneOrganization ...
func (e *OrganizationService) GetOneOrganization(ID string) (*fhir.Organization, error) {
	organization, err := e.OrganizationRepository.GetOneOrganization(ID)
	if err != nil {
		return nil, err
	}

	return organization, nil
}

// GetCurrentOrganization ...
func (e *OrganizationService) GetCurrentOrganization() (*fhir.Bundle, error) {
	organizationId := os.Getenv("ORGANIZATION_ID")

	organization, err := e.OrganizationRepository.GetCurrentOrganization(organizationId)
	if err != nil {
		return nil, err
	}

	return organization, nil
}

// GetOneOrganization ...
func (e *OrganizationService) GetOrganizationByIdentifier(ID string) (*fhir.Bundle, error) {
	organization, err := e.OrganizationRepository.GetOrganizationByIdentifier(ID)
	if err != nil {
		return nil, err
	}

	return organization, nil
}

// CreateOrganization ...
func (e *OrganizationService) CreateOrganization(en fhir.Organization) (*fhir.Organization, error) {
	organization, err := e.OrganizationRepository.CreateOrganization(en)
	if err != nil {
		return nil, err
	}

	return organization, nil
}

// UpdateOrganization ...
func (e *OrganizationService) UpdateOrganization(en fhir.Organization) (*fhir.Organization, error) {
	organization, err := e.OrganizationRepository.UpdateOrganization(en)
	if err != nil {
		return nil, err
	}

	return organization, nil
}
