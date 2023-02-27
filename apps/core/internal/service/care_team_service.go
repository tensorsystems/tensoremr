package service

import (
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
)

type CareTeamService struct {
	CareTeamRepository repository.CareTeamRepository
}

// GetOneCareTeam ...
func (e *CareTeamService) GetOneCareTeam(ID string) (*fhir.CareTeam, error) {
	careTeam, err := e.CareTeamRepository.GetOneCareTeam(ID)
	if err != nil {
		return nil, err
	}

	return careTeam, nil
}

// CreateCareTeam ...
func (s *CareTeamService) CreateCareTeam(en fhir.CareTeam) (*fhir.CareTeam, error) {
	careTeam, err := s.CareTeamRepository.CreateCareTeam(en)

	if err != nil {
		return nil, err
	}

	return careTeam, nil
}

// CreateCareTeamBatch ...
func (s *CareTeamService) CreateCareTeamBatch(careTeams []fhir.CareTeam) (*fhir.Bundle, error) {
	r, err := s.CareTeamRepository.CreateCareTeamBatch(careTeams)

	if err != nil {
		return nil, err
	}

	return r, nil
}

// UpdateCareTeam ...
func (s *CareTeamService) UpdateCareTeam(en fhir.CareTeam) (*fhir.CareTeam, error) {
	careTeam, err := s.CareTeamRepository.UpdateCareTeam(en)

	if err != nil {
		return nil, err
	}

	return careTeam, nil
}
