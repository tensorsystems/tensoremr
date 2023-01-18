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

package repository

import (
	"encoding/json"
	"errors"
	"strings"

	"github.com/Nerzal/gocloak/v12"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	fhir_rest "github.com/tensorsystems/tensoremr/apps/core/internal/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/keycloak"
	"github.com/tensorsystems/tensoremr/apps/core/internal/payload"
)

type UserRepository struct {
	KeycloakService keycloak.KeycloakService
	FhirService     fhir_rest.FhirService
}

func (u *UserRepository) CreateOneUser(p payload.CreateUserPayload, token string) (*gocloak.User, error) {
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

	userId, err := u.KeycloakService.CreateUser(keycloakUser, token)
	if err != nil {
		return nil, err
	}

	keycloakUser.ID = &userId

	// Set temporary password
	if err := u.KeycloakService.SetPassword(userId, p.Password, true, token); err != nil {
		return nil, err
	}

	phone := fhir.ContactPointSystemPhone
	email := fhir.ContactPointSystemEmail
	photo := []fhir.Attachment{}

	if p.ProfilePicture != nil {
		profilePicTitle := "profile-pic"
		photo = append(photo, fhir.Attachment{
			Title: &profilePicTitle,
			Data:  p.ProfilePicture,
		})
	}

	if p.Signature != nil {
		signaturePicTitle := "signature"
		photo = append(photo, fhir.Attachment{
			Title: &signaturePicTitle,
			Data:  p.Signature,
		})
	}

	practitionerBytes, err := fhir.Practitioner{
		Id: &userId,
		Name: []fhir.HumanName{
			{
				Prefix: []string{p.NamePrefix},
				Given:  []string{p.GivenName},
				Family: &p.FamilyName,
			},
		},
		Telecom: []fhir.ContactPoint{
			{
				System: &phone,
				Value:  &p.ContactNumber,
			},
			{
				System: &email,
				Value:  &p.Email,
			},
		},
		Photo: photo,
	}.MarshalJSON()

	if err != nil {
		return nil, err
	}

	pracitionerType := "Practitioner"
	practionerRef := "Practitioner/" + userId

	practitionerRoleBytes, err := fhir.PractitionerRole{
		Practitioner: &fhir.Reference{
			Reference: &practionerRef,
			Type:      &pracitionerType,
		},
		Code: []fhir.CodeableConcept{
			{

				Coding: []fhir.Coding{
					{
						Display: &p.AccountType,
					},
				},
				Text: &p.AccountType,
			},
		},
	}.MarshalJSON()

	bundle := fhir.Bundle{
		Type: fhir.BundleTypeTransaction,
		Entry: []fhir.BundleEntry{
			{
				Id:       &userId,
				Resource: practitionerBytes,
				Request: &fhir.BundleEntryRequest{
					Method: fhir.HTTPVerbPUT,
					Url:    "Practitioner/" + userId,
				},
			},
			{
				Resource: practitionerRoleBytes,
				Request: &fhir.BundleEntryRequest{
					Method: fhir.HTTPVerbPUT,
					Url:    "PractitionerRole?practitioner=" + userId,
				},
			},
		},
	}

	body, statusCode, err := u.FhirService.SaveBundle(bundle, nil)
	if err != nil {
		return nil, err
	}

	if statusCode != 201 && statusCode != 200 {
		return nil, errors.New(string(body))
	}

	return &keycloakUser, nil
}

func (u *UserRepository) UpdateUser(p payload.UpdateUserPayload, token string) (*gocloak.User, error) {
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
	if err := u.KeycloakService.UpdateUser(keycloakUser, token); err != nil {
		return nil, err
	}

	phone := fhir.ContactPointSystemPhone
	email := fhir.ContactPointSystemEmail
	photo := []fhir.Attachment{}

	practionerBytes, err := fhir.Practitioner{
		Id: &p.ID,
		Name: []fhir.HumanName{
			{
				Prefix: []string{p.NamePrefix},
				Given:  []string{p.GivenName},
				Family: &p.FamilyName,
			},
		},
		Telecom: []fhir.ContactPoint{
			{
				System: &phone,
				Value:  &p.ContactNumber,
			},
			{
				System: &email,
				Value:  &p.Email,
			},
		},
		Photo: photo,
	}.MarshalJSON()

	if err != nil {
		return nil, err
	}

	pracitionerType := "Practitioner"
	practionerRef := "Practitioner/" + p.ID

	practitionerRoleBytes, err := fhir.PractitionerRole{
		Practitioner: &fhir.Reference{
			Reference: &practionerRef,
			Type:      &pracitionerType,
		},
		Code: []fhir.CodeableConcept{
			{

				Coding: []fhir.Coding{
					{
						Display: &p.AccountType,
					},
				},
				Text: &p.AccountType,
			},
		},
	}.MarshalJSON()

	if err != nil {
		return nil, err
	}

	bundle := fhir.Bundle{
		Type: fhir.BundleTypeTransaction,
		Entry: []fhir.BundleEntry{
			{
				Id:       &p.ID,
				Resource: practionerBytes,
				Request: &fhir.BundleEntryRequest{
					Method: fhir.HTTPVerbPUT,
					Url:    "Practitioner/" + p.ID,
				},
			},
			{
				Resource: practitionerRoleBytes,
				Request: &fhir.BundleEntryRequest{
					Method: fhir.HTTPVerbPUT,
					Url:    "PractitionerRole?practitioner=" + p.ID,
				},
			},
		},
	}

	body, statusCode, err := u.FhirService.SaveBundle(bundle, nil)
	if err != nil {
		return nil, err
	}

	if statusCode != 200 {
		return nil, errors.New(string(body))
	}

	return &keycloakUser, nil
}

