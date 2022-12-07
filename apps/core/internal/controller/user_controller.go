package controller

import (
	"os"

	"github.com/Nerzal/gocloak/v12"
	"github.com/gin-gonic/gin"
	"github.com/tensorsystems/tensoremr/apps/core/internal/payload"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
	"github.com/tensorsystems/tensoremr/apps/core/internal/util"
)

type UserController struct {
	KeycloakClient *gocloak.GoCloak
	FhirService    service.FhirService
}

// CreateUser ...
func (u *UserController) CreateUser(c *gin.Context) {
	util.CheckAccessToken(c)

	// Bind JSON
	var payload payload.CreateUserPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		util.ReqError(c, 400, "Invalid input")
		return
	}

	// Check if passwords match
	if payload.Password != payload.ConfirmPassword {
		util.ReqError(c, 400, "Passwords do not match")
		return
	}

	// Check if password length is less than 6
	if len(payload.Password) < 6 {
		util.ReqError(c, 400, "Password is too short")
		return
	}

	// Login into keycloak
	keycloakService := LoginKeycloak(u.KeycloakClient, c.GetString("accessToken"))

	// Create user
	userService := service.UserService{KeycloakService: keycloakService, FhirService: u.FhirService}
	user, err := userService.CreateUser(payload)
	if err != nil {
		util.ReqError(c, 500, err.Error())
	}

	// Success
	c.JSON(200, user)
}

// UpdateUser ...
func (u *UserController) UpdateUser(c *gin.Context) {
	util.CheckAccessToken(c)

	// Bind JSON
	var payload payload.UpdateUserPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		util.ReqError(c, 400, "invalid input")
		return
	}

	// Login into keycloak
	keycloakService := LoginKeycloak(u.KeycloakClient, c.GetString("accessToken"))

	// Update user
	userService := service.UserService{KeycloakService: keycloakService, FhirService: u.FhirService}
	user, err := userService.UpdateUser(payload)
	if err != nil {
		util.ReqError(c, 500, err.Error())
		return
	}

	c.JSON(200, user)
}

// GetAllUsers ...
func (u *UserController) GetAllUsers(c *gin.Context) {
	util.CheckAccessToken(c)

	searchTerm := c.Query("search")

	// Login into Keycloak
	keycloakService := LoginKeycloak(u.KeycloakClient, c.GetString("accessToken"))

	// Get all users
	userService := service.UserService{KeycloakService: keycloakService, FhirService: u.FhirService}
	users, err := userService.GetAllUsers(searchTerm)
	if err != nil {
		util.ReqError(c, 500, err.Error())
		return
	}

	c.JSON(200, users)
}

// GetOneUser ...
func (u *UserController) GetOneUser(c *gin.Context) {
	util.CheckAccessToken(c)

	userId := c.Param("id")

	// Login into Keycloak
	keycloakService := LoginKeycloak(u.KeycloakClient, c.GetString("accessToken"))

	// Get one user
	userService := service.UserService{KeycloakService: keycloakService, FhirService: u.FhirService}
	user, err := userService.GetOneUser(userId)
	if err != nil {
		util.ReqError(c, 500, err.Error())
		return
	}

	c.JSON(200, user)
}

func LoginKeycloak(KeycloakClient *gocloak.GoCloak, accessToken string) service.KeycloakService {
	clientAppRealm := os.Getenv("KEYCLOAK_CLIENT_APP_REALM")
	return service.KeycloakService{Client: KeycloakClient, Token: accessToken, Realm: clientAppRealm}
}
