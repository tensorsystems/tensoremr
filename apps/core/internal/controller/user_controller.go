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
	fhir_rest "github.com/tensorsystems/tensoremr/apps/core/internal/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/payload"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
	"github.com/tensorsystems/tensoremr/apps/core/internal/util"
)

type UserController struct {
	KeycloakClient *gocloak.GoCloak
	FhirService    fhir_rest.FhirService
	UserService    service.UserService
}

// CreateUser ...
func (u *UserController) CreateUser(c *gin.Context) {
	util.CheckAccessToken(c)

	// Bind JSON
	var payload payload.CreateUserPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		util.ReqError(c, 400, "Invalid input")
		return
	}

	// Check if passwords match
	if payload.Password != payload.ConfirmPassword {
		util.ReqError(c, 400, "Passwords do not match")
		return
	}

	// Check if password length is less than 6
	if len(payload.Password) < 6 {
		util.ReqError(c, 400, "Password is too short")
		return
	}

	user, err := u.UserService.CreateOneUser(payload, c.GetString("accessToken"))
	if err != nil {
		util.ReqError(c, 500, err.Error())
	}

	// Success
	c.JSON(200, user)
}

// GetCurrentUser ...
func (u *UserController) GetCurrentUser(c *gin.Context) {
	util.CheckAccessToken(c)

	user, err := u.UserService.GetCurrentUser(c.GetString("accessToken"))

	if err != nil {
		util.ReqError(c, 500, err.Error())
		return
	}

	c.JSON(200, user)
}

// UpdateUser ...
func (u *UserController) UpdateUser(c *gin.Context) {
	util.CheckAccessToken(c)

	// Bind JSON
	var payload payload.UpdateUserPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		util.ReqError(c, 400, "invalid input")
		return
	}

	user, err := u.UserService.UpdateUser(payload, c.GetString("accessToken"))
	if err != nil {
		util.ReqError(c, 500, err.Error())
		return
	}

	c.JSON(200, user)
}

// GetAllUsers ...
func (u *UserController) GetAllUsers(c *gin.Context) {
	util.CheckAccessToken(c)

	searchTerm := c.Query("search")

	users, err := u.UserService.GetAllUsers(searchTerm, c.GetString("accessToken"))
	if err != nil {
		util.ReqError(c, 500, err.Error())
		return
	}

	c.JSON(200, users)
}

// GetOneUser ...
func (u *UserController) GetOneUser(c *gin.Context) {
	util.CheckAccessToken(c)

	userId := c.Param("id")

	user, err := u.UserService.GetOneUser(userId, c.GetString("accessToken"))
	if err != nil {
		util.ReqError(c, 500, err.Error())
		return
	}

	c.JSON(200, user)
}
