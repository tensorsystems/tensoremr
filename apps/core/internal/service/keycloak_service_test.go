package service_test

import (
	"context"
	"testing"

	"github.com/Nerzal/gocloak/v12"
	"github.com/stretchr/testify/assert"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

var keycloakService service.KeycloakService
var users []map[string]interface{}

func setupKeycloakTest(t *testing.T) func(t *testing.T) {
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

	users = []map[string]interface{}{
		{
			"firstName":     "Test",
			"lastName":      "User 1",
			"email":         "test1@gmail.com",
			"contactNumber": "0911000000",
			"verified":      true,
		},
		{
			"firstName":     "Test",
			"lastName":      "User 2",
			"email":         "test2@gmail.com",
			"contactNumber": "0912000000",
			"verified":      true,
		},
	}

	return func(t *testing.T) {
		users = []map[string]interface{}{}
	}
}

func TestCreateUser(t *testing.T) {
	s := setupKeycloakTest(t)
	defer s(t)

	firstName := users[0]["firstName"].(string)
	lastName := users[0]["lastName"].(string)
	email := users[0]["email"].(string)
	verified := users[0]["verified"].(bool)
	contactNumber := users[0]["contactNumber"].(string)

	user := gocloak.User{
		FirstName:     &firstName,
		LastName:      &lastName,
		Email:         &email,
		EmailVerified: &verified,
		Attributes: &map[string][]string{
			"contact_number": {contactNumber},
		},
	}

	var uId string

	t.Run("creates user", func(t *testing.T) {
		userId, err := keycloakService.CreateUser(user)
		if err != nil {
			t.Error(err)
		}
		uId = userId

		assert.NotEmpty(t, userId)
	})

	t.Run("fails when user has duplicate email", func(t *testing.T) {
		_, err := keycloakService.CreateUser(user)
		assert.Error(t, err)
	})

	t.Cleanup(func() {
		if err := keycloakService.DeleteUser(uId); err != nil {
			t.Error(err)
		}
	})
}

func TestUpdateUser(t *testing.T) {
	s := setupKeycloakTest(t)
	defer s(t)

	firstName := users[0]["firstName"].(string)
	lastName := users[0]["lastName"].(string)
	email := users[0]["email"].(string)
	verified := users[0]["verified"].(bool)
	contactNumber := users[0]["contactNumber"].(string)

	user := gocloak.User{
		FirstName:     &firstName,
		LastName:      &lastName,
		Email:         &email,
		EmailVerified: &verified,
		Attributes: &map[string][]string{
			"contact_number": {contactNumber},
		},
	}

	userId, err := keycloakService.CreateUser(user)
	if err != nil {
		t.Error(err)
	}

	assert.NotEmpty(t, userId)

	updatedFirstName := "UpdateTest"
	user.ID = &userId
	user.FirstName = &updatedFirstName
	if err := keycloakService.UpdateUser(user); err != nil {
		t.Error(err)
	}

	updatedUser, err := keycloakService.GetUser(userId)
	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, updatedFirstName, *updatedUser.FirstName)

	t.Cleanup(func() {
		if err := keycloakService.DeleteUser(userId); err != nil {
			t.Error(err)
		}
	})
}

func TestGetUser(t *testing.T) {
	s := setupKeycloakTest(t)
	defer s(t)

	firstName := users[0]["firstName"].(string)
	lastName := users[0]["lastName"].(string)
	email := users[0]["email"].(string)
	verified := users[0]["verified"].(bool)
	contactNumber := users[0]["contactNumber"].(string)

	user := gocloak.User{
		FirstName:     &firstName,
		LastName:      &lastName,
		Email:         &email,
		EmailVerified: &verified,
		Attributes: &map[string][]string{
			"contact_number": {contactNumber},
		},
	}

	userId, err := keycloakService.CreateUser(user)
	if err != nil {
		t.Fatal(err)
	}

	u, err := keycloakService.GetUser(userId)
	if err != nil {
		t.Error(err)
	}

	assert.NotEmpty(t, *u.ID)

	t.Cleanup(func() {
		if err := keycloakService.DeleteUser(userId); err != nil {
			t.Fatal(err)
		}
	})
}

func TestGetUsers(t *testing.T) {
	s := setupKeycloakTest(t)
	defer s(t)

	firstName := users[0]["firstName"].(string)
	lastName := users[0]["lastName"].(string)
	email := users[0]["email"].(string)
	verified := users[0]["verified"].(bool)
	contactNumber := users[0]["contactNumber"].(string)

	user := gocloak.User{
		FirstName:     &firstName,
		LastName:      &lastName,
		Email:         &email,
		EmailVerified: &verified,
		Attributes: &map[string][]string{
			"contact_number": {contactNumber},
		},
	}

	userId, err := keycloakService.CreateUser(user)
	if err != nil {
		t.Fatal(err)
	}

	search := "test1@gmail.com"
	users, err := keycloakService.GetUsers(&search)
	if err != nil {
		t.Error(err)
	}

	assert.Equal(t, 1, len(users))

	t.Cleanup(func() {
		if err := keycloakService.DeleteUser(userId); err != nil {
			t.Fatal(err)
		}
	})
}

func TestDeleteUser(t *testing.T) {
	s := setupKeycloakTest(t)
	defer s(t)

	firstName := users[0]["firstName"].(string)
	lastName := users[0]["lastName"].(string)
	email := users[0]["email"].(string)
	verified := users[0]["verified"].(bool)
	contactNumber := users[0]["contactNumber"].(string)

	user := gocloak.User{
		FirstName:     &firstName,
		LastName:      &lastName,
		Email:         &email,
		EmailVerified: &verified,
		Attributes: &map[string][]string{
			"contact_number": {contactNumber},
		},
	}

	userId, err := keycloakService.CreateUser(user)
	if err != nil {
		t.Error(err)
	}

	assert.NotEmpty(t, userId)

	if err := keycloakService.DeleteUser(userId); err != nil {
		t.Error(err)
	}
}

func TestSetPassword(t *testing.T) {
	s := setupKeycloakTest(t)
	defer s(t)

	firstName := users[0]["firstName"].(string)
	lastName := users[0]["lastName"].(string)
	email := users[0]["email"].(string)
	verified := users[0]["verified"].(bool)
	contactNumber := users[0]["contactNumber"].(string)

	user := gocloak.User{
		FirstName:     &firstName,
		LastName:      &lastName,
		Email:         &email,
		EmailVerified: &verified,
		Attributes: &map[string][]string{
			"contact_number": {contactNumber},
		},
	}

	userId, err := keycloakService.CreateUser(user)
	if err != nil {
		t.Error(err)
	}

	assert.NotEmpty(t, userId)

	password := "password"
	if err := keycloakService.SetPassword(userId, password, true); err != nil {
		t.Error(err)
	}

	t.Cleanup(func() {
		if err := keycloakService.DeleteUser(userId); err != nil {
			t.Fatal(err)
		}
	})
}
