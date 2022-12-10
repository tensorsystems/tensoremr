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

// PatientHistory ...
type PatientHistory struct {
	gorm.Model
	ID                   int                   `gorm:"primaryKey" json:"id"`
	PatientID            int                   `json:"patientId" gorm:"uniqueIndex"`
	ReviewOfSystems      []ReviewOfSystem      `json:"reviewOfSystems"`
	ReviewOfSystemsNote  *string               `json:"reviewOfSystemsNote"`
	PastIllnesses        []PastIllness         `json:"pastIllnesses"`
	PastInjuries         []PastInjury          `json:"pastInjuries"`
	PastHospitalizations []PastHospitalization `json:"pastHospitalizations"`
	PastSurgeries        []PastSurgery         `json:"pastSurgeries"`
	FamilyIllnesses      []FamilyIllness       `json:"familyIllnesses"`
	Lifestyles           []Lifestyle           `json:"lifestyles"`
	Allergies            []Allergy             `json:"allergies"`
}
