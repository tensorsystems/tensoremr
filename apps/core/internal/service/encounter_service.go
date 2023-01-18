package service

import (
	"database/sql"
	"strconv"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
	"github.com/tensorsystems/tensoremr/apps/core/internal/util"
)

type EncounterService struct {
	EncounterRepository repository.EncounterRepository
	SqlDB               *sql.DB
}

// GetOneEncounter ...
func (e *EncounterService) GetOneEncounter(ID string) (*fhir.Encounter, error) {
	encounter, err := e.EncounterRepository.GetOneEncounter(ID)
	if err != nil {
		return nil, err
	}

	return encounter, nil
}

// GetOneEncounterByAppointment ...
func (e *EncounterService) GetOneEncounterByAppointment(ID string) (*fhir.Encounter, error) {
	encounter, err := e.EncounterRepository.GetOneEncounterByAppointment(ID)
	if err != nil {
		return nil, err
	}

	return encounter, nil
}

// CreateEncounter ...
func (e *EncounterService) CreateEncounter(en fhir.Encounter) (*fhir.Encounter, error) {
	stmt, err := e.SqlDB.Prepare("INSERT INTO encounters(created_at) VALUES (?)")
	if err != nil {
		return nil, err
	}

	tx, err := e.SqlDB.Begin()
	if err != nil {
		return nil, err
	}

	result, err := tx.Stmt(stmt).Exec("datetime('now')")

	if err != nil {
		return nil, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}

	// Accession ID
	value := strconv.Itoa(int(id))
	en.Identifier = []fhir.Identifier{
		util.CreateAccessionIdentifier(value),
	}

	encounter, err := e.EncounterRepository.CreateEncounter(en)

	if err != nil {
		tx.Rollback()
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	return encounter, nil
}

// UpdateEncounter ...
func (s *EncounterService) UpdateEncounter(en fhir.Encounter) (*fhir.Encounter, error) {
	encounter, err := s.EncounterRepository.UpdateEncounter(en)

	if err != nil {
		return nil, err
	}

	return encounter, nil
}

