package service

import (
	"bytes"
	"encoding/json"
	"errors"

	"github.com/Nerzal/gocloak/v12"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

type TaskService struct {
	FhirService FhirService
}

// GetOneTask ...
func (t *TaskService) GetOneTask(ID string) (*fhir.Task, error) {
	returnPref := "return=representation"
	body, statusCode, err := t.FhirService.FhirRequest("Task/"+ID, "GET", nil, &returnPref)

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

	var task fhir.Task
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&task)

	return &task, nil
}

// CreateTask ...
func (e *TaskService) CreateTask(ts fhir.Task) (*fhir.Task, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := ts.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, statusCode, err := e.FhirService.FhirRequest("Task", "POST", b, &returnPref)
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

	var task fhir.Task
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&task)

	return &task, nil
}

// CreateTask ...
func (e *TaskService) CreateTaskBatch(ts []fhir.Task) (*fhir.Bundle, error) {
	// Create FHIR resource
	var entries []fhir.BundleEntry
	for _, e := range ts {
		b, err := e.MarshalJSON()
		if err != nil {
			return nil, err
		}

		entry := fhir.BundleEntry{
			Request: &fhir.BundleEntryRequest{
				Method: fhir.HTTPVerbPOST,
				Url:    "Task",
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

	body, statusCode, err := e.FhirService.FhirRequest("", "POST", b, &returnPref)
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

// UpdateTask ...
func (s *TaskService) UpdateTask(en fhir.Task) (*fhir.Task, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	if en.Id == nil {
		return nil, errors.New("Task ID is required")
	}

	body, statusCode, err := s.FhirService.FhirRequest("Task/"+*en.Id, "PUT", b, &returnPref)
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

	var task fhir.Task
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&task)

	return &task, nil
}

// GetPossibleTasksFromEncounter ...
func (t *TaskService) GetPossibleTasksFromEncounter(encounter fhir.Encounter, users []*gocloak.User, requesterId *string, activityDefinitionTitle *string) []fhir.Task {
	fulFillCode := "fulfill"
	fulFillDisplay := "Fulfill the focal request"
	fulFillSystem := "http://hl7.org/fhir/ValueSet/task-code"

	var priority fhir.RequestPriority
	if *encounter.Class.Code == "EMER" {
		priority = fhir.RequestPriorityUrgent
	} else {
		priority = fhir.RequestPriorityRoutine
	}

	var tasks []fhir.Task

	for _, user := range users {
		participantRef := "Practitioner/" + *user.ID
		participantRefType := "Practitioner"

		encounterRef := "Encounter/" + *encounter.Id
		encounterRefType := "Encounter"

		requesterRef := "Practitioner/" + *requesterId
		requesterRefType := "Practitioner"

		ownerRef := "Practitioner/" + *user.ID
		ownerRefType := "Practitioner"

		var locationRef *string
		locationRefType := "Location"

		if len(encounter.Location) > 0 {
			locationRef = encounter.Location[0].Location.Reference
		}

		task := fhir.Task{
			Status:   fhir.TaskStatusRequested,
			Intent:   "proposal",
			Priority: &priority,
			Code: &fhir.CodeableConcept{
				Coding: []fhir.Coding{
					{
						Code:    &fulFillCode,
						Display: &fulFillDisplay,
						System:  &fulFillSystem,
					},
				},
			},
			Description: activityDefinitionTitle,
			For: &fhir.Reference{
				Reference: &participantRef,
				Type:      &participantRefType,
			},
			Encounter: &fhir.Reference{
				Reference: &encounterRef,
				Type:      &encounterRefType,
			},
			Requester: &fhir.Reference{
				Reference: &requesterRef,
				Type:      &requesterRefType,
			},
			Owner: &fhir.Reference{
				Reference: &ownerRef,
				Type:      &ownerRefType,
			},
			Location: &fhir.Reference{
				Reference: locationRef,
				Type:      &locationRefType,
			},
		}

		tasks = append(tasks, task)
	}

	return tasks
}
