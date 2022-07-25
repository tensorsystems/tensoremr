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

type TreatmentRepository struct {
	DB *gorm.DB
}

func ProvideTreatmentRepository(DB *gorm.DB) TreatmentRepository {
	return TreatmentRepository{DB: DB}
}

// TreatmentStatus ...
type TreatmentStatus string

// SurgicalProcedureOrder statuses ...
const (
	TreatmentStatusOrdered   TreatmentStatus = "ORDERED"
	TreatmentStatusCompleted TreatmentStatus = "COMPLETED"
)

// Save ...
func (r *TreatmentRepository) Save(m *models.Treatment) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *TreatmentRepository) Get(m *models.Treatment, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByPatientChart ...
func (r *TreatmentRepository) GetByPatientChart(m *models.Treatment, ID int) error {
	return r.DB.Where("patient_chart_id = ?", ID).Preload("TreatmentType").Take(&m).Error
}

// GetAll ...
func (r *TreatmentRepository) GetAll(p models.PaginationInput, filter *models.Treatment) ([]models.Treatment, int64, error) {
	var result []models.Treatment

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("Order").Preload("Order.Payments").Preload("TreatmentType").Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// GetByPatient ...
func (r *TreatmentRepository) GetByPatient(p models.PaginationInput, patientID int) ([]models.Treatment, int64, error) {
	var result []models.Treatment

	dbOp := r.DB.Scopes(models.Paginate(&p)).Joins("INNER JOIN orders ON orders.id = treatments.order_id").Where("orders.patient_id = ?", patientID).Preload("Order").Preload("Order.Payments").Preload("Order.User").Preload("TreatmentType").Order("treatments.id ASC").Find(&result)

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
func (r *TreatmentRepository) Update(m *models.Treatment) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *TreatmentRepository) Delete(ID int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var treatment models.Treatment

		if err := tx.Where("id = ?", ID).Take(&treatment).Error; err != nil {
			return err
		}

		if err := tx.Where("id = ?", ID).Delete(&treatment).Error; err != nil {
			return err
		}

		var treatmentsCount int64
		if err := tx.Model(&treatment).Where("treatment_order_id = ?", treatment.TreatmentOrderID).Count(&treatmentsCount).Error; err != nil {
			return err
		}

		if treatmentsCount == 0 {
			if err := tx.Where("id = ?", treatment.TreatmentOrderID).Delete(&models.TreatmentOrder{}).Error; err != nil {
				return err
			}
		}

		return nil
	})
}
