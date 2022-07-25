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
	"time"

	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	"gorm.io/gorm"
)

type EyewearPrescriptionOrderRepository struct {
	DB *gorm.DB
}

func ProvideEyewearPrescriptionOrderRepository(DB *gorm.DB) EyewearPrescriptionOrderRepository {
	return EyewearPrescriptionOrderRepository{DB: DB}
}

// SaveEyewearPrescription ...
func (r *EyewearPrescriptionOrderRepository) SaveEyewearPrescription(m *models.EyewearPrescriptionOrder, eyewearPrescription models.EyewearPrescription, patientID int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var patient models.Patient
		if err := tx.Where("id = ?", patientID).Take(&patient).Error; err != nil {
			return err
		}

		var user models.User
		if err := tx.Where("id = ?", m.OrderedByID).Take(&user).Error; err != nil {
			return err
		}

		m.FirstName = patient.FirstName
		m.LastName = patient.LastName
		m.PhoneNo = patient.PhoneNo
		m.UserName = user.FirstName + " " + user.LastName
		m.Status = "ORDERED"

		var existing models.EyewearPrescriptionOrder
		existingErr := tx.Where("patient_chart_id = ?", m.PatientChartID).Take(&existing).Error

		if existingErr != nil {
			if err := tx.Create(&m).Error; err != nil {
				return err
			}
		} else {
			m.ID = existing.ID
			if err := tx.Updates(&m).Error; err != nil {
				return err
			}
		}

		eyewearPrescription.Status = "Active"

		tx.Model(&m).Association("EyewearPrescriptions").Append(&eyewearPrescription)

		return nil
	})
}

// Search ...
func (r *EyewearPrescriptionOrderRepository) Search(p models.PaginationInput, filter *models.EyewearPrescriptionOrder, date *time.Time, searchTerm *string, ascending bool) ([]models.EyewearPrescriptionOrder, int64, error) {
	var result []models.EyewearPrescriptionOrder

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("EyewearPrescriptions").Preload("OrderedBy")

	if date != nil {
		prescribedDate := *date
		start := time.Date(prescribedDate.Year(), prescribedDate.Month(), prescribedDate.Day(), 0, 0, 0, 0, prescribedDate.Location())
		end := start.AddDate(0, 0, 1)
		dbOp.Where("created_at >= ?", start).Where("created_at <= ?", end)
	}

	if searchTerm != nil {
		dbOp.Where("first_name ILIKE ?", "%"+*searchTerm+"%").Or("last_name ILIKE ?", "%"+*searchTerm+"%").Or("phone_no ILIKE ?", "%"+*searchTerm+"%")
	}

	if ascending {
		dbOp.Order("id ASC")
	} else {
		dbOp.Order("id DESC")
	}

	dbOp.Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// Get ...
func (r *EyewearPrescriptionOrderRepository) Get(m *models.EyewearPrescriptionOrder, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByPatientChartID ...
func (r *EyewearPrescriptionOrderRepository) GetByPatientChartID(m *models.EyewearPrescriptionOrder, patientChartID int) error {
	return r.DB.Where("patient_chart_id = ?", patientChartID).Preload("EyewearPrescriptions").Take(&m).Error
}

// GetAll ...
func (r *EyewearPrescriptionOrderRepository) GetAll(p PaginationInput, filter *models.EyewearPrescriptionOrder) ([]models.EyewearPrescriptionOrder, int64, error) {
	var result []models.EyewearPrescriptionOrder

	dbOp := r.DB.Scopes(Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// Save ...
func (r *EyewearPrescriptionOrderRepository) Save(m *models.EyewearPrescriptionOrder) error {
	return r.DB.Create(&m).Error
}

// Update ...
func (r *EyewearPrescriptionOrderRepository) Update(m *models.EyewearPrescriptionOrder) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *EyewearPrescriptionOrderRepository) Delete(m *models.EyewearPrescriptionOrder, ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.EyewearPrescriptionOrder{}).Error
}
