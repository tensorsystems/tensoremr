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
	"bytes"
	"encoding/json"
	"errors"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"golang.org/x/net/context"
)

type SlotService struct {
	FHIRService FHIRService
}

func NewSlotService(FHIRService FHIRService) SlotService {
	return SlotService{
		FHIRService: FHIRService,
	}
}

// GetOneSlot ...
func (s *SlotService) GetOneSlot(ID string, context context.Context) (*fhir.Slot, error) {
	returnPref := "return=representation"
	body, resp, err := s.FHIRService.GetResource("Slot/"+ID, &returnPref, context)

	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 200 {
		return nil, errors.New(string(body))
	}

	aResult := make(map[string]interface{})
	if err := json.Unmarshal(body, &aResult); err != nil {
		return nil, err
	}

	var slot fhir.Slot
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&slot)

	return &slot, nil
}

// CreateSlot ...
func (s *SlotService) CreateSlot(sl fhir.Slot, context context.Context) (*fhir.Slot, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := sl.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, resp, err := s.FHIRService.CreateResource("Slot", b, &returnPref, context)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 201 && resp.StatusCode != 200 {
		return nil, errors.New(string(body))
	}

	aResult := make(map[string]interface{})
	if err := json.Unmarshal(body, &aResult); err != nil {
		return nil, err
	}

	var slot fhir.Slot
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&slot)

	return &slot, nil
}

// UpdateSlot ...
func (s *SlotService) UpdateSlot(sl fhir.Slot, context context.Context) (*fhir.Slot, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := sl.MarshalJSON()
	if err != nil {
		return nil, err
	}

	if sl.Id == nil {
		return nil, errors.New("slot ID is required")
	}

	body, resp, err := s.FHIRService.UpdateResource("Slot/"+*sl.Id, b, &returnPref, context)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode != 201 && resp.StatusCode != 200 {
		return nil, errors.New(string(body))
	}

	aResult := make(map[string]interface{})
	if err := json.Unmarshal(body, &aResult); err != nil {
		return nil, err
	}

	var slot fhir.Slot
	buf := new(bytes.Buffer)
	json.NewEncoder(buf).Encode(aResult)
	json.NewDecoder(buf).Decode(&slot)

	return &slot, nil
}
