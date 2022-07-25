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

type SurgicalProcedureTypeRepository struct {
	DB *gorm.DB
}

func ProvideSurgicalProcedureTypeRepository(DB *gorm.DB) SurgicalProcedureTypeRepository {
	return SurgicalProcedureTypeRepository{DB: DB}
}

// Save ...
func (r *SurgicalProcedureTypeRepository) Save(m *models.SurgicalProcedureType) error {
	return r.DB.Create(&m).Error
}

// GetAll ...
func (r *SurgicalProcedureTypeRepository) GetAll(p models.PaginationInput, searchTerm *string) ([]models.SurgicalProcedureType, int64, error) {
	var result []models.SurgicalProcedureType

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count")

	if searchTerm != nil {
		dbOp.Where("title ILIKE ?", "%"+*searchTerm+"%")
	}

	dbOp.Order("id ASC").Preload("Billings").Preload("Supplies.Billings").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// Get ...
func (r *SurgicalProcedureTypeRepository) Get(m *models.SurgicalProcedureType, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByTitle ...
func (r *SurgicalProcedureTypeRepository) GetByTitle(m *models.SurgicalProcedureType, title string) error {
	return r.DB.Where("title = ?", title).Take(&m).Error
}

// Update ...
func (r *SurgicalProcedureTypeRepository) Update(m *models.SurgicalProcedureType) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		tx.Model(&m).Association("Billings").Replace(&m.Billings)
		tx.Model(&m).Association("Supplies").Replace(&m.Supplies)

		return tx.Updates(&m).Error
	})
}

// Delete ...
func (r *SurgicalProcedureTypeRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.SurgicalProcedureType{}).Error
}
