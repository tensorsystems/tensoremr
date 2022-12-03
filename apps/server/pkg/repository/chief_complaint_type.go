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

type ChiefComplaintTypeRepository struct {
	DB                               *gorm.DB
	FavoriteChiefComplaintRepository FavoriteChiefComplaintRepository
}

func ProvideChiefComplaintTypeRepository(DB *gorm.DB, favoriteChiefComplaintRepository FavoriteChiefComplaintRepository) ChiefComplaintTypeRepository {
	return ChiefComplaintTypeRepository{DB: DB, FavoriteChiefComplaintRepository: favoriteChiefComplaintRepository}
}

// Save ...
func (r *ChiefComplaintTypeRepository) Save(m *models.ChiefComplaintType) error {
	return r.DB.Create(&m).Error
}

// GetAll ...
func (r *ChiefComplaintTypeRepository) GetAll(p models.PaginationInput, searchTerm *string) ([]models.ChiefComplaintType, int64, error) {
	var result []models.ChiefComplaintType

	dbOp := r.DB.Scopes(models.Paginate(&p))

	if searchTerm != nil {
		dbOp.Where("title ILIKE ?", "%"+*searchTerm+"%")
	}

	dbOp.Order("title ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// GetFavorites ...
func (r *ChiefComplaintTypeRepository) GetFavorites(p models.PaginationInput, searchTerm *string, userId int) ([]models.ChiefComplaintType, int64, error) {
	var result []models.ChiefComplaintType
	var count int64
	var err error

	var favoriteIds []int
	favoriteChiefComplaints, _ := r.FavoriteChiefComplaintRepository.GetByUser(userId)
	for _, e := range favoriteChiefComplaints {
		favoriteIds = append(favoriteIds, e.ChiefComplaintTypeID)
	}

	if len(favoriteIds) > 0 {
		var favorites []models.ChiefComplaintType

		favoritesDb := r.DB.Where("id IN ?", favoriteIds)
		if searchTerm != nil {
			favoritesDb.Where("title ILIKE ?", "%"+*searchTerm+"%")
		}
		favoritesDb.Find(&favorites)

		result = append(result, favorites...)

		var nonFavorites []models.ChiefComplaintType
		nonFavoritesDb := r.DB.Not(favoriteIds).Scopes(models.Paginate(&p))
		if searchTerm != nil {
			nonFavoritesDb.Where("title ILIKE ?", "%"+*searchTerm+"%")
		}
		nonFavoritesDb.Find(&nonFavorites)

		result = append(result, nonFavorites...)

		if len(nonFavorites) > 0 {
			count = nonFavorites[0].Count + int64(len(favoriteIds))
		}
	} else {
		return r.GetAll(p, searchTerm)
	}

	return result, count, err
}

// Get ...
func (r *ChiefComplaintTypeRepository) Get(m *models.ChiefComplaintType, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByTitle ...
func (r *ChiefComplaintTypeRepository) GetByTitle(m *models.ChiefComplaintType, title string) error {
	return r.DB.Where("title = ?", title).Take(&m).Error
}

// Update ...
func (r *ChiefComplaintTypeRepository) Update(m *models.ChiefComplaintType) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *ChiefComplaintTypeRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.ChiefComplaintType{}).Error
}
