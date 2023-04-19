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

package service

import (
	"bytes"
	"encoding/json"
	"errors"

	"github.com/Nerzal/gocloak/v12"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"golang.org/x/net/context"
)

type ActivityDefinitionService struct {
	FHIRService FHIRService
}

func NewActivityDefinitionService(FHIRService FHIRService) ActivityDefinitionService {
	return ActivityDefinitionService{
		FHIRService: FHIRService,
	}
}

// GetActivityDefinition ...
func (a *ActivityDefinitionService) GetActivityDefinition(ID string, context context.Context) (*fhir.ActivityDefinition, error) {
	returnPref := "return=representation"
	body, resp, err := a.FHIRService.GetResource("ActivityDefinition/"+ID, &returnPref, context)

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

	var activityDefinition fhir.ActivityDefinition
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&activityDefinition)

	return &activityDefinition, nil
}

// CreateActivityDefinition ...
func (a *ActivityDefinitionService) CreateActivityDefinition(activityDefinition fhir.ActivityDefinition, context context.Context) (*fhir.ActivityDefinition, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := activityDefinition.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, resp, err := a.FHIRService.CreateResource("ActivityDefinition", b, &returnPref, context)
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

	var result fhir.ActivityDefinition
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&result)

	return &result, nil
}

// UpdateActivityDefinition ...
func (a *ActivityDefinitionService) UpdateActivityDefinition(activityDefinition fhir.ActivityDefinition, context context.Context) (*fhir.ActivityDefinition, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := activityDefinition.MarshalJSON()
	if err != nil {
		return nil, err
	}

	if activityDefinition.Id == nil {
		return nil, errors.New("Activity definition ID is required")
	}

	body, resp, err := a.FHIRService.UpdateResource("ActivityDefinition/"+*activityDefinition.Id, b, &returnPref, context)
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

	var result fhir.ActivityDefinition
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&result)

	return &result, nil
}

// GetActiveDefinitionByName...
func (a *ActivityDefinitionService) GetActivityDefinitionByName(name string, context context.Context) (*fhir.Bundle, error) {
	returnPref := "return=representation"
	body, resp, err := a.FHIRService.GetResource("ActivityDefinition?name="+name, &returnPref, context)

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

	var activityDefinition fhir.Bundle
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&activityDefinition)

	return &activityDefinition, nil
}

// GetActivityParticipants ...
func (a *ActivityDefinitionService) GetActivityParticipantsFromName(name string, context context.Context) ([]*gocloak.User, error) {
	activityDefinition, err := a.GetActivityDefinitionByName(name, context)
	if err != nil {
		return nil, err
	}

	var users []*gocloak.User

	if len(activityDefinition.Entry) > 0 {
		var participants []fhir.ActivityDefinitionParticipant

		for _, entry := range activityDefinition.Entry {
			resource := entry.Resource

			var activityDefinition fhir.ActivityDefinition
			buf := new(bytes.Buffer)
			json.NewEncoder(buf).Encode(resource)
			json.NewDecoder(buf).Decode(&activityDefinition)

			participants = append(participants, activityDefinition.Participant...)
		}

		// for _, participant := range participants {
		// 	if participant.Type == fhir.ActionParticipantTypePractitioner {
		// 		for _, role := range participant.Role.Coding {
		// 			group, err := a.KeycloakService.GetGroupByPath("/"+*role.Code, token)
		// 			if err != nil {
		// 				return nil, err
		// 			}

		// 			u, err := a.KeycloakService.GetUsersByGroup(*group.ID, token)
		// 			if err != nil {
		// 				return nil, err
		// 			}

		// 			users = append(users, u...)
		// 		}
		// 	}
		// }
	}

	return users, nil
}
