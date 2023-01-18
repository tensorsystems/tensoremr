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
	"github.com/Nerzal/gocloak/v12"
	"github.com/tensorsystems/tensoremr/apps/core/internal/payload"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
)

type UserService struct {
	UserRepository repository.UserRepository
}

func (u *UserService) CreateOneUser(p payload.CreateUserPayload, token string) (*gocloak.User, error) {
	user, err := u.UserRepository.CreateOneUser(p, token)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (u *UserService) UpdateUser(p payload.UpdateUserPayload, token string) (*gocloak.User, error) {
	user, err := u.UserRepository.UpdateUser(p, token)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (u *UserService) GetUsersByGroup(groupID string, token string) ([]*gocloak.User, error) {
	user, err := u.UserRepository.GetUsersByGroup(groupID, token)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (u *UserService) GetCurrentUser(token string) (*gocloak.UserInfo, error) {
	user, err := u.UserRepository.GetCurrentUser(token)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (u *UserService) GetAllUsers(search string, token string) ([]map[string]interface{}, error) {
	user, err := u.UserRepository.GetAllUsers(search, token)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (u *UserService) GetOneUser(ID string, token string) (map[string]interface{}, error) {
	user, err := u.UserRepository.GetOneUser(ID, token)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (u *UserService) SyncUserStores(token string) error {
	return u.UserRepository.SyncUserStores(token)
}
