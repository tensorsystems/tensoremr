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
	"context"

	"github.com/Nerzal/gocloak/v12"
)

type KeycloakService struct {
	Client *gocloak.GoCloak
	Realm  string
}

func (k *KeycloakService) CreateUser(user gocloak.User, token string) (string, error) {
	return k.Client.CreateUser(context.Background(), token, k.Realm, user)
}

func (k *KeycloakService) UpdateUser(user gocloak.User, token string) error {
	return k.Client.UpdateUser(context.Background(), token, k.Realm, user)
}

func (k *KeycloakService) GetUsers(search *string, token string) ([]*gocloak.User, error) {
	return k.Client.GetUsers(context.Background(), token, k.Realm, gocloak.GetUsersParams{
		Search: search,
	})
}

func (k *KeycloakService) GetUserGroups(ID string, token string) ([]*gocloak.Group, error) {
	return k.Client.GetUserGroups(context.Background(), token, k.Realm, ID, gocloak.GetGroupsParams{})
}

func (k *KeycloakService) GetCurrentUser(token string) (*gocloak.UserInfo, error) {
	return k.Client.GetUserInfo(context.Background(), token, k.Realm)
}

func (k *KeycloakService) GetUsersByGroup(groupID string, token string) ([]*gocloak.User, error) {
	return k.Client.GetGroupMembers(context.Background(), token, k.Realm, groupID, gocloak.GetGroupsParams{})
}

func (k *KeycloakService) GetGroupByPath(path string, token string) (*gocloak.Group, error) {
	return k.Client.GetGroupByPath(context.Background(), token, k.Realm, path)
}

func (k *KeycloakService) GetUser(ID string, token string) (*gocloak.User, error) {
	return k.Client.GetUserByID(context.Background(), token, k.Realm, ID)
}

func (k *KeycloakService) SetPassword(userID, password string, temporary bool, token string) error {
	return k.Client.SetPassword(context.Background(), token, userID, k.Realm, password, temporary)
}

func (k *KeycloakService) DeleteUser(ID string, token string) (error) {
	return k.Client.DeleteUser(context.Background(), token, k.Realm, ID)
}