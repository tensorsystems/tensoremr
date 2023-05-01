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

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/supertokens/supertokens-golang/recipe/thirdpartyemailpassword/tpepmodels"
	"github.com/tensorsystems/tensoremr/apps/core/pkg/payload"
)

type UserService struct {
	FHIRService         FHIRService
	PractitionerService PractitionerService
	AuthService         AuthService
	RoleService         RoleService
	Context             context.Context
}

func NewUserService(fhirService FHIRService, practitionerService PractitionerService, authService AuthService, roleService RoleService, context context.Context) UserService {
	return UserService{
		FHIRService:         fhirService,
		PractitionerService: practitionerService,
		AuthService:         authService,
		RoleService:         roleService,
		Context:             context,
	}
}

func (u *UserService) CreateOneUser(p payload.CreateUserPayload, context context.Context) (*tpepmodels.User, int, error) {
	if !u.FHIRService.HaveConnection(context) {
		return nil, 500, errors.New("could not connect to fhir")
	}

	// Create user
	user, err := u.AuthService.CreateUser(map[string]interface{}{
		"email":    p.Email,
		"password": p.Password,
	})

	if err != nil {
		return nil, 500, err
	}

	// Update metadata
	_, err = u.AuthService.UpdateUserMetadata(user.ID, map[string]interface{}{
		"first_name":   p.GivenName,
		"family_name":  p.FamilyName,
		"name_prefix":  p.NamePrefix,
		"phone_number": p.ContactNumber,
	})

	if err != nil {
		return nil, 500, err
	}

	// Assign role
	if err := u.RoleService.AddRoleToUser(user.ID, p.Role); err != nil {
		return nil, 500, err
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

	practitioner := fhir.Practitioner{
		Id: &user.ID,
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
	}

	pracitionerType := "Practitioner"
	practionerRef := "Practitioner/" + user.ID
	practitionerRole := fhir.PractitionerRole{
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
	}

	_, resp, err := u.PractitionerService.CreatePractitionerWithRole(practitioner, practitionerRole, context)
	if err != nil {
		return nil, resp.StatusCode, err
	}

	return user, 200, nil
}

func (u *UserService) UpdateUser(p payload.UpdateUserPayload, context context.Context) (*tpepmodels.User, int, error) {
	if !u.FHIRService.HaveConnection(context) {
		return nil, 500, errors.New("could not connect to fhir")
	}

	// get user
	user, err := u.AuthService.GetUser(p.ID)
	if err != nil {
		return nil, 404, err
	}

	// update email
	err = u.AuthService.UpdateUser(p.ID, map[string]interface{}{
		"email": p.Email,
	})

	if err != nil {
		return nil, 500, err
	}

	// update metadata
	_, err = u.AuthService.UpdateUserMetadata(p.ID, map[string]interface{}{
		"first_name":   p.GivenName,
		"family_name":  p.FamilyName,
		"name_prefix":  p.NamePrefix,
		"phone_number": p.ContactNumber,
	})

	if err != nil {
		return nil, 500, err
	}

	// update fhir resource
	phone := fhir.ContactPointSystemPhone
	email := fhir.ContactPointSystemEmail
	photo := []fhir.Attachment{}

	practitioner := fhir.Practitioner{
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
	}

	pracitionerType := "Practitioner"
	practionerRef := "Practitioner/" + p.ID

	practitionerRole := fhir.PractitionerRole{
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
	}

	_, updateResp, err := u.PractitionerService.UpdatePractitionerWithRole(practitioner, practitionerRole, context)
	if err != nil {
		return nil, updateResp.StatusCode, err
	}

	return user, 200, nil
}

func (u *UserService) GetOneUser(ID string) (*tpepmodels.User, error) {
	return u.AuthService.GetUser(ID)
}
