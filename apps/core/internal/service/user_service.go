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
	"errors"
	"log"

	"github.com/Nerzal/gocloak/v12"
	ory "github.com/ory/client-go"
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	fhir_rest "github.com/tensorsystems/tensoremr/apps/core/internal/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/payload"
)

type UserService struct {
	FhirService      fhir_rest.FhirService
	OryClient        *ory.APIClient
	Context          context.Context
	IdentitySchemaID string
}

func NewUserService(fhirService fhir_rest.FhirService, oryClient *ory.APIClient, context context.Context, schemaID string) UserService {
	return UserService{
		FhirService:      fhirService,
		OryClient:        oryClient,
		Context:          context,
		IdentitySchemaID: schemaID,
	}
}

func (u *UserService) CreateOneUser(p payload.CreateUserPayload) (*ory.Identity, int, error) {
	if !u.FhirService.HaveConnection() {
		return nil, 500, errors.New("could not connect to FHIR")
	}

	// Create Ory identity
	body := *ory.NewCreateIdentityBody(u.IdentitySchemaID, map[string]interface{}{
		"email": p.Email,
		"name": map[string]string{
			"given":  p.GivenName,
			"family": p.FamilyName,
			"prefix": p.NamePrefix,
		},
		"contactNumber": p.ContactNumber,
		"role":          p.Role,
	})

	phrase := "changeme"
	password := *ory.NewIdentityWithCredentialsPasswordWithDefaults()
	password.SetConfig(ory.IdentityWithCredentialsPasswordConfig{
		Password: &phrase,
	})

	credentials := ory.NewIdentityWithCredentials()
	credentials.Password = &password

	body.Credentials = credentials

	createdIdentity, resp, err := u.OryClient.IdentityApi.CreateIdentity(u.Context).CreateIdentityBody(body).Execute()

	if err != nil {
		return nil, resp.StatusCode, err
	}

	// Create FHIR resource
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

	practitionerBytes, _ := fhir.Practitioner{
		Id: &createdIdentity.Id,
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

	pracitionerType := "Practitioner"
	practionerRef := "Practitioner/" + createdIdentity.Id

	practitionerRoleBytes, _ := fhir.PractitionerRole{
		Practitioner: &fhir.Reference{
			Reference: &practionerRef,
			Type:      &pracitionerType,
		},
		Code: []fhir.CodeableConcept{
			{

				Coding: []fhir.Coding{
					{
						Display: &p.Role,
					},
				},
				Text: &p.Role,
			},
		},
	}.MarshalJSON()

	bundle := fhir.Bundle{
		Type: fhir.BundleTypeTransaction,
		Entry: []fhir.BundleEntry{
			{
				Id:       &createdIdentity.Id,
				Resource: practitionerBytes,
				Request: &fhir.BundleEntryRequest{
					Method: fhir.HTTPVerbPUT,
					Url:    "Practitioner/" + createdIdentity.Id,
				},
			},
			{
				Resource: practitionerRoleBytes,
				Request: &fhir.BundleEntryRequest{
					Method: fhir.HTTPVerbPUT,
					Url:    "PractitionerRole?practitioner=" + createdIdentity.Id,
				},
			},
		},
	}

	_, statusCode, err := u.FhirService.SaveBundle(bundle, nil)
	if err != nil {
		return nil, statusCode, err
	}

	return createdIdentity, resp.StatusCode, nil
}

func (u *UserService) UpdateUser(p payload.UpdateUserPayload) (*ory.Identity, int, error) {
	if !u.FhirService.HaveConnection() {
		return nil, 500, errors.New("could not connect to FHIR")
	}

	body := ory.UpdateIdentityBody{
		SchemaId: u.IdentitySchemaID,
		Traits: map[string]interface{}{
			"email": p.Email,
			"name": map[string]string{
				"given":  p.GivenName,
				"family": p.FamilyName,
				"prefix": p.NamePrefix,
			},
			"contactNumber": p.ContactNumber,
			"role":          p.Role,
		},
	}

	updatedIdentity, resp, err := u.OryClient.IdentityApi.UpdateIdentity(u.Context, p.ID).UpdateIdentityBody(body).Execute()

	if err != nil {
		return nil, resp.StatusCode, err
	}

	phone := fhir.ContactPointSystemPhone
	email := fhir.ContactPointSystemEmail
	photo := []fhir.Attachment{}

	practionerBytes, _ := fhir.Practitioner{
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

	pracitionerType := "Practitioner"
	practionerRef := "Practitioner/" + p.ID

	practitionerRoleBytes, _ := fhir.PractitionerRole{
		Practitioner: &fhir.Reference{
			Reference: &practionerRef,
			Type:      &pracitionerType,
		},
		Code: []fhir.CodeableConcept{
			{

				Coding: []fhir.Coding{
					{
						Display: &p.Role,
					},
				},
				Text: &p.Role,
			},
		},
	}.MarshalJSON()

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

	b, statusCode, err := u.FhirService.SaveBundle(bundle, nil)
	if err != nil {
		return nil, statusCode, err
	}

	if statusCode != 200 {
		return nil, statusCode, errors.New(string(b))
	}

	return updatedIdentity, resp.StatusCode, nil
}

func (u *UserService) GetUsersByGroup(groupID string, token string) ([]*gocloak.User, error) {
	// user, err := u.UserRepository.GetUsersByGroup(groupID, token)
	// if err != nil {
	// 	return nil, err
	// }

	// return user, nil

	return nil, nil
}

func (u *UserService) GetCurrentUser(token string) (*gocloak.UserInfo, error) {
	// user, err := u.UserRepository.GetCurrentUser(token)
	// if err != nil {
	// 	return nil, err
	// }

	// return user, nil

	return nil, nil
}

func (u *UserService) GetAllUsers() ([]ory.Identity, int, error) {
	identities, resp, err := u.OryClient.IdentityApi.ListIdentities(u.Context).Execute()

	if err != nil {
		return nil, resp.StatusCode, err
	}

	return identities, resp.StatusCode, nil
}

func (u *UserService) GetOneUser(ID string) (*ory.Identity, int, error) {
	user, resp, err := u.OryClient.IdentityApi.GetIdentity(u.Context, ID).Execute()
	if err != nil {
		return nil, resp.StatusCode, err
	}

	return user, resp.StatusCode, nil
}

func (u *UserService) DeleteUserIdentity(ID string) (int, error) {
	resp, err := u.OryClient.IdentityApi.DeleteIdentity(u.Context, ID).Execute()
	return resp.StatusCode, err
}

func (u *UserService) GetRecoveryLink(ID string) (*ory.RecoveryLinkForIdentity, int, error) {
	body := ory.CreateRecoveryLinkForIdentityBody{
		IdentityId: ID,
	}

	link, resp, err := u.OryClient.IdentityApi.CreateRecoveryLinkForIdentity(u.Context).CreateRecoveryLinkForIdentityBody(body).Execute()
	if err != nil {
		return nil, resp.StatusCode, err
	}

	return link, resp.StatusCode, nil
}

func (u *UserService) SyncUserStores(token string) error {
	return nil
}

func (u *UserService) CreateDefaultAdminAccount() (int, error) {
	email := "kidus@tensorsystems.net"

	identities, statusCode, err := u.GetAllUsers()

	if err != nil {
		return statusCode, err
	}

	exists := false
	for _, identity := range identities {
		if identity.Traits != nil && identity.Traits.(map[string]interface{})["email"] == email {
			exists = true
		}
	}

	if exists {
		return 200, nil
	}

	body := *ory.NewCreateIdentityBody(u.IdentitySchemaID, map[string]interface{}{
		"email": email,
		"name": map[string]string{
			"given":  "Admin",
			"family": "Admin",
		},
		"role": "ict",
	})

	createdIdentity, resp, err := u.OryClient.IdentityApi.CreateIdentity(u.Context).CreateIdentityBody(body).Execute()

	if err != nil {
		return resp.StatusCode, err
	}

	link, statusCode, err := u.GetRecoveryLink(createdIdentity.Id)
	if err != nil {
		return statusCode, err
	}

	log.Println("====== USER RECOVERY LINK ======")
	log.Println(link.RecoveryLink)

	return 200, nil
}
