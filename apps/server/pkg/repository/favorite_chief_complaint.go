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

type FavoriteChiefComplaintRepository struct {
	DB *gorm.DB
}

func ProvideFavoriteChiefComplaintRepository(DB *gorm.DB) FavoriteChiefComplaintRepository {
	return FavoriteChiefComplaintRepository{DB: DB}
}

// Save ...
func (r *FavoriteChiefComplaintRepository) Save(m *models.FavoriteChiefComplaint) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *FavoriteChiefComplaintRepository) Get(m *models.FavoriteChiefComplaint, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByUser ...
func (r *FavoriteChiefComplaintRepository) GetByUser(ID int) ([]*models.FavoriteChiefComplaint, error) {
	var result []*models.FavoriteChiefComplaint
	err := r.DB.Where("user_id = ?", ID).Find(&result).Error
	if err != nil {
		return result, err
	}

	return result, nil
}

// Update ...
func (r *FavoriteChiefComplaintRepository) Update(m *models.FavoriteChiefComplaint) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *FavoriteChiefComplaintRepository) Delete(id int) error {
	return r.DB.Where("id = ?", id).Delete(&models.FavoriteChiefComplaint{}).Error
}
