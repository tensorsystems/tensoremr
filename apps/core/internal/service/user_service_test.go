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

package service_test

import (
	"context"
	"testing"

	"github.com/Nerzal/gocloak/v12"
	"github.com/tensorsystems/tensoremr/apps/core/internal/keycloak"
)

var userKeycloakService keycloak.KeycloakService
var payloads []map[string]interface{}
var usersToken string

func setupUserTest(t *testing.T) func(t *testing.T) {
	client := gocloak.NewClient("http://localhost:8080")
	clientId := "core-app"
	clientSecret := "hMn2XimtjjS5NDGTPXVMii5dHDePdODT"
	clientMasterRealm := "master"

	token, err := client.LoginClient(context.Background(), clientId, clientSecret, clientMasterRealm)
	if err != nil {
		t.Fatal(err)
	}

	usersToken = token.AccessToken

	userKeycloakService = keycloak.KeycloakService{
		Client: client,
		Realm:  "TensorEMR",
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

func TestCreateOneUser(t *testing.T) {
	// s := setupUserTest(t)
	// defer s(t)

	// fhirService := fhir_rest.FhirService{
	// 	Client:      http.Client{},
	// 	FhirBaseURL: "http://localhost:8081" + "/fhir-server/api/v4/",
	// }

	// payload := payload.CreateUserPayload{
	// 	Role:            payloads[0]["role"].(string),
	// 	NamePrefix:      payloads[0]["namePrefix"].(string),
	// 	GivenName:       payloads[0]["givenName"].(string),
	// 	FamilyName:      payloads[0]["familyName"].(string),
	// 	Email:           payloads[0]["email"].(string),
	// 	ContactNumber:   payloads[0]["contactNumber"].(string),
	// 	Password:        payloads[0]["password"].(string),
	// 	ConfirmPassword: payloads[0]["password"].(string),
	// }

	// userRepository := repository.UserRepository{FhirService: fhirService, KeycloakService: userKeycloakService}
	// userService := service.UserService{UserRepository: userRepository}
	// user, _, err := userService.CreateOneUser(payload)
	// assert.NoError(t, err)

	// t.Cleanup(func() {
	// 	if user != nil {
	// 		if err := userKeycloakService.DeleteUser(user.Id, usersToken); err != nil {
	// 			t.Error(err)
	// 		}

	// 		_, _, err := fhirService.DeleteResource("Practitioner", user.Id)
	// 		if err != nil {
	// 			t.Fatal(err)
	// 		}
	// 	}
	// })
}

func TestGetOneUser(t *testing.T) {
	// s := setupUserTest(t)
	// defer s(t)

	// fhirService := fhir_rest.FhirService{
	// 	Client:      http.Client{},
	// 	FhirBaseURL: "http://localhost:8081" + "/fhir-server/api/v4/",
	// }

	// payload := payload.CreateUserPayload{
	// 	Role:            payloads[0]["role"].(string),
	// 	NamePrefix:      payloads[0]["namePrefix"].(string),
	// 	GivenName:       payloads[0]["givenName"].(string),
	// 	FamilyName:      payloads[0]["familyName"].(string),
	// 	Email:           payloads[0]["email"].(string),
	// 	ContactNumber:   payloads[0]["contactNumber"].(string),
	// 	Password:        payloads[0]["password"].(string),
	// 	ConfirmPassword: payloads[0]["password"].(string),
	// }

	// userRepository := repository.UserRepository{FhirService: fhirService, KeycloakService: userKeycloakService}
	// userService := service.UserService{UserRepository: userRepository}

	// // Create user first
	// user, _, err := userService.CreateOneUser(payload)
	// assert.NoError(t, err)

	// t.Run("successfully gets the created user", func(t *testing.T) {
	// 	_, _, err = userService.GetOneUser(user.Id)
	// 	assert.NoError(t, err)
	// })

	// t.Run("creates FHIR resource if not found", func(t *testing.T) {
	// 	_, statusCode, err := fhirService.DeleteResource("Practitioner", user.Id)
	// 	if err != nil {
	// 		t.Fatal(err)
	// 	}

	// 	if statusCode != 200 {
	// 		t.Error(err)
	// 	}

	// 	_, _, err = userService.GetOneUser(user.Id)
	// 	assert.NoError(t, err)
	// })

	// t.Cleanup(func() {
	// 	if user != nil {
	// 		if err := userKeycloakService.DeleteUser(user.Id, usersToken); err != nil {
	// 			t.Error(err)
	// 		}

	// 		_, _, err := fhirService.DeleteResource("Practitioner", user.Id)
	// 		if err != nil {
	// 			t.Fatal(err)
	// 		}
	// 	}
	// })
}

func TestSyncUserStores(t *testing.T) {
	// s := setupUserTest(t)
	// defer s(t)

	// fhirService := fhir_rest.FhirService{
	// 	Client:      http.Client{},
	// 	FhirBaseURL: "http://localhost:8081" + "/fhir-server/api/v4/",
	// }

	// payload := payload.CreateUserPayload{
	// 	Role:            payloads[0]["role"].(string),
	// 	NamePrefix:      payloads[0]["namePrefix"].(string),
	// 	GivenName:       payloads[0]["givenName"].(string),
	// 	FamilyName:      payloads[0]["familyName"].(string),
	// 	Email:           payloads[0]["email"].(string),
	// 	ContactNumber:   payloads[0]["contactNumber"].(string),
	// 	Password:        payloads[0]["password"].(string),
	// 	ConfirmPassword: payloads[0]["password"].(string),
	// }

	// userRepository := repository.UserRepository{FhirService: fhirService, KeycloakService: userKeycloakService}
	// userService := service.UserService{UserRepository: userRepository}

	// // Create user first
	// user, _, err := userService.CreateOneUser(payload)
	// assert.NoError(t, err)

	// err = userService.SyncUserStores(usersToken)
	// assert.NoError(t, err)

	// t.Cleanup(func() {
	// 	if user != nil {
	// 		if err := userKeycloakService.DeleteUser(user.Id, usersToken); err != nil {
	// 			t.Error(err)
	// 		}

	// 		_, _, err := fhirService.DeleteResource("Practitioner", user.Id)
	// 		if err != nil {
	// 			t.Fatal(err)
	// 		}
	// 	}
	// })
}

func TestGetAllUsers(t *testing.T) {
	// s := setupUserTest(t)
	// defer s(t)

	// fhirService := fhir_rest.FhirService{
	// 	Client:      http.Client{},
	// 	FhirBaseURL: "http://localhost:8081" + "/fhir-server/api/v4/",
	// }

	// payload := payload.CreateUserPayload{
	// 	Role:            payloads[0]["role"].(string),
	// 	NamePrefix:      payloads[0]["namePrefix"].(string),
	// 	GivenName:       payloads[0]["givenName"].(string),
	// 	FamilyName:      payloads[0]["familyName"].(string),
	// 	Email:           payloads[0]["email"].(string),
	// 	ContactNumber:   payloads[0]["contactNumber"].(string),
	// 	Password:        payloads[0]["password"].(string),
	// 	ConfirmPassword: payloads[0]["password"].(string),
	// }

	// userRepository := repository.UserRepository{FhirService: fhirService, KeycloakService: userKeycloakService}
	// userService := service.UserService{UserRepository: userRepository}

	// // Create user first
	// user, _, err := userService.CreateOneUser(payload)
	// assert.NoError(t, err)

	// users, _, err := userService.GetAllUsers()
	// assert.NoError(t, err)
	// assert.NotZero(t, users)

	// t.Cleanup(func() {
	// 	if user != nil {
	// 		if err := userKeycloakService.DeleteUser(user.Id, usersToken); err != nil {
	// 			t.Error(err)
	// 		}

	// 		_, _, err := fhirService.DeleteResource("Practitioner", user.Id)
	// 		if err != nil {
	// 			t.Fatal(err)
	// 		}
	// 	}
	// })
}
