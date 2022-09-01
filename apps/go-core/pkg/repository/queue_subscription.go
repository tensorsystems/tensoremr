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

type QueueSubscriptionRepository struct {
	DB *gorm.DB
}

func ProvideQueueSubscriptionRepository(DB *gorm.DB) QueueSubscriptionRepository {
	return QueueSubscriptionRepository{DB: DB}
}

// Save
func (r *QueueSubscriptionRepository) Save(m *models.QueueSubscription) error {
	return r.DB.Create(&m).Error
}

// GetByUserId ...
func (r *QueueSubscriptionRepository) GetByUserId(m *models.QueueSubscription, userID int) error {
	return r.DB.Where("user_id = ?", userID).Preload("Subscriptions").Find(&m).Error
}

// Subscribe ...
func (r *QueueSubscriptionRepository) Subscribe(m *models.QueueSubscription, userId int, patientQueueId int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var user models.User
		if err := r.DB.Where("id = ?", userId).Take(&user).Error; err != nil {
			return err
		}

		if err := r.DB.Where("user_id = ?", user.ID).Take(&m).Error; err != nil {
			m.UserID = user.ID

			if err := r.DB.Create(&m).Error; err != nil {
				return err
			}
		}

		var patientQueue models.PatientQueue
		if err := r.DB.Where("id = ?", patientQueueId).Take(&patientQueue).Error; err != nil {
			return err
		}

		r.DB.Model(&m).Association("Subscriptions").Append(&patientQueue)

		return nil
	})
}

// Unsubscribe ...
func (r *QueueSubscriptionRepository) Unsubscribe(m *models.QueueSubscription, userId int, patientQueueId int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var user models.User
		if err := r.DB.Where("id = ?", userId).Take(&user).Error; err != nil {
			return err
		}

		if err := r.DB.Where("user_id = ?", user.ID).Take(&m).Error; err != nil {
			return err
		}

		var patientQueue models.PatientQueue
		if err := r.DB.Where("id = ?", patientQueueId).Take(&patientQueue).Error; err != nil {
			return err
		}

		r.DB.Model(&m).Association("Subscriptions").Delete(&patientQueue)
		return nil
	})
}
