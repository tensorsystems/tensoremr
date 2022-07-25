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

type FollowUpRepository struct {
	DB *gorm.DB
}

func ProvideFollowUpRepository(DB *gorm.DB) FollowUpRepository {
	return FollowUpRepository{DB: DB}
}

// Save ...
func (r *FollowUpRepository) Save(m *models.FollowUp) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *FollowUpRepository) Get(m *models.FollowUp, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByPatientChart ...
func (r *FollowUpRepository) GetByPatientChart(m *models.FollowUp, ID int) error {
	return r.DB.Where("patient_chart_id = ?", ID).Take(&m).Error
}

// GetAll ...
func (r *FollowUpRepository) GetAll(p models.PaginationInput, filter *models.FollowUp) ([]models.FollowUp, int64, error) {
	var result []models.FollowUp

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Order("id ASC").Find(&result)

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
func (r *FollowUpRepository) Update(m *models.FollowUp) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *FollowUpRepository) Delete(ID int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var followUp models.FollowUp
		if err := tx.Where("id = ?", ID).Take(&followUp).Error; err != nil {
			return err
		}

		if err := tx.Where("id = ?", ID).Delete(&followUp).Error; err != nil {
			return err
		}

		var followUpsCount int64
		if err := tx.Model(&followUp).Where("follow_up_order_id = ?", followUp.FollowUpOrderID).Count(&followUpsCount).Error; err != nil {
			return err
		}

		if followUpsCount == 0 {
			if err := tx.Where("id = ?", followUp.FollowUpOrderID).Delete(&models.FollowUpOrder{}).Error; err != nil {
				return err
			}
		}

		return nil
	})
}
