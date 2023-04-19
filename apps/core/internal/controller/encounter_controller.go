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
	EncounterService service.EncounterService
}

func NewEncounterController(encounterService service.EncounterService) EncounterController {
	return EncounterController{
		EncounterService: encounterService,
	}
}

// CreateEncounter ...
func (e *EncounterController) CreateEncounter(c *gin.Context) {
	var payload payload.CreateEncounterPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		util.ReqError(c, 400, "Invalid input")
		return
	}

	encounter, err := e.EncounterService.CreateEncounterFromPayload(payload, c)
	if err != nil {
		util.ReqError(c, 500, err.Error())
		return
	}

	c.JSON(200, encounter)
}
