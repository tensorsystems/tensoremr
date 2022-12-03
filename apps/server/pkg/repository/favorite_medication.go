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
	"errors"

	"github.com/lib/pq"
	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	"gorm.io/gorm"
)

type FavoriteMedicationRepository struct {
	DB *gorm.DB
}

func ProvideFavoriteMedicationRepository(DB *gorm.DB) FavoriteMedicationRepository {
	return FavoriteMedicationRepository{DB: DB}
}

// Save ...
func (r *FavoriteMedicationRepository) Save(m *models.FavoriteMedication) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *FavoriteMedicationRepository) Get(m *models.FavoriteMedication, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetAll ...
func (r *FavoriteMedicationRepository) GetAll(p models.PaginationInput, filter *models.FavoriteMedication, searchTerm *string) ([]models.FavoriteMedication, int64, error) {
	var result []models.FavoriteMedication

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter)

	if searchTerm != nil {
		dbOp.Where("medication ILIKE ?", "%"+*searchTerm+"%")
	}

	dbOp.Order("medication ASC").Find(&result)

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
func (r *FavoriteMedicationRepository) Search(p models.PaginationInput, searchTerm string) ([]models.FavoriteMedication, int64, error) {
	var result []models.FavoriteMedication
	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where("medication LIKE ?", "%"+searchTerm+"%").Order("id ASC").Find(&result)

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
func (r *FavoriteMedicationRepository) Update(m *models.FavoriteMedication) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		err := tx.Updates(&m).Error

		if err, ok := err.(*pq.Error); ok && err.Code.Name() == "unique_violation" {
			return errors.New("Duplicate, " + err.Detail)
		}

		if err != nil {
			return err
		}
		return nil
	})
}

// Delete ...
func (r *FavoriteMedicationRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.FavoriteMedication{}).Error
}
