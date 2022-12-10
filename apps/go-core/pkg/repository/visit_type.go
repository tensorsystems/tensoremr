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
	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	"gorm.io/gorm"
)

type VisitTypeRepository struct {
	DB *gorm.DB
}

func ProvideVisitTypeRepository(DB *gorm.DB) VisitTypeRepository {
	return VisitTypeRepository{DB: DB}
}

// Seed ...
func (r *VisitTypeRepository) Seed() {
	r.DB.Create(&models.VisitType{Title: "Sick Visit"})
	r.DB.Create(&models.VisitType{Title: "Follow-Up"})
	r.DB.Create(&models.VisitType{Title: "Check-Up"})
	r.DB.Create(&models.VisitType{Title: "Surgery"})
	r.DB.Create(&models.VisitType{Title: "Treatment"})
	r.DB.Create(&models.VisitType{Title: "Post-Op"})
	r.DB.Create(&models.VisitType{Title: "Referral"})
}

// Save ...
func (r *VisitTypeRepository) Save(m *models.VisitType) error {
	err := r.DB.Create(&m).Error

	if err, ok := err.(*pq.Error); ok && err.Code.Name() == "unique_violation" {
		var existing models.VisitType
		existingErr := r.DB.Unscoped().Where("title = ?", m.Title).Take(&existing).Error

		if existingErr == nil {
			r.DB.Model(&models.VisitType{}).Unscoped().Where("id = ?", existing.ID).Update("deleted_at", nil)
			m = &existing
			return nil
		}

		return errors.New("Duplicate, " + err.Detail)
	}

	if err != nil {
		return err
	}

	return nil
}

// Get ...
func (r *VisitTypeRepository) Get(m *models.VisitType, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByTitle ...
func (r *VisitTypeRepository) GetByTitle(m *models.VisitType, title string) error {
	return r.DB.Where("title = ?", title).Take(&m).Error
}

// GetByTitles ...
func (r *VisitTypeRepository) GetByTitles(titles []string) ([]models.VisitType, error) {
	var visitTypes []models.VisitType
	err := r.DB.Where("title IN ?", titles).Find(&visitTypes).Error
	return visitTypes, err
}

// Count ...
func (r *VisitTypeRepository) Count(dbString string) (int64, error) {
	var count int64

	err := r.DB.Model(&models.VisitType{}).Count(&count).Error
	return count, err
}

// GetAll ...
func (r *VisitTypeRepository) GetAll(p models.PaginationInput) ([]models.VisitType, int64, error) {
	var result []models.VisitType

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

// Update ...
func (r *VisitTypeRepository) Update(m *models.VisitType) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *VisitTypeRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.VisitType{}).Error
}
