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
	"time"

	"gorm.io/gorm"
)

// MedicalPrescription ...
type MedicalPrescription struct {
	gorm.Model
	ID                         int        `gorm:"primaryKey"`
	MedicalPrescriptionOrderID *int       `json:"medicalPrescriptionOrderId"`
	PatientID                  int        `json:"patientId"`
	Patient                    Patient    `json:"patient"`
	Medication                 string     `json:"medication"`
	RxCui                      *string    `json:"rxCui"`
	Synonym                    *string    `json:"synonym"`
	Tty                        *string    `json:"tty"`
	Language                   *string    `json:"language"`
	Sig                        *string    `json:"sig"`
	Refill                     *int       `json:"refill"`
	Generic                    *bool      `json:"generic"`
	SubstitutionAllowed        *bool      `json:"substitutionAllowed"`
	DirectionToPatient         *string    `json:"directionToPatient"`
	PrescribedDate             *time.Time `json:"prescribedDate"`
	History                    bool       `json:"history"`
	Status                     string     `json:"status"`
	Count                      int64      `json:"count"`
}
