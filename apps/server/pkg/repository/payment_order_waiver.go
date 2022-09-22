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

	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type PaymentOrderWaiverRepository struct {
	DB *gorm.DB
}

func ProvidePaymentOrderWaiverRepository(DB *gorm.DB) PaymentOrderWaiverRepository {
	return PaymentOrderWaiverRepository{DB: DB}
}

// Save ...
func (r *PaymentOrderWaiverRepository) Save(m *models.PaymentOrderWaiver) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(&m).Error; err != nil {
			return err
		}

		if m.OrderType == "diagnostic-procedure" {
			var diagnosticProcedure models.DiagnosticProcedure

			if err := tx.Where("id = ?", m.OrderID).Take(&diagnosticProcedure).Error; err != nil {
				return err
			}

			diagnosticProcedure.PaymentStatus = models.OrderPaymentWaiverRequested
			if err := tx.Updates(&diagnosticProcedure).Error; err != nil {
				return err
			}
		}

		if m.OrderType == "surgical-procedure" {
			var surgicalProcedure models.SurgicalProcedure

			if err := tx.Where("id = ?", m.OrderID).Take(&surgicalProcedure).Error; err != nil {
				return err
			}

			surgicalProcedure.PaymentStatus = models.OrderPaymentWaiverRequested
			if err := tx.Updates(&surgicalProcedure).Error; err != nil {
				return err
			}
		}

		if m.OrderType == "treatment" {
			var treatment models.Treatment

			if err := tx.Where("id = ?", m.OrderID).Take(&treatment).Error; err != nil {
				return err
			}

			treatment.PaymentStatus = models.OrderPaymentWaiverRequested
			if err := tx.Updates(&treatment).Error; err != nil {
				return err
			}
		}

		return nil
	})

}

// ApproveWaiver ...
func (r *PaymentOrderWaiverRepository) ApproveWaiver(m *models.PaymentOrderWaiver, id int, approve bool) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		// Update payment waiver
		if err := tx.Where("id = ?", id).Take(&m).Error; err != nil {
			return err
		}

		m.Approved = &approve
		if err := tx.Updates(&m).Error; err != nil {
			return err
		}

		if m.OrderType == "diagnostic-procedure" {
			var diagnosticProcedure models.DiagnosticProcedure
			if err := tx.Where("id = ?", m.OrderID).Preload("Payments").Take(&diagnosticProcedure).Error; err != nil {
				return err
			}

			var paymentIds []int
			for _, payment := range diagnosticProcedure.Payments {
				paymentIds = append(paymentIds, payment.ID)
			}

			if err := tx.Model(&models.Payment{}).Where("id IN ?", paymentIds).Updates(map[string]interface{}{"status": "PAID"}).Error; err != nil {
				return err
			}

			waived := "WAIVED"
			diagnosticProcedure.PaymentVoucher = &waived

			if err := tx.Updates(&diagnosticProcedure).Error; err != nil {
				return err
			}

			var order models.DiagnosticProcedureOrder
			if err := tx.Where("id = ?", diagnosticProcedure.DiagnosticProcedureOrderID).Preload("DiagnosticProcedures").Take(&order).Error; err != nil {
				return err
			}

			allPaid := true
			for _, procedure := range order.DiagnosticProcedures {
				if procedure.PaymentVoucher == nil {
					allPaid = false
				}
			}

			if allPaid {
				order.Status = models.DiagnosticProcedureOrderCompletedStatus

				if err := tx.Updates(&order).Error; err != nil {
					return err
				}
			}

			// Add to Diagnostic Queue
			var patientChart models.PatientChart
			if err := tx.Where("id = ?", order.PatientChartID).Take(&patientChart).Error; err != nil {
				return err
			}

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

		if m.OrderType == "surgical-procedure" {
			var surgicalProcedure models.SurgicalProcedure
			if err := tx.Where("id = ?", m.OrderID).Preload("Payments").Take(&surgicalProcedure).Error; err != nil {
				return err
			}

			var paymentIds []int
			for _, payment := range surgicalProcedure.Payments {
				paymentIds = append(paymentIds, payment.ID)
			}

			if err := tx.Model(&models.Payment{}).Where("id IN ?", paymentIds).Updates(map[string]interface{}{"status": "PAID"}).Error; err != nil {
				return err
			}

			waived := "WAIVED"
			surgicalProcedure.PaymentVoucher = &waived
			if err := tx.Updates(&surgicalProcedure).Error; err != nil {
				return err
			}

			var order models.SurgicalOrder
			if err := tx.Where("id = ?", surgicalProcedure.SurgicalOrderID).Preload("SurgicalProcedures").Take(&order).Error; err != nil {
				return err
			}

			allPaid := true
			for _, procedure := range order.SurgicalProcedures {
				if procedure.PaymentVoucher == nil {
					allPaid = false
				}
			}

			if allPaid {
				order.Status = models.SurgicalOrderStatusCompleted

				if err := tx.Updates(&order).Error; err != nil {
					return err
				}
			}
		}

		if m.OrderType == "treatment" {
			var treatment models.Treatment
			if err := tx.Where("id = ?", m.OrderID).Preload("Payments").Take(&treatment).Error; err != nil {
				return err
			}

			var paymentIds []int
			for _, payment := range treatment.Payments {
				paymentIds = append(paymentIds, payment.ID)
			}

			if err := tx.Model(&models.Payment{}).Where("id IN ?", paymentIds).Updates(map[string]interface{}{"status": "PAID"}).Error; err != nil {
				return err
			}

			waived := "WAIVED"
			treatment.PaymentVoucher = &waived
			if err := tx.Updates(&treatment).Error; err != nil {
				return err
			}

			var order models.TreatmentOrder
			if err := tx.Where("id = ?", treatment.TreatmentOrderID).Preload("Treatments").Take(&order).Error; err != nil {
				return err
			}

			allPaid := true
			for _, procedure := range order.Treatments {
				if procedure.PaymentVoucher == nil {
					allPaid = false
				}
			}

			if allPaid {
				order.Status = models.TreatmentOrderStatusCompleted

				if err := tx.Updates(&order).Error; err != nil {
					return err
				}
			}
		}

		return nil
	})
}

// BatchSave ...
func (r *PaymentOrderWaiverRepository) BatchSave(waivers []models.PaymentOrderWaiver) error {
	return r.DB.Save(&waivers).Error
}

// Get ...
func (r *PaymentOrderWaiverRepository) Get(m *models.PaymentOrderWaiver, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetCount ...
func (r *PaymentOrderWaiverRepository) GetApprovedCount() (int, error) {
	var count int64
	err := r.DB.Model(&models.PaymentOrderWaiver{}).Where("approved IS NULL").Count(&count).Error
	return int(count), err
}

// GetAll ...
func (r *PaymentOrderWaiverRepository) GetAll(p models.PaginationInput) ([]models.PaymentOrderWaiver, int64, error) {
	var result []models.PaymentOrderWaiver

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Preload("Patient").Preload("User").Order("id DESC").Find(&result)

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
func (r *PaymentOrderWaiverRepository) Update(m *models.PaymentOrderWaiver) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *PaymentOrderWaiverRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.PaymentOrderWaiver{}).Error
}
