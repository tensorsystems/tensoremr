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

package repository

import (
	"time"

	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	"gorm.io/gorm"
)

type PatientChartRepository struct {
	DB *gorm.DB
}

func ProvidePatientChartRepository(DB *gorm.DB) PatientChartRepository {
	return PatientChartRepository{DB: DB}
}

// Save ...
func (r *PatientChartRepository) Save(m *models.PatientChart) error {
	return r.DB.Create(&m).Error
}

// SignAndLock ...
func (r *PatientChartRepository) SignAndLock(m *models.PatientChart, patientChartID int, userID *int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ?", patientChartID).Take(&m).Error; err != nil {
			return err
		}

		if m.Locked != nil && *m.Locked == true {
			return nil
		}

		locked := true
		lockedDate := time.Now()

		m.Locked = &locked
		m.LockedDate = &lockedDate
		m.LockedByID = userID

		if err := tx.Updates(&m).Error; err != nil {
			return err
		}

		var checkedOut models.AppointmentStatus
		if err := tx.Where("title = ?", "Checked-Out").Take(&checkedOut).Error; err != nil {
			return err
		}

		if err := tx.Table("appointments").Where("id = ?", m.AppointmentID).Updates(map[string]interface{}{"appointment_status_id": checkedOut.ID}).Error; err != nil {
			return err
		}

		return nil
	})

}

// Get ...
func (r *PatientChartRepository) Get(m *models.PatientChart, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByAppointmentID ...
func (r *PatientChartRepository) GetByAppointmentID(m *models.PatientChart, appointmentID int) error {
	return r.DB.Where("appointment_id = ?", appointmentID).Take(&m).Error
}

// Get ...
func (r *PatientChartRepository) GetWithDetails(m *models.PatientChart, ID int) error {
	return r.DB.Where("id = ?", ID).Preload("ChiefComplaints.HPIComponents.HpiComponentType").Preload("MedicalPrescriptionOrder.MedicalPrescriptions").Preload("EyewearPrescriptionOrder.EyewearPrescriptions").Preload("VitalSigns").Preload("PhysicalExamFindings.ExamCategory").Preload("OpthalmologyExam").Preload("Diagnoses").Preload("LabOrder.Labs.LabType").Preload("LabOrder.Labs.RightEyeImages").Preload("LabOrder.Labs.LeftEyeImages").Preload("LabOrder.Labs.Documents").Preload("DiagnosticProcedureOrder.DiagnosticProcedures.DiagnosticProcedureType").Preload("DiagnosticProcedureOrder.DiagnosticProcedures.Images").Preload("DiagnosticProcedureOrder.DiagnosticProcedures.Documents").Preload("SurgicalProcedure.SurgicalProcedureType").Preload("Treatment.TreatmentType").Preload("Amendments").Take(&m).Error
}

// Update ...
func (r *PatientChartRepository) Update(m *models.PatientChart) error {
	return r.DB.Updates(&m).Error
}
