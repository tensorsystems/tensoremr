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
	"log"

	"github.com/tensorsystems/tensoremr/apps/core/pkg/payload"
	"github.com/tensorsystems/tensoremr/apps/core/pkg/service"
)

type SeedService struct {
	UserService service.UserService
	RoleService service.RoleService
}

func (s *SeedService) SeedRoles(context context.Context) (er error) {
	if err := s.RoleService.CreateRole("doctor"); err != nil {
		log.Println(err)
		er = err
	}
	if err := s.RoleService.CreateRole("nurse"); err != nil {
		log.Println(err)
		er = err
	}
	if err := s.RoleService.CreateRole("pharmacist"); err != nil {
		log.Println(err)
		er = err
	}
	if err := s.RoleService.CreateRole("researcher"); err != nil {
		log.Println(err)
		er = err
	}
	if err := s.RoleService.CreateRole("teacher"); err != nil {
		log.Println(err)
		er = err
	}
	if err := s.RoleService.CreateRole("ict"); err != nil {
		log.Println(err)
		er = err
	}
	if err := s.RoleService.CreateRole("receptionist"); err != nil {
		log.Println(err)
		er = err
	}

	return er
}

func (s *SeedService) SeedUsers(context context.Context) (er error) {
	// ict
	_, _, err := s.UserService.CreateOneUser(payload.CreateUserPayload{
		GivenName:  "Admin",
		FamilyName: "Admin",
		Email:      "ict@tensoremr.com",
		Role:       "ict",
		Password:   "changeme1",
	}, context)

	if err != nil {
		er = err
		log.Println(err)
	}

	// doctor
	_, _, err = s.UserService.CreateOneUser(payload.CreateUserPayload{
		NamePrefix: "Dr.",
		GivenName:  "Physician",
		FamilyName: "Physician",
		Email:      "physician@tensoremr.com",
		Role:       "doctor",
		Password:   "changeme1",
	}, context)

	if err != nil {
		er = err
		log.Println(err)
	}

	// nurse
	_, _, err = s.UserService.CreateOneUser(payload.CreateUserPayload{
		GivenName:  "Nurse",
		FamilyName: "Nurse",
		Email:      "nurse@tensoremr.com",
		Role:       "nurse",
		Password:   "changeme1",
	}, context)

	if err != nil {
		er = err
		log.Println(err)
	}

	// receptionist
	_, _, err = s.UserService.CreateOneUser(payload.CreateUserPayload{
		GivenName:  "Receptionist",
		FamilyName: "Receptionist",
		Email:      "receptionist@tensoremr.com",
		Role:       "receptionist",
		Password:   "changeme1",
	}, context)

	if err != nil {
		er = err
		log.Println(err)
	}

	return err
}
