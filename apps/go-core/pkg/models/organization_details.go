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

package models

import (
	"gorm.io/gorm"
)

// OrganizationDetails ...
type OrganizationDetails struct {
	gorm.Model
	ID                       int     `gorm:"primaryKey" json:"id"`
	Name                     *string `json:"name"`
	PhoneNo                  *string `json:"phoneNo"`
	PhoneNo2                 *string `json:"phoneNo2"`
	Address                  *string `json:"address"`
	Address2                 *string `json:"address2"`
	Website                  *string `json:"website"`
	Email                    *string `json:"email"`
	LanIpAddress             *string `json:"lanIpAddress"`
	LogoID                   *int    `json:"logoId"`
	Logo                     *File   `json:"logo"`
	DefaultMedicalDepartment *string `json:"defaultMedicalDepartment"`
}
