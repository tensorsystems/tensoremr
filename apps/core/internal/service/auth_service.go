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

	"github.com/supertokens/supertokens-golang/recipe/thirdpartyemailpassword"
	"github.com/supertokens/supertokens-golang/recipe/thirdpartyemailpassword/tpepmodels"
	"github.com/supertokens/supertokens-golang/recipe/usermetadata"
)

type AuthService struct {
}

func NewAuthService() AuthService {
	return AuthService{}
}

func (a *AuthService) GetUser(userID string) (*tpepmodels.User, error) {
	return thirdpartyemailpassword.GetUserById(userID)
}

func (a *AuthService) CreateUser(d map[string]interface{}) (*tpepmodels.User, error) {
	resp, err := thirdpartyemailpassword.EmailPasswordSignUp(d["email"].(string), d["password"].(string))

	if err != nil {
		return nil, err
	}

	if resp.EmailAlreadyExistsError != nil {
		return nil, errors.New("email already exits")
	}

	if resp.OK == nil {
		return nil, errors.New("something went wrong")
	}

	return &resp.OK.User, nil
}

func (a *AuthService) UpdateUser(userID string, d map[string]interface{}) error {
	email := d["email"].(string)

	resp, err := thirdpartyemailpassword.UpdateEmailOrPassword(userID, &email, nil)

	if err != nil {
		return err
	}

	if resp.OK == nil {
		return errors.New("something went wrong")
	}

	if resp.UnknownUserIdError != nil {
		return errors.New("user id unknown")
	}

	return nil
}

func (a *AuthService) UpdateUserMetadata(userId string, metadata map[string]interface{}) (map[string]interface{}, error) {
	return usermetadata.UpdateUserMetadata(userId, metadata)
}
