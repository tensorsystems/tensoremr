package util

import (
	"github.com/Nerzal/gocloak/v12"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

// GetPossibleTasksFromEncounter ...
func GetPossibleTasksFromEncounter(encounter fhir.Encounter, users []*gocloak.User, requesterId *string, activityDefinitionTitle *string) []fhir.Task {
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
