package service

import (
	"bytes"
	"encoding/json"
	"errors"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"golang.org/x/net/context"
)

type TaskService struct {
	FHIRService FHIRService
}

func NewTaskService(FHIRService FHIRService) TaskService {
	return TaskService{
		FHIRService: FHIRService,
	}
}

// GetOneTask ...
func (t *TaskService) GetOneTask(ID string, context context.Context) (*fhir.Task, error) {
	returnPref := "return=representation"
	body, resp, err := t.FHIRService.GetResource("Task/"+ID, &returnPref, context)

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

	var task fhir.Task
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&task)

	return &task, nil
}

// CreateTask ...
func (t *TaskService) CreateTask(ts fhir.Task, context context.Context) (*fhir.Task, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := ts.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, resp, err := t.FHIRService.CreateResource("Task", b, &returnPref, context)
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

	var task fhir.Task
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&task)

	return &task, nil
}

// CreateTask ...
func (t *TaskService) CreateTaskBatch(ts []fhir.Task, context context.Context) (*fhir.Bundle, error) {
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

	body, resp, err := t.FHIRService.CreateBundle(bundle, &returnPref, context)
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

// UpdateTask ...
func (t *TaskService) UpdateTask(en fhir.Task, context context.Context) (*fhir.Task, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := en.MarshalJSON()
	if err != nil {
		return nil, err
	}

	if en.Id == nil {
		return nil, errors.New("task ID is required")
	}

	body, resp, err := t.FHIRService.UpdateResource("Task/"+*en.Id, b, &returnPref, context)
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

	var task fhir.Task
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&task)

	return &task, nil
}
