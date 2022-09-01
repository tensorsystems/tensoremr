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
	"errors"

	"github.com/lib/pq"
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	"gorm.io/gorm"
)

type PatientRepository struct {
	DB *gorm.DB
}

func ProvidePatientRepository(DB *gorm.DB) PatientRepository {
	return PatientRepository{DB: DB}
}

// Save ...
func (r *PatientRepository) Save(m *models.Patient) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var existingPatient models.Patient
		if err := tx.Where("trim(first_name) = ?", m.FirstName).Where("trim(last_name) = ?", m.LastName).Where("trim(phone_no) = ?", m.PhoneNo).Take(&existingPatient).Error; err == nil {
			if existingPatient.ID != 0 {
				return errors.New("Patient already exists")
			}
		}

		if err := tx.Create(&m).Error; err != nil {
			return err
		}

		if err := tx.Create(&models.PatientHistory{PatientID: m.ID}).Error; err != nil {
			return err
		}

		return nil
	})
}

// Get ...
func (r *PatientRepository) Get(m *models.Patient, ID int) error {
	return r.DB.Where("id = ?", ID).Preload("PatientHistory").Preload("PaperRecordDocument").Preload("Documents").Take(&m).Error
}

// GetPatientFiles ...
func (r *PatientRepository) GetPatientFiles(patientID int) ([]*models.File, error) {
	var files []models.File

	err := r.DB.Transaction(func(tx *gorm.DB) error {
		var diagnosticProcedureOrder models.DiagnosticProcedureOrder
		tx.Model(&models.DiagnosticProcedureOrder{}).Where("patient_id = ?", patientID).Preload("DiagnosticProcedures.Images").Preload("DiagnosticProcedures.Documents").Take(&diagnosticProcedureOrder)

		for _, diagnosticProcedure := range diagnosticProcedureOrder.DiagnosticProcedures {
			files = append(files, diagnosticProcedure.Images...)
			files = append(files, diagnosticProcedure.Documents...)
		}

		var labOrder models.LabOrder
		tx.Model(&models.LabOrder{}).Where("patient_id = ?", patientID).Preload("Labs.Images").Preload("Labs.Documents").Take(&labOrder)

		for _, lab := range labOrder.Labs {
			files = append(files, lab.Images...)
			files = append(files, lab.Documents...)
		}

		return nil
	})

	var f []*models.File
	for _, file := range files {
		item := file
		f = append(f, &item)
	}

	return f, err
}

