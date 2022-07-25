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

// ReferralStatus ...
type ReferralStatus string

// ReferralType ...
type ReferralType string

// SurgicalProcedureOrder statuses ...
const (
	ReferralStatusOrdered   ReferralStatus = "ORDERED"
	ReferralStatusCompleted ReferralStatus = "COMPLETED"

	ReferralTypeInHouse   ReferralType = "PATIENT_IN_HOUSE_REFERRAL"
	ReferralTypeOutsource ReferralType = "PATIENT_OUTSOURCE_REFERRAL"
)

// Referral ...
type Referral struct {
	gorm.Model
	ID              int            `gorm:"primaryKey"`
	ReferralOrderID int            `json:"referralOrderId"`
	PatientChartID  int            `json:"patientChartId"`
	Reason          string         `json:"reason"`
	ReferredToID    *int           `json:"referredToId"`
	ReferredToName  string         `json:"referredToName"`
	Status          ReferralStatus `json:"status"`
	Type            ReferralType   `json:"type"`
	ReceptionNote   string         `json:"receptionNote"`
	Count           int64          `json:"count"`
}
