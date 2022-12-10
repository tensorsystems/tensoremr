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

// MedicalPrescriptionOrder is a gorm struct for the prescription_order table
type MedicalPrescriptionOrder struct {
	gorm.Model
	ID                   int                   `gorm:"primaryKey"`
	PharmacyID           int                   `json:"pharmacyId"`
	Pharmacy             Pharmacy              `json:"pharmacy"`
	PatientChartID       int                   `json:"patientChartId"`
	OrderedByID          *int                  `json:"orderedById"`
	OrderedBy            *User                 `json:"orderedBy"`
	FirstName            string                `json:"firstName"`
	LastName             string                `json:"lastName"`
	PhoneNo              string                `json:"phoneNo"`
	UserName             string                `json:"userName"`
	Status               string                `json:"status"`
	MedicalPrescriptions []MedicalPrescription `json:"medicalPrescriptions"`
	Count                int64                 `json:"count"`
}
