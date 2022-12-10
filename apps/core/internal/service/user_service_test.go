package service_test

import (
	"context"
	"testing"

	"github.com/Nerzal/gocloak/v12"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

var userKeycloakService service.KeycloakService
var payloads []map[string]interface{}

func setupUserTest(t *testing.T) func(t *testing.T) {
	client := gocloak.NewClient("http://localhost:8080")
	clientId := "core-app"
	clientSecret := "hMn2XimtjjS5NDGTPXVMii5dHDePdODT"
	clientMasterRealm := "master"

	token, err := client.LoginClient(context.Background(), clientId, clientSecret, clientMasterRealm)
	if err != nil {
		t.Fatal(err)
	}

	keycloakService = service.KeycloakService{
		Client: client,
		Realm:  "TensorEMR",
		Token:  token.AccessToken,
	}

	payloads = []map[string]interface{}{
		{
			"accountType":   "physician",
			"namePrefix":    "Dr.",
			"givenName":     "Test",
			"familyName":    "User 1",
			"email":         "test1@gmail.com",
			"contactNumber": "0911000000",
			"password":      "password",
		},
		{
			"accountType":   "physician",
			"namePrefix":    "Dr.",
			"givenName":     "Test",
			"familyName":    "User 2",
			"email":         "test2@gmail.com",
			"contactNumber": "0911000000",
			"password":      "password",
		},
	}

	return func(t *testing.T) {
		payloads = []map[string]interface{}{}
	}
}

func TestGetOneUser(t *testing.T) {

}
