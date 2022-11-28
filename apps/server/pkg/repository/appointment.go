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
	"errors"
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/tensorsystems/tensoremr/apps/server/pkg/models"
	"gorm.io/gorm"
)

type AppointmentRepository struct {
	DB                          *gorm.DB
	AppointmentStatusRepository AppointmentStatusRepository
}

func ProvideAppointmentRepository(DB *gorm.DB, appointmentStatusRepository AppointmentStatusRepository) AppointmentRepository {
	return AppointmentRepository{DB: DB, AppointmentStatusRepository: appointmentStatusRepository}
}

// Save ...
func (r *AppointmentRepository) Save(m *models.Appointment) error {
	return r.DB.Create(&m).Error
}

// CreateNewAppointment ... Creates a new appointment along with PatientChart
func (r *AppointmentRepository) CreateNewAppointment(m *models.Appointment, billingID *int, invoiceNo *string) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {
		var sickVisit models.VisitType
		if err := tx.Where("title = ?", "Sick Visit").Take(&sickVisit).Error; err != nil {
			return err
		}

		if m.VisitTypeID == sickVisit.ID {
			var existingAppointment models.Appointment

			checkInTime := m.CheckInTime
			start := time.Date(checkInTime.Year(), checkInTime.Month(), checkInTime.Day(), 0, 0, 0, 0, checkInTime.Location())
			end := start.AddDate(0, 0, 1)

			var status models.AppointmentStatus
			if err := tx.Where("title = ?", "Checked-In").Take(&status).Error; err != nil {
				return err
			}

			if err := tx.Where("patient_id = ?", m.PatientID).Where("user_id = ?", m.UserID).Where("visit_type_id = ?", m.VisitTypeID).Where("check_in_time >= ?", start).Where("check_in_time < ?", end).Where("appointment_status_id = ?", status.ID).Take(&existingAppointment).Error; err == nil {
				if existingAppointment.ID != 0 {
					return errors.New("Appointment already exists")
				}
			}
		}

		var status models.AppointmentStatus
		if err := tx.Where("title = ?", "Scheduled").Take(&status).Error; err != nil {
			return err
		}

		m.AppointmentStatusID = status.ID

		if invoiceNo != nil && billingID != nil {
			var payment models.Payment
			payment.InvoiceNo = *invoiceNo
			payment.Status = models.PaidPaymentStatus
			payment.BillingID = *billingID

			if err := tx.Create(&payment).Error; err != nil {
				return err
			}

			m.Payments = append(m.Payments, payment)
		}

		if err := tx.Create(&m).Error; err != nil {
			return err
		}

		patientChart := &models.PatientChart{
			AppointmentID: m.ID,
		}

		if err := tx.Create(&patientChart).Error; err != nil {
			return err
		}

		return nil
	})
}

// SchedulePostOp ...
func (r *AppointmentRepository) SchedulePostOp(m *models.Appointment, appointment models.Appointment) error {
	return r.DB.Transaction(func(tx *gorm.DB) error {

		var room models.Room
		if err := tx.Where("title = ?", "Post-Op Room").Take(&room).Error; err != nil {
			room.Title = "Post-Op Room"

			if err := tx.Create(&room).Error; err != nil {
				return err
			}
		}

		var visitType models.VisitType
		if err := tx.Where("title = ?", "Post-Op").Take(&visitType).Error; err != nil {
			visitType.Title = "Post-Op"

			if err := tx.Create(&visitType).Error; err != nil {
				return err
			}
		}

		var status models.AppointmentStatus
		if err := tx.Where("title = ?", "Scheduled").Take(&status).Error; err != nil {
			status.Title = "Scheduled"

			if err := tx.Create(&status).Error; err != nil {
				return err
			}
		}

		now := time.Now()
		tomorrow := now.AddDate(0, 0, 1)

		m.CheckInTime = tomorrow
		m.RoomID = room.ID
		m.VisitTypeID = visitType.ID
		m.AppointmentStatus = status
		m.Credit = appointment.Credit
		m.MedicalDepartment = appointment.MedicalDepartment
		m.PatientID = appointment.PatientID
		m.FirstName = appointment.FirstName
		m.LastName = appointment.LastName
		m.PhoneNo = appointment.PhoneNo
		m.ProviderName = appointment.ProviderName
		m.UserID = appointment.UserID

		if err := tx.Create(&m).Error; err != nil {
			return err
		}

		patientChart := &models.PatientChart{
			AppointmentID: m.ID,
		}

		if err := tx.Create(&patientChart).Error; err != nil {
			return err
		}

		return nil
	})
}

