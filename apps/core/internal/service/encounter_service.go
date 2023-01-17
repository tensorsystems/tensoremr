package service

import (
	"bytes"
	"encoding/json"
	"errors"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

type EncounterService struct {
	FhirService               FhirService
	TaskService               TaskService
	ActivityDefinitionService ActivityDefinitionService
}

// GetOneEncounter ...
func (e *EncounterService) GetOneEncounter(ID string) (*fhir.Encounter, error) {
	returnPref := "return=representation"
	body, statusCode, err := e.FhirService.FhirRequest("Encounter/"+ID, "GET", nil, &returnPref)

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

// GetOneEncounter ...
func (e *EncounterService) GetOneEncounterByAppointment(ID string) (*fhir.Encounter, error) {
	returnPref := "return=representation"
	body, statusCode, err := e.FhirService.FhirRequest("Encounter?appointment="+ID, "GET", nil, &returnPref)

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
func (e *EncounterService) CreateEncounter(en fhir.Encounter) (*fhir.Encounter, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, statusCode, err := e.FhirService.FhirRequest("Encounter", "POST", b, &returnPref)
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

	body, statusCode, err := s.FhirService.FhirRequest("Encounter/"+*en.Id, "PUT", b, &returnPref)
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
