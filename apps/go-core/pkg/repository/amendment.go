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

type AmendmentRepository struct {
	DB *gorm.DB
}

func ProvideAmendmentRepository(DB *gorm.DB) AmendmentRepository {
	return AmendmentRepository{DB: DB}
}

// Create ...
func (r *AmendmentRepository) Create(m *models.Amendment) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *AmendmentRepository) Get(m *models.Amendment, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetAll ...
func (r *AmendmentRepository) GetAll(filter *models.Amendment) ([]*models.Amendment, error) {
	var result []*models.Amendment
	err := r.DB.Where(filter).Order("id ASC").Find(&result).Error
	return result, err
}

// Update ...
func (r *AmendmentRepository) Update(m *models.Amendment) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *AmendmentRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.Amendment{}).Error
}
