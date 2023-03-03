package service

import (
	"context"
	"strconv"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/payload"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
	"github.com/tensorsystems/tensoremr/apps/core/internal/util"
)

type EncounterService struct {
	EncounterRepository       repository.EncounterRepository
	CareTeamService           CareTeamService
	PatientService            PatientService
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

	encounterId, err := e.EncounterRepository.CreateEncounterID(tx)
	if err != nil {
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

	// Create to care team
	statusActive := fhir.CareTeamStatusActive
	categoryCode := "LA27976-2"
	categoryDisplay := "Encounter-focused care team"
	categorySystem := "http://loinc.org"

	s := strings.Split(*encounter.Subject.Reference, "/")[1]
	patient, err := e.PatientService.GetOnePatient(s)
	if err != nil {
		return nil, err
	}
	name := *patient.Name[0].Family + " Care Team"
	var participants []fhir.CareTeamParticipant
	for _, p := range encounter.Participant {
		participants = append(participants, fhir.CareTeamParticipant{
			Member: p.Individual,
		})
	}

	// Add existing care teams if selected
	for _, ID := range payload.CareTeams {
		ref := "CareTeam/" + ID
		refType := "CareTeam"

		participants = append(participants, fhir.CareTeamParticipant{
			Member: &fhir.Reference{
				Reference: &ref,
				Type:      &refType,
			},
		})
	}

	encounterRef := "Encounter/" + *encounter.Id
	encounterRefType := "Encounter"

	careTeam := fhir.CareTeam{
		Status: &statusActive,
		Category: []fhir.CodeableConcept{
			{
				Coding: []fhir.Coding{
					{
						Code:    &categoryCode,
						Display: &categoryDisplay,
						System:  &categorySystem,
					},
				},
				Text: &categoryDisplay,
			},
		},
		Name:        &name,
		Subject:     encounter.Subject,
		Period:      encounter.Period,
		Participant: participants,
		Encounter: &fhir.Reference{
			Reference: &encounterRef,
			Type:      &encounterRefType,
		},
	}

	_, err = e.CareTeamService.CreateCareTeam(careTeam)
	if err != nil {
		return nil, err
	}

	// Create tasks from for each participant
	if payload.ActivityDefinitionName != nil {
		users, err := e.ActivityDefinitionService.GetActivityParticipantsFromName(*payload.ActivityDefinitionName, accessToken)
		if err != nil {
			return nil, err
		}

		tasks := util.GetPossibleTasksFromEncounter(*encounter, users, payload.RequesterID, payload.ActivityDefinitionName)

		if len(tasks) > 0 {
			_, err := e.TaskService.CreateTaskBatch(tasks)
			if err != nil {
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
