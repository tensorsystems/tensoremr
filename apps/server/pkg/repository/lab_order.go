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

	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type LabOrderRepository struct {
	DB *gorm.DB
}

func ProvideLabOrderRepository(DB *gorm.DB) LabOrderRepository {
	return LabOrderRepository{DB: DB}
}

// NewOrder ...
func (r *LabOrderRepository) Save(m *models.LabOrder, labTypeID int, patientChartID int, patientID int, billingIds []int, user models.User, orderNote string, receptionNote string) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		// Get Patient
		var patient models.Patient
		if err := tx.Model(&models.Patient{}).Where("id = ?", patientID).Take(&patient).Error; err != nil {
			return err
		}

		// Lab Type
		var labType models.LabType
		if err := tx.Model(&models.LabType{}).Where("id = ?", labTypeID).Take(&labType).Error; err != nil {
			return err
		}

		// Create payments
		var payments []models.Payment
		for _, billingId := range billingIds {
			var payment models.Payment
			payment.Status = models.NotPaidPaymentStatus
			payment.BillingID = billingId
			payments = append(payments, payment)
		}

		m.PatientChartID = patientChartID
		m.PatientID = patientID
		m.FirstName = patient.FirstName
		m.LastName = patient.LastName
		m.PhoneNo = patient.PhoneNo
		m.UserName = user.FirstName + " " + user.LastName
		m.OrderedByID = &user.ID
		m.Status = models.LabOrderOrderedStatus

		var existing models.LabOrder
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

		// Create Lab
		var lab models.Lab
		lab.LabTypeID = labType.ID
		lab.LabOrderID = m.ID
		lab.PatientChartID = patientChartID
		lab.Payments = payments
		lab.Status = models.LabOrderedStatus
		lab.LabTypeTitle = labType.Title
		lab.OrderNote = orderNote
		lab.ReceptionNote = receptionNote

		if err := tx.Create(&lab).Error; err != nil {
			return err
		}

		return nil
	})
}

// GetTodaysOrderedCount ...
func (r *LabOrderRepository) GetTodaysOrderedCount() (count int) {
	now := time.Now()
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	end := start.AddDate(0, 0, 1)

	var countTmp int64
	err := r.DB.Model(&models.LabOrder{}).Where("created_at >= ?", start).Where("created_at <= ?", end).Where("status = ?", models.LabOrderOrderedStatus).Count(&countTmp).Error
	if err != nil {
		countTmp = 0
	}

	count = int(countTmp)

	return
}

// Confirm ...
func (r *LabOrderRepository) Confirm(m *models.LabOrder, id int, invoiceNo string) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ?", id).Preload("Labs.Payments").Take(&m).Error; err != nil {
			return err
		}

		var payments []models.Payment
		for _, lab := range m.Labs {
			payments = append(payments, lab.Payments...)
		}

		var paymentIds []int
		for _, payment := range payments {
			paymentIds = append(paymentIds, payment.ID)
		}

		if err := tx.Model(&models.Payment{}).Where("id IN ?", paymentIds).Updates(map[string]interface{}{"invoice_no": invoiceNo, "status": "PAID"}).Error; err != nil {
			return err
		}

		m.Status = models.LabOrderCompletedStatus

		if err := tx.Updates(&m).Error; err != nil {
			return err
		}

		// Add to Lab Queue
		var patientChart models.PatientChart
		if err := tx.Where("id = ?", m.PatientChartID).Take(&patientChart).Error; err != nil {
			return err
		}

		for _, lab := range m.Labs {
			var patientQueue models.PatientQueue

			// Create new patient queue if it doesn't exists
			if err := tx.Where("queue_name = ?", lab.LabTypeTitle).Take(&patientQueue).Error; err != nil {
				patientQueue.QueueName = lab.LabTypeTitle
				patientQueue.QueueType = models.LabQueue
				patientQueue.Queue = datatypes.JSON([]byte("[" + fmt.Sprint(patientChart.AppointmentID) + "]"))

				if err := tx.Create(&patientQueue).Error; err != nil {
					return err
				}
			} else {
				var ids []int
				if err := json.Unmarshal([]byte(patientQueue.Queue.String()), &ids); err != nil {
					return err
				}

				exists := false
				for _, e := range ids {
					if e == patientChart.AppointmentID {
						exists = true
					}
				}

				if exists {
					return nil
				}

				ids = append(ids, patientChart.AppointmentID)

				var appointmentIds []string
				for _, v := range ids {
					appointmentIds = append(appointmentIds, fmt.Sprint(v))
				}

				queue := datatypes.JSON([]byte("[" + strings.Join(appointmentIds, ", ") + "]"))

				if err := tx.Where("queue_name = ?", lab.LabTypeTitle).Updates(&models.PatientQueue{Queue: queue}).Error; err != nil {
					return err
				}
			}
		}

		return nil
	})
}

// GetCount ...
func (r *LabOrderRepository) GetCount(filter *models.LabOrder, date *time.Time, searchTerm *string) (int64, error) {
	dbOp := r.DB.Model(&models.LabOrder{}).Where(filter)

	if date != nil {
		createdAt := *date
		start := time.Date(createdAt.Year(), createdAt.Month(), createdAt.Day(), 0, 0, 0, 0, createdAt.Location())
		end := start.AddDate(0, 0, 1)
		dbOp.Where("created_at >= ?", start).Where("created_at <= ?", end)
	}

	if searchTerm != nil {
		dbOp.Where("document @@ plainto_tsquery(?)", *searchTerm)
	}

	var count int64
	err := dbOp.Count(&count).Error

	return count, err
}

// Search ...
func (r *LabOrderRepository) Search(p models.PaginationInput, filter *models.LabOrder, date *time.Time, searchTerm *string, ascending bool) ([]models.LabOrder, int64, error) {
	var result []models.LabOrder

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("Labs.Payments.Billing").Preload("Labs.LabType").Preload("OrderedBy.UserTypes")

	if date != nil {
		createdAt := *date
		start := time.Date(createdAt.Year(), createdAt.Month(), createdAt.Day(), 0, 0, 0, 0, createdAt.Location())
		end := start.AddDate(0, 0, 1)
		dbOp.Where("created_at >= ?", start).Where("created_at <= ?", end)
	}

	if searchTerm != nil {
		dbOp.Where("document @@ plainto_tsquery(?)", *searchTerm)
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
func (r *LabOrderRepository) Get(m *models.LabOrder, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetByPatientChartID ...
func (r *LabOrderRepository) GetByPatientChartID(m *models.LabOrder, patientChartID int) error {
	return r.DB.Where("patient_chart_id = ?", patientChartID).Preload("Labs.Payments").Preload("Labs.LabType").Preload("Labs.RightEyeImages").Preload("Labs.LeftEyeImages").Preload("Labs.RightEyeSketches").Preload("Labs.LeftEyeSketches").Preload("Labs.Images").Preload("Labs.Documents").Take(&m).Error
}

// GetAll ...
func (r *LabOrderRepository) GetAll(p PaginationInput, filter *models.LabOrder) ([]models.LabOrder, int64, error) {
	var result []models.LabOrder

	dbOp := r.DB.Scopes(Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("Labs").Order("id ASC").Find(&result)

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
func (r *LabOrderRepository) Update(m *models.LabOrder) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *LabOrderRepository) Delete(m *models.LabOrder, ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&m).Error
}
