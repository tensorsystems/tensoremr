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

type PharmacyRepository struct {
	DB *gorm.DB
}

func ProvidePharmacyRepository(DB *gorm.DB) PharmacyRepository {
	return PharmacyRepository{DB: DB}
}

// Get ...
func (r *PharmacyRepository) Get(m *models.Pharmacy, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetAll ...
func (r *PharmacyRepository) GetAll(p models.PaginationInput, filter *models.Pharmacy) ([]models.Pharmacy, int64, error) {
	var result []models.Pharmacy

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

// Save ...
func (r *PharmacyRepository) Save(m *models.Pharmacy) error {
	return r.DB.Create(&m).Error
}

// Update ...
func (r *PharmacyRepository) Update(m *models.Pharmacy) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *PharmacyRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.Pharmacy{}).Error
}
