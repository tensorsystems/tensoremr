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

type ReferralRepository struct {
	DB *gorm.DB
}

func ProvideReferralRepository(DB *gorm.DB) ReferralRepository {
	return ReferralRepository{DB: DB}
}

// Save ...
func (r *ReferralRepository) Save(m *models.Referral) error {
	return r.DB.Create(&m).Error
}

// Get ...
func (r *ReferralRepository) Get(m *models.Referral, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// Get ...
func (r *ReferralRepository) GetByOrderID(m *models.Referral, ID int) error {
	return r.DB.Where("patient_chart_id = ?", ID).Take(&m).Error
}

// // ConfirmReferral ...
// func (r *Referral) ConfirmReferral(orderID int, checkInTime time.Time, roomId int) error {
// 	return r.DB.Transaction(func(tx *gorm.DB) error {
// 		var order Order
// 		if err := order.Get(orderID); err != nil {
// 			return err
// 		}

// 		var referral Referral
// 		if err := referral.GetByOrderID(order.ID); err != nil {
// 			return err
// 		}

// 		*r = referral

// 		var appointment Appointment
// 		if err := appointment.GetWithDetails(referral.AppointmentID); err != nil {
// 			return err
// 		}

// 		var visitType VisitType
// 		if err := tx.Where("title = ?", "Referral").Take(&visitType).Error; err != nil {
// 			return err
// 		}

// 		var status AppointmentStatus
// 		if err := tx.Where("title = ?", "Scheduled").Take(&status).Error; err != nil {
// 			return err
// 		}

// 		var newAppointment Appointment
// 		newAppointment.AppointmentStatusID = status.ID
// 		newAppointment.CheckInTime = checkInTime
// 		newAppointment.Payments = appointment.Payments
// 		newAppointment.PatientID = appointment.PatientID
// 		newAppointment.VisitTypeID = visitType.ID
// 		newAppointment.RoomID = roomId
// 		newAppointment.UserID = appointment.UserID
// 		newAppointment.PatientChart = appointment.PatientChart
// 		if err := tx.Create(&newAppointment).Error; err != nil {
// 			return err
// 		}

// 		order.Status = CompletedOrderStatus
// 		if err := order.Update(); err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// }

// GetAll ...
func (r *ReferralRepository) GetAll(p models.PaginationInput, filter *models.Referral) ([]models.Referral, int64, error) {
	var result []models.Referral

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where(filter).Order("id ASC").Find(&result)

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
func (r *ReferralRepository) Update(m *models.Referral) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *ReferralRepository) Delete(m *models.Referral, ID int) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("id = ?", ID).Take(&m).Error; err != nil {
			return err
		}

		if err := tx.Where("id = ?", ID).Delete(&m).Error; err != nil {
			return err
		}

		var referralsCount int64
		if err := tx.Model(&m).Where("referral_order_id = ?", m.ReferralOrderID).Count(&referralsCount).Error; err != nil {
			return err
		}

		if referralsCount == 0 {
			if err := tx.Where("id = ?", m.ReferralOrderID).Delete(&models.ReferralOrder{}).Error; err != nil {
				return err
			}
		}

		return nil
	})
}

// NewOrder ...
// func (r *Referral) NewOrder(appointmentID int, orderedByID int, orderedToID int, patientID int, reason *string) error {
// 	return r.DB.Transaction(func(tx *gorm.DB) error {
// 		// Get Patient
// 		var patient Patient
// 		if err := tx.Model(&Patient{}).Where("id = ?", patientID).Take(&patient).Error; err != nil {
// 			return err
// 		}

// 		// Get Appointment
// 		var appointment Appointment
// 		if err := tx.Model(&Appointment{}).Where("id = ?", appointmentID).Preload("PatientChart").Take(&appointment).Error; err != nil {
// 			return err
// 		}

// 		// Get referred to
// 		var referredTo User
// 		if err := tx.Model(&User{}).Where("id = ?", orderedToID).Take(&referredTo).Error; err != nil {
// 			return err
// 		}

// 		// Create order
// 		var order Order
// 		order.UserID = orderedByID
// 		order.Status = OrderedOrderStatus
// 		order.OrderType = InHouseReferralOrderType
// 		order.Note = *reason
// 		order.FirstName = patient.FirstName
// 		order.LastName = patient.LastName
// 		order.PhoneNo = patient.PhoneNo
// 		order.PatientID = patient.ID
// 		order.PatientChartID = appointment.PatientChart.ID

// 		if err := tx.Create(&order).Error; err != nil {
// 			return err
// 		}

// 		// Create referral
// 		r.Reason = *reason
// 		r.ReferredDate = time.Now()
// 		r.OrderedByID = orderedByID
// 		r.ReferredToID = referredTo.ID
// 		r.ReferredToName = referredTo.FirstName + " " + referredTo.LastName
// 		r.AppointmentID = appointmentID
// 		r.OrderID = order.ID
// 		if err := tx.Create(&r).Error; err != nil {
// 			return err
// 		}

// 		return nil
// 	})
// }
