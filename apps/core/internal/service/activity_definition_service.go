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

	"github.com/Nerzal/gocloak/v12"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
)

type ActivityDefinitionService struct {
	ActivityDefinitionRepository repository.ActivityDefinitionRepository
}

func NewActivityDefinitionService(repository repository.ActivityDefinitionRepository) ActivityDefinitionService {
	return ActivityDefinitionService{
		ActivityDefinitionRepository: repository,
	}
}

// GetActivityDefinition ...
func (a *ActivityDefinitionService) GetActivityDefinition(ID string) (*fhir.ActivityDefinition, error) {
	activityDefinition, err := a.ActivityDefinitionRepository.GetActivityDefinition(ID)
	if err != nil {
		return nil, err
	}

	return activityDefinition, nil
}

// CreateActivityDefinition ...
func (a *ActivityDefinitionService) CreateActivityDefinition(activityDefinition fhir.ActivityDefinition) (*fhir.ActivityDefinition, error) {
	result, err := a.ActivityDefinitionRepository.CreateActivityDefinition(activityDefinition)
	if err != nil {
		return nil, err
	}

	return result, nil
}

// UpdateActivityDefinition ...
func (a *ActivityDefinitionService) UpdateActivityDefinition(activityDefinition fhir.ActivityDefinition) (*fhir.ActivityDefinition, error) {
	result, err := a.ActivityDefinitionRepository.UpdateActivityDefinition(activityDefinition)
	if err != nil {
		return nil, err
	}

	return result, nil
}

// GetActiveDefinitionByName...
func (a *ActivityDefinitionService) GetActivityDefinitionByName(name string) (*fhir.Bundle, error) {
	result, err := a.ActivityDefinitionRepository.GetActivityDefinitionByName(name)
	if err != nil {
		return nil, err
	}

	return result, nil
}

// GetActivityParticipants ...
func (a *ActivityDefinitionService) GetActivityParticipantsFromName(name string, token string) ([]*gocloak.User, error) {
	activityDefinition, err := a.ActivityDefinitionRepository.GetActivityDefinitionByName(name)
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
