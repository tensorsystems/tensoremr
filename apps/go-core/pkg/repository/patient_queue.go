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
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/tensorsystems/tensoremr/apps/go-core/pkg/models"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type PatientQueueRepository struct {
	DB *gorm.DB
}

func ProvidePatientQueueRepository(DB *gorm.DB) PatientQueueRepository {
	return PatientQueueRepository{DB: DB}
}

// Seed ...
func (r *PatientQueueRepository) Seed() {
	emptyQueue := datatypes.JSON([]byte("[]"))

	r.DB.Create(&models.PatientQueue{QueueName: "Pre-Exam", Queue: emptyQueue, QueueType: models.QueueType("PREEXAM")})
	r.DB.Create(&models.PatientQueue{QueueName: "Pre-Operation", Queue: emptyQueue, QueueType: models.QueueType("PREOPERATION")})
}

// Save
func (r *PatientQueueRepository) Save(m *models.PatientQueue) error {
	return r.DB.Create(&m).Error
}

// GetAll
func (r *PatientQueueRepository) GetAll() ([]*models.PatientQueue, error) {
	var result []*models.PatientQueue
	err := r.DB.Order("queue_type DESC").Find(&result).Error

	return result, err
}

// Get ...
func (r *PatientQueueRepository) Get(m *models.PatientQueue, id int) error {
	return r.DB.Where("id = ?", id).Take(&m).Error
}

// GetByQueueName ...
func (r *PatientQueueRepository) GetByQueueName(m *models.PatientQueue, queueName string) error {
	return r.DB.Where("queue_name = ?", queueName).Take(&m).Error
}

// GetByQueueName ...
func (r *PatientQueueRepository) UpdateQueue(queueName string, queue datatypes.JSON) error {
	return r.DB.Where("queue_name = ?", queueName).Updates(&models.PatientQueue{Queue: queue}).Error
}

// Move ...
func (r *PatientQueueRepository) Move(m *models.PatientQueue, fromQueueID int, toQueueID int, appointmentID int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		// Get source queue
		var sourceQueue models.PatientQueue
		if err := tx.Where("id = ?", fromQueueID).Take(&sourceQueue).Error; err != nil {
			return err
		}

		// Get destination queue
		var destinationQueue models.PatientQueue
		if err := tx.Where("id = ?", toQueueID).Take(&destinationQueue).Error; err != nil {
			return err
		}

		// Remove appointment id from source queue
		var sourceIds []int
		if err := json.Unmarshal([]byte(sourceQueue.Queue.String()), &sourceIds); err != nil {
			return err
		}

		for i, v := range sourceIds {
			if v == appointmentID {
				sourceIds = remove(sourceIds, i)
			}
		}

		var sourceAppointmentIds []string
		for _, v := range sourceIds {
			sourceAppointmentIds = append(sourceAppointmentIds, fmt.Sprint(v))
		}

		sourceQueue.Queue = datatypes.JSON([]byte("[" + strings.Join(sourceAppointmentIds, ", ") + "]"))
		if err := tx.Updates(&models.PatientQueue{ID: sourceQueue.ID, Queue: sourceQueue.Queue}).Error; err != nil {
			return err
		}

		var destinationIds []int
		if err := json.Unmarshal([]byte(destinationQueue.Queue.String()), &destinationIds); err != nil {
			return err
		}

		// Skip adding if it alread exists
		exists := false
		for _, e := range destinationIds {
			if e == appointmentID {
				exists = true
			}
		}

		if exists {
			return nil
		}

		var destinationAppointmentIds []string
		for _, v := range destinationIds {
			destinationAppointmentIds = append(destinationAppointmentIds, fmt.Sprint(v))
		}

		destinationAppointmentIds = append(destinationAppointmentIds, fmt.Sprint(appointmentID))
		destinationQueue.Queue = datatypes.JSON([]byte("[" + strings.Join(destinationAppointmentIds, ", ") + "]"))
		if err := tx.Updates(&models.PatientQueue{ID: destinationQueue.ID, Queue: destinationQueue.Queue}).Error; err != nil {
			return err
		}

		m = &destinationQueue

		return nil
	})
}

