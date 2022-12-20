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
	"os"

	"github.com/Nerzal/gocloak/v12"
	"github.com/gin-gonic/gin"
	"github.com/tensorsystems/tensoremr/apps/core/internal/payload"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
	"github.com/tensorsystems/tensoremr/apps/core/internal/util"
)

type UserController struct {
	KeycloakClient *gocloak.GoCloak
	FhirService    service.FhirService
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

	// Get Keycloak service
	keycloakService := KeycloakService(u.KeycloakClient, c.GetString("accessToken"))

	// Create user
	userService := service.UserService{KeycloakService: keycloakService, FhirService: u.FhirService}
	user, err := userService.CreateOneUser(payload)
	if err != nil {
		util.ReqError(c, 500, err.Error())
	}

	// Success
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

	// Get Keycloak service
	keycloakService := KeycloakService(u.KeycloakClient, c.GetString("accessToken"))

	// Update user
	userService := service.UserService{KeycloakService: keycloakService, FhirService: u.FhirService}
	user, err := userService.UpdateUser(payload)
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

	// Get Keycloak service
	keycloakService := KeycloakService(u.KeycloakClient, c.GetString("accessToken"))

	// Get all users
	userService := service.UserService{KeycloakService: keycloakService, FhirService: u.FhirService}
	users, err := userService.GetAllUsers(searchTerm)
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

	// Get Keycloak service
	keycloakService := KeycloakService(u.KeycloakClient, c.GetString("accessToken"))

	// Get one user
	userService := service.UserService{KeycloakService: keycloakService, FhirService: u.FhirService}
	user, err := userService.GetOneUser(userId)
	if err != nil {
		util.ReqError(c, 500, err.Error())
		return
	}

	c.JSON(200, user)
}

func KeycloakService(KeycloakClient *gocloak.GoCloak, accessToken string) service.KeycloakService {
	clientAppRealm := os.Getenv("KEYCLOAK_CLIENT_APP_REALM")
	return service.KeycloakService{Client: KeycloakClient, Token: accessToken, Realm: clientAppRealm}
}
