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
	"github.com/opentracing/opentracing-go/log"
	"github.com/tensorsystems/tensoremr/apps/core/pkg/payload"
	"github.com/tensorsystems/tensoremr/apps/core/pkg/service"
	"github.com/tensorsystems/tensoremr/apps/core/pkg/util"
)

type UserController struct {
	UserService service.UserService
}

func NewUserController(userService service.UserService) UserController {
	return UserController{
		UserService: userService,
	}
}

// CreateUser ...
func (u *UserController) CreateUser(c *gin.Context) {
	// Bind JSON
	var payload payload.CreateUserPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		log.Error(err)
		util.ReqError(c, 400, "Invalid input")
		return
	}

	user, statusCode, err := u.UserService.CreateOneUser(payload, c)
	if err != nil {
		log.Error(err)
		util.ReqError(c, statusCode, err.Error())
	}

	// Success
	c.JSON(200, user)
}

// UpdateUser ...
func (u *UserController) UpdateUser(c *gin.Context) {
	// Bind JSON
	var payload payload.UpdateUserPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		log.Error(err)
		util.ReqError(c, 400, "invalid input")
		return
	}

	user, status, err := u.UserService.UpdateUser(payload, c)
	if err != nil {
		log.Error(err)
		util.ReqError(c, status, err.Error())
		return
	}

	c.JSON(200, user)
}

// GetOneUser ...
func (u *UserController) GetOneUser(c *gin.Context) {
	userId := c.Param("id")

	user, err := u.UserService.GetOneUser(userId)
	if err != nil {
		log.Error(err)
		util.ReqError(c, 500, err.Error())
		return
	}

	c.JSON(200, user)
}
