package service

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"strconv"
	"strings"

	"github.com/jackc/pgx/v5"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/payload"
	"github.com/tensorsystems/tensoremr/apps/core/internal/util"
)

type EncounterService struct {
	FHIRService               FHIRService
	CareTeamService           CareTeamService
	PatientService            PatientService
	ActivityDefinitionService ActivityDefinitionService
	TaskService               TaskService
	SqlDB                     *pgx.Conn
}

func NewEncounterService(FHIRService FHIRService, careTeamService CareTeamService, patientService PatientService, activityDefinitionService ActivityDefinitionService, taskService TaskService, db *pgx.Conn) EncounterService {
	return EncounterService{
		CareTeamService:           careTeamService,
		PatientService:            patientService,
		ActivityDefinitionService: activityDefinitionService,
		TaskService:               taskService,
		SqlDB:                     db,
	}
}

// GetOneEncounter ...
func (e *EncounterService) GetOneEncounter(ID string) (*fhir.Encounter, error) {
	returnPref := "return=representation"
	body, resp, err := e.FHIRService.GetResource("Encounter/"+ID, &returnPref)

	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 200 {
		return nil, errors.New(string(body))
	}

	aResult := make(map[string]interface{})
	if err := json.Unmarshal(body, &aResult); err != nil {
		return nil, err
	}

	var encounter fhir.Encounter
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&encounter)

	return &encounter, nil
}

// GetOneEncounterByAppointment ...
func (e *EncounterService) GetOneEncounterByAppointment(ID string) (*fhir.Encounter, error) {
	returnPref := "return=representation"
	body, resp, err := e.FHIRService.GetResource("Encounter?appointment="+ID, &returnPref)

	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 200 {
		return nil, errors.New(string(body))
	}

	aResult := make(map[string]interface{})
	if err := json.Unmarshal(body, &aResult); err != nil {
		return nil, err
	}

	var encounter fhir.Encounter
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&encounter)

	return &encounter, nil
}

// CreateEncounter ...
func (e *EncounterService) CreateEncounter(en fhir.Encounter) (*fhir.Encounter, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, resp, err := e.FHIRService.CreateResource("Encounter", b, &returnPref)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 201 && resp.StatusCode != 200 {
		return nil, errors.New(string(body))
	}

	aResult := make(map[string]interface{})
	if err := json.Unmarshal(body, &aResult); err != nil {
		return nil, err
	}

	var encounter fhir.Encounter
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&encounter)

	return &encounter, nil
}

// CreateEncounter ...
func (e *EncounterService) CreateEncounterFromPayload(payload payload.CreateEncounterPayload) (*fhir.Encounter, error) {
	tx, err := e.SqlDB.BeginTx(context.Background(), pgx.TxOptions{})
	if err != nil {
		return nil, err
	}

	encounterId, err := e.CreateEncounterID(tx)
	if err != nil {
		return nil, err
	}

	// Accession ID
	value := strconv.Itoa(encounterId)
	payload.Encounter.Identifier = []fhir.Identifier{
		util.CreateAccessionIdentifier(value),
	}

	encounter, err := e.CreateEncounter(payload.Encounter)

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

	if err := tx.Commit(context.Background()); err != nil {
		return nil, err
	}

	return encounter, nil
}

// UpdateEncounter ...
func (s *EncounterService) UpdateEncounter(en fhir.Encounter) (*fhir.Encounter, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	if en.Id == nil {
		return nil, errors.New("Encounter ID is required")
	}

	body, resp, err := s.FHIRService.UpdateResource("Encounter/"+*en.Id, b, &returnPref)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 201 && resp.StatusCode != 200 {
		return nil, errors.New(string(body))
	}

	aResult := make(map[string]interface{})
	if err := json.Unmarshal(body, &aResult); err != nil {
		return nil, err
	}

	var encounter fhir.Encounter
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&encounter)

	return &encounter, nil
}

// CreateEncounterID ...
func (e *EncounterService) CreateEncounterID(tx pgx.Tx) (int, error) {
	var encounterId int
	if err := tx.QueryRow(context.Background(), "INSERT INTO encounters(created_at) VALUES ($1) RETURNING id", "now()").Scan(&encounterId); err != nil {
		return 0, err
	}

	return encounterId, nil
}