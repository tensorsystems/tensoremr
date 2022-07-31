package datasource

import (
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	"gorm.io/gorm"
)

type Patients struct {
	DB *gorm.DB
}

// GetAllPatients ...
func (p *Patients) GetAllPatients() ([]map[string]interface{}, error) {
	var patients []models.Patient

	if err := p.DB.Order("id ASC").Find(&patients).Error; err != nil {
		return nil, err
	}

	body := []map[string]interface{}{}

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

	return body, nil
}
