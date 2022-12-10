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

type EyewearPrescriptionRepository struct {
	DB *gorm.DB
}

func ProvideEyewearPrescriptionRepository(DB *gorm.DB) EyewearPrescriptionRepository {
	return EyewearPrescriptionRepository{DB: DB}
}

// Save ...
func (r *EyewearPrescriptionRepository) Save(m *models.EyewearPrescription) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *EyewearPrescriptionRepository) Get(m *models.EyewearPrescription, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetAll ...
func (r *EyewearPrescriptionRepository) GetAll(p PaginationInput, filter *models.EyewearPrescription) ([]models.EyewearPrescription, int64, error) {
	var result []models.EyewearPrescription

	dbOp := r.DB.Scopes(Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Order("id ASC").Find(&result)

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
func (r *EyewearPrescriptionRepository) Update(m *models.EyewearPrescription) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *EyewearPrescriptionRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.EyewearPrescription{}).Error
}
