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

// Billing ...
type Billing struct {
	gorm.Model
	ID       int     `gorm:"primaryKey"`
	Item     string  `json:"item" gorm:"uniqueIndex"`
	Code     string  `json:"code"`
	Price    float64 `json:"price"`
	Credit   bool    `json:"credit"`
	Remark   string  `json:"remark"`
	Document string  `gorm:"type:tsvector"`
	Count    int64   `json:"count"`
}
