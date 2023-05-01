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
	"errors"

	"github.com/supertokens/supertokens-golang/recipe/userroles"
)

type RoleService struct {
}

func NewRoleService() RoleService {
	return RoleService{}
}

func (r *RoleService) CreateRole(role string) error {
	_, err := userroles.CreateNewRoleOrAddPermissions(role, []string{}, nil)
	if err != nil {
		return err
	}

	return nil
}

func (r *RoleService) AddRoleToUser(userID string, role string) error {
	resp, err := userroles.AddRoleToUser(userID, role, nil)
	if err != nil {
		return err
	}

	if resp.UnknownRoleError != nil {
		return errors.New("no such role exists")
	}

	return nil
}
