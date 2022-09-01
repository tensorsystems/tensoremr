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

// FollowUpStatus ...
type FollowUpStatus string

// SurgicalProcedureOrder statuses ...
const (
	FollowUpStatusOrdered   FollowUpStatus = "ORDERED"
	FollowUpStatusCompleted FollowUpStatus = "COMPLETED"
)

// FollowUp ...
type FollowUp struct {
	gorm.Model
	ID              int            `gorm:"primaryKey"`
	FollowUpOrderID int            `json:"followUpOrderId"`
	PatientChartID  int            `json:"patientChartId"`
	Status          FollowUpStatus `json:"status"`
	ReceptionNote   string         `json:"receptionNote"`
	Count           int64          `json:"count"`
}
