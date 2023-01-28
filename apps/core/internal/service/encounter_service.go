package service

import (
	"context"
	"strconv"

	"github.com/jackc/pgx/v5"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/payload"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
	"github.com/tensorsystems/tensoremr/apps/core/internal/util"
)

type EncounterService struct {
	EncounterRepository       repository.EncounterRepository
	ActivityDefinitionService ActivityDefinitionService
	TaskService               TaskService
	SqlDB                     *pgx.Conn
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
func (e *EncounterService) CreateEncounter(payload payload.CreateEncounterPayload, accessToken string) (*fhir.Encounter, error) {
	tx, err := e.SqlDB.BeginTx(context.Background(), pgx.TxOptions{})
	if err != nil {
		return nil, err
	}

	var encounterId int
	if err := tx.QueryRow(context.Background(), "INSERT INTO encounters(created_at) VALUES ($1) RETURNING id", "now()").Scan(&encounterId); err != nil {
		return nil, err
	}

	// Accession ID
	value := strconv.Itoa(encounterId)
	payload.Encounter.Identifier = []fhir.Identifier{
		util.CreateAccessionIdentifier(value),
	}

	encounter, err := e.EncounterRepository.CreateEncounter(payload.Encounter)

	if err != nil {
		tx.Rollback(context.Background())
		return nil, err
	}

	if payload.ActivityDefinitionName != nil {
		users, err := e.ActivityDefinitionService.GetActivityParticipantsFromName(*payload.ActivityDefinitionName, accessToken)
		if err != nil {
			tx.Rollback(context.Background())
			return nil, err
		}

		tasks := util.GetPossibleTasksFromEncounter(*encounter, users, payload.RequesterID, payload.ActivityDefinitionName)

		if len(tasks) > 0 {
			_, err := e.TaskService.CreateTaskBatch(tasks)
			if err != nil {
				tx.Rollback(context.Background())
				return nil, err
			}
		}
	}

	if err := tx.Commit(context.Background()); err != nil {
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
