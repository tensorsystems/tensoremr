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

type ReferralOrderRepository struct {
	DB *gorm.DB
}

func ProvideReferralOrderRepository(DB *gorm.DB) ReferralOrderRepository {
	return ReferralOrderRepository{DB: DB}
}

// Save ...
func (r *ReferralOrderRepository) Save(m *models.ReferralOrder, patientChartID int, patientID int, orderedToID *int, referralType models.ReferralType, user models.User, receptionNote *string, reason string, providerName *string) error {
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
		m.Status = models.ReferralOrderStatusOrdered

		var existing models.ReferralOrder
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

		var referral models.Referral
		referral.ReferralOrderID = m.ID
		referral.PatientChartID = patientChartID
		referral.Reason = reason
		referral.Type = referralType

		if referral.Type == models.ReferralTypeInHouse {
			referral.Status = models.ReferralStatusOrdered
		} else if referral.Type == models.ReferralTypeOutsource {
			referral.Status = models.ReferralStatusCompleted
		}

		if receptionNote != nil {
			referral.ReceptionNote = *receptionNote
		}

		if orderedToID != nil {
			var referredTo models.User
			if err := tx.Model(&models.User{}).Where("id = ?", *orderedToID).Take(&referredTo).Error; err != nil {
				return err
			}

			referral.ReferredToID = &referredTo.ID
			referral.ReferredToName = "Dr. " + referredTo.FirstName + " " + referredTo.LastName
		}

		if err := tx.Create(&referral).Error; err != nil {
			return err
		}

		return nil
	})
}

// GetTodaysOrderedCount ...
func (r *ReferralOrderRepository) GetTodaysOrderedCount() (count int) {
	now := time.Now()
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	end := start.AddDate(0, 0, 1)

	var countTmp int64
	err := r.DB.Model(&models.ReferralOrder{}).Where("created_at >= ?", start).Where("created_at <= ?", end).Where("status = ?", models.ReferralOrderStatusOrdered).Count(&countTmp).Error
	if err != nil {
		countTmp = 0
	}

	count = int(countTmp)

	return
}

// ConfirmOrder ...
func (r *ReferralOrderRepository) ConfirmOrder(m *models.ReferralOrder, referralOrderID int, referralID int, billingID *int, invoiceNo *string, roomID *int, checkInTime *time.Time) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var referral models.Referral
		if err := tx.Where("id = ?", referralID).Take(&referral).Error; err != nil {
			return err
		}

		if err := tx.Where("id = ?", referralOrderID).Take(&m).Error; err != nil {
			return err
		}

		if referral.Type == models.ReferralTypeInHouse {
			var patientChart models.PatientChart
			if err := tx.Where("id = ?", m.PatientChartID).Take(&patientChart).Error; err != nil {
				return err
			}

			var previousAppointment models.Appointment
			if err := tx.Where("id = ?", patientChart.AppointmentID).Take(&previousAppointment).Error; err != nil {
				return err
			}

			// Create new appointment
			var appointment models.Appointment
			appointment.PatientID = m.PatientID
			appointment.RoomID = *roomID
			appointment.CheckInTime = *checkInTime
			appointment.UserID = *referral.ReferredToID
			appointment.Credit = false
			appointment.MedicalDepartment = previousAppointment.MedicalDepartment

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
			if err := tx.Where("title = ?", "Referral").Take(&visitType).Error; err != nil {
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
		}

		referral.Status = models.ReferralStatusCompleted
		if err := tx.Updates(&referral).Error; err != nil {
			return err
		}

		var referrals []models.Referral
		if err := tx.Where("referral_order_id = ?", m.ID).Find(&referrals).Error; err != nil {
			return err
		}

		allConfirmed := true
		for _, referral := range referrals {
			if referral.Type == models.ReferralTypeInHouse && referral.Status == models.ReferralStatusOrdered {
				allConfirmed = false
			}
		}

		if allConfirmed {
			m.Status = models.ReferralOrderStatusCompleted
			if err := tx.Updates(&m).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

// GetCount ...
func (r *ReferralOrderRepository) GetCount(filter *models.ReferralOrder, date *time.Time, searchTerm *string) (int64, error) {
	dbOp := r.DB.Model(&models.ReferralOrder{}).Where(filter)

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
func (r *ReferralOrderRepository) Search(p models.PaginationInput, filter *models.ReferralOrder, date *time.Time, searchTerm *string, ascending bool) ([]models.ReferralOrder, int64, error) {
	var result []models.ReferralOrder

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("Referrals", "type = ?", models.ReferralTypeInHouse).Preload("OrderedBy.UserTypes")

	if date != nil {
		createdAt := *date
		start := time.Date(createdAt.Year(), createdAt.Month(), createdAt.Day(), 0, 0, 0, 0, createdAt.Location())
		end := start.AddDate(0, 0, 1)
		dbOp.Where("created_at >= ?", start).Where("referral_orders.created_at <= ?", end)
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
func (r *ReferralOrderRepository) GetByPatientChartID(m *models.ReferralOrder, patientChartID int) error {
	return r.DB.Where("patient_chart_id = ?", patientChartID).Preload("Referrals").Preload("OrderedBy.UserTypes").Take(&m).Error
}

// GetAll ...
func (r *ReferralOrderRepository) GetAll(p models.PaginationInput, filter *models.ReferralOrder) ([]models.ReferralOrder, int64, error) {
	var result []models.ReferralOrder

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Preload("Referrals").Order("id ASC").Find(&result)

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
func (r *ReferralOrderRepository) Update(m *models.ReferralOrder) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *ReferralOrderRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.ReferralOrder{}).Error
}
