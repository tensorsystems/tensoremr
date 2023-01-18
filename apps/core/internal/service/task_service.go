package service

import (
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
)

type TaskService struct {
	TaskRepository repository.TaskRepository
}

// GetOneTask ...
func (t *TaskService) GetOneTask(ID string) (*fhir.Task, error) {
	task, err := t.TaskRepository.GetOneTask(ID)
	if err != nil {
		return nil, err
	}

	return task, nil
}

// CreateTask ...
func (t *TaskService) CreateTask(ts fhir.Task) (*fhir.Task, error) {
	task, err := t.TaskRepository.CreateTask(ts)
	if err != nil {
		return nil, err
	}

	return task, nil
}

// CreateTask ...
func (t *TaskService) CreateTaskBatch(ts []fhir.Task) (*fhir.Bundle, error) {
	task, err := t.TaskRepository.CreateTaskBatch(ts)
	if err != nil {
		return nil, err
	}

	return task, nil
}

// UpdateTask ...
func (t *TaskService) UpdateTask(en fhir.Task) (*fhir.Task, error) {
	task, err := t.TaskRepository.CreateTask(en)
	if err != nil {
		return nil, err
	}

	return task, nil
}
