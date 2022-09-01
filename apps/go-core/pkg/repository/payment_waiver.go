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

type PaymentWaiverRepository struct {
	DB *gorm.DB
}

func ProvidePaymentWaiverRepository(DB *gorm.DB) PaymentWaiverRepository {
	return PaymentWaiverRepository{DB: DB}
}

// Save ...
func (r *PaymentWaiverRepository) Save(m *models.PaymentWaiver) error {
	return r.DB.Save(&m).Error
}

// BatchSave ...
func (r *PaymentWaiverRepository) BatchSave(waivers []models.PaymentWaiver) error {
	return r.DB.Save(&waivers).Error
}

// Get ...
func (r *PaymentWaiverRepository) Get(m *models.PaymentWaiver, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetCount ...
func (r *PaymentWaiverRepository) GetApprovedCount() (int, error) {
	var count int64
	err := r.DB.Model(&models.PaymentWaiver{}).Where("approved IS NULL").Count(&count).Error
	return int(count), err
}

// GetAll ...
func (r *PaymentWaiverRepository) GetAll(p models.PaginationInput) ([]models.PaymentWaiver, int64, error) {
	var result []models.PaymentWaiver

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Preload("Patient").Preload("User").Preload("Payment.Billing").Order("id DESC").Find(&result)

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
func (r *PaymentWaiverRepository) Update(m *models.PaymentWaiver) error {
	return r.DB.Updates(&m).Error
}

// ApproveWaiver ...
func (r *PaymentWaiverRepository) ApproveWaiver(m *models.PaymentWaiver, id int, approve bool) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		// Update payment waiver
		if err := tx.Where("id = ?", id).Preload("Payment").Take(&m).Error; err != nil {
			return err
		}

		m.Approved = &approve
		if err := tx.Updates(&m).Error; err != nil {
			return err
		}

		// Update payment status
		payment := m.Payment
		payment.Status = models.PaidPaymentStatus
		if err := tx.Updates(&payment).Error; err != nil {
			return err
		}

		return nil
	})
}

// Delete ...
func (r *PaymentWaiverRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.PaymentWaiver{}).Error
}
