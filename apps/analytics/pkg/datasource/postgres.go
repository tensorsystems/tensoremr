package datasource

import (
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	"gorm.io/gorm"
)

type PostgresDataSource struct {
	DB *gorm.DB
}

// GetPatientById ...
func (p *PostgresDataSource) GetPatientById(id int) (map[string]interface{}, error) {
	var patient models.Patient

	if err := p.DB.Where("id = ?", id).Take(&patient).Error; err != nil {
		return nil, err
	}

	body := map[string]interface{}{
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

	return body, nil
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

// GetAppointmentById ...
func (p *PostgresDataSource) GetAppointmentById(id int) (map[string]interface{}, error) {
	var appointment models.Appointment

	if err := p.DB.Where("id = ?", id).Preload("Patient").Preload("Room").Preload("VisitType").Preload("AppointmentStatus").Take(&appointment).Error; err != nil {
		return nil, err
	}

	body := map[string]interface{}{
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

// GetDiagnosticProcedureById ...
func (p *PostgresDataSource) GetDiagnosticProcedureById(id int) (map[string]interface{}, error) {
	var diagnosticProcedure models.DiagnosticProcedure
	if err := p.DB.Where("id = ?", id).Take(&diagnosticProcedure).Error; err != nil {
		return nil, err
	}

	var order models.DiagnosticProcedureOrder
	if err := p.DB.Where("id = ?", diagnosticProcedure.DiagnosticProcedureOrderID).Take(&order).Error; err != nil {
		return nil, err
	}

	var patient models.Patient
	if err := p.DB.Where("id = ?", order.PatientID).Take(&patient).Error; err != nil {
		return nil, err
	}

	body := map[string]interface{}{
		"meta": map[string]interface{}{
			"_index": "diagnostic-procedures",
			"_id":    diagnosticProcedure.ID,
		},
		"data": map[string]interface{}{
			"is_refraction":      diagnosticProcedure.IsRefraction,
			"type":               diagnosticProcedure.DiagnosticProcedureTypeTitle,
			"status":             diagnosticProcedure.Status,
			"patient_id":         patient.ID,
			"patient_first_name": patient.FirstName,
			"patient_last_name":  patient.LastName,
			"patient_full_name":  patient.FirstName + " " + patient.LastName,
			"patient_gender":     patient.Gender,
			"patient_country":    patient.Country,
			"patient_region":     patient.Region,
			"patient_woreda":     patient.Woreda,
			"created_at":         diagnosticProcedure.CreatedAt,
			"updated_at":         diagnosticProcedure.UpdatedAt,
		},
	}

	return body, nil
}

// GetAllDiagnosticProcedures ...
func (p *PostgresDataSource) GetAllDiagnosticProcedures() ([]map[string]interface{}, error) {
	var diagnosticProcedures []models.DiagnosticProcedure

	body := []map[string]interface{}{}

	p.DB.Order("id ASC").FindInBatches(&diagnosticProcedures, 1000, func(tx *gorm.DB, batch int) error {
		for _, diagnosticProcedure := range diagnosticProcedures {
			var order models.DiagnosticProcedureOrder
			if err := p.DB.Where("id = ?", diagnosticProcedure.DiagnosticProcedureOrderID).Take(&order).Error; err != nil {
				return err
			}

			var patient models.Patient
			if err := p.DB.Where("id = ?", order.PatientID).Take(&patient).Error; err != nil {
				return err
			}

			item := map[string]interface{}{
				"meta": map[string]interface{}{
					"_index": "diagnostic-procedures",
					"_id":    diagnosticProcedure.ID,
				},
				"data": map[string]interface{}{
					"is_refraction":      diagnosticProcedure.IsRefraction,
					"type":               diagnosticProcedure.DiagnosticProcedureTypeTitle,
					"status":             diagnosticProcedure.Status,
					"patient_id":         patient.ID,
					"patient_first_name": patient.FirstName,
					"patient_last_name":  patient.LastName,
					"patient_full_name":  patient.FirstName + " " + patient.LastName,
					"patient_gender":     patient.Gender,
					"patient_country":    patient.Country,
					"patient_region":     patient.Region,
					"patient_woreda":     patient.Woreda,
					"created_at":         diagnosticProcedure.CreatedAt,
					"updated_at":         diagnosticProcedure.UpdatedAt,
				},
			}

			body = append(body, item)
		}
		return nil
	})

	return body, nil
}

// GetSurgicalProcedureById ...
func (p *PostgresDataSource) GetSurgicalProcedureById(id int) (map[string]interface{}, error) {
	var surgicalProcedure models.SurgicalProcedure

	if err := p.DB.Where("id = ?", id).Take(&surgicalProcedure).Error; err != nil {
		return nil, err
	}

	var order models.SurgicalOrder
	if err := p.DB.Where("id = ?", surgicalProcedure.SurgicalOrderID).Take(&order).Error; err != nil {
		return nil, err
	}

	var patient models.Patient
	if err := p.DB.Where("id = ?", order.PatientID).Take(&patient).Error; err != nil {
		return nil, err
	}

	body := map[string]interface{}{
		"meta": map[string]interface{}{
			"_index": "surgical-procedures",
			"_id":    surgicalProcedure.ID,
		},
		"data": map[string]interface{}{
			"type":               surgicalProcedure.SurgicalProcedureTypeTitle,
			"status":             surgicalProcedure.Status,
			"patient_id":         patient.ID,
			"patient_first_name": patient.FirstName,
			"patient_last_name":  patient.LastName,
			"patient_full_name":  patient.FirstName + " " + patient.LastName,
			"patient_gender":     patient.Gender,
			"patient_country":    patient.Country,
			"patient_region":     patient.Region,
			"patient_woreda":     patient.Woreda,
			"created_at":         surgicalProcedure.CreatedAt,
			"updated_at":         surgicalProcedure.UpdatedAt,
		},
	}

	return body, nil
}

// GetAllSurgicalProcedures ...
func (p *PostgresDataSource) GetAllSurgicalProcedures() ([]map[string]interface{}, error) {
	var surgicalProcedures []models.SurgicalProcedure

	body := []map[string]interface{}{}

	p.DB.Order("id ASC").FindInBatches(&surgicalProcedures, 1000, func(tx *gorm.DB, batch int) error {
		for _, surgicalProcedure := range surgicalProcedures {
			var order models.SurgicalOrder
			if err := p.DB.Where("id = ?", surgicalProcedure.SurgicalOrderID).Take(&order).Error; err != nil {
				return err
			}

			var patient models.Patient
			if err := p.DB.Where("id = ?", order.PatientID).Take(&patient).Error; err != nil {
				return err
			}

			item := map[string]interface{}{
				"meta": map[string]interface{}{
					"_index": "surgical-procedures",
					"_id":    surgicalProcedure.ID,
				},
				"data": map[string]interface{}{
					"type":               surgicalProcedure.SurgicalProcedureTypeTitle,
					"status":             surgicalProcedure.Status,
					"patient_id":         patient.ID,
					"patient_first_name": patient.FirstName,
					"patient_last_name":  patient.LastName,
					"patient_full_name":  patient.FirstName + " " + patient.LastName,
					"patient_gender":     patient.Gender,
					"patient_country":    patient.Country,
					"patient_region":     patient.Region,
					"patient_woreda":     patient.Woreda,
					"created_at":         surgicalProcedure.CreatedAt,
					"updated_at":         surgicalProcedure.UpdatedAt,
				},
			}

			body = append(body, item)
		}
		return nil
	})

	return body, nil
}

// GetTreatmentById ...
func (p *PostgresDataSource) GetTreatmentById(id int) (map[string]interface{}, error) {
	var treatment models.Treatment

	if err := p.DB.Where("id = ?", id).Take(&treatment).Error; err != nil {
		return nil, err
	}

	var order models.TreatmentOrder
	if err := p.DB.Where("id = ?", treatment.TreatmentOrderID).Take(&order).Error; err != nil {
		return nil, err
	}

	var patient models.Patient
	if err := p.DB.Where("id = ?", order.PatientID).Take(&patient).Error; err != nil {
		return nil, err
	}

	body := map[string]interface{}{
		"meta": map[string]interface{}{
			"_index": "treatments",
			"_id":    treatment.ID,
		},
		"data": map[string]interface{}{
			"type":               treatment.TreatmentTypeTitle,
			"status":             treatment.Status,
			"patient_id":         patient.ID,
			"patient_first_name": patient.FirstName,
			"patient_last_name":  patient.LastName,
			"patient_full_name":  patient.FirstName + " " + patient.LastName,
			"patient_gender":     patient.Gender,
			"patient_country":    patient.Country,
			"patient_region":     patient.Region,
			"patient_woreda":     patient.Woreda,
			"created_at":         treatment.CreatedAt,
			"updated_at":         treatment.UpdatedAt,
		},
	}

	return body, nil
}

// GetAllTreatments ...
func (p *PostgresDataSource) GetAllTreatments() ([]map[string]interface{}, error) {
	var treatments []models.Treatment

	body := []map[string]interface{}{}

	p.DB.Order("id ASC").FindInBatches(&treatments, 1000, func(tx *gorm.DB, batch int) error {
		for _, treatment := range treatments {
			var order models.TreatmentOrder
			if err := p.DB.Where("id = ?", treatment.TreatmentOrderID).Take(&order).Error; err != nil {
				return err
			}

			var patient models.Patient
			if err := p.DB.Where("id = ?", order.PatientID).Take(&patient).Error; err != nil {
				return err
			}

			item := map[string]interface{}{
				"meta": map[string]interface{}{
					"_index": "treatments",
					"_id":    treatment.ID,
				},
				"data": map[string]interface{}{
					"type":               treatment.TreatmentTypeTitle,
					"status":             treatment.Status,
					"patient_id":         patient.ID,
					"patient_first_name": patient.FirstName,
					"patient_last_name":  patient.LastName,
					"patient_full_name":  patient.FirstName + " " + patient.LastName,
					"patient_gender":     patient.Gender,
					"patient_country":    patient.Country,
					"patient_region":     patient.Region,
					"patient_woreda":     patient.Woreda,
					"created_at":         treatment.CreatedAt,
					"updated_at":         treatment.UpdatedAt,
				},
			}

			body = append(body, item)
		}
		return nil
	})

	return body, nil
}

// GetTreatmentById ...
func (p *PostgresDataSource) GetMedicalPrescriptionById(id int) (map[string]interface{}, error) {
	var medicalPrescription models.MedicalPrescription

	if err := p.DB.Where("id = ?", id).Preload("Patient").Take(&medicalPrescription).Error; err != nil {
		return nil, err
	}

	body := map[string]interface{}{
		"meta": map[string]interface{}{
			"_index": "medical-prescriptions",
			"_id":    medicalPrescription.ID,
		},
		"data": map[string]interface{}{
			"patient_first_name":   medicalPrescription.Patient.FirstName,
			"patient_last_name":    medicalPrescription.Patient.LastName,
			"patient_full_name":    medicalPrescription.Patient.FirstName + " " + medicalPrescription.Patient.LastName,
			"patient_gender":       medicalPrescription.Patient.Gender,
			"medication":           medicalPrescription.Medication,
			"sig":                  medicalPrescription.Sig,
			"refill":               medicalPrescription.Refill,
			"generic":              medicalPrescription.Generic,
			"substitution_allowed": medicalPrescription.SubstitutionAllowed,
			"prescribed_date":      medicalPrescription.PrescribedDate,
			"history":              medicalPrescription.History,
			"status":               medicalPrescription.Status,
			"created_at":           medicalPrescription.CreatedAt,
			"updated_at":           medicalPrescription.UpdatedAt,
		},
	}

	return body, nil
}

// GetAllMedicalPrescriptions ...
func (p *PostgresDataSource) GetAllMedicalPrescriptions() ([]map[string]interface{}, error) {
	var medicalPrescriptions []models.MedicalPrescription

	body := []map[string]interface{}{}

	p.DB.Preload("Patient").Order("id ASC").FindInBatches(&medicalPrescriptions, 1000, func(tx *gorm.DB, batch int) error {
		for _, medicalPrescription := range medicalPrescriptions {
			item := map[string]interface{}{
				"meta": map[string]interface{}{
					"_index": "medical-prescriptions",
					"_id":    medicalPrescription.ID,
				},
				"data": map[string]interface{}{
					"patient_first_name":   medicalPrescription.Patient.FirstName,
					"patient_last_name":    medicalPrescription.Patient.LastName,
					"patient_full_name":    medicalPrescription.Patient.FirstName + " " + medicalPrescription.Patient.LastName,
					"patient_gender":       medicalPrescription.Patient.Gender,
					"medication":           medicalPrescription.Medication,
					"sig":                  medicalPrescription.Sig,
					"refill":               medicalPrescription.Refill,
					"generic":              medicalPrescription.Generic,
					"substitution_allowed": medicalPrescription.SubstitutionAllowed,
					"prescribed_date":      medicalPrescription.PrescribedDate,
					"history":              medicalPrescription.History,
					"status":               medicalPrescription.Status,
					"created_at":           medicalPrescription.CreatedAt,
					"updated_at":           medicalPrescription.UpdatedAt,
				},
			}

			body = append(body, item)
		}
		return nil
	})

	return body, nil
}

// GetEyewearPrescriptionById ...
func (p *PostgresDataSource) GetEyewearPrescriptionById(id int) (map[string]interface{}, error) {
	var eyewearPrescription models.EyewearPrescription

	if err := p.DB.Where("id = ?", id).Preload("Patient").Take(&eyewearPrescription).Error; err != nil {
		return nil, err
	}

	body := map[string]interface{}{
		"meta": map[string]interface{}{
			"_index": "eyewear-prescriptions",
			"_id":    eyewearPrescription.ID,
		},
		"data": map[string]interface{}{
			"patient_first_name":   eyewearPrescription.Patient.FirstName,
			"patient_last_name":    eyewearPrescription.Patient.LastName,
			"patient_full_name":    eyewearPrescription.Patient.FirstName + " " + eyewearPrescription.Patient.LastName,
			"patient_gender":       eyewearPrescription.Patient.Gender,
			"glass":                eyewearPrescription.Glass,
			"plastic":              eyewearPrescription.Plastic,
			"single_vision":        eyewearPrescription.SingleVision,
			"photo_chromatic":      eyewearPrescription.PhotoChromatic,
			"glare_free":           eyewearPrescription.GlareFree,
			"scratch_resistant":    eyewearPrescription.ScratchResistant,
			"bifocal":              eyewearPrescription.Bifocal,
			"progressive":          eyewearPrescription.Progressive,
			"two_separate_glasses": eyewearPrescription.TwoSeparateGlasses,
			"high_index":           eyewearPrescription.HighIndex,
			"tine":                 eyewearPrescription.Tint,
			"blue_cut":             eyewearPrescription.BlueCut,
			"prescribed_date":      eyewearPrescription.PrescribedDate,
			"history":              eyewearPrescription.History,
			"status":               eyewearPrescription.Status,
			"created_at":           eyewearPrescription.CreatedAt,
			"updated_at":           eyewearPrescription.UpdatedAt,
		},
	}

	return body, nil
}

// GetAllEyewearPrescriptions ...
func (p *PostgresDataSource) GetAllEyewearPrescriptions() ([]map[string]interface{}, error) {
	var eyewearPrescriptions []models.EyewearPrescription

	body := []map[string]interface{}{}

	p.DB.Preload("Patient").Order("id ASC").FindInBatches(&eyewearPrescriptions, 1000, func(tx *gorm.DB, batch int) error {
		for _, eyewearPrescription := range eyewearPrescriptions {
			item := map[string]interface{}{
				"meta": map[string]interface{}{
					"_index": "eyewear-prescriptions",
					"_id":    eyewearPrescription.ID,
				},
				"data": map[string]interface{}{
					"patient_first_name":   eyewearPrescription.Patient.FirstName,
					"patient_last_name":    eyewearPrescription.Patient.LastName,
					"patient_full_name":    eyewearPrescription.Patient.FirstName + " " + eyewearPrescription.Patient.LastName,
					"patient_gender":       eyewearPrescription.Patient.Gender,
					"glass":                eyewearPrescription.Glass,
					"plastic":              eyewearPrescription.Plastic,
					"single_vision":        eyewearPrescription.SingleVision,
					"photo_chromatic":      eyewearPrescription.PhotoChromatic,
					"glare_free":           eyewearPrescription.GlareFree,
					"scratch_resistant":    eyewearPrescription.ScratchResistant,
					"bifocal":              eyewearPrescription.Bifocal,
					"progressive":          eyewearPrescription.Progressive,
					"two_separate_glasses": eyewearPrescription.TwoSeparateGlasses,
					"high_index":           eyewearPrescription.HighIndex,
					"tine":                 eyewearPrescription.Tint,
					"blue_cut":             eyewearPrescription.BlueCut,
					"prescribed_date":      eyewearPrescription.PrescribedDate,
					"history":              eyewearPrescription.History,
					"status":               eyewearPrescription.Status,
					"created_at":           eyewearPrescription.CreatedAt,
					"updated_at":           eyewearPrescription.UpdatedAt,
				},
			}

			body = append(body, item)
		}
		return nil
	})

	return body, nil
}

// GetPatientDiagnosisById ...
func (p *PostgresDataSource) GetPatientDiagnosisById(id int) (map[string]interface{}, error) {
	var patientDiagnosis models.PatientDiagnosis

	if err := p.DB.Where("id = ?", id).Take(&patientDiagnosis).Error; err != nil {
		return nil, err
	}

	var patientChart models.PatientChart
	if err := p.DB.Where("id = ?", patientDiagnosis.PatientChartID).Take(&patientChart).Error; err != nil {
		return nil, err
	}

	var appointment models.Appointment
	if err := p.DB.Where("id = ?", patientChart.AppointmentID).Preload("Patient").Take(&appointment).Error; err != nil {
		return nil, err
	}

	body := map[string]interface{}{
		"meta": map[string]interface{}{
			"_index": "patient-diagnoses",
			"_id":    patientDiagnosis.ID,
		},
		"data": map[string]interface{}{
			"category_code":           patientDiagnosis.CategoryCode,
			"diagnosis_code":          patientDiagnosis.DiagnosisCode,
			"full_code":               patientDiagnosis.FullCode,
			"abbreviated_description": patientDiagnosis.AbbreviatedDescription,
			"full_description":        patientDiagnosis.FullDescription,
			"category_title":          patientDiagnosis.CategoryTitle,
			"location":                patientDiagnosis.Location,
			"differential":            patientDiagnosis.Differential,
			"patient_first_name":      appointment.Patient.FirstName,
			"patient_last_name":       appointment.Patient.LastName,
			"patient_full_name":       appointment.Patient.FirstName + " " + appointment.Patient.LastName,
			"patient_gender":          appointment.Patient.Gender,
			"created_at":              patientDiagnosis.CreatedAt,
			"updated_at":              patientDiagnosis.UpdatedAt,
		},
	}

	return body, nil
}

// GetAllPatientDiagnoses ...
func (p *PostgresDataSource) GetAllPatientDiagnoses() ([]map[string]interface{}, error) {
	var diagnoses []models.PatientDiagnosis

	body := []map[string]interface{}{}

	p.DB.Order("id ASC").FindInBatches(&diagnoses, 1000, func(tx *gorm.DB, batch int) error {
		for _, diagnosis := range diagnoses {
			var patientChart models.PatientChart
			if err := p.DB.Where("id = ?", diagnosis.PatientChartID).Take(&patientChart).Error; err != nil {
				return err
			}

			var appointment models.Appointment
			if err := p.DB.Where("id = ?", patientChart.AppointmentID).Preload("Patient").Take(&appointment).Error; err != nil {
				return err
			}

			item := map[string]interface{}{
				"meta": map[string]interface{}{
					"_index": "patient-diagnoses",
					"_id":    diagnosis.ID,
				},
				"data": map[string]interface{}{
					"category_code":           diagnosis.CategoryCode,
					"diagnosis_code":          diagnosis.DiagnosisCode,
					"full_code":               diagnosis.FullCode,
					"abbreviated_description": diagnosis.AbbreviatedDescription,
					"full_description":        diagnosis.FullDescription,
					"category_title":          diagnosis.CategoryTitle,
					"location":                diagnosis.Location,
					"differential":            diagnosis.Differential,
					"patient_first_name":      appointment.Patient.FirstName,
					"patient_last_name":       appointment.Patient.LastName,
					"patient_full_name":       appointment.Patient.FirstName + " " + appointment.Patient.LastName,
					"patient_gender":          appointment.Patient.Gender,
					"created_at":              diagnosis.CreatedAt,
					"updated_at":              diagnosis.UpdatedAt,
				},
			}

			body = append(body, item)
		}
		return nil
	})

	return body, nil
}
