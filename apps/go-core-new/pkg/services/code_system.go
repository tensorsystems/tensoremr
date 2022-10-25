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

package services

import (
	"io"
	"net/http"
)

type CodeSystemService struct {
	Client *http.Client
}

func NewCodeSystemService(client *http.Client) *CodeSystemService {
	return &CodeSystemService{Client: client}
}

func (c *CodeSystemService) GetOrganizationTypes(organizationTypeUrl string) ([]byte, error) {
	resp, err := c.Client.Get(organizationTypeUrl)
	if err != nil {
		return nil, err
	}

	resp.Header.Add("Content-Type", "application/json")

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}
