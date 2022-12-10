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

type HpiComponentTypeRepository struct {
	DB *gorm.DB
}

func ProvideHpiComponentTypeRepository(DB *gorm.DB) HpiComponentTypeRepository {
	return HpiComponentTypeRepository{DB: DB}
}

// Save ...
func (r *HpiComponentTypeRepository) Save(m *models.HpiComponentType) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *HpiComponentTypeRepository) Get(m *models.HpiComponentType, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// Update ...
func (r *HpiComponentTypeRepository) Update(m *models.HpiComponentType) error {
	return r.DB.Updates(&m).Error
}

// Count ...
func (r *HpiComponentTypeRepository) Count(dbString string) (int64, error) {
	var count int64

	err := r.DB.Model(&models.HpiComponent{}).Count(&count).Error
	return count, err
}

// GetAll ...
func (r *HpiComponentTypeRepository) GetAll(p models.PaginationInput) ([]models.HpiComponentType, int64, error) {
	var result []models.HpiComponentType

	var count int64
	count, countErr := r.Count("")
	if countErr != nil {
		return result, 0, countErr
	}

	err := r.DB.Scopes(models.Paginate(&p)).Order("id ASC").Find(&result).Error
	if err != nil {
		return result, 0, err
	}

	return result, count, err
}

// Delete ...
func (r *HpiComponentTypeRepository) Delete(ID int) error {
	err := r.DB.Where("id = ?", ID).Delete(&models.HpiComponentType{}).Error
	return err
}
