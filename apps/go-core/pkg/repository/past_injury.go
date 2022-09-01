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

type PastInjuryRepository struct {
	DB *gorm.DB
}

func ProvidePastInjuryRepository(DB *gorm.DB) PastInjuryRepository {
	return PastInjuryRepository{DB: DB}
}

// Save ...
func (r *PastInjuryRepository) Save(m *models.PastInjury) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *PastInjuryRepository) Get(m *models.PastInjury, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByPatientHistoryID ...
func (r *PastInjuryRepository) GetByPatientHistoryID(ID int) ([]*models.PastInjury, error) {
	var result []*models.PastInjury

	err := r.DB.Where("patient_history_id = ?", ID).Find(&result).Error

	if err != nil {
		return result, err
	}

	return result, nil
}

// Update ...
func (r *PastInjuryRepository) Update(m *models.PastInjury) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *PastInjuryRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.PastInjury{}).Error
}