// GetAll ...
func (r *PatientRepository) GetAll(p models.PaginationInput) ([]models.Patient, int64, error) {
	var result []models.Patient

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// GetAllProgressNotes ...
func (r *PatientRepository) GetAllProgressNotes(appointmentID int) (*models.PatientHistory, []*models.Appointment, error) {
	var patientHistory *models.PatientHistory
	var appointments []*models.Appointment

	err := r.DB.Transaction(func(tx *gorm.DB) error {
		var appointment models.Appointment

		if err := tx.Where("id = ?", appointmentID).Take(&appointment).Error; err != nil {
			return err
		}

		if err := r.DB.Model(models.Appointment{}).Where("patient_id = ?", appointment.PatientID).Where("id != ?", appointmentID).Preload("Patient").Preload("VisitType").Preload("PatientChart.VitalSigns").Preload("PatientChart.Diagnoses").Preload("PatientChart.MedicalPrescriptionOrder.MedicalPrescriptions").Preload("PatientChart.LabOrder.Labs").Preload("PatientChart.DiagnosticProcedureOrder.DiagnosticProcedures").Preload("PatientChart.SurgicalOrder.SurgicalProcedures").Preload("PatientChart.TreatmentOrder.Treatments").Preload("PatientChart.ReferralOrder.Referrals").Preload("PatientChart.FollowUpOrder.FollowUps").Preload("PatientChart.SurgicalProcedure").Preload("PatientChart.Treatment").Order("id ASC").Find(&appointments).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, nil, err
	}

	return patientHistory, appointments, nil
}

// GetAllProgress ...
func (r *PatientRepository) GetAllProgress(patientID int) (*models.PatientHistory, []*models.Appointment, error) {
	var patientHistory *models.PatientHistory
	var appointments []*models.Appointment

	err := r.DB.Transaction(func(tx *gorm.DB) error {

		if err := r.DB.Model(models.Appointment{}).Where("patient_id = ?", patientID).Preload("Patient").Preload("VisitType").Preload("PatientChart.VitalSigns").Preload("PatientChart.Diagnoses").Preload("PatientChart.MedicalPrescriptionOrder.MedicalPrescriptions").Preload("PatientChart.LabOrder.Labs").Preload("PatientChart.DiagnosticProcedureOrder.DiagnosticProcedures").Preload("PatientChart.SurgicalOrder.SurgicalProcedures").Preload("PatientChart.TreatmentOrder.Treatments").Preload("PatientChart.ReferralOrder.Referrals").Preload("PatientChart.FollowUpOrder.FollowUps").Preload("PatientChart.SurgicalProcedure").Preload("PatientChart.Treatment").Order("id ASC").Find(&appointments).Error; err != nil {
			return err
		}

		return nil
	})

	if err != nil {
		return nil, nil, err
	}

	return patientHistory, appointments, nil
}

// GetVisionProgress ...
func (r *PatientRepository) GetVitalSignsProgress(patientID int) ([]*models.Appointment, error) {
	var appointments []*models.Appointment

	if err := r.DB.Model(models.Appointment{}).Where("patient_id = ?", patientID).Order("id ASC").Preload("PatientChart.VitalSigns").Find(&appointments).Error; err != nil {
		return nil, err
	}

	return appointments, nil
}

// GetPatientDiagnosticProcedures ...
func (r *PatientRepository) GetPatientDiagnosticProcedures(patientID int, diagnosticProcedureTypeTitle string) ([]*models.Appointment, error) {
	var appointments []*models.Appointment

	if err := r.DB.Model(models.Appointment{}).Where("patient_id = ?", patientID).Order("id ASC").Preload("PatientChart.DiagnosticProcedureOrder.DiagnosticProcedures", "diagnostic_procedure_type_title ILIKE ?", diagnosticProcedureTypeTitle).Preload("PatientChart.DiagnosticProcedureOrder.DiagnosticProcedures.Images").Preload("PatientChart.DiagnosticProcedureOrder.DiagnosticProcedures.Documents").Preload("PatientChart.DiagnosticProcedureOrder.DiagnosticProcedures.Payments").Find(&appointments).Error; err != nil {
		return nil, err
	}

	return appointments, nil
}

// Search ...
func (r *PatientRepository) Search(term string) ([]*models.Patient, error) {
	var patients []*models.Patient
	err := r.DB.Raw("SELECT * FROM patients WHERE document @@ plainto_tsquery(?) AND deleted_at IS NULL LIMIT 20", term).Find(&patients).Error
	return patients, err
}

// FindByCardNo ...
func (r *PatientRepository) FindByCardNo(m *models.Patient, cardNo string) error {
	return r.DB.Where("card_no = ?", cardNo).Take(&m).Error
}

// FindByName ...
func (r *PatientRepository) FindByName(firstName string, lastName string) ([]*models.Patient, error) {
	var patients []*models.Patient
	err := r.DB.Where("trim(first_name) ILIKE ?", firstName).Where("trim(last_name) ILIKE ?", lastName).Find(&patients).Error
	if err != nil {
		return patients, err
	}

	return patients, nil
}

// FindByPhoneNo ...
func (r *PatientRepository) FindByPhoneNo(phoneNo string) ([]*models.Patient, error) {
	var patients []*models.Patient

	err := r.DB.Where("trim(phone_no) ILIKE ?", phoneNo).Find(&patients).Error
	if err != nil {
		return patients, err
	}

	return patients, nil
}

// Update ...
func (r *PatientRepository) Update(m *models.Patient) error {
	err := r.DB.Updates(m).Error

	if err, ok := err.(*pq.Error); ok && err.Code.Name() == "unique_violation" {
		return errors.New("Duplicate, " + err.Detail)
	}

	return err
}

// Delete ...
func (r *PatientRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.Patient{}).Error
}

// Clean ...
func (r *PatientRepository) Clean() error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		patients := []map[string]interface{}{}

		if err := tx.Raw("SELECT first_name, last_name, phone_no, count(*) FROM patients GROUP BY first_name, last_name, phone_no HAVING count(*) > 1").Find(&patients).Error; err != nil {
			return err
		}

		for _, e := range patients {
			var duplicatePatients []models.Patient

			if err := tx.Select("id, first_name, last_name, phone_no").Where("first_name = ?", e["first_name"].(string)).Where("last_name = ?", e["last_name"].(string)).Where("phone_no = ?", e["phone_no"].(string)).Preload("Appointments").Preload("PatientHistory.PastIllnesses").Preload("PatientHistory.PastInjuries").Preload("PatientHistory.PastHospitalizations").Preload("PatientHistory.PastSurgeries").Preload("PatientHistory.FamilyIllnesses").Preload("PatientHistory.Lifestyles").Preload("PatientHistory.Allergies").Preload("PatientHistory.PastHospitalizations").Order("id desc").Find(&duplicatePatients).Error; err != nil {
				return err
			}

			primaryPatient := duplicatePatients[0]

			// Attach paper record document to primary record
			if primaryPatient.PaperRecordDocumentID == nil {
				for _, e := range duplicatePatients {
					if e.PaperRecordDocumentID != nil {
						primaryPatient.PaperRecordDocumentID = e.PaperRecordDocumentID
						primaryPatient.CardNo = e.CardNo
					}
				}
			}

			// Update medical prescriptions
			for index, e := range duplicatePatients {
				if index != 0 {
					tx.Model(&models.MedicalPrescription{}).Where("patient_id = ?", e.ID).Update("patient_id", primaryPatient.ID)
				}
			}

			// Update eyewear prescriptions
			for index, e := range duplicatePatients {
				if index != 0 {
					tx.Model(&models.EyewearPrescription{}).Where("patient_id = ?", e.ID).Update("patient_id", primaryPatient.ID)
				}
			}

			// Update diagnostic orders
			for index, e := range duplicatePatients {
				if index != 0 {
					tx.Model(&models.DiagnosticProcedureOrder{}).Where("patient_id = ?", e.ID).Update("patient_id", primaryPatient.ID)
				}
			}

			// Update surgical orders
			for index, e := range duplicatePatients {
				if index != 0 {
					tx.Model(&models.SurgicalOrder{}).Where("patient_id = ?", e.ID).Update("patient_id", primaryPatient.ID)
				}
			}

			// Update lab
			for index, e := range duplicatePatients {
				if index != 0 {
					tx.Model(&models.LabOrder{}).Where("patient_id = ?", e.ID).Update("patient_id", primaryPatient.ID)
				}
			}

			// Update treatments
			for index, e := range duplicatePatients {
				if index != 0 {
					tx.Model(&models.TreatmentOrder{}).Where("patient_id = ?", e.ID).Update("patient_id", primaryPatient.ID)
				}
			}

			// Update follow-up
			for index, e := range duplicatePatients {
				if index != 0 {
					tx.Model(&models.FollowUpOrder{}).Where("patient_id = ?", e.ID).Update("patient_id", primaryPatient.ID)
				}
			}

			// Update referral
			for index, e := range duplicatePatients {
				if index != 0 {
					tx.Model(&models.ReferralOrder{}).Where("patient_id = ?", e.ID).Update("patient_id", primaryPatient.ID)
				}
			}

			// Attach histories
			for _, e := range duplicatePatients {
				for _, p := range e.PatientHistory.PastIllnesses {
					tx.Model(&models.PastIllness{}).Where("id = ?", p.ID).Update("patient_history_id", primaryPatient.PatientHistory.ID)
				}

				for _, p := range e.PatientHistory.PastHospitalizations {
					tx.Model(&models.PastHospitalization{}).Where("id = ?", p.ID).Update("patient_history_id", primaryPatient.PatientHistory.ID)
				}

				for _, p := range e.PatientHistory.FamilyIllnesses {
					tx.Model(&models.FamilyIllness{}).Where("id = ?", p.ID).Update("patient_history_id", primaryPatient.PatientHistory.ID)
				}

				for _, p := range e.PatientHistory.Lifestyles {
					tx.Model(&models.Lifestyle{}).Where("id = ?", p.ID).Update("patient_history_id", primaryPatient.PatientHistory.ID)
				}

				for _, p := range e.PatientHistory.Allergies {
					tx.Model(&models.Patient{}).Where("id = ?", p.ID).Update("patient_history_id", primaryPatient.PatientHistory.ID)
				}
			}

			// Attach appointments
			for _, e := range duplicatePatients {
				for _, a := range e.Appointments {
					tx.Model(&models.Appointment{}).Where("id = ?", a.ID).Update("patient_id", primaryPatient.ID)
				}
			}

			// Delete non primary records
			for index, e := range duplicatePatients {
				if index != 0 {
					tx.Delete(&e)
				}
			}

			tx.Updates(&primaryPatient)
		}

		return nil
	})

}
