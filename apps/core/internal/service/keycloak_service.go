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
	Token  string
	Realm  string
}

func (k *KeycloakService) CreateUser(user gocloak.User) (string, error) {
	return k.Client.CreateUser(context.Background(), k.Token, k.Realm, user)
}

func (k *KeycloakService) UpdateUser(user gocloak.User) error {
	return k.Client.UpdateUser(context.Background(), k.Token, k.Realm, user)
}

func (k *KeycloakService) GetUsers(search *string) ([]*gocloak.User, error) {
	return k.Client.GetUsers(context.Background(), k.Token, k.Realm, gocloak.GetUsersParams{
		Search: search,
	})
}

func (k *KeycloakService) GetUserGroups(ID string) ([]*gocloak.Group, error) {
	return k.Client.GetUserGroups(context.Background(), k.Token, k.Realm, ID, gocloak.GetGroupsParams{})
}

func (k *KeycloakService) GetUser(ID string) (*gocloak.User, error) {
	return k.Client.GetUserByID(context.Background(), k.Token, k.Realm, ID)
}

func (k *KeycloakService) SetPassword(userID, password string, temporary bool) error {
	return k.Client.SetPassword(context.Background(), k.Token, userID, k.Realm, password, temporary)
}

func (k *KeycloakService) DeleteUser(ID string) (error) {
	return k.Client.DeleteUser(context.Background(), k.Token, k.Realm, ID)
}