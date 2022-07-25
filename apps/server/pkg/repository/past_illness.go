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

type PastIllnessRepository struct {
	DB *gorm.DB
}

func ProvidePastIllnessRepository(DB *gorm.DB) PastIllnessRepository {
	return PastIllnessRepository{DB: DB}
}

// Save ...
func (r *PastIllnessRepository) Save(m *models.PastIllness) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *PastIllnessRepository) Get(m *models.PastIllness, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByPatientHistoryID ...
func (r *PastIllnessRepository) GetByPatientHistoryID(ID int) ([]*models.PastIllness, error) {
	var result []*models.PastIllness

	err := r.DB.Where("patient_history_id = ?", ID).Find(&result).Error

	if err != nil {
		return result, err
	}

	return result, nil
}

// Update ...
func (r *PastIllnessRepository) Update(m *models.PastIllness) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *PastIllnessRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.PastIllness{}).Error
}
