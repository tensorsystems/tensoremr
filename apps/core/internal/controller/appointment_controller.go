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
	"github.com/Nerzal/gocloak/v12"
	"github.com/gin-gonic/gin"
	"github.com/tensorsystems/tensoremr/apps/core/internal/payload"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
	"github.com/tensorsystems/tensoremr/apps/core/internal/util"
)

type AppointmentController struct {
	KeycloakClient     *gocloak.GoCloak
	AppointmentService service.AppointmentService
	UserService        service.UserService
}

// SaveAppointmentResponse ...
func (p *AppointmentController) SaveAppointmentResponse(c *gin.Context) {
	util.CheckAccessToken(c)

	var payload payload.SaveAppointmentResponsePayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		util.ReqError(c, 400, "Invalid input")
		return
	}

	result, err := p.AppointmentService.SaveAppointmentResponse(payload.AppointmentID, payload.ParticipantID, payload.ParticipationStatus, c.GetString("accessToken"))
	if err != nil {
		util.ReqError(c, 500, err.Error())
		return
	}

	c.JSON(200, *result)
}
