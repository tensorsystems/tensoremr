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

type DiagnosticProcedureOrderRepository struct {
	DB *gorm.DB
}

func ProvideDiagnosticProcedureOrderRepository(DB *gorm.DB) DiagnosticProcedureOrderRepository {
	return DiagnosticProcedureOrderRepository{DB: DB}
}

// Get ...
func (r *DiagnosticProcedureOrderRepository) Get(m *models.DiagnosticProcedureOrder, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetWithProcedures ...
func (r *DiagnosticProcedureOrderRepository) GetWithProcedures(m *models.DiagnosticProcedureOrder, ID int) error {
	return r.DB.Where("id = ?", ID).Preload("DiagnosticProcedures").Take(&m).Error
}

// Save ...
func (r *DiagnosticProcedureOrderRepository) Save(m *models.DiagnosticProcedureOrder, diagnosticProcedure *models.DiagnosticProcedure, diagnosticProcedureTypeID int, patientChartID int, patientID int, billingID int, user models.User, orderNote string, receptionNote string) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		// Get Patient
		var patient models.Patient
		if err := tx.Model(&models.Patient{}).Where("id = ?", patientID).Take(&patient).Error; err != nil {
			return err
		}

		// Diagnostic Procedure Type
		var diagnosticProcedureType models.DiagnosticProcedureType
		if err := tx.Model(&models.DiagnosticProcedureType{}).Where("id = ?", diagnosticProcedureTypeID).Take(&diagnosticProcedureType).Error; err != nil {
			return err
		}

		// Create payment
		var payment models.Payment
		payment.Status = models.NotPaidPaymentStatus
		payment.BillingID = billingID
		if err := tx.Create(&payment).Error; err != nil {
			return err
		}

		isPhysician := false
		for _, e := range user.UserTypes {
			if e.Title == "Physician" {
				isPhysician = true
			}
		}

		orderedByPrefix := ""
		if isPhysician {
			orderedByPrefix = "Dr. "
		}

		m.PatientChartID = patientChartID
		m.PatientID = patientID
		m.FirstName = patient.FirstName
		m.LastName = patient.LastName
		m.PhoneNo = patient.PhoneNo
		m.UserName = orderedByPrefix + user.FirstName + " " + user.LastName
		m.OrderedByID = &user.ID
		m.Status = models.DiagnosticProcedureOrderOrderedStatus

		var existing models.DiagnosticProcedureOrder
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

		// Create Diagnostic Procedure
		diagnosticProcedure.DiagnosticProcedureTypeID = diagnosticProcedureType.ID
		diagnosticProcedure.DiagnosticProcedureOrderID = m.ID
		diagnosticProcedure.PatientChartID = patientChartID
		diagnosticProcedure.Payments = append(diagnosticProcedure.Payments, payment)
		diagnosticProcedure.Status = models.DiagnosticProcedureOrderedStatus
		diagnosticProcedure.DiagnosticProcedureTypeTitle = diagnosticProcedureType.Title
		diagnosticProcedure.OrderNote = orderNote
		diagnosticProcedure.ReceptionNote = receptionNote

		if diagnosticProcedureType.Title == "Refraction" || diagnosticProcedureType.Title == "Refraction Advanced- VIP" {
			diagnosticProcedure.IsRefraction = true
		}

		if err := tx.Create(&diagnosticProcedure).Error; err != nil {
			return err
		}

		return nil
	})
}

// OrderAndConfirm ...
func (r *DiagnosticProcedureOrderRepository) OrderAndConfirm() {

}

// GetTodaysOrderedCount ...
func (r *DiagnosticProcedureOrderRepository) GetTodaysOrderedCount() (count int) {
	now := time.Now()
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	end := start.AddDate(0, 0, 1)

	var countTmp int64
	err := r.DB.Model(&models.DiagnosticProcedureOrder{}).Where("created_at >= ?", start).Where("created_at <= ?", end).Where("status = ?", models.DiagnosticProcedureOrderOrderedStatus).Count(&countTmp).Error
	if err != nil {
		countTmp = 0
	}

	count = int(countTmp)

	return
}

// GetPatientDiagnosticOrderTitles ...
func (r *DiagnosticProcedureOrderRepository) GetPatientDiagnosticProcedureTitles(patientID int) ([]string, error) {
	var procedureTitles []string

	var result []map[string]interface{}

	if err := r.DB.Raw(`
		SELECT DISTINCT(diagnostic_procedure_type_title) 
			FROM diagnostic_procedure_orders 
			INNER JOIN diagnostic_procedures
			ON diagnostic_procedure_orders.id = diagnostic_procedures.diagnostic_procedure_order_id
		WHERE patient_id = ?`, patientID).Find(&result).Error; err != nil {
		return procedureTitles, err
	}

	for _, order := range result {
		procedureTitles = append(procedureTitles, order["diagnostic_procedure_type_title"].(string))
	}

	return procedureTitles, nil
}