func (u *UserRepository) GetUsersByGroup(groupID string, token string) ([]*gocloak.User, error) {
	users, err := u.KeycloakService.GetUsersByGroup(groupID, token)
	if err != nil {
		return nil, err
	}

	return users, nil
}

func (u *UserRepository) GetCurrentUser(token string) (*gocloak.UserInfo, error) {
	user, err := u.KeycloakService.GetCurrentUser(token)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (u *UserRepository) GetAllUsers(search string, token string) ([]map[string]interface{}, error) {
	// if err := u.SyncUserStores(); err != nil {
	// 	return nil, err
	// }

	// Get keycloak users
	keycloakUsers, err := u.KeycloakService.GetUsers(&search, token)
	if err != nil {
		return nil, err
	}

	// Get user roles from FHIR
	var userIds []string
	for _, user := range keycloakUsers {
		userIds = append(userIds, *user.ID)
	}

	practionerRolesByte, _, err := u.FhirService.FhirRequest("PractitionerRole?practitioner="+strings.Join(userIds, ","), "GET", nil, nil)
	if err != nil {
		return nil, err
	}

	practionerRolesFhir := make(map[string]interface{})
	if err := json.Unmarshal(practionerRolesByte, &practionerRolesFhir); err != nil {
		return nil, err
	}

	roles := make(map[string]interface{})
	if practionerRolesFhir["entry"] != nil {
		for _, e := range practionerRolesFhir["entry"].([]interface{}) {
			entry := e.(map[string]interface{})
			resource := entry["resource"].(map[string]interface{})
			codes := resource["code"].([]interface{})
			practioner := strings.Split(resource["practitioner"].(map[string]interface{})["reference"].(string), "/")

			if len(codes) > 0 {
				code := codes[0].(map[string]interface{})
				codings := code["coding"].([]interface{})

				r := []string{}
				for _, code := range codings {
					c := code.(map[string]interface{})["display"].(string)
					r = append(r, c)
				}

				roles[practioner[1]] = r
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
			"roles":         roles[*keycloakUser.ID],
		})
	}

	return users, nil
}

func (u *UserRepository) GetOneUser(ID string, token string) (map[string]interface{}, error) {
	keycloakUser, err := u.KeycloakService.GetUser(ID, token)
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

	returnPref := "return=representation"
	practitionerBody, statusCode, err := u.FhirService.GetOnePractitioner(ID, &returnPref)
	if err != nil {
		return nil, err
	}

	if statusCode == 404 || statusCode == 410 {
		email := fhir.ContactPointSystemEmail
		photo := []fhir.Attachment{}

		practitionerBytes, err := fhir.Practitioner{
			Id: keycloakUser.ID,
			Name: []fhir.HumanName{
				{
					Given:  []string{*keycloakUser.FirstName},
					Family: keycloakUser.LastName,
				},
			},
			Telecom: []fhir.ContactPoint{
				{
					System: &email,
					Value:  keycloakUser.Email,
				},
			},
			Photo: photo,
		}.MarshalJSON()

		if err != nil {
			return nil, err
		}

		groups, err := u.KeycloakService.GetUserGroups(*keycloakUser.ID, token)
		roles := []fhir.Coding{}
		for _, group := range groups {
			if group.Name != nil {
				roles = append(roles, fhir.Coding{Display: group.Name})
			}
		}

		pracitionerType := "Practitioner"
		practionerRef := "Practitioner/" + *keycloakUser.ID

		practitionerRoleBytes, err := fhir.PractitionerRole{
			Practitioner: &fhir.Reference{
				Reference: &practionerRef,
				Type:      &pracitionerType,
			},
			Code: []fhir.CodeableConcept{
				{

					Coding: roles,
				},
			},
		}.MarshalJSON()

		bundle := fhir.Bundle{
			Type: fhir.BundleTypeTransaction,
			Entry: []fhir.BundleEntry{
				{
					Id:       keycloakUser.ID,
					Resource: practitionerBytes,
					Request: &fhir.BundleEntryRequest{
						Method: fhir.HTTPVerbPUT,
						Url:    "Practitioner/" + *keycloakUser.ID,
					},
				},
				{
					Resource: practitionerRoleBytes,
					Request: &fhir.BundleEntryRequest{
						Method: fhir.HTTPVerbPUT,
						Url:    "PractitionerRole?practitioner=" + *keycloakUser.ID,
					},
				},
			},
		}

		body, statusCode, err := u.FhirService.SaveBundle(bundle, nil)
		if err != nil {
			return nil, err
		}

		if statusCode != 201 && statusCode != 200 {
			return nil, errors.New(string(body))
		}
	}

	practitionerBody, statusCode, err = u.FhirService.GetOnePractitioner(ID, &returnPref)
	if err != nil {
		return nil, err
	}

	practionerFhir := make(map[string]interface{})
	if err := json.Unmarshal(practitionerBody, &practionerFhir); err != nil {
		return nil, err
	}

	names := practionerFhir["name"].([]interface{})
	if len(names) > 0 {
		if names[0].(map[string]interface{})["prefix"] != nil {
			prefixes := names[0].(map[string]interface{})["prefix"].([]interface{})
			if len(prefixes) > 0 {
				user["namePrefix"] = prefixes[0].(string)
			}
		}
	}

	// Get user roles from FHIR
	practionerRolesByte, _, err := u.FhirService.FhirRequest("PractitionerRole?practitioner="+ID, "GET", nil, nil)
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

func (u *UserRepository) SyncUserStores(token string) error {
	// Get keycloak users
	keycloakUsers, err := u.KeycloakService.GetUsers(nil, token)
	if err != nil {
		return err
	}

	for _, keycloakUser := range keycloakUsers {
		returnPref := "return=representation"
		_, statusCode, err := u.FhirService.GetOnePractitioner(*keycloakUser.ID, &returnPref)
		if err != nil {
			return err
		}

		if statusCode == 404 || statusCode == 410 {
			email := fhir.ContactPointSystemEmail
			photo := []fhir.Attachment{}

			practionerBytes, err := fhir.Practitioner{
				Id: keycloakUser.ID,
				Name: []fhir.HumanName{
					{
						Given:  []string{*keycloakUser.FirstName},
						Family: keycloakUser.LastName,
					},
				},
				Telecom: []fhir.ContactPoint{
					{
						System: &email,
						Value:  keycloakUser.Email,
					},
				},
				Photo: photo,
			}.MarshalJSON()

			if err != nil {
				return err
			}

			groups, err := u.KeycloakService.GetUserGroups(*keycloakUser.ID, token)
			roles := []fhir.Coding{}
			for _, group := range groups {
				if group.Name != nil {
					roles = append(roles, fhir.Coding{Display: group.Name})
				}
			}

			pracitionerType := "Practitioner"
			practionerRef := "Practitioner/" + *keycloakUser.ID

			practitionerRoleBytes, err := fhir.PractitionerRole{
				Practitioner: &fhir.Reference{
					Reference: &practionerRef,
					Type:      &pracitionerType,
				},
				Code: []fhir.CodeableConcept{
					{

						Coding: roles,
					},
				},
			}.MarshalJSON()

			if err != nil {
				return err
			}

			bundle := fhir.Bundle{
				Type: fhir.BundleTypeTransaction,
				Entry: []fhir.BundleEntry{
					{
						Id:       keycloakUser.ID,
						Resource: practionerBytes,
						Request: &fhir.BundleEntryRequest{
							Method: fhir.HTTPVerbPUT,
							Url:    "Practitioner/" + *keycloakUser.ID,
						},
					},
					{
						Resource: practitionerRoleBytes,
						Request: &fhir.BundleEntryRequest{
							Method: fhir.HTTPVerbPUT,
							Url:    "PractitionerRole?practitioner=" + *keycloakUser.ID,
						},
					},
				},
			}

			body, statusCode, err := u.FhirService.SaveBundle(bundle, nil)
			if err != nil {
				return err
			}

			if statusCode != 200 {
				return errors.New(string(body))
			}
		}
	}

	return nil
}
