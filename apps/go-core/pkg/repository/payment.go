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

type PaymentRepository struct {
	DB *gorm.DB
}

func ProvidePaymentRepository(DB *gorm.DB) PaymentRepository {
	return PaymentRepository{DB: DB}
}

// Save ...
func (r *PaymentRepository) Save(m *models.Payment) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *PaymentRepository) Get(m *models.Payment, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// Get ...
func (r *PaymentRepository) GetByIds(ids []int) ([]models.Payment, error) {
	var result []models.Payment
	err := r.DB.Where("id IN ?", ids).Find(&result).Error
	if err != nil {
		return nil, err
	}
	return result, nil
}

// Update ...
func (r *PaymentRepository) Update(m *models.Payment) error {
	return r.DB.Updates(&m).Error
}

// BatchUpdate ...
func (r *PaymentRepository) BatchUpdate(ids []int, e models.Payment) error {
	return r.DB.Model(&models.Payment{}).Where("id IN ?", ids).Updates(&e).Error
}

// RequestWaiver ...
func (r *PaymentRepository) RequestWaiver(m *models.Payment, paymentID int, patientID int, userID int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		// Update payment
		m.ID = paymentID
		m.Status = models.WaiverRequestedPaymentStatus
		if err := tx.Updates(&m).Error; err != nil {
			return err
		}

		// Save payment waiver
		var paymentWaiver models.PaymentWaiver
		paymentWaiver.PatientID = patientID
		paymentWaiver.PaymentID = paymentID
		paymentWaiver.UserID = userID

		if err := tx.Save(&paymentWaiver).Error; err != nil {
			return err
		}

		return nil
	})
}

// RequestWaiverBatch ...
func (r *PaymentRepository) RequestWaiverBatch(paymentIds []int, patientId int, userId int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		// Update payments
		if err := tx.Where("id IN ?", paymentIds).Updates(&models.Payment{Status: models.WaiverRequestedPaymentStatus}).Error; err != nil {
			return err
		}

		// Save payment waivers
		var paymentWaivers []models.PaymentWaiver
		for i := range paymentIds {
			waiver := models.PaymentWaiver{
				PatientID: patientId,
				PaymentID: paymentIds[i],
				UserID:    userId,
			}

			paymentWaivers = append(paymentWaivers, waiver)
		}

		if err := tx.Save(&paymentWaivers).Error; err != nil {
			return err
		}

		return nil
	})
}

// Delete ...
func (r *PaymentRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.Payment{}).Error
}
