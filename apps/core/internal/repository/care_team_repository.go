package repository

import (
	"bytes"
	"encoding/json"
	"errors"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	fhir_rest "github.com/tensorsystems/tensoremr/apps/core/internal/fhir"
)

type CareTeamRepository struct {
	FhirService fhir_rest.FhirService
}

func NewCareTeamRepository(fhirService fhir_rest.FhirService) CareTeamRepository {
	return CareTeamRepository{
		FhirService: fhirService,
	}
}

// GetOneCareTeam ...
func (e *CareTeamRepository) GetOneCareTeam(ID string) (*fhir.CareTeam, error) {
	returnPref := "return=representation"
	body, statusCode, err := e.FhirService.Request("CareTeam/"+ID, "GET", nil, &returnPref)

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

	var careTeam fhir.CareTeam
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&careTeam)

	return &careTeam, nil
}

// CreateCareTeam ...
func (e *CareTeamRepository) CreateCareTeam(en fhir.CareTeam) (*fhir.CareTeam, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, statusCode, err := e.FhirService.Request("CareTeam", "POST", b, &returnPref)
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

	var careTeam fhir.CareTeam
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&careTeam)

	return &careTeam, nil
}

// CreateCareTeamBatch ...
func (c *CareTeamRepository) CreateCareTeamBatch(careTeams []fhir.CareTeam) (*fhir.Bundle, error) {
	// Create FHIR resource
	var entries []fhir.BundleEntry
	for _, e := range careTeams {
		b, err := e.MarshalJSON()
		if err != nil {
			return nil, err
		}

		entry := fhir.BundleEntry{
			Request: &fhir.BundleEntryRequest{
				Method: fhir.HTTPVerbPOST,
				Url:    "CareTeam",
			},
			Resource: b,
		}

		entries = append(entries, entry)
	}

	bundle := fhir.Bundle{
		Type:  fhir.BundleTypeTransaction,
		Entry: entries,
	}

	returnPref := "return=representation"
	b, err := bundle.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, statusCode, err := c.FhirService.Request("", "POST", b, &returnPref)
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

	var result fhir.Bundle
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&result)

	return &result, nil
}

// UpdateCareTeam ...
func (s *CareTeamRepository) UpdateCareTeam(en fhir.CareTeam) (*fhir.CareTeam, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	if en.Id == nil {
		return nil, errors.New("CareTeam ID is required")
	}

	body, statusCode, err := s.FhirService.Request("CareTeam/"+*en.Id, "PUT", b, &returnPref)
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

	var CareTeam fhir.CareTeam
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&CareTeam)

	return &CareTeam, nil
}
