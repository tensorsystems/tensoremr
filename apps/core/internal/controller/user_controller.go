package controller

import (
	"encoding/json"

	"github.com/Nerzal/gocloak/v12"
	"github.com/gin-gonic/gin"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/service"
)

type UserController struct {
	KeycloakService service.KeycloakService
	FhirService     service.FhirService
}

type CreateUserPayload struct {
	AccountType     string `json:"accountType"`
	NamePrefix      string `json:"namePrefix"`
	GivenName       string `json:"givenName"`
	FamilyName      string `json:"familyName"`
	Email           string `json:"email"`
	ContactNumber   string `json:"contactNumber"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmPassword"`
}

func (u *UserController) CreateUser(c *gin.Context) {
	var payload CreateUserPayload

	// Bind JSON
	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(400, gin.H{
			"message": "invalid json",
		})
		c.Abort()
		return
	}

	// Validate passwords
	if payload.Password != payload.ConfirmPassword {
		c.JSON(400, gin.H{
			"message": "passwords do not match",
		})
		c.Abort()
		return
	}

	if len(payload.Password) < 6 {
		c.JSON(400, gin.H{
			"message": "password is too short",
		})
		c.Abort()
		return
	}

	// Create keycloak user
	keycloakUser := gocloak.User{
		Groups:    &[]string{payload.AccountType},
		FirstName: &payload.GivenName,
		LastName:  &payload.FamilyName,
		Email:     &payload.Email,
		Username:  &payload.Email,
		Attributes: &map[string][]string{
			"contact_number": {payload.ContactNumber},
		},
	}

	userId, err := u.KeycloakService.CreateUser(keycloakUser)
	if err != nil {
		c.JSON(500, gin.H{
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	phone := fhir.ContactPointSystemPhone
	email := fhir.ContactPointSystemEmail

	fhirResource := fhir.Practitioner{
		Id: &userId,
		Name: []fhir.HumanName{
			{
				Prefix: []string{payload.NamePrefix},
				Given:  []string{payload.GivenName},
				Family: &payload.FamilyName,
			},
		},
		Telecom: []fhir.ContactPoint{
			{
				System: &phone,
				Value:  &payload.ContactNumber,
			},
			{
				System: &email,
				Value:  &payload.Email,
			},
		},
	}

	b, err := json.Marshal(fhirResource)
	if err != nil {
		c.JSON(500, gin.H{
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	if err := u.FhirService.FhirRequest("Practitioner/"+userId, "PUT", b); err != nil {
		c.JSON(500, gin.H{
			"message": err.Error(),
		})
		c.Abort()
		return
	}

	c.JSON(200, map[string]interface{}{"userId": userId})

	return
}
