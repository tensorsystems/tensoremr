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

type SurgicalProcedureRepository struct {
	DB *gorm.DB
}

func ProvideSurgicalProcedureRepository(DB *gorm.DB) SurgicalProcedureRepository {
	return SurgicalProcedureRepository{DB: DB}
}

// Save ...
func (r *SurgicalProcedureRepository) Save(m *models.SurgicalProcedure) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *SurgicalProcedureRepository) Get(m *models.SurgicalProcedure, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByPatientChart ...
func (r *SurgicalProcedureRepository) GetByPatientChart(m *models.SurgicalProcedure, ID int) error {
	return r.DB.Where("patient_chart_id = ?", ID).Preload("SurgicalProcedureType").Preload("PreanestheticDocuments").Take(&m).Error
}

// GetAll ...
func (r *SurgicalProcedureRepository) GetAll(p models.PaginationInput, filter *models.SurgicalProcedure) ([]models.SurgicalProcedure, int64, error) {
	var result []models.SurgicalProcedure

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("SurgicalProcedureType").Preload("PreanestheticDocuments").Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// DeleteFile ...
func (r *SurgicalProcedureRepository) DeleteFile(association string, surgicalProcedureID int, fileID int) error {
	return r.DB.Model(&models.SurgicalProcedure{ID: surgicalProcedureID}).Association(association).Delete(&models.File{ID: fileID})
}

// GetByPatient ...
func (r *SurgicalProcedureRepository) GetByPatient(p models.PaginationInput, patientID int) ([]models.SurgicalProcedure, int64, error) {
	var result []models.SurgicalProcedure

	dbOp := r.DB.Scopes(models.Paginate(&p)).Joins("INNER JOIN orders ON orders.id = surgical_procedures.order_id").Where("orders.patient_id = ?", patientID).Preload("Order").Preload("Order.Payments").Preload("Order.User").Preload("SurgicalProcedureType").Order("surgical_procedures.id ASC").Find(&result)

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
func (r *SurgicalProcedureRepository) Update(m *models.SurgicalProcedure) error {
	
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *SurgicalProcedureRepository) Delete(ID int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var surgicalProcedure models.SurgicalProcedure

		if err := tx.Where("id = ?", ID).Take(&surgicalProcedure).Error; err != nil {
			return err
		}

		if err := tx.Where("id = ?", ID).Delete(&surgicalProcedure).Error; err != nil {
			return err
		}

		var surgicalCount int64
		if err := tx.Model(&models.SurgicalProcedure{}).Where("surgical_order_id = ?", surgicalProcedure.SurgicalOrderID).Count(&surgicalCount).Error; err != nil {
			return err
		}

		if surgicalCount == 0 {
			if err := tx.Where("id = ?", surgicalProcedure.SurgicalOrderID).Delete(&models.SurgicalOrder{}).Error; err != nil {
				return err
			}
		}

		return nil
	})
}
