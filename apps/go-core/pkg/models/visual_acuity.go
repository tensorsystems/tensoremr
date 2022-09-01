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

// VisualAcuity ...
type VisualAcuity struct {
	gorm.Model
	ID                       int     `gorm:"primaryKey"`
	RightDistanceUncorrected *string `json:"rightDistanceUncorrected"`
	LeftDistanceUncorrected  *string `json:"leftDistanceUncorrected"`
	RightDistancePinhole     *string `json:"rightDistancePinhole"`
	LeftDistancePinhole      *string `json:"leftDistancePinhole"`
	RightDistanceCorrected   *string `json:"rightDistanceCorrected"`
	LeftDistanceCorrected    *string `json:"leftDistanceCorrected"`
	RightNearUncorrected     *string `json:"rightNearUncorrected"`
	LeftNearUncorrected      *string `json:"leftNearUncorrected"`
	RightNearPinhole         *string `json:"rightNearPinhole"`
	LeftNearPinhole          *string `json:"leftNearPinhole"`
	RightNearCorrected       *string `json:"rightNearCorrected"`
	LeftNearCorrected        *string `json:"leftNearCorrected"`
	PatientChartID           int     `json:"patientChartId" gorm:"unique"`
}
