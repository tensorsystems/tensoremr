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

type HpiComponentRepository struct {
	DB *gorm.DB
}

func ProvideHpiComponentRepository(DB *gorm.DB) HpiComponentRepository {
	return HpiComponentRepository{DB: DB}
}

// Save ...
func (r *HpiComponentRepository) Save(m *models.HpiComponent) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *HpiComponentRepository) Get(m *models.HpiComponent, ID int) error {
	return r.DB.Where("id = ?", ID).Preload("HpiComponentType").Take(&m).Error
}

// GetByIds ...
func (r *HpiComponentRepository) GetByIds(ids []*int) ([]models.HpiComponent, error) {
	var result []models.HpiComponent

	err := r.DB.Where("id IN ?", ids).Find(&result).Error

	if err != nil {
		return result, err
	}

	return result, nil
}

// Update ...
func (r *HpiComponentRepository) Update(m *models.HpiComponent) error {
	return r.DB.Updates(&m).Error
}

// GetAll ...
func (r *HpiComponentRepository) GetAll(p models.PaginationInput, filter *models.HpiComponent) ([]models.HpiComponent, int64, error) {
	var result []models.HpiComponent

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("HpiComponentType").Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// Search ...
func (r *HpiComponentRepository) Search(p models.PaginationInput, filter *models.HpiComponent, searchTerm *string) ([]models.HpiComponent, int64, error) {
	var result []models.HpiComponent

	tx := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter)

	if searchTerm != nil {
		tx.Where("title ILIKE ?", "%"+*searchTerm+"%")
	}

	err := tx.Preload("HpiComponentType").Order("id ASC").Find(&result).Error

	if err != nil {
		return result, 0, err
	}

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	return result, count, err
}

// Delete ...
func (r *HpiComponentRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.HpiComponent{}).Error
}
