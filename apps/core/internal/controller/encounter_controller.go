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

package controller

import (
	"github.com/gin-gonic/gin"
	"github.com/tensorsystems/tensoremr/apps/core/internal/payload"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
	"github.com/tensorsystems/tensoremr/apps/core/internal/util"
)

type EncounterController struct {
	EncounterService          service.EncounterService
	ActivityDefinitionService service.ActivityDefinitionService
	TaskService               service.TaskService
}

// CreateEncounter ...
func (e *EncounterController) CreateEncounter(c *gin.Context) {
	util.CheckAccessToken(c)

	var payload payload.CreateEncounterPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		util.ReqError(c, 400, "Invalid input")
		return
	}

	encounter, err := e.EncounterService.CreateEncounter(payload.Encounter)
	if err != nil {
		util.ReqError(c, 500, err.Error())
		return
	}

	if payload.ActivityDefinitionName != nil {
		users, err := e.ActivityDefinitionService.GetActivityParticipantsFromName(*payload.ActivityDefinitionName, c.GetString("accessToken"))
		if err != nil {
			util.ReqError(c, 500, err.Error())
			return
		}

		tasks := util.GetPossibleTasksFromEncounter(*encounter, users, payload.RequesterID, payload.ActivityDefinitionName)

		if len(tasks) > 0 {
			_, err := e.TaskService.CreateTaskBatch(tasks)
			if err != nil {
				util.ReqError(c, 500, err.Error())
				return
			}
		}
	}

	c.JSON(200, encounter)
}
