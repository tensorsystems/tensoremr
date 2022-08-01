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

type SurgicalOrderRepository struct {
	DB *gorm.DB
}

func ProvideSurgicalOrderRepository(DB *gorm.DB) SurgicalOrderRepository {
	return SurgicalOrderRepository{DB: DB}
}

// SaveOpthalmologyOrder ...
func (r *SurgicalOrderRepository) SaveOpthalmologyOrder(m *models.SurgicalOrder, surgicalProcedure *models.SurgicalProcedure, surgicalProcedureTypeID int, patientChartID int, patientID int, billingID int, user models.User, performOnEye string, orderNote string, receptionNote string) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		// Get Patient
		var patient models.Patient
		if err := tx.Model(&models.Patient{}).Where("id = ?", patientID).Take(&patient).Error; err != nil {
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
		m.OrderedByID = user.ID
		m.Status = models.SurgicalOrderStatusOrdered

		var existing models.SurgicalOrder
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

		// Surgical Procedure Type
		var surgicalProcedureType models.SurgicalProcedureType
		if err := tx.Model(&models.SurgicalProcedureType{}).Preload("Supplies.Billings").Where("id = ?", surgicalProcedureTypeID).Take(&surgicalProcedureType).Error; err != nil {
			return err
		}

		// Create payment
		var payments []models.Payment

		// Payment for procedure
		var payment models.Payment
		payment.Status = models.NotPaidPaymentStatus
		payment.BillingID = billingID
		payments = append(payments, payment)

		// Attach supply payments
		for _, supply := range surgicalProcedureType.Supplies {
			for _, billing := range supply.Billings {
				var payment models.Payment
				payment.Status = models.NotPaidPaymentStatus
				payment.BillingID = billing.ID
				payments = append(payments, payment)
			}
		}

		// Create surgical procedure
		surgicalProcedure.SurgicalProcedureTypeID = surgicalProcedureType.ID
		surgicalProcedure.SurgicalOrderID = m.ID
		surgicalProcedure.PatientChartID = patientChartID
		surgicalProcedure.Payments = payments
		surgicalProcedure.Status = models.SurgeryStatusOrdered
		surgicalProcedure.SurgicalProcedureTypeTitle = surgicalProcedureType.Title
		surgicalProcedure.PerformOnEye = performOnEye
		surgicalProcedure.OrderNote = orderNote
		surgicalProcedure.ReceptionNote = receptionNote

		if err := tx.Create(&surgicalProcedure).Error; err != nil {
			return err
		}

		return nil
	})
}

// GetTodaysOrderedCount ...
func (r *SurgicalOrderRepository) GetTodaysOrderedCount() (count int) {
	now := time.Now()
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	end := start.AddDate(0, 0, 1)

	var countTmp int64
	err := r.DB.Model(&models.SurgicalOrder{}).Where("created_at >= ?", start).Where("created_at <= ?", end).Where("status = ?", models.SurgicalOrderStatusOrdered).Count(&countTmp).Error
	if err != nil {
		countTmp = 0
	}

	count = int(countTmp)

	return
}

