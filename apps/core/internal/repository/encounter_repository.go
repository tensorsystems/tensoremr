package repository

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"

	"github.com/jackc/pgx/v5"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	fhir_rest "github.com/tensorsystems/tensoremr/apps/core/internal/fhir"
)

type EncounterRepository struct {
	FhirService fhir_rest.FhirService
}

func NewEncounterRepository(fhirService fhir_rest.FhirService) EncounterRepository {
	return EncounterRepository{
		FhirService: fhirService,
	}
}

// GetOneEncounter ...
func (e *EncounterRepository) GetOneEncounter(ID string) (*fhir.Encounter, error) {
	returnPref := "return=representation"
	body, statusCode, err := e.FhirService.Request("Encounter/"+ID, "GET", nil, &returnPref)

	if err != nil {
		return nil, err
	}

	if statusCode != 200 {
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
func (e *EncounterRepository) GetOneEncounterByAppointment(ID string) (*fhir.Encounter, error) {
	returnPref := "return=representation"
	body, statusCode, err := e.FhirService.Request("Encounter?appointment="+ID, "GET", nil, &returnPref)

	if err != nil {
		return nil, err
	}

	if statusCode != 200 {
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
func (e *EncounterRepository) CreateEncounter(en fhir.Encounter) (*fhir.Encounter, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, statusCode, err := e.FhirService.Request("Encounter", "POST", b, &returnPref)
	if err != nil {
		return nil, err
	}

	if statusCode != 201 && statusCode != 200 {
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

// UpdateEncounter ...
func (s *EncounterRepository) UpdateEncounter(en fhir.Encounter) (*fhir.Encounter, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	if en.Id == nil {
		return nil, errors.New("Encounter ID is required")
	}

	body, statusCode, err := s.FhirService.Request("Encounter/"+*en.Id, "PUT", b, &returnPref)
	if err != nil {
		return nil, err
	}

	if statusCode != 201 && statusCode != 200 {
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
func (e *EncounterRepository) CreateEncounterID(tx pgx.Tx) (int, error) {
	var encounterId int
	if err := tx.QueryRow(context.Background(), "INSERT INTO encounters(created_at) VALUES ($1) RETURNING id", "now()").Scan(&encounterId); err != nil {
		return 0, err
	}

	return encounterId, nil
}
