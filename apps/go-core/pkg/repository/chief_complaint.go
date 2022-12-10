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

type ChiefComplaintRepository struct {
	DB *gorm.DB
}

func ProvideChiefComplaintRepository(DB *gorm.DB) ChiefComplaintRepository {
	return ChiefComplaintRepository{DB: DB}
}

// Save ...
func (r *ChiefComplaintRepository) Save(m *models.ChiefComplaint) error {
	var existing models.ChiefComplaint
	r.DB.Unscoped().Where("title = ?", m.Title).Where("patient_chart_id = ?", m.PatientChartID).Take(&existing)

	if existing.ID != 0 {
		r.DB.Model(&models.ChiefComplaint{}).Unscoped().Where("id = ?", existing.ID).Update("deleted_at", nil)
		m = &existing
		return nil
	}

	err := r.DB.Create(&m).Error
	return err
}

// Get ...
func (r *ChiefComplaintRepository) Get(m *models.ChiefComplaint, ID int) error {
	return r.DB.Where("id = ?", ID).Preload("HPIComponents").Take(&m).Error
}

// GetAll ...
func (r *ChiefComplaintRepository) GetAll(p models.PaginationInput, filter *models.ChiefComplaint) ([]models.ChiefComplaint, int64, error) {
	var result []models.ChiefComplaint

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("HPIComponents").Order("id ASC").Find(&result)

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
func (r *ChiefComplaintRepository) Search(p models.PaginationInput, searchTerm string) ([]models.ChiefComplaint, int64, error) {
	var result []models.ChiefComplaint
	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where("title LIKE ?", "%"+searchTerm+"%").Order("id ASC").Preload("HPIComponents").Find(&result)

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
func (r *ChiefComplaintRepository) Update(m *models.ChiefComplaint) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		tx.Model(&m).Association("HPIComponents").Replace(&m.HPIComponents)

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
func (r *ChiefComplaintRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.ChiefComplaint{}).Error
}
