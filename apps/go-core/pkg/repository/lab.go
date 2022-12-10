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

type LabRepository struct {
	DB *gorm.DB
}

func ProvideLabRepository(DB *gorm.DB) LabRepository {
	return LabRepository{DB: DB}
}

// Save ...
func (r *LabRepository) Save(m *models.Lab) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *LabRepository) Get(m *models.Lab, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetAll ...
func (r *LabRepository) GetAll(p models.PaginationInput, filter *models.Lab) ([]models.Lab, int64, error) {
	var result []models.Lab

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("Order").Preload("Order.Payments").Preload("LabType").Preload("RightEyeImages").Preload("LeftEyeImages").Preload("RightEyeSketches").Preload("LeftEyeSketches").Preload("Images").Preload("Documents").Order("id ASC").Find(&result)

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
func (r *LabRepository) Update(m *models.Lab) error {
	return r.DB.Updates(&m).Preload("Images").Preload("Documents").Error
}

// DeleteFile ...
func (r *LabRepository) DeleteFile(association string, LabID int, fileID int) error {
	return r.DB.Model(&models.Lab{ID: LabID}).Association(association).Delete(&models.File{ID: fileID})
}

// ClearAssociation ...
func (r *LabRepository) ClearAssociation(association string, labID int) error {
	return r.DB.Model(&models.Lab{ID: labID}).Association(association).Clear()
}

// Delete ...
func (r *LabRepository) Delete(ID int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var lab models.Lab
		if err := tx.Where("id = ?", ID).Take(&lab).Error; err != nil {
			return err
		}

		if err := tx.Where("id = ?", ID).Delete(&lab).Error; err != nil {
			return err
		}

		var labsCount int64
		if err := tx.Model(&models.Lab{}).Where("lab_order_id = ?", lab.LabOrderID).Count(&labsCount).Error; err != nil {
			return err
		}

		if labsCount == 0 {
			if err := tx.Where("id = ?", lab.LabOrderID).Delete(&models.LabOrder{}).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

// GetByPatientChartID ...
func (r *LabRepository) GetByPatientChartID(m *models.Lab, ID int) error {
	return r.DB.Where("patient_chart_id = ?", ID).Take(&m).Error
}
