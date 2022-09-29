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

import "gorm.io/gorm"

// ClinicalFindingAttribute ...
type ClinicalFindingAttribute struct {
	gorm.Model
	ID                int     `gorm:"primaryKey"`
	ClinicalFindingID int     `json:"clinicalFindingId"`
	AttributeTypeID   string `json:"attributeTypeID"`
	AttributeID       string `json:"attributeID"`
	AttributeTerm     string `json:"attributeTerm"`
	CreatedByID       int     `json:"createdById"`
	UpdatedByID       int     `json:"updatedById"`
	Authority         string  `json:"authority"`
}
