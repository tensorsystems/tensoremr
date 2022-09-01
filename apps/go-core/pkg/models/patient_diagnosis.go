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

// PatientDiagnosis ...
type PatientDiagnosis struct {
	gorm.Model
	ID                     int     `gorm:"primaryKey"`
	PatientChartID         int     `json:"patientChartId"`
	CategoryCode           *string `json:"categoryCode"`
	DiagnosisCode          *string `json:"diagnosisCode"`
	FullCode               *string `json:"fullCode"`
	AbbreviatedDescription *string `json:"abbreviatedDescription"`
	FullDescription        string  `json:"fullDescription"`
	CategoryTitle          *string `json:"categoryTitle"`
	Location               string  `json:"location"`
	Differential           bool    `json:"differential"`
	Count                  int64   `json:"count"`
}