// ConfirmOrder ...
func (r *SurgicalOrderRepository) ConfirmOrder(m *models.SurgicalOrder, surgicalProcedure *models.SurgicalProcedure, appointment *models.Appointment, surgicalOrderID int, surgicalProcedureID int, invoiceNo string, roomID int, checkInTime time.Time) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ?", surgicalProcedureID).Preload("Payments").Take(&surgicalProcedure).Error; err != nil {
			return err
		}

		// Update all surgical procedure payments to paid
		var paymentIds []int
		for _, payment := range surgicalProcedure.Payments {
			paymentIds = append(paymentIds, payment.ID)
		}

		if err := tx.Model(&models.Payment{}).Where("id IN ?", paymentIds).Updates(map[string]interface{}{"invoice_no": invoiceNo, "status": "PAID"}).Error; err != nil {
			return err
		}

		// Get surgical order with payments
		if err := tx.Where("id = ?", surgicalOrderID).Preload("SurgicalProcedures.Payments").Take(&m).Error; err != nil {
			return err
		}

		var patientChart models.PatientChart
		if err := tx.Where("id = ?", m.PatientChartID).Take(&patientChart).Error; err != nil {
			return err
		}

		var previousAppointment models.Appointment
		if err := tx.Where("id = ?", patientChart.AppointmentID).Take(&previousAppointment).Error; err != nil {
			return err
		}

		var allPayments []models.Payment
		for _, surgicalProcedure := range m.SurgicalProcedures {
			allPayments = append(allPayments, surgicalProcedure.Payments...)
		}

		allPaid := true
		for _, payment := range allPayments {
			if payment.Status == models.NotPaidPaymentStatus {
				allPaid = false
			}
		}

		if allPaid {
			// Update surgical order to completed
			m.Status = models.SurgicalOrderStatusCompleted
			if err := tx.Updates(&m).Error; err != nil {
				return err
			}
		}

		// Create new appointment
		appointment.PatientID = m.PatientID
		appointment.RoomID = roomID
		appointment.CheckInTime = checkInTime
		appointment.UserID = m.OrderedByID
		appointment.Credit = false
		appointment.Payments = surgicalProcedure.Payments
		appointment.MedicalDepartment = previousAppointment.MedicalDepartment

		// Assign surgery visit type
		var visitType models.VisitType
		if err := tx.Where("title = ?", "Surgery").Take(&visitType).Error; err != nil {
			return err
		}
		appointment.VisitTypeID = visitType.ID

		// Assign scheduled status
		var status models.AppointmentStatus
		if err := tx.Where("title = ?", "Scheduled").Take(&status).Error; err != nil {
			return err
		}
		appointment.AppointmentStatusID = status.ID

		// Create appointment
		if err := tx.Create(&appointment).Error; err != nil {
			return err
		}

		// Create new patient chart
		var newPatientChart models.PatientChart
		newPatientChart.AppointmentID = appointment.ID
		if err := tx.Create(&newPatientChart).Error; err != nil {
			return err
		}

		surgicalProcedure.Status = models.SurgeryStatusOrdered
		surgicalProcedure.PatientChartID = newPatientChart.ID
		if err := tx.Updates(&surgicalProcedure).Error; err != nil {
			return err
		}

		return nil
	})
}

// GetCount ...
func (r *SurgicalOrderRepository) GetCount(filter *models.SurgicalOrder, date *time.Time, searchTerm *string) (int64, error) {
	dbOp := r.DB.Model(&models.SurgicalOrder{}).Where(filter)

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
func (r *SurgicalOrderRepository) Search(p models.PaginationInput, filter *models.SurgicalOrder, date *time.Time, searchTerm *string, ascending bool) ([]models.SurgicalOrder, int64, error) {
	var result []models.SurgicalOrder

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("SurgicalProcedures.Payments.Billing").Preload("SurgicalProcedures.SurgicalProcedureType").Preload("OrderedBy.UserTypes")

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
func (r *SurgicalOrderRepository) GetByPatientChartID(m *models.SurgicalOrder, patientChartID int) error {
	return r.DB.Where("patient_chart_id = ?", patientChartID).Preload("SurgicalProcedures").Preload("SurgicalProcedures.Payments").Preload("SurgicalProcedures.SurgicalProcedureType").Take(&m).Error
}

// GetAll ...
func (r *SurgicalOrderRepository) GetAll(p PaginationInput, filter *models.SurgicalOrder) ([]models.SurgicalOrder, int64, error) {
	var result []models.SurgicalOrder

	dbOp := r.DB.Scopes(Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("SurgicalProcedures").Order("id ASC").Find(&result)

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
func (r *SurgicalOrderRepository) Update(m *models.SurgicalOrder) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *SurgicalOrderRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.SurgicalOrder{}).Error
}
