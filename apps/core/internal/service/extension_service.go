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
	"io"
	"net/http"
)

type ExtensionService struct{
	ExtensionUrl string
}

func (e *ExtensionService) GetExtensions() (map[string]interface{}, error) {
	resp, err := http.Get(e.ExtensionUrl)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()
	body, err := io.ReadAll(resp.Body)

	m := make(map[string]interface{})
	if err := json.Unmarshal(body, &m); err != nil {
		return nil, err
	}

	return m, nil
}
