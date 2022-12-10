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

type DiagnosisRepository struct {
	DB                          *gorm.DB
	FavoriteDiagnosisRepository FavoriteDiagnosisRepository
}

func ProvideDiagnosisRepository(DB *gorm.DB, favoriteDiagnosisRepository FavoriteDiagnosisRepository) DiagnosisRepository {
	return DiagnosisRepository{DB: DB, FavoriteDiagnosisRepository: favoriteDiagnosisRepository}
}

// Save ...
func (r *DiagnosisRepository) Save(m *models.Diagnosis) error {
	return r.DB.Create(&m).Error
}

// GetAll ...
func (r *DiagnosisRepository) GetAll(p models.PaginationInput, searchTerm *string) ([]models.Diagnosis, int64, error) {
	var result []models.Diagnosis

	dbOp := r.DB.Scopes(models.Paginate(&p))

	if searchTerm != nil && len(*searchTerm) > 0 {
		dbOp.Where("document @@ plainto_tsquery(?)", *searchTerm)
	}

	dbOp.Order("id ASC").Find(&result)

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
func (r *DiagnosisRepository) GetFavorites(p models.PaginationInput, searchTerm *string, userId int) ([]models.Diagnosis, int64, error) {
	var result []models.Diagnosis
	var count int64
	var err error

	var favoriteIds []int
	favoriteDiagnosis, _ := r.FavoriteDiagnosisRepository.GetByUser(userId)
	for _, e := range favoriteDiagnosis {
		favoriteIds = append(favoriteIds, e.DiagnosisID)
	}

	if len(favoriteIds) > 0 {
		var favorites []models.Diagnosis

		favoritesDb := r.DB.Where("id IN ?", favoriteIds)
		if searchTerm != nil && len(*searchTerm) > 0 {
			favoritesDb.Where("full_description ILIKE ?", "%"+*searchTerm+"%")
		}
		favoritesDb.Find(&favorites)

		result = append(result, favorites...)

		var nonFavorites []models.Diagnosis
		nonFavoritesDb := r.DB.Not(favoriteIds).Scopes(models.Paginate(&p))
		if searchTerm != nil && len(*searchTerm) > 0 {
			nonFavoritesDb.Where("full_description ILIKE ?", "%"+*searchTerm+"%")
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
func (r *DiagnosisRepository) Get(m *models.Diagnosis, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByTitle ...
func (r *DiagnosisRepository) GetByTitle(m *models.Diagnosis, title string) error {
	return r.DB.Where("title = ?", title).Take(&m).Error
}

// Update ...
func (r *DiagnosisRepository) Update(m *models.Diagnosis) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *DiagnosisRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.Diagnosis{}).Error
}
