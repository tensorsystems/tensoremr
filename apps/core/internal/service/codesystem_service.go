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
	"encoding/json"

	"github.com/samply/golang-fhir-models/fhir-models/fhir"
	"github.com/tensorsystems/tensoremr/apps/core/pkg/codesystem"
)

type CodeSystemService struct{}

func (f *CodeSystemService) GetSeviceTypes() (*fhir.CodeSystem, error) {
	bytes := codesystem.ServiceTypes

	codeSystem, err := f.Unmarshal(bytes)
	if err != nil {
		return nil, err
	}

	return codeSystem, nil
}

func (f *CodeSystemService) Unmarshal(bytes []byte) (*fhir.CodeSystem, error) {
	var codeSystem fhir.CodeSystem
	if err := json.Unmarshal(bytes, &codeSystem); err != nil {
		return nil, err
	}

	return &codeSystem, nil
}
