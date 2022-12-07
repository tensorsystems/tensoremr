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

func (k *KeycloakService) GetUser(ID string) (*gocloak.User, error) {
	return k.Client.GetUserByID(context.Background(), k.Token, k.Realm, ID)
}