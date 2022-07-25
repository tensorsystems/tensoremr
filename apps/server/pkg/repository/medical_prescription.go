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
	"time"

	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	"gorm.io/gorm"
)

type MedicalPrescriptionRepository struct {
	DB *gorm.DB
}

func ProvideMedicalPrescriptionRepository(DB *gorm.DB) MedicalPrescriptionRepository {
	return MedicalPrescriptionRepository{DB: DB}
}

// Save ...
func (r *MedicalPrescriptionRepository) Save(m *models.MedicalPrescription) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *MedicalPrescriptionRepository) Get(m *models.MedicalPrescription, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetAll ...
func (r *MedicalPrescriptionRepository) GetAll(p PaginationInput, filter *models.MedicalPrescription) ([]models.MedicalPrescription, int64, error) {
	var result []models.MedicalPrescription

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

// Search ...
func (r *MedicalPrescriptionRepository) Search(p models.PaginationInput, filter *models.MedicalPrescription, date *time.Time, searchTerm *string, ascending bool) ([]models.MedicalPrescription, int64, error) {
	var result []models.MedicalPrescription

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter)

	if date != nil {
		prescribedDate := *date
		start := time.Date(prescribedDate.Year(), prescribedDate.Month(), prescribedDate.Day(), 0, 0, 0, 0, prescribedDate.Location())
		end := start.AddDate(0, 0, 1)
		dbOp.Where("prescribed_date >= ?", start).Where("prescribed_date <= ?", end)
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

// Update ...
func (r *MedicalPrescriptionRepository) Update(m *models.MedicalPrescription) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *MedicalPrescriptionRepository) Delete(m *models.MedicalPrescription, ID int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ?", ID).Take(&m).Error; err != nil {
			return err
		}

		var order models.MedicalPrescriptionOrder
		if err := tx.Where("id = ?", m.MedicalPrescriptionOrderID).Take(&order).Error; err != nil {
			return err
		}

		var patientChart models.PatientChart
		if err := tx.Where("id = ?", order.PatientChartID).Take(&patientChart).Error; err != nil {
			return err
		}

		if patientChart.Locked != nil && *patientChart.Locked {
			return errors.New("This prescription cannot be deleted because it's respective chart has been locked")
		}

		if err := tx.Delete(&m).Error; err != nil {
			return err
		}

		return nil
	})
}
