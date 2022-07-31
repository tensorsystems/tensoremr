package datasource

import (
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	"gorm.io/gorm"
)

type PostgresDataSource struct {
	DB *gorm.DB
}

// GetAllPatients ...
func (p *PostgresDataSource) GetAllPatients() ([]map[string]interface{}, error) {
	var patients []models.Patient

	body := []map[string]interface{}{}

	p.DB.Order("id ASC").FindInBatches(&patients, 1000, func(tx *gorm.DB, batch int) error {
		for _, patient := range patients {
			item := map[string]interface{}{
				"meta": map[string]interface{}{
					"_index": "patients",
					"_id":    patient.ID,
				},
				"data": map[string]interface{}{
					"first_name":    patient.FirstName,
					"last_name":     patient.LastName,
					"full_name":     patient.FullName,
					"gender":        patient.Gender,
					"phone_no":      patient.PhoneNo,
					"phone_no2":     patient.PhoneNo2,
					"email":         patient.Email,
					"date_of_birth": patient.DateOfBirth,
					"country":       patient.Country,
					"city":          patient.City,
					"sub_city":      patient.SubCity,
					"region":        patient.Region,
					"woreda":        patient.Woreda,
					"zone":          patient.Zone,
					"kebele":        patient.Kebele,
					"created_at":    patient.CreatedAt,
					"updated_at":    patient.UpdatedAt,
				},
			}

			body = append(body, item)
		}

		return nil
	})

	return body, nil
}

// GetAllAppointments ...
func (p *PostgresDataSource) GetAllAppointments() ([]map[string]interface{}, error) {
	var appointments []models.Appointment

	body := []map[string]interface{}{}

	p.DB.Preload("Patient").Preload("Room").Preload("VisitType").Preload("AppointmentStatus").Order("id ASC").FindInBatches(&appointments, 1000, func(tx *gorm.DB, batch int) error {
		for _, appointment := range appointments {
			item := map[string]interface{}{
				"meta": map[string]interface{}{
					"_index": "appointments",
					"_id":    appointment.ID,
				},
				"data": map[string]interface{}{
					"patient_id":         appointment.PatientID,
					"patient_first_name": appointment.FirstName,
					"patient_last_name":  appointment.LastName,
					"patient_full_name":  appointment.FirstName + " " + appointment.LastName,
					"patient_gender":     appointment.Patient.Gender,
					"patient_country":    appointment.Patient.Country,
					"patient_region":     appointment.Patient.Region,
					"patient_woreda":     appointment.Patient.Woreda,
					"check_in_time":      appointment.CheckInTime,
					"checked_in_time":    appointment.CheckedInTime,
					"checked_out_time":   appointment.CheckedOutTime,
					"room":               appointment.Room.Title,
					"visit_type":         appointment.VisitType.Title,
					"status":             appointment.AppointmentStatus.Title,
					"emergency":          appointment.Emergency,
					"medical_department": appointment.MedicalDepartment,
					"credit":             appointment.Credit,
					"provider":           "Dr. " + appointment.ProviderName,
					"created_at":         appointment.CreatedAt,
					"updated_at":         appointment.UpdatedAt,
				},
			}

			body = append(body, item)
		}
		return nil
	})

	return body, nil
}

// GetAllDiagnosticProcedures ...
func (p *PostgresDataSource) GetAllDiagnosticProcedures() ([]map[string]interface{}, error) {
	var diagnosticProcedures []models.DiagnosticProcedure

	body := []map[string]interface{}{}

	p.DB.Order("id ASC").FindInBatches(&diagnosticProcedures, 1000, func(tx *gorm.DB, batch int) error {
		for _, diagnosticProcedure := range diagnosticProcedures {
			item := map[string]interface{}{
				"meta": map[string]interface{}{
					"_index": "diagnostic-procedures",
					"_id":    diagnosticProcedure.ID,
				},
				"data": map[string]interface{}{
					"is_refraction": diagnosticProcedure.IsRefraction,
					"type":          diagnosticProcedure.DiagnosticProcedureTypeTitle,
					"status":        diagnosticProcedure.Status,
					"created_at":    diagnosticProcedure.CreatedAt,
					"updated_at":    diagnosticProcedure.UpdatedAt,
				},
			}

			body = append(body, item)
		}
		return nil
	})

	return body, nil
}

// GetAllSurgicalProcedures ...
func (p *PostgresDataSource) GetAllSurgicalProcedures() ([]map[string]interface{}, error) {
	var surgicalProcedures []models.SurgicalProcedure

	body := []map[string]interface{}{}

	p.DB.Order("id ASC").FindInBatches(&surgicalProcedures, 1000, func(tx *gorm.DB, batch int) error {
		for _, surgicalProcedure := range surgicalProcedures {
			item := map[string]interface{}{
				"meta": map[string]interface{}{
					"_index": "surgical-procedures",
					"_id":    surgicalProcedure.ID,
				},
				"data": map[string]interface{}{
					"type":       surgicalProcedure.SurgicalProcedureTypeTitle,
					"status":     surgicalProcedure.Status,
					"created_at": surgicalProcedure.CreatedAt,
					"updated_at": surgicalProcedure.UpdatedAt,
				},
			}

			body = append(body, item)
		}
		return nil
	})

	return body, nil
}

// GetAllTreatments ...
func (p *PostgresDataSource) GetAllTreatments() ([]map[string]interface{}, error) {
	var treatments []models.Treatment

	body := []map[string]interface{}{}

	p.DB.Order("id ASC").FindInBatches(&treatments, 1000, func(tx *gorm.DB, batch int) error {
		for _, treatment := range treatments {
			item := map[string]interface{}{
				"meta": map[string]interface{}{
					"_index": "treatments",
					"_id":    treatment.ID,
				},
				"data": map[string]interface{}{
					"type":       treatment.TreatmentTypeTitle,
					"status":     treatment.Status,
					"created_at": treatment.CreatedAt,
					"updated_at": treatment.UpdatedAt,
				},
			}

			body = append(body, item)
		}
		return nil
	})

	return body, nil
}
