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

type TreatmentOrderRepository struct {
	DB *gorm.DB
}

func ProvideTreatmentOrderRepository(DB *gorm.DB) TreatmentOrderRepository {
	return TreatmentOrderRepository{DB: DB}
}

// GetWithTreatments ...
func (r *TreatmentOrderRepository) GetWithTreatments(m *models.TreatmentOrder, ID int) error {
	return r.DB.Where("id = ?", ID).Preload("Treatments").Take(&m).Error
}

// Get ...
func (r *TreatmentOrderRepository) Get(m *models.TreatmentOrder, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// SaveOpthalmologyTreatment ...
func (r *TreatmentOrderRepository) SaveOpthalmologyTreatment(m *models.TreatmentOrder, treatment *models.Treatment, treatmentTypeID int, patientChartID int, patientID int, billingID int, user models.User, treatmentNote string, orderNote string) error {
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
		m.Status = models.TreatmentOrderStatusOrdered

		var existing models.TreatmentOrder
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

		// Treatment Type
		var treatmentType models.TreatmentType
		if err := tx.Where("id = ?", treatmentTypeID).Take(&treatmentType).Error; err != nil {
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
		for _, supply := range treatmentType.Supplies {
			for _, billing := range supply.Billings {
				var payment models.Payment
				payment.Status = models.NotPaidPaymentStatus
				payment.BillingID = billing.ID
				payments = append(payments, payment)
			}
		}

		// Create treatment
		treatment.TreatmentTypeID = treatmentType.ID
		treatment.TreatmentOrderID = m.ID
		treatment.PatientChartID = patientChartID
		treatment.Payments = payments
		treatment.Status = models.TreatmentStatusOrdered
		treatment.PaymentStatus = models.OrderPaymentNotPaid
		treatment.TreatmentTypeTitle = treatmentType.Title
		treatment.ReceptionNote = orderNote
		treatment.Note = treatmentNote

		if err := tx.Create(&treatment).Error; err != nil {
			return err
		}

		return nil
	})
}

// GetTodaysOrderedCount ...
func (r *TreatmentOrderRepository) GetTodaysOrderedCount() (count int) {
	now := time.Now()
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	end := start.AddDate(0, 0, 1)

	var countTmp int64
	err := r.DB.Model(&models.TreatmentOrder{}).Where("created_at >= ?", start).Where("created_at <= ?", end).Where("status = ?", models.TreatmentOrderStatusOrdered).Count(&countTmp).Error
	if err != nil {
		countTmp = 0
	}

	count = int(countTmp)

	return
}

// ConfirmOrder ...
func (r *TreatmentOrderRepository) ConfirmOrder(m *models.TreatmentOrder, treatment *models.Treatment, appointment *models.Appointment, treatmentOrderID int, treatmentID int, invoiceNo string, roomID int, checkInTime time.Time) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ?", treatmentID).Preload("Payments").Take(&treatment).Error; err != nil {
			return err
		}

		// Update all treatment payments to paid
		var paymentIds []int
		for _, payment := range treatment.Payments {
			paymentIds = append(paymentIds, payment.ID)
		}

		if err := tx.Model(&models.Payment{}).Where("id IN ?", paymentIds).Updates(map[string]interface{}{"invoice_no": invoiceNo, "status": "PAID"}).Error; err != nil {
			return err
		}

		// Get treatment order with payments
		if err := tx.Where("id = ?", treatmentOrderID).Preload("Treatments.Payments").Take(&m).Error; err != nil {
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
		for _, treatment := range m.Treatments {
			allPayments = append(allPayments, treatment.Payments...)
		}

		allPaid := true
		for _, payment := range allPayments {
			if payment.Status == models.NotPaidPaymentStatus {
				allPaid = false
			}
		}

		if allPaid {
			// Update treatment order to completed
			m.Status = models.TreatmentOrderStatusCompleted
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
		appointment.Payments = treatment.Payments
		appointment.MedicalDepartment = previousAppointment.MedicalDepartment

		// Assign treatment visit type
		var visitType models.VisitType
		if err := tx.Where("title = ?", "Treatment").Take(&visitType).Error; err != nil {
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

		treatment.Status = models.TreatmentStatusOrdered
		treatment.PatientChartID = newPatientChart.ID
		if err := tx.Updates(&treatment).Error; err != nil {
			return err
		}

		return nil
	})
}

// GetCount ...
func (r *TreatmentOrderRepository) GetCount(filter *models.TreatmentOrder, date *time.Time, searchTerm *string) (int64, error) {
	dbOp := r.DB.Model(&models.TreatmentOrder{}).Where(filter)

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
func (r *TreatmentOrderRepository) Search(p models.PaginationInput, filter *models.TreatmentOrder, date *time.Time, searchTerm *string, ascending bool) ([]models.TreatmentOrder, int64, error) {
	var result []models.TreatmentOrder

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("Treatments.Payments.Billing").Preload("Treatments.TreatmentType").Preload("OrderedBy.UserTypes")

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
func (r *TreatmentOrderRepository) GetByPatientChartID(m *models.TreatmentOrder, patientChartID int) error {
	return r.DB.Where("patient_chart_id = ?", patientChartID).Preload("Treatments").Preload("Treatments.Payments").Preload("Treatments.TreatmentType").Take(&m).Error
}

// GetAll ...
func (r *TreatmentOrderRepository) GetAll(p PaginationInput, filter *models.TreatmentOrder) ([]models.TreatmentOrder, int64, error) {
	var result []models.TreatmentOrder

	dbOp := r.DB.Scopes(Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("Treatments").Order("id ASC").Find(&result)

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
func (r *TreatmentOrderRepository) Update(m *models.TreatmentOrder) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *TreatmentOrderRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.TreatmentOrder{}).Error
}
