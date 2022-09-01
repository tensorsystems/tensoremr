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

type AppointmentQueueRepository struct {
	DB *gorm.DB
}

func ProvideAppointmentQueueRepository(DB *gorm.DB) AppointmentQueueRepository {
	return AppointmentQueueRepository{DB: DB}
}

// Save ...
func (r *AppointmentQueueRepository) Save(m *models.AppointmentQueue) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *AppointmentQueueRepository) Get(ID int, m *models.AppointmentQueue) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// Update ...
func (r *AppointmentQueueRepository) Update(m *models.AppointmentQueue) error {
	err := r.DB.Save(&m).Error
	return err
}

// FindByAppointment ...
func (r *AppointmentQueueRepository) FindByAppointment(p PaginationInput, userID int) ([]models.AppointmentQueue, int64, error) {
	var result []models.AppointmentQueue
	dbOp := r.DB.Scopes(Paginate(&p)).Select("*, count(*) OVER() AS count").Where("appointment_id = ?", userID).Preload("Appointment").Preload("QueueDestination").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// FindTodaysAppointments ...
func (r *AppointmentQueueRepository) FindTodaysAppointments(appointmentID int) ([]models.AppointmentQueue, error) {
	var result []models.AppointmentQueue

	err := r.DB.Joins("left join user_queues on user_queues.queue_id = queues.id").Where("user_queues.appointment_id = ?", appointmentID).Find(&result).Error

	if err != nil {
		return result, err
	}

	return result, nil
}

// Delete ...
func (r *AppointmentQueueRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.AppointmentQueue{}).Error
}
