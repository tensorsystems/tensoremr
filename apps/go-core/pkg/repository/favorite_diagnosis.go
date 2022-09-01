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

type FavoriteDiagnosisRepository struct {
	DB *gorm.DB
}

func ProvideFavoriteDiagnosisRepository(DB *gorm.DB) FavoriteDiagnosisRepository {
	return FavoriteDiagnosisRepository{DB: DB}
}

// Save ...
func (r *FavoriteDiagnosisRepository) Save(m *models.FavoriteDiagnosis) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *FavoriteDiagnosisRepository) Get(m *models.FavoriteDiagnosis, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByUser ...
func (r *FavoriteDiagnosisRepository) GetByUser(ID int) ([]*models.FavoriteDiagnosis, error) {
	var result []*models.FavoriteDiagnosis
	err := r.DB.Where("user_id = ?", ID).Find(&result).Error
	if err != nil {
		return result, err
	}

	return result, nil
}

// Update ...
func (r *FavoriteDiagnosisRepository) Update(m *models.FavoriteDiagnosis) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *FavoriteDiagnosisRepository) Delete(id int) error {
	return r.DB.Where("id = ?", id).Delete(&models.FavoriteDiagnosis{}).Error
}
