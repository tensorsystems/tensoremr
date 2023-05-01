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
	"net/http"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
)

type PractitionerService struct {
	FHIRService FHIRService
}

func NewPractitionerService(fhirService FHIRService) PractitionerService {
	return PractitionerService{
		FHIRService: fhirService,
	}
}

func (p *PractitionerService) CreatePractitionerWithRole(practitioner fhir.Practitioner, practitionerRole fhir.PractitionerRole, context context.Context) (*fhir.Practitioner, *http.Response, error) {
	practitionerBytes, _ := practitioner.MarshalJSON()
	practitionerRoleBytes, _ := practitionerRole.MarshalJSON()

	bundle := fhir.Bundle{
		Type: fhir.BundleTypeTransaction,
		Entry: []fhir.BundleEntry{
			{
				Id:       practitioner.Id,
				Resource: practitionerBytes,
				Request: &fhir.BundleEntryRequest{
					Method: fhir.HTTPVerbPUT,
					Url:    "Practitioner/" + *practitioner.Id,
				},
			},
			{
				Resource: practitionerRoleBytes,
				Request: &fhir.BundleEntryRequest{
					Method: fhir.HTTPVerbPUT,
					Url:    "PractitionerRole?practitioner=" + *practitioner.Id,
				},
			},
		},
	}

	_, resp, err := p.FHIRService.CreateBundle(bundle, nil, context)
	if err != nil {
		return nil, resp, err
	}

	return &practitioner, resp, nil
}


func (p *PractitionerService) UpdatePractitionerWithRole(practitioner fhir.Practitioner, practitionerRole fhir.PractitionerRole, context context.Context) (*fhir.Practitioner, *http.Response, error) {
	practitionerBytes, _ := practitioner.MarshalJSON()
	practitionerRoleBytes, _ := practitionerRole.MarshalJSON()


	bundle := fhir.Bundle{
		Type: fhir.BundleTypeTransaction,
		Entry: []fhir.BundleEntry{
			{
				Id:       practitioner.Id,
				Resource: practitionerBytes,
				Request: &fhir.BundleEntryRequest{
					Method: fhir.HTTPVerbPUT,
					Url:    "Practitioner/" + *practitioner.Id,
				},
			},
			{
				Resource: practitionerRoleBytes,
				Request: &fhir.BundleEntryRequest{
					Method: fhir.HTTPVerbPUT,
					Url:    "PractitionerRole?practitioner=" + *practitioner.Id,
				},
			},
		},
	}

	_, resp, err := p.FHIRService.CreateBundle(bundle, nil, context)
	if err != nil {
		return nil, resp, err
	}

	return &practitioner, resp, nil
}
