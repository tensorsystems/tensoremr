package service

import (
	"context"

	"github.com/Nerzal/gocloak/v12"
)

type KeycloakService struct {
	Client *gocloak.GoCloak
	Token string
	Realm string
}

func (k *KeycloakService) CreateUser(user gocloak.User) (string, error) {
	ctx := context.Background()

	return k.Client.CreateUser(ctx, k.Token, k.Realm, user)
}
