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
	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/internal/repository"
)

type SlotService struct {
	SlotRepository repository.SlotRepository
}

// GetOneSlot ...
func (s *SlotService) GetOneSlot(ID string) (*fhir.Slot, error) {
	slot, err := s.SlotRepository.GetOneSlot(ID)
	if err != nil {
		return nil, err
	}

	return slot, nil
}

// CreateSlot ...
func (s *SlotService) CreateSlot(sl fhir.Slot) (*fhir.Slot, error) {
	slot, err := s.SlotRepository.CreateSlot(sl)
	if err != nil {
		return nil, err
	}

	return slot, nil
}

// UpdateSlot ...
func (s *SlotService) UpdateSlot(sl fhir.Slot) (*fhir.Slot, error) {
	slot, err := s.SlotRepository.UpdateSlot(sl)
	if err != nil {
		return nil, err
	}

	return slot, nil

}
