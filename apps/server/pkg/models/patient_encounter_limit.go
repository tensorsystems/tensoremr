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

// PatientEncounterLimit ...
type PatientEncounterLimit struct {
	gorm.Model
	ID             int   `gorm:"primaryKey"`
	UserID         int   `json:"userId" gorm:"uniqueIndex"`
	User           User  `json:"user"`
	MondayLimit    int   `json:"mondayLimit"`
	TuesdayLimit   int   `json:"tuesdayLimit"`
	WednesdayLimit int   `json:"wednesdayLimit"`
	ThursdayLimit  int   `json:"thursdayLimit"`
	FridayLimit    int   `json:"fridayLimit"`
	SaturdayLimit  int   `json:"saturdayLimit"`
	SundayLimit    int   `json:"sundayLimit"`
	Overbook       int   `json:"overbook"`
	Count          int64 `json:"count"`
}
