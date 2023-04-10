package service

import (
	"bytes"
	"encoding/json"
	"errors"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

type CareTeamService struct {
	FHIRService FHIRService
}

func NewCareTeamService(FHIRService FHIRService) CareTeamService {
	return CareTeamService{
		FHIRService: FHIRService,
	}
}

// GetOneCareTeam ...
func (c *CareTeamService) GetOneCareTeam(ID string) (*fhir.CareTeam, error) {
	returnPref := "return=representation"
	body, resp, err := c.FHIRService.GetResource("CareTeam/"+ID, &returnPref)

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

	var careTeam fhir.CareTeam
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&careTeam)

	return &careTeam, nil
}

// CreateCareTeam ...
func (c *CareTeamService) CreateCareTeam(en fhir.CareTeam) (*fhir.CareTeam, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, resp, err := c.FHIRService.CreateResource("CareTeam", b, &returnPref)
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

	var careTeam fhir.CareTeam
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&careTeam)

	return &careTeam, nil
}

// CreateCareTeamBatch ...
func (c *CareTeamService) CreateCareTeamBatch(careTeams []fhir.CareTeam) (*fhir.Bundle, error) {
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

	body, resp, err := c.FHIRService.CreateBundle(bundle, &returnPref)
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

	var result fhir.Bundle
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&result)

	return &result, nil
}

// UpdateCareTeam ...
func (c *CareTeamService) UpdateCareTeam(en fhir.CareTeam) (*fhir.CareTeam, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	if en.Id == nil {
		return nil, errors.New("CareTeam ID is required")
	}

	body, resp, err := c.FHIRService.UpdateResource("CareTeam/"+*en.Id, b, &returnPref)
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

	var CareTeam fhir.CareTeam
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&CareTeam)

	return &CareTeam, nil
}
