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

type PatientEncounterLimitRepository struct {
	DB *gorm.DB
}

func ProvidePatientEncounterLimitRepository(DB *gorm.DB) PatientEncounterLimitRepository {
	return PatientEncounterLimitRepository{DB: DB}
}

// Save ...
func (r *PatientEncounterLimitRepository) Save(m *models.PatientEncounterLimit) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *PatientEncounterLimitRepository) Get(m *models.PatientEncounterLimit, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByUser ...
func (r *PatientEncounterLimitRepository) GetByUser(m *models.PatientEncounterLimit, userID int) error {
	return r.DB.Where("user_id = ?", userID).Take(&m).Error
}

// GetAll ...
func (r *PatientEncounterLimitRepository) GetAll(p models.PaginationInput) ([]models.PatientEncounterLimit, int64, error) {
	var result []models.PatientEncounterLimit

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Preload("User").Order("id DESC").Find(&result)

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
func (r *PatientEncounterLimitRepository) Update(m *models.PatientEncounterLimit) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *PatientEncounterLimitRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.PatientEncounterLimit{}).Error
}
