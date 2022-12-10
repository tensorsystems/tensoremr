package service

import (
	"encoding/json"
	"strings"

	"github.com/Nerzal/gocloak/v12"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/payload"
)

type UserService struct {
	KeycloakService KeycloakService
	FhirService     FhirService
}

func (u *UserService) CreateUser(p payload.CreateUserPayload) (*gocloak.User, error) {
	// Create keycloak user
	enabled := true
	keycloakUser := gocloak.User{
		Groups:    &[]string{p.AccountType},
		FirstName: &p.GivenName,
		LastName:  &p.FamilyName,
		Email:     &p.Email,
		Username:  &p.Email,
		Enabled:   &enabled,

		Attributes: &map[string][]string{
			"contact_number": {p.ContactNumber},
		},
	}

	userId, err := u.KeycloakService.CreateUser(keycloakUser)
	if err != nil {
		return nil, err
	}

	// Set temporary password
	if err := u.KeycloakService.SetPassword(userId, p.Password, true); err != nil {
		return nil, err
	}

	// Create Practitioner FHIR resource
	if err := createFHIRPractionerResource(u.FhirService, userId, p); err != nil {
		return nil, err
	}

	// Create PractitionerRole FHIR resource
	if err := createFHIRPractionerRoleResource(u.FhirService, userId, p.AccountType); err != nil {
		return nil, err
	}

	return &keycloakUser, nil
}

func (u *UserService) UpdateUser(p payload.UpdateUserPayload) (*gocloak.User, error) {
	// Bind payload to keycloak user
	keycloakUser := gocloak.User{
		ID:        &p.ID,
		Groups:    &[]string{p.AccountType},
		FirstName: &p.GivenName,
		LastName:  &p.FamilyName,
		Email:     &p.Email,
		Username:  &p.Email,
		Enabled:   &p.Enabled,
		Attributes: &map[string][]string{
			"contact_number": {p.ContactNumber},
		},
	}

	// Update keycloak user
	if err := u.KeycloakService.UpdateUser(keycloakUser); err != nil {
		return nil, err
	}

	// Update Practioner FHIR Resource
	if err := updateFHIRPractionerResource(u.FhirService, p); err != nil {
		return nil, err
	}

	return &keycloakUser, nil
}

func (u *UserService) GetAllUsers(search string) ([]map[string]interface{}, error) {
	// Get keycloak users
	keycloakUsers, err := u.KeycloakService.GetUsers(&search)
	if err != nil {
		return nil, err
	}

	// Get user roles from FHIR
	var userIds []string
	for _, user := range keycloakUsers {
		userIds = append(userIds, *user.ID)
	}

	practionerRolesByte,_, err := u.FhirService.FhirRequest("PractitionerRole?practitioner="+strings.Join(userIds, ","), "GET", nil, nil)
	if err != nil {
		return nil, err
	}

	practionerRolesFhir := make(map[string]interface{})
	if err := json.Unmarshal(practionerRolesByte, &practionerRolesFhir); err != nil {
		return nil, err
	}

	roles := make(map[string]string)
	if practionerRolesFhir["entry"] != nil {
		for _, e := range practionerRolesFhir["entry"].([]interface{}) {
			entry := e.(map[string]interface{})
			resource := entry["resource"].(map[string]interface{})
			codes := resource["code"].([]interface{})
			practioner := strings.Split(resource["practitioner"].(map[string]interface{})["reference"].(string), "/")

			if len(codes) > 0 {
				code := codes[0].(map[string]interface{})
				codings := code["coding"].([]interface{})

				if len(codings) > 0 {
					coding := codings[0].(map[string]interface{})

					roles[practioner[1]] = coding["display"].(string)
				}
			}
		}
	}

	var users []map[string]interface{}
	for _, keycloakUser := range keycloakUsers {
		users = append(users, map[string]interface{}{
			"id":            keycloakUser.ID,
			"username":      keycloakUser.Username,
			"enabled":       keycloakUser.Enabled,
			"emailVerified": keycloakUser.EmailVerified,
			"firstName":     keycloakUser.FirstName,
			"lastName":      keycloakUser.LastName,
			"email":         keycloakUser.Email,
			"attributes":    keycloakUser.Attributes,
			"role":          roles[*keycloakUser.ID],
		})
	}

	return users, nil
}