// GetOrderPayments ...
func (r *DiagnosticProcedureOrderRepository) GetOrderPayments(id int) ([]models.Payment, error) {
	var order models.DiagnosticProcedureOrder
	if err := r.DB.Where("id = ?", id).Preload("DiagnosticProcedures.Payments").Take(&order).Error; err != nil {
		return nil, err
	}

	var payments []models.Payment
	for _, diagnosticProcedure := range order.DiagnosticProcedures {
		payments = append(payments, diagnosticProcedure.Payments...)
	}

	return payments, nil
}

// Confirm ...
func (r *DiagnosticProcedureOrderRepository) Confirm(m *models.DiagnosticProcedureOrder, id int, invoiceNo string) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ?", id).Preload("DiagnosticProcedures.Payments").Take(&m).Error; err != nil {
			return err
		}

		var payments []models.Payment
		for _, diagnosticProcedure := range m.DiagnosticProcedures {
			payments = append(payments, diagnosticProcedure.Payments...)
		}

		var paymentIds []int
		for _, payment := range payments {
			paymentIds = append(paymentIds, payment.ID)
		}

		if err := tx.Model(&models.Payment{}).Where("id IN ?", paymentIds).Updates(map[string]interface{}{"invoice_no": invoiceNo, "status": "PAID"}).Error; err != nil {
			return err
		}

		m.Status = models.DiagnosticProcedureOrderCompletedStatus

		if err := tx.Updates(&m).Error; err != nil {
			return err
		}

		// Add to Diagnostic Queue
		var patientChart models.PatientChart

		if err := tx.Where("id = ?", m.PatientChartID).Take(&patientChart).Error; err != nil {
			return err
		}

		for _, diagnosticProcedure := range m.DiagnosticProcedures {
			var patientQueue models.PatientQueue

			// Create new patient queue if it doesn't exists
			if err := tx.Where("queue_name = ?", diagnosticProcedure.DiagnosticProcedureTypeTitle).Take(&patientQueue).Error; err != nil {
				patientQueue.QueueName = diagnosticProcedure.DiagnosticProcedureTypeTitle
				patientQueue.QueueType = models.DiagnosticQueue
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

				if err := tx.Where("queue_name = ?", diagnosticProcedure.DiagnosticProcedureTypeTitle).Updates(&models.PatientQueue{Queue: queue}).Error; err != nil {
					return err
				}
			}
		}

		return nil
	})
}

// GetCount ...
func (r *DiagnosticProcedureOrderRepository) GetCount(filter *models.DiagnosticProcedureOrder, date *time.Time, searchTerm *string) (int64, error) {
	dbOp := r.DB.Model(&models.DiagnosticProcedureOrder{}).Where(filter)

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
func (r *DiagnosticProcedureOrderRepository) Search(p models.PaginationInput, filter *models.DiagnosticProcedureOrder, date *time.Time, searchTerm *string, ascending bool) ([]models.DiagnosticProcedureOrder, int64, error) {
	var result []models.DiagnosticProcedureOrder

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("DiagnosticProcedures.Payments.Billing").Preload("DiagnosticProcedures.DiagnosticProcedureType").Preload("OrderedBy.UserTypes")

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

	err := dbOp.Find(&result).Error

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	return result, count, err
}

// GetByPatientChartID ...
func (r *DiagnosticProcedureOrderRepository) GetByPatientChartID(m *models.DiagnosticProcedureOrder, patientChartID int) error {
	return r.DB.Where("patient_chart_id = ?", patientChartID).Preload("DiagnosticProcedures").Preload("DiagnosticProcedures.Payments").Preload("DiagnosticProcedures.DiagnosticProcedureType").Preload("DiagnosticProcedures.Images").Preload("DiagnosticProcedures.Documents").Take(&m).Error
}

// GetAll ...
func (r *DiagnosticProcedureOrderRepository) GetAll(p PaginationInput, filter *models.DiagnosticProcedureOrder) ([]models.DiagnosticProcedureOrder, int64, error) {
	var result []models.DiagnosticProcedureOrder

	dbOp := r.DB.Scopes(Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("DiagnosticProcedures").Order("id ASC").Find(&result)

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
func (r *DiagnosticProcedureOrderRepository) Update(m *models.DiagnosticProcedureOrder) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *DiagnosticProcedureOrderRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.DiagnosticProcedureOrder{}).Error
}
