package jobs

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	"gorm.io/gorm"
)

type Jobs struct {
	DB *gorm.DB
}

func ProvideJobs(DB *gorm.DB) Jobs {
	return Jobs{DB: DB}
}

// PatientsJobs ...
func (j *Jobs) PatientsInsertAll() error {
	var patients []models.Patient

	j.DB.Order("id ASC").Find(&patients)

	bulkArray := []string{}

	for _, patient := range patients {
		action := map[string]interface{}{
			"index": map[string]interface{}{
				"_index": "patients",
				"_id":    patient.ID,
			},
		}

		document := map[string]interface{}{
			"first_name":    patient.FirstName,
			"last_name":     patient.LastName,
			"full_name":     patient.FullName,
			"gender":        patient.Gender,
			"phone_no":      patient.PhoneNo,
			"phone_no2":     patient.PhoneNo2,
			"email":         patient.Email,
			"date_of_birth": patient.DateOfBirth,
			"city":          patient.City,
			"sub_city":      patient.SubCity,
			"region":        patient.Region,
			"woreda":        patient.Woreda,
			"zone":          patient.Zone,
			"kebede":        patient.Kebele,
		}

		actionJson, _ := json.Marshal(action)
		documentJson, _ := json.Marshal(document)

		bulkArray = append(bulkArray, string(actionJson), string(documentJson))
	}

	bulkString := strings.Join(bulkArray, "\n")

	fmt.Println(bulkString)

	return nil
}
