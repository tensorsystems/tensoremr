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
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	"gorm.io/gorm"
)

type PatientDiagnosisRepository struct {
	DB *gorm.DB
}

func ProvidePatientDiagnosisRepository(DB *gorm.DB) PatientDiagnosisRepository {
	return PatientDiagnosisRepository{DB: DB}
}

// Save ...
func (r *PatientDiagnosisRepository) Save(m *models.PatientDiagnosis, diagnosisID int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var diagnosis models.Diagnosis
		if err := tx.Where("id = ?", diagnosisID).Take(&diagnosis).Error; err != nil {
			return err
		}

		m.CategoryCode = diagnosis.CategoryCode
		m.DiagnosisCode = diagnosis.DiagnosisCode
		m.FullCode = diagnosis.FullCode
		m.AbbreviatedDescription = diagnosis.AbbreviatedDescription
		m.FullDescription = diagnosis.FullDescription

		if err := tx.Create(&m).Error; err != nil {
			return err
		}

		return nil
	})
}

// GetByPatientChartID ...
func (r *PatientDiagnosisRepository) GetByPatientChartID(m *models.PatientDiagnosis, ID int) error {
	return r.DB.Where("patient_chart_id = ?", ID).Take(&m).Error
}

// Get ...
func (r *PatientDiagnosisRepository) Get(m *models.PatientDiagnosis, ID int) error {
	err := r.DB.Where("id = ?", ID).Take(&m).Error
	if err != nil {
		return err
	}

	return nil
}

// GetAll ...
func (r *PatientDiagnosisRepository) GetAll(p models.PaginationInput, filter *models.PatientDiagnosis) ([]models.PatientDiagnosis, int64, error) {
	var result []models.PatientDiagnosis

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// Update ...
func (r *PatientDiagnosisRepository) Update(m *models.PatientDiagnosis) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *PatientDiagnosisRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.PatientDiagnosis{}).Error
}
