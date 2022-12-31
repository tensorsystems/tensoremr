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
)

type SlotService struct {
	FhirService FhirService
}

// GetOneSlot ...
func (s *SlotService) GetOneSlot(ID string) (*fhir.Slot, error) {
	returnPref := "return=representation"
	body, statusCode, err := s.FhirService.FhirRequest("Slot/"+ID, "GET", nil, &returnPref)

	if err != nil {
		return nil, err
	}

	if statusCode != 200 {
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
func (s *SlotService) CreateSlot(sl fhir.Slot) (*fhir.Slot, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := sl.MarshalJSON()
	if err != nil {
		return nil, err
	}

	body, statusCode, err := s.FhirService.FhirRequest("Slot", "POST", b, &returnPref)
	if err != nil {
		return nil, err
	}

	if statusCode != 201 && statusCode != 200 {
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
func (s *SlotService) UpdateSlot(sl fhir.Slot) (*fhir.Slot, error) {
	// Create FHIR resource
	returnPref := "return=representation"
	b, err := sl.MarshalJSON()
	if err != nil {
		return nil, err
	}

	if sl.Id == nil {
		return nil, errors.New("Slot ID is required")
	}

	body, statusCode, err := s.FhirService.FhirRequest("Slot/"+*sl.Id, "PUT", b, &returnPref)
	if err != nil {
		return nil, err
	}

	if statusCode != 201 && statusCode != 200 {
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
