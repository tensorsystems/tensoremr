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

// VitalSigns ...
type VitalSigns struct {
	gorm.Model
	ID             int `gorm:"primaryKey"`
	PatientChartID int `json:"patientChartId" gorm:"uniqueIndex"`

	Temperature            *float64 `json:"temperature"`
	Pulse                  *float64 `json:"pulse"`
	BloodPressureSystolic  *float64 `json:"bloodPressureSystolic"`
	BloodPressureDiastolic *float64 `json:"bloodPressureDiastolic"`
	RespiratoryRate        *float64 `json:"respiratoryRate"`
	OxygenSaturation       *float64 `json:"oxygenSaturation"`
	Height                 *float64 `json:"height"`
	Weight                 *float64 `json:"weight"`
	Bmi                    *float64 `json:"bmi"`

	// Visual Acuity
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

	// IOP
	RightIop             *string `json:"rightIop"`
	LeftIop              *string `json:"leftIop"`
	RightApplanation     *string `json:"rightApplanation"`
	LeftApplanation      *string `json:"leftApplanation"`
	RightTonopen         *string `json:"rightTonopen"`
	LeftTonopen          *string `json:"leftTonopen"`
	RightDigital         *string `json:"rightDigital"`
	LeftDigital          *string `json:"leftDigital"`
	RightNoncontact      *string `json:"rightNoncontact"`
	LeftNoncontact       *string `json:"leftNoncontact"`
	RightSchotzTonometer *string `json:"rightSchotzTonometer"`
	LeftSchotzTonometer *string `json:"leftSchotzTonometer"`

	// Auto Refraction
	RightDistanceSph   *string `json:"rightDistanceSph"`
	LeftDistanceSph    *string `json:"leftDistanceSph"`
	RightDistanceAxis  *string `json:"rightDistanceAxis"`
	LeftDistanceAxis   *string `json:"leftDistanceAxis"`
	RightDistanceCyl   *string `json:"rightDistanceCyl"`
	LeftDistanceCyl    *string `json:"leftDistanceCyl"`
	RightNearSph       *string `json:"rightNearSph"`
	LeftNearSph        *string `json:"leftNearSph"`
	RightNearCyl       *string `json:"rightNearCyl"`
	LeftNearCyl        *string `json:"leftNearCyl"`
	RightNearAxis      *string `json:"rightNearAxis"`
	LeftNearAxis       *string `json:"leftNearAxis"`
	RightLensMeterSph  *string `json:"rightLensMeterSph"`
	LeftLensMeterSph   *string `json:"leftLensMeterSph"`
	RightLensMeterAxis *string `json:"rightLensMeterAxis"`
	LeftLensMeterAxis  *string `json:"leftLensMeterAxis"`
	RightLensMeterCyl  *string `json:"rightLensMeterCyl"`
	LeftLensMeterCyl   *string `json:"leftLensMeterCyl"`
}
