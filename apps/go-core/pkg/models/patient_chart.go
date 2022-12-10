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

// PatientChart ...
type PatientChart struct {
	gorm.Model
	ID                        int                      `gorm:"primaryKey"`
	AppointmentID             int                      `json:"appointmentId"`
	VitalSigns                VitalSigns               `json:"vitalSigns"`
	PhysicalExamFindings      []PhysicalExamFinding    `json:"physicalExamFindings"`
	PhysicalExamFindingNote   *string                  `json:"physicalExamFindingNote"`
	OpthalmologyExam          OpthalmologyExam         `json:"opthalmologyExam"`
	SurgicalProcedure         SurgicalProcedure        `json:"surgicalProcedure"`
	Treatment                 Treatment                `json:"treatment"`
	ChiefComplaints           []ChiefComplaint         `json:"chiefComplaints"`
	ChiefComplaintsNote       *string                  `json:"chiefComplaintNote"`
	BloodPressure             *string                  `json:"bloodPressure"`
	HpiNote                   *string                  `json:"hpiNote"`
	DiagnosisNote             *string                  `json:"diagnosisNote"`
	DifferentialDiagnosisNote *string                  `json:"differentialDiagnosisNote"`
	RightSummarySketch        *string                  `json:"rightSummarySketch"`
	LeftSummarySketch         *string                  `json:"leftSummarySketch"`
	SummaryNote               *string                  `json:"summaryNote"`
	StickieNote               *string                  `json:"stickieNote"`
	MedicalRecommendation     *string                  `json:"medicalRecommendation"`
	SickLeave                 *string                  `json:"sickLeave"`
	IllnessType               *string                  `json:"illnessType"`
	MedicalPrescriptionOrder  MedicalPrescriptionOrder `json:"medicalPrescriptionOrder"`
	EyewearPrescriptionOrder  EyewearPrescriptionOrder `json:"eyewearPrescriptionOrder"`
	DiagnosticProcedureOrder  DiagnosticProcedureOrder `json:"diagnosticProcedureOrder"`
	SurgicalOrder             SurgicalOrder            `json:"surgicalOrder"`
	TreatmentOrder            TreatmentOrder           `json:"treatmentOrder"`
	ReferralOrder             ReferralOrder            `json:"referralOrder"`
	FollowUpOrder             FollowUpOrder            `json:"followUpOrder"`
	LabOrder                  LabOrder                 `json:"labOrder"`
	Diagnoses                 []PatientDiagnosis       `json:"diagnoses"`
	Locked                    *bool                    `json:"locked"`
	LockedDate                *time.Time               `json:"lockedDate"`
	LockedByID                *int                     `json:"lockedById"`
	LockedBy                  *User                    `json:"lockedBy"`
	Amendments                []Amendment              `json:"amendments"`
	ClinicalFinding           ClinicalFinding          `json:"clinicalFinding"`
	OldPatientChartId         int                      `json:"oldPatientChartId"`
}

// AfterCreate ...
func (r *PatientChart) AfterCreate(tx *gorm.DB) error {

	if err := tx.Create(&VitalSigns{PatientChartID: r.ID}).Error; err != nil {
		return err
	}

	if err := tx.Create(&OpthalmologyExam{PatientChartID: r.ID}).Error; err != nil {
		return err
	}

	return nil
}
