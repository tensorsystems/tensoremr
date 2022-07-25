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

// DiagnosticProcedureStatus ...
type DiagnosticProcedureStatus string

// DiagnosticProcedureOrder statuses ...
const (
	DiagnosticProcedureOrderedStatus   DiagnosticProcedureStatus = "ORDERED"
	DiagnosticProcedureCompletedStatus DiagnosticProcedureStatus = "COMPLETED"
)

// DiagnosticProcedure ...
type DiagnosticProcedure struct {
	gorm.Model
	ID                           int                       `gorm:"primaryKey"`
	DiagnosticProcedureOrderID   int                       `json:"diagnosticProcedureOrderId"`
	PatientChartID               int                       `json:"patientChartId"`
	GeneralText                  *string                   `json:"generalText"`
	Images                       []File                    `json:"images" gorm:"many2many:diagnostic_images"`
	Documents                    []File                    `json:"documents" gorm:"many2many:diagnostic_documents"`
	IsRefraction                 bool                      `json:"isRefraction"`
	RightDistanceSubjectiveSph   *string                   `json:"rightDistanceSubjectiveSph"`
	LeftDistanceSubjectiveSph    *string                   `json:"leftDistanceSubjectiveSph"`
	RightDistanceSubjectiveCyl   *string                   `json:"rightDistanceSubjectiveCyl"`
	LeftDistanceSubjectiveCyl    *string                   `json:"leftDistanceSubjectiveCyl"`
	RightDistanceSubjectiveAxis  *string                   `json:"rightDistanceSubjectiveAxis"`
	LeftDistanceSubjectiveAxis   *string                   `json:"leftDistanceSubjectiveAxis"`
	RightNearSubjectiveSph       *string                   `json:"rightNearSubjectiveSph"`
	LeftNearSubjectiveSph        *string                   `json:"leftNearSubjectiveSph"`
	RightNearSubjectiveCyl       *string                   `json:"rightNearSubjectiveCyl"`
	LeftNearSubjectiveCyl        *string                   `json:"leftNearSubjectiveCyl"`
	RightNearSubjectiveAxis      *string                   `json:"rightNearSubjectiveAxis"`
	LeftNearSubjectiveAxis       *string                   `json:"leftNearSubjectiveAxis"`
	RightDistanceObjectiveSph    *string                   `json:"rightDistanceObjectiveSph"`
	LeftDistanceObjectiveSph     *string                   `json:"leftDistanceObjectiveSph"`
	RightDistanceObjectiveCyl    *string                   `json:"rightDistanceObjectiveCyl"`
	LeftDistanceObjectiveCyl     *string                   `json:"leftDistanceObjectiveCyl"`
	RightDistanceObjectiveAxis   *string                   `json:"rightDistanceObjectiveAxis"`
	LeftDistanceObjectiveAxis    *string                   `json:"leftDistanceObjectiveAxis"`
	RightNearObjectiveSph        *string                   `json:"rightNearObjectiveSph"`
	LeftNearObjectiveSph         *string                   `json:"leftNearObjectiveSph"`
	RightNearObjectiveCyl        *string                   `json:"rightNearObjectiveCyl"`
	LeftNearObjectiveCyl         *string                   `json:"leftNearObjectiveCyl"`
	RightNearObjectiveAxis       *string                   `json:"rightNearObjectiveAxis"`
	LeftNearObjectiveAxis        *string                   `json:"leftNearObjectiveAxis"`
	RightDistanceFinalSph        *string                   `json:"rightDistanceFinalSph"`
	LeftDistanceFinalSph         *string                   `json:"leftDistanceFinalSph"`
	RightDistanceFinalCyl        *string                   `json:"rightDistanceFinalCyl"`
	LeftDistanceFinalCyl         *string                   `json:"leftDistanceFinalCyl"`
	RightDistanceFinalAxis       *string                   `json:"rightDistanceFinalAxis"`
	LeftDistanceFinalAxis        *string                   `json:"leftDistanceFinalAxis"`
	RightNearFinalSph            *string                   `json:"rightNearFinalSph"`
	LeftNearFinalSph             *string                   `json:"leftNearFinalSph"`
	RightNearFinalCyl            *string                   `json:"rightNearFinalCyl"`
	LeftNearFinalCyl             *string                   `json:"leftNearFinalCyl"`
	RightNearFinalAxis           *string                   `json:"rightNearFinalAxis"`
	LeftNearFinalAxis            *string                   `json:"leftNearFinalAxis"`
	RightVisualAcuity            *string                   `json:"rightVisualAcuity"`
	LeftVisualAcuity             *string                   `json:"leftVisualAcuity"`
	FarPd                        *string                   `json:"farPd"`
	NearPd                       *string                   `json:"nearPd"`
	DiagnosticProcedureTypeID    int                       `json:"diagnosticProcedureTypeId"`
	DiagnosticProcedureType      DiagnosticProcedureType   `json:"diagnosticProcedureType"`
	DiagnosticProcedureTypeTitle string                    `json:"diagnosticProcedureTypeTitle"`
	Payments                     []Payment                 `json:"payments" gorm:"many2many:diagnostic_procedure_payments;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	Status                       DiagnosticProcedureStatus `json:"status"`
	OrderNote                    string                    `json:"orderNote"`
	ReceptionNote                string                    `json:"receptionNote"`
	Count                        int64                     `json:"count"`
	OldId                        int                       `json:"oldId"`
}
