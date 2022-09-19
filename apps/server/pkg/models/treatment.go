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

// TreatmentStatus ...
type TreatmentStatus string

// SurgicalProcedureOrder statuses ...
const (
	TreatmentStatusOrdered   TreatmentStatus = "ORDERED"
	TreatmentStatusCompleted TreatmentStatus = "COMPLETED"
)

// Treatment ...
type Treatment struct {
	gorm.Model
	ID                 int             `gorm:"primaryKey"`
	TreatmentOrderID   int             `json:"treatmentOrderId"`
	PatientChartID     int             `json:"patientChartId"`
	Note               string          `json:"note"`
	Result             string          `json:"result"`
	RightEyeText       string          `json:"rightEyeText"`
	LeftEyeText        string          `json:"leftEyeText"`
	GeneralText        string          `json:"generalText"`
	TreatmentTypeID    int             `json:"treatmentTypeId"`
	TreatmentType      TreatmentType   `json:"treatmentType"`
	TreatmentTypeTitle string          `json:"treatmentTypeTitle"`
	Payments           []Payment       `json:"payments" gorm:"many2many:treatment_payments;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	PaymentVoucher     *string         `json:"paymentVoucher"`
	ReceptionNote      string          `json:"receptionNote"`
	Status             TreatmentStatus `json:"status"`
	Count              int64           `json:"count"`
}
