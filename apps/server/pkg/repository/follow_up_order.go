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

type FollowUpOrderRepository struct {
	DB *gorm.DB
}

func ProvideFollowUpOrderRepository(DB *gorm.DB) FollowUpOrderRepository {
	return FollowUpOrderRepository{DB: DB}
}

// Save ...
func (r *FollowUpOrderRepository) Save(m *models.FollowUpOrder, patientChartID int, patientID int, user models.User, receptionNote string) error {
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
		m.Status = models.FollowUpOrderStatusOrdered

		var existing models.FollowUpOrder
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

		var followUp models.FollowUp
		followUp.FollowUpOrderID = m.ID
		followUp.PatientChartID = patientChartID
		followUp.ReceptionNote = receptionNote
		followUp.Status = models.FollowUpStatusOrdered

		if err := tx.Create(&followUp).Error; err != nil {
			return err
		}

		return nil
	})
}

// GetTodaysOrderedCount ...
func (r *FollowUpOrderRepository) GetTodaysOrderedCount() (count int) {
	now := time.Now()
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	end := start.AddDate(0, 0, 1)

	var countTmp int64
	err := r.DB.Model(&models.FollowUpOrder{}).Where("created_at >= ?", start).Where("created_at <= ?", end).Where("status = ?", models.FollowUpOrderStatusOrdered).Count(&countTmp).Error
	if err != nil {
		countTmp = 0
	}

	count = int(countTmp)

	return
}

// ConfirmOrder ...
func (r *FollowUpOrderRepository) ConfirmOrder(m *models.FollowUpOrder, followUpOrderID int, followUpID int, billingID *int, invoiceNo *string, roomID int, checkInTime time.Time) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var followUp models.FollowUp
		if err := tx.Where("id = ?", followUpID).Take(&followUp).Error; err != nil {
			return err
		}

		if err := tx.Where("id = ?", followUpOrderID).Take(&m).Error; err != nil {
			return err
		}

		var previousPatientChart models.PatientChart
		if err := tx.Where("id = ?", followUp.PatientChartID).Take(&previousPatientChart).Error; err != nil {
			return err
		}

		var previousAppointment models.Appointment
		if err := tx.Where("id = ?", previousPatientChart.AppointmentID).Take(&previousAppointment).Error; err != nil {
			return err
		}

		// Create new appointment
		var appointment models.Appointment
		appointment.PatientID = m.PatientID
		appointment.RoomID = roomID
		appointment.CheckInTime = checkInTime
		appointment.UserID = m.OrderedByID
		appointment.MedicalDepartment = previousAppointment.MedicalDepartment
		appointment.Credit = false

		if billingID != nil {
			var payment models.Payment

			payment.Status = models.PaidPaymentStatus
			payment.BillingID = *billingID

			if invoiceNo != nil {
				payment.InvoiceNo = *invoiceNo
			}

			appointment.Payments = append(appointment.Payments, payment)
		}

		// Assign treatment visit type
		var visitType models.VisitType
		if err := tx.Where("title = ?", "Follow-Up").Take(&visitType).Error; err != nil {
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

		followUp.Status = models.FollowUpStatusCompleted
		if err := tx.Updates(&followUp).Error; err != nil {
			return err
		}

		var followUps []models.FollowUp
		if err := tx.Where("follow_up_order_id = ?", m.ID).Find(&followUps).Error; err != nil {
			return err
		}

		allConfirmed := true
		for _, followUp := range followUps {
			if followUp.Status == models.FollowUpStatusOrdered {
				allConfirmed = false
			}
		}

		if allConfirmed {
			m.Status = models.FollowUpOrderStatusCompleted
			if err := tx.Updates(&m).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

// GetCount ...
func (r *FollowUpOrderRepository) GetCount(filter *models.FollowUpOrder, date *time.Time, searchTerm *string) (int64, error) {
	dbOp := r.DB.Model(&models.FollowUpOrder{}).Where(filter)

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
func (r *FollowUpOrderRepository) Search(p models.PaginationInput, filter *models.FollowUpOrder, date *time.Time, searchTerm *string, ascending bool) ([]models.FollowUpOrder, int64, error) {
	var result []models.FollowUpOrder

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("FollowUps").Preload("OrderedBy.UserTypes")

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
func (r *FollowUpOrderRepository) GetByPatientChartID(m *models.FollowUpOrder, patientChartID int) error {
	return r.DB.Where("patient_chart_id = ?", patientChartID).Preload("FollowUps").Take(&m).Error
}

// GetAll ...
func (r *FollowUpOrderRepository) GetAll(p PaginationInput, filter *models.FollowUpOrder) ([]models.FollowUpOrder, int64, error) {
	var result []models.FollowUpOrder

	dbOp := r.DB.Scopes(Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("FollowUps").Order("id ASC").Find(&result)

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
func (r *FollowUpOrderRepository) Update(m *models.FollowUpOrder) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *FollowUpOrderRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.FollowUpOrder{}).Error
}
