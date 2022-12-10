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
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	"gorm.io/gorm"
)

type PatientHistoryRepository struct {
	DB *gorm.DB
}

func ProvidePatientHistoryRepository(DB *gorm.DB) PatientHistoryRepository {
	return PatientHistoryRepository{DB: DB}
}

// Save ...
func (r *PatientHistoryRepository) Save(m *models.PatientHistory) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *PatientHistoryRepository) Get(m *models.PatientHistory, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByPatientID ...
func (r *PatientHistoryRepository) GetByPatientID(m *models.PatientHistory, ID int) error {
	return r.DB.Where("patient_id = ?", ID).Take(&m).Error
}

// GetByPatientIDWithDetails ...
func (r *PatientHistoryRepository) GetByPatientIDWithDetails(m *models.PatientHistory, ID int) error {
	return r.DB.Where("patient_id = ?", ID).Preload("PastIllnesses").Preload("PastInjuries").Preload("PastHospitalizations").Preload("PastSurgeries").Preload("FamilyIllnesses").Preload("Lifestyles").Preload("Allergies").Take(&m).Error
}

// Update ...
func (r *PatientHistoryRepository) Update(m *models.PatientHistory) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *PatientHistoryRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.PatientHistory{}).Error
}