func (u *UserService) GetOneUser(ID string) (map[string]interface{}, error) {
	keycloakUser, err := u.KeycloakService.GetUser(ID)
	if err != nil {
		return nil, err
	}

	user := map[string]interface{}{
		"id":            keycloakUser.ID,
		"username":      keycloakUser.Username,
		"enabled":       keycloakUser.Enabled,
		"emailVerified": keycloakUser.EmailVerified,
		"firstName":     keycloakUser.FirstName,
		"lastName":      keycloakUser.LastName,
		"email":         keycloakUser.Email,
		"attributes":    keycloakUser.Attributes,
	}

	// Get user from FHIR
	practionerBytes,_, err := u.FhirService.FhirRequest("Practitioner/"+ID, "GET", nil, nil)
	if err != nil {
		return nil, err
	}

	practionerFhir := make(map[string]interface{})
	if err := json.Unmarshal(practionerBytes, &practionerFhir); err != nil {
		return nil, err
	}

	names := practionerFhir["name"].([]interface{})
	if len(names) > 0 {
		prefixes := names[0].(map[string]interface{})["prefix"].([]interface{})
		if len(prefixes) > 0 {
			user["namePrefix"] = prefixes[0].(string)
		}
	}

	// Get user roles from FHIR
	practionerRolesByte,_, err := u.FhirService.FhirRequest("PractitionerRole?practitioner="+ID, "GET", nil, nil)
	if err != nil {
		return nil, err
	}

	practionerRolesFhir := make(map[string]interface{})
	if err := json.Unmarshal(practionerRolesByte, &practionerRolesFhir); err != nil {
		return nil, err
	}

	if practionerRolesFhir["entry"] != nil {
		for _, e := range practionerRolesFhir["entry"].([]interface{}) {
			entry := e.(map[string]interface{})
			resource := entry["resource"].(map[string]interface{})
			codes := resource["code"].([]interface{})

			if len(codes) > 0 {
				code := codes[0].(map[string]interface{})
				codings := code["coding"].([]interface{})

				if len(codings) > 0 {
					coding := codings[0].(map[string]interface{})

					user["role"] = coding["display"].(string)
				}
			}
		}
	}

	return user, nil
}

func createFHIRPractionerResource(fhirService FhirService, userID string, payload payload.CreateUserPayload) error {
	phone := fhir.ContactPointSystemPhone
	email := fhir.ContactPointSystemEmail
	photo := []fhir.Attachment{}

	if payload.ProfilePicture != nil {
		profilePicTitle := "profile-pic"
		photo = append(photo, fhir.Attachment{
			Title: &profilePicTitle,
			Data:  payload.ProfilePicture,
		})
	}

	if payload.Signature != nil {
		signaturePicTitle := "signature"
		photo = append(photo, fhir.Attachment{
			Title: &signaturePicTitle,
			Data:  payload.Signature,
		})
	}

	b, err := fhir.Practitioner{
		Id: &userID,
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
		Photo: photo,
	}.MarshalJSON()

	if err != nil {
		return err
	}

	if _,_, err := fhirService.FhirRequest("Practitioner/"+userID, "PUT", b, nil); err != nil {
		return err
	}

	return nil
}

func createFHIRPractionerRoleResource(fhirService FhirService, userID string, role string) error {
	pracitionerType := "Practitioner"
	practionerRef := "Practitioner/" + userID

	b, err := fhir.PractitionerRole{
		Practitioner: &fhir.Reference{
			Reference: &practionerRef,
			Type:      &pracitionerType,
		},
		Code: []fhir.CodeableConcept{
			{

				Coding: []fhir.Coding{
					{
						Display: &role,
					},
				},
				Text: &role,
			},
		},
	}.MarshalJSON()

	if err != nil {
		return err
	}

	if _,_, err := fhirService.FhirRequest("PractitionerRole", "POST", b, nil); err != nil {
		return err
	}

	return nil
}

func updateFHIRPractionerResource(fhirService FhirService, payload payload.UpdateUserPayload) error {
	phone := fhir.ContactPointSystemPhone
	email := fhir.ContactPointSystemEmail
	photo := []fhir.Attachment{}

	practionerBytes, err := fhir.Practitioner{
		Id: &payload.ID,
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
		Photo: photo,
	}.MarshalJSON()

	if err != nil {
		return err
	}

	pracitionerType := "Practitioner"
	practionerRef := "Practitioner/" + payload.ID

	practitionerRoleBytes, err := fhir.PractitionerRole{
		Practitioner: &fhir.Reference{
			Reference: &practionerRef,
			Type:      &pracitionerType,
		},
		Code: []fhir.CodeableConcept{
			{

				Coding: []fhir.Coding{
					{
						Display: &payload.AccountType,
					},
				},
				Text: &payload.AccountType,
			},
		},
	}.MarshalJSON()

	if err != nil {
		return err
	}

	b, err := fhir.Bundle{
		Type: fhir.BundleTypeTransaction,
		Entry: []fhir.BundleEntry{
			{
				Id:       &payload.ID,
				Resource: practionerBytes,
				Request: &fhir.BundleEntryRequest{
					Method: fhir.HTTPVerbPUT,
					Url:    "Practitioner/" + payload.ID,
				},
			},
			{
				Resource: practitionerRoleBytes,
				Request: &fhir.BundleEntryRequest{
					Method: fhir.HTTPVerbPUT,
					Url:    "PractitionerRole?practitioner=" + payload.ID,
				},
			},
		},
	}.MarshalJSON()

	if err != nil {
		return err
	}

	if _,_, err := fhirService.FhirRequest("", "POST", b, nil); err != nil {
		return err
	}

	return nil
}
