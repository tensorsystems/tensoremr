/*
  Copyright 2021 Kidus Tiliksew

  This file is part of Tensor EMR.

  Tensor EMR is free software: you can redistribute it and/or modify
  it under the terms of the version 2 of GNU General Public License as published by
  the Free Software Foundation.

  Tensor EMR is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

package service_test

import (
	"net/http"
	"testing"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

func TestCreateTask(t *testing.T) {
	fhirService := service.FhirService{Client: http.Client{}, FhirBaseURL: "http://localhost:8081" + "/fhir-server/api/v4/"}
	taskService := service.TaskService{FhirService: fhirService}

	task := fhir.Task{
		Status: fhir.TaskStatusDraft,
		Intent: "proposal",
	}

	result, err := taskService.CreateTask(task)
	assert.NoError(t, err)

	t.Cleanup(func() {
		if result.Id != nil {
			_, _, err := fhirService.DeleteResource("Task", *result.Id)
			if err != nil {
				t.Fatal(err)
			}

		}
	})
}

func TestCreateTaskBatch(t *testing.T) {
	fhirService := service.FhirService{Client: http.Client{}, FhirBaseURL: "http://localhost:8081" + "/fhir-server/api/v4/"}
	taskService := service.TaskService{FhirService: fhirService}

	tasks := []fhir.Task{
		{
			Status: fhir.TaskStatusDraft,
			Intent: "proposal",
		},
		{
			Status: fhir.TaskStatusDraft,
			Intent: "proposal",
		},
	}

	_, err := taskService.CreateTaskBatch(tasks)
	assert.NoError(t, err)
}