// MoveToQueueName ...
func (r *PatientQueueRepository) MoveToQueueName(fromQueueID int, toQueueName string, appointmentID int, queueType string) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		// Get source queue
		var sourceQueue models.PatientQueue
		if err := tx.Where("id = ?", fromQueueID).Take(&sourceQueue).Error; err != nil {
			return err
		}

		// Remove appointment id from source queue
		var sourceIds []int
		if err := json.Unmarshal([]byte(sourceQueue.Queue.String()), &sourceIds); err != nil {
			return err
		}

		for i, v := range sourceIds {
			if v == appointmentID {
				sourceIds = remove(sourceIds, i)
			}
		}

		var sourceAppointmentIds []string
		for _, v := range sourceIds {
			sourceAppointmentIds = append(sourceAppointmentIds, fmt.Sprint(v))
		}

		sourceQueue.Queue = datatypes.JSON([]byte("[" + strings.Join(sourceAppointmentIds, ", ") + "]"))
		if err := tx.Updates(&models.PatientQueue{ID: sourceQueue.ID, Queue: sourceQueue.Queue}).Error; err != nil {
			return err
		}

		// Add appointment to destination queue
		var destinationQueue models.PatientQueue

		// Check if queue exists, create new one if it doesn't
		if err := tx.Where("queue_name = ?", toQueueName).Take(&destinationQueue).Error; err != nil {
			destinationQueue.QueueName = toQueueName
			destinationQueue.Queue = datatypes.JSON([]byte("[" + fmt.Sprint(appointmentID) + "]"))

			if len(queueType) != 0 {
				destinationQueue.QueueType = models.QueueType(queueType)
			}

			if err := tx.Create(&destinationQueue).Error; err != nil {
				return err
			}

			return nil
		}

		var destinationIds []int
		if err := json.Unmarshal([]byte(destinationQueue.Queue.String()), &destinationIds); err != nil {
			return err
		}

		// Skip adding if it alread exists
		exists := false
		for _, e := range destinationIds {
			if e == appointmentID {
				exists = true
			}
		}

		if exists {
			return nil
		}

		var destinationAppointmentIds []string
		for _, v := range destinationIds {
			destinationAppointmentIds = append(destinationAppointmentIds, fmt.Sprint(v))
		}

		destinationAppointmentIds = append(destinationAppointmentIds, fmt.Sprint(appointmentID))
		destinationQueue.Queue = datatypes.JSON([]byte("[" + strings.Join(destinationAppointmentIds, ", ") + "]"))
		if err := tx.Updates(&models.PatientQueue{ID: destinationQueue.ID, Queue: destinationQueue.Queue}).Error; err != nil {
			return err
		}

		return nil
	})
}

// AddToQueue
func (r *PatientQueueRepository) AddToQueue(m *models.PatientQueue, toQueueName string, appointmentID int, queueType string) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {

		// Check if queue exists, create new one if it doesn't
		if err := tx.Where("queue_name = ?", toQueueName).Take(&m).Error; err != nil {
			m.QueueName = toQueueName
			m.Queue = datatypes.JSON([]byte("[" + fmt.Sprint(appointmentID) + "]"))
			if len(queueType) != 0 {
				m.QueueType = models.QueueType(queueType)
			}

			if err := tx.Create(&m).Error; err != nil {
				return err
			}

			return nil
		}

		var destinationIds []int
		if err := json.Unmarshal([]byte(m.Queue.String()), &destinationIds); err != nil {
			return err
		}

		// Skip adding if it alread exists
		exists := false
		for _, e := range destinationIds {
			if e == appointmentID {
				exists = true
			}
		}

		if exists {
			return nil
		}

		var destinationAppointmentIds []string
		for _, v := range destinationIds {
			destinationAppointmentIds = append(destinationAppointmentIds, fmt.Sprint(v))
		}

		destinationAppointmentIds = append(destinationAppointmentIds, fmt.Sprint(appointmentID))
		m.Queue = datatypes.JSON([]byte("[" + strings.Join(destinationAppointmentIds, ", ") + "]"))
		if err := tx.Updates(&models.PatientQueue{ID: m.ID, Queue: m.Queue}).Error; err != nil {
			return err
		}

		return nil
	})
}

// DeleteFromQueue ...
func (r *PatientQueueRepository) DeleteFromQueue(m *models.PatientQueue, patientQueueID int, appointmentID int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ?", patientQueueID).Take(&m).Error; err != nil {
			return err
		}

		var ids []int
		if err := json.Unmarshal([]byte(m.Queue.String()), &ids); err != nil {
			return err
		}

		for i, v := range ids {
			if v == appointmentID {
				ids = remove(ids, i)
			}
		}

		var appointmentIds []string
		for _, v := range ids {
			appointmentIds = append(appointmentIds, fmt.Sprint(v))
		}

		m.Queue = datatypes.JSON([]byte("[" + strings.Join(appointmentIds, ", ") + "]"))
		if err := tx.Updates(&models.PatientQueue{ID: m.ID, Queue: m.Queue}).Error; err != nil {
			return err
		}

		return nil
	})
}

// ClearExpired ...
func (r *PatientQueueRepository) ClearExpired() error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var patientQueues []models.PatientQueue

		if err := tx.Find(&patientQueues).Error; err != nil {
			return err
		}

		for _, patientQueue := range patientQueues {
			var ids []int
			if err := json.Unmarshal([]byte(patientQueue.Queue.String()), &ids); err != nil {
				return err
			}

			now := time.Now()
			start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())

			var expiredAppointments []models.Appointment

			if err := tx.Model(models.Appointment{}).Select("id").Where("id IN ?", ids).Where("checked_in_time < ?", start).Find(&expiredAppointments).Error; err != nil {
				return err
			}

			if len(expiredAppointments) != 0 {
				for index, id := range ids {
					for _, appointment := range expiredAppointments {
						if appointment.ID == id {
							ids = remove(ids, index)
						}
					}
				}
			}

			var appointmentIds []string
			for _, v := range ids {
				appointmentIds = append(appointmentIds, fmt.Sprint(v))
			}

			queue := datatypes.JSON([]byte("[" + strings.Join(appointmentIds, ", ") + "]"))
			patientQueue.Queue = queue

			if err := tx.Updates(&patientQueue).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

func remove(slice []int, s int) []int {
	if len(slice) > 0 && s >= len(slice) {
		return slice[:len(slice)-1]
	}

	return append(slice[:s], slice[s+1:]...)
}