// GetAll ...
func (r *AppointmentRepository) GetAll(p models.PaginationInput, filter *models.Appointment) ([]models.Appointment, int64, error) {
	var result []models.Appointment

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Preload("VisitType").Preload("AppointmentStatus").Where(filter).Order("id ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// PayForConsultation ...
func (r *AppointmentRepository) PayForConsultation(patientID int, date *time.Time) (bool, error) {
	endDate := time.Now()
	if date != nil {
		endDate = *date
	}

	consultationPayDate, _ := strconv.Atoi(os.Getenv("CONSLUTATION_PAY_DATE"))
	surgeryPayDate, _ := strconv.Atoi(os.Getenv("SURGERY_PAY_DATE"))

	consultationStartDate := endDate.AddDate(0, 0, -consultationPayDate)
	surgeryStartDate := endDate.AddDate(0, 0, -surgeryPayDate)

	var consultationCount int64
	var surgeryCount int64

	cErr := r.DB.Model(&models.Appointment{}).Where("patient_id = ?", patientID).Where("check_in_time >= ?", consultationStartDate).Where("check_in_time <= ?", endDate).Count(&consultationCount).Error
	if cErr != nil {
		return false, cErr
	}

	var surgicalVisitType models.VisitType
	if err := r.DB.Where("title = ?", "Surgery").Take(&surgicalVisitType).Error; err != nil {
		return false, err
	}

	sErr := r.DB.Model(&models.Appointment{}).Where("patient_id = ?", patientID).Where("check_in_time >= ?", surgeryStartDate).Where("check_in_time <= ?", endDate).Where("visit_type_id = ?", surgicalVisitType.ID).Count(&surgeryCount).Error
	if sErr != nil {
		return false, sErr
	}

	return consultationCount == 0 && surgeryCount == 0, nil
}

// FindAppointmentsByPatientAndRange ...
func (r *AppointmentRepository) FindAppointmentsByPatientAndRange(patientID int, start time.Time, end time.Time) ([]*models.Appointment, error) {
	var result []*models.Appointment

	err := r.DB.Where("patient_id = ?", patientID).Where("check_in_time >= ?", start).Where("check_in_time <= ?", end).Preload("VisitType").Preload("Room").Find(&result).Error

	return result, err
}

// PatientsAppointmentsToday ...
func (r *AppointmentRepository) PatientsAppointmentToday(patientID int, checkedIn *bool, paid *bool) (models.Appointment, error) {
	now := time.Now()
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	end := start.AddDate(0, 0, 1)

	var appointment models.Appointment
	tx := r.DB.Model(&models.Appointment{}).Where("patient_id = ?", patientID).Where("check_in_time >= ?", start).Where("check_in_time <= ?", end)

	if checkedIn != nil {
		var checkInCondition string
		if *checkedIn {
			checkInCondition = "checked_in_time IS NOT NULL"
		} else {
			checkInCondition = "checked_in_time IS NULL"
		}

		tx.Where(checkInCondition)
	}

	if paid != nil {
		if *paid {
			tx.Where("appointment_payment_status = ?", "PAID")
		}
	}

	err := tx.Preload("VisitType").Preload("Room").Preload("AppointmentStatus").Preload("Patient").Take(&appointment).Error

	return appointment, err
}

// FindTodaysAppointments ...
func (r *AppointmentRepository) FindTodaysAppointments(p models.PaginationInput, searchTerm *string) ([]models.Appointment, int64, error) {
	var result []models.Appointment

	now := time.Now()
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	end := start.AddDate(0, 0, 1)

	tx := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where("check_in_time >= ?", start).Where("check_in_time < ?", end).Preload("VisitType").Preload("Room").Preload("Patient").Preload("AppointmentStatus").Preload("Payments.Billing")

	if searchTerm != nil {
		tx.Where("document @@ plainto_tsquery(?)", *searchTerm)
	}

	tx.Order("check_in_time ASC").Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if tx.Error != nil {
		return result, 0, tx.Error
	}

	return result, count, tx.Error
}

// FindTodaysCheckedInAppointments ...
func (r *AppointmentRepository) FindTodaysCheckedInAppointments(p models.PaginationInput, searchTerm *string, visitTypes []string) ([]models.Appointment, int64, error) {
	var result []models.Appointment

	now := time.Now()
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	end := start.AddDate(0, 0, 1)

	var appointmentStatus models.AppointmentStatus
	if err := r.AppointmentStatusRepository.GetByTitle(&appointmentStatus, "Checked-In"); err != nil {
		return result, 0, err
	}

	tx := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Preload("VisitType").Preload("Room").Preload("Patient").Preload("AppointmentStatus").Where("checked_in_time >= ?", start).Where("checked_in_time < ?", end).Where("appointment_status_id = ?", appointmentStatus.ID)

	if searchTerm != nil {
		tx.Where("document @@ plainto_tsquery(?)", *searchTerm)
	}

	if len(visitTypes) > 0 {
		var visitTypeRepository VisitTypeRepository
		v, err := visitTypeRepository.GetByTitles(visitTypes)
		if err != nil {
			return nil, 0, err
		}

		var visitTypeIds []int
		for _, visitType := range v {
			visitTypeIds = append(visitTypeIds, visitType.ID)
		}

		tx.Where("visit_type_id IN ?", visitTypeIds)
	}

	err := tx.Order("check_in_time ASC").Find(&result).Error

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	return result, count, err
}

// GetByIds ...
func (r *AppointmentRepository) GetByIds(ids []int, p models.PaginationInput) ([]models.Appointment, int64, error) {
	var result []models.Appointment

	dbOp := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Where("id IN ?", ids).Find(&result)

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	if dbOp.Error != nil {
		return result, 0, dbOp.Error
	}

	return result, count, dbOp.Error
}

// GetByIds ...
func (r *AppointmentRepository) FindByUserSubscriptions(ids []int, searchTerm *string, visitTypes []string, p models.PaginationInput) ([]models.Appointment, int64, error) {
	var result []models.Appointment

	var i []string
	for _, id := range ids {
		i = append(i, strconv.Itoa(id))
	}

	idsString := strings.Join(i, ",")

	join := fmt.Sprintf("JOIN unnest('{%s}'::int[]) WITH ORDINALITY t(id, ord) USING (id)", idsString)

	tx := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Joins(join)

	if searchTerm != nil {
		tx.Where("document @@ plainto_tsquery(?)", *searchTerm)
	}

	if len(visitTypes) > 0 {
		var visitTypeRepository VisitTypeRepository
		v, err := visitTypeRepository.GetByTitles(visitTypes)
		if err != nil {
			return nil, 0, err
		}

		var visitTypeIds []int
		for _, visitType := range v {
			visitTypeIds = append(visitTypeIds, visitType.ID)
		}

		tx.Where("visit_type_id IN ?", visitTypeIds)
	}

	err := tx.Preload("VisitType").Preload("Room").Preload("Patient").Preload("AppointmentStatus").Order("t.ord").Find(&result).Error

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	return result, count, err
}

// FindByProvider ...
func (r *AppointmentRepository) FindByProvider(p models.PaginationInput, searchTerm *string, visitTypes []string, userID int) ([]models.Appointment, int64, error) {
	var result []models.Appointment

	now := time.Now()
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	end := start.AddDate(0, 0, 1)

	var appointmentStatus models.AppointmentStatus
	if err := r.AppointmentStatusRepository.GetByTitle(&appointmentStatus, "Checked-In"); err != nil {
		return result, 0, err
	}

	tx := r.DB.Scopes(models.Paginate(&p)).Select("*, count(*) OVER() AS count").Preload("VisitType").Preload("Room").Preload("Patient").Preload("AppointmentStatus").Where("check_in_time >= ?", start).Where("check_in_time < ?", end).Where("appointment_status_id = ?", appointmentStatus.ID).Where("user_id = ?", userID)

	if searchTerm != nil {
		tx.Where("document @@ plainto_tsquery(?)", *searchTerm)
	}

	if len(visitTypes) > 0 {
		var visitTypeRepository VisitTypeRepository
		v, err := visitTypeRepository.GetByTitles(visitTypes)
		if err != nil {
			return nil, 0, err
		}

		var visitTypeIds []int
		for _, visitType := range v {
			visitTypeIds = append(visitTypeIds, visitType.ID)
		}

		tx.Where("visit_type_id IN ?", visitTypeIds)
	}

	err := tx.Order("check_in_time ASC").Find(&result).Error

	var count int64
	if len(result) > 0 {
		count = result[0].Count
	}

	return result, count, err
}

// SearchAppointments ...
func (r *AppointmentRepository) SearchAppointments(page models.PaginationInput, p models.AppointmentSearchInput) ([]models.Appointment, int64, error) {
	var count int64
	var appointments []models.Appointment

	tx := r.DB.Scopes(models.Paginate(&page)).Select("*, count(*) OVER() AS count").Preload("VisitType").Preload("Room").Preload("Patient").Preload("AppointmentStatus").Preload("Payments.Billing")

	if p.SearchTerm != nil {
		tx.Where("document @@ plainto_tsquery(?)", p.SearchTerm)
	}

	if p.AppointmentStatusID != nil {
		tx.Where("appointment_status_id = ?", p.AppointmentStatusID)
	}

	if p.VisitTypeID != nil {
		tx.Where("visit_type_id = ?", p.VisitTypeID)
	}

	if p.UserID != nil {
		tx.Where("user_id = ?", p.UserID)
	}

	if p.PatientID != nil {
		tx.Where("patient_id = ?", p.PatientID)
	}

	if p.CheckInTime != nil {
		checkInTime := p.CheckInTime
		start := time.Date(checkInTime.Year(), checkInTime.Month(), checkInTime.Day(), 0, 0, 0, 0, checkInTime.Location())
		end := time.Date(checkInTime.Year(), checkInTime.Month(), checkInTime.Day(), 24, 0, 0, 0, checkInTime.Location())

		tx.Where("check_in_time >= ?", start).Where("check_in_time <= ?", end)
	}

	tx.Order("check_in_time DESC")

	err := tx.Find(&appointments).Error

	if len(appointments) > 0 {
		count = appointments[0].Count
	}

	return appointments, count, err
}

// Get ...
func (r *AppointmentRepository) Get(m *models.Appointment, ID int) error {
	return r.DB.Where("id = ?", ID).Take(&m).Error
}

// GetWithDetails ...
func (r *AppointmentRepository) GetWithDetails(m *models.Appointment, ID int) error {
	return r.DB.Where("id = ?", ID).Preload("VisitType").Preload("Room").Preload("Patient").Preload("AppointmentStatus").Preload("PatientChart.SurgicalProcedure.SurgicalProcedureType").Preload("PatientChart.SurgicalProcedure.PreanestheticDocuments").Preload("PatientChart.Treatment.TreatmentType").Preload("Patient.PaperRecordDocument").Preload("Patient.Documents").Take(&m).Error
}

// ReceptionHomeStats ...
func (r *AppointmentRepository) ReceptionHomeStats() (int, int, int, error) {
	var appointments []models.Appointment

	now := time.Now()
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	end := start.AddDate(0, 0, 1)

	err := r.DB.Select("*, count(*) OVER() AS count").Where("check_in_time >= ?", start).Where("check_in_time < ?", end).Preload("AppointmentStatus").Find(&appointments).Error
	if err != nil {
		return 0, 0, 0, nil
	}

	var scheduled int
	var checkedIn int
	var checkedOut int
	for _, e := range appointments {
		if e.AppointmentStatus.Title == "Scheduled" {
			scheduled = scheduled + 1
		} else if e.AppointmentStatus.Title == "Checked-In" {
			checkedIn = checkedIn + 1
		} else if e.AppointmentStatus.Title == "Checked-Out" {
			checkedOut = checkedOut + 1
		}
	}

	return scheduled, checkedIn, checkedOut, nil
}

// NurseHomeStats ...
func (r *AppointmentRepository) NurseHomeStats() (int, int, int, error) {
	var appointments []models.Appointment

	now := time.Now()
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	end := start.AddDate(0, 0, 1)

	err := r.DB.Select("*, count(*) OVER() AS count").Where("check_in_time >= ?", start).Where("check_in_time < ?", end).Preload("AppointmentStatus").Find(&appointments).Error
	if err != nil {
		return 0, 0, 0, nil
	}

	var scheduled int
	var checkedIn int
	var checkedOut int
	for _, e := range appointments {
		if e.AppointmentStatus.Title == "Scheduled" {
			scheduled = scheduled + 1
		} else if e.AppointmentStatus.Title == "Checked-In" {
			checkedIn = checkedIn + 1
		} else if e.AppointmentStatus.Title == "Checked-Out" {
			checkedOut = checkedOut + 1
		}
	}

	return scheduled, checkedIn, checkedOut, nil
}

// PhysicianHomeStats ...
func (r *AppointmentRepository) PhysicianHomeStats(userId int) (int, int, int, error) {
	var appointments []models.Appointment

	now := time.Now()
	start := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	end := start.AddDate(0, 0, 1)

	err := r.DB.Select("*, count(*) OVER() AS count").Where("check_in_time >= ?", start).Where("check_in_time < ?", end).Where("user_id = ?", userId).Preload("AppointmentStatus").Find(&appointments).Error
	if err != nil {
		return 0, 0, 0, nil
	}

	var scheduled int
	var checkedIn int
	var checkedOut int
	for _, e := range appointments {
		if e.AppointmentStatus.Title == "Scheduled" {
			scheduled = scheduled + 1
		} else if e.AppointmentStatus.Title == "Checked-In" {
			checkedIn = checkedIn + 1
		} else if e.AppointmentStatus.Title == "Checked-Out" {
			checkedOut = checkedOut + 1
		}
	}

	return len(appointments), checkedIn, checkedOut, nil
}

// Update ...
func (r *AppointmentRepository) Update(m *models.Appointment) error {
	return r.DB.Updates(&m).Error
}

// Delete ...
func (r *AppointmentRepository) Delete(ID int) error {
	return r.DB.Where("id = ?", ID).Delete(&models.Appointment{}).Error
}
