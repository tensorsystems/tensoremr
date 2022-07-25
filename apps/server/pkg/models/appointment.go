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

package models

import (
	"time"

	"gorm.io/gorm"
)

// Appointment ...
type Appointment struct {
	gorm.Model
	ID                  int               `gorm:"primaryKey" json:"id"`
	PatientID           int               `json:"patientId"`
	Patient             Patient           `json:"patient"`
	FirstName           string            `json:"firstName"`
	LastName            string            `json:"lastName"`
	PhoneNo             string            `json:"phoneNo"`
	CheckInTime         time.Time         `json:"checkInTime" gorm:"index:check_in_time_idx"`
	CheckedInTime       *time.Time        `json:"checkedInTime" gorm:"index:daily_appointment_idx"`
	CheckedOutTime      time.Time         `json:"checkedOutTime"`
	RoomID              int               `json:"roomId"`
	Room                Room              `json:"room"`
	VisitTypeID         int               `json:"visitTypeId"`
	VisitType           VisitType         `json:"visitType"`
	AppointmentStatusID int               `json:"appointmentStatusId" gorm:"index:daily_appointment_idx"`
	AppointmentStatus   AppointmentStatus `json:"appointmentStatus"`
	Emergency           *bool             `json:"emergency"`
	MedicalDepartment   string            `json:"medicalDepartment"`
	Credit              bool              `json:"credit"`
	Payments            []Payment         `json:"payments" gorm:"many2many:appointment_payments;"`
	Files               []File            `json:"files" gorm:"many2many:appointment_files"`
	UserID              int               `json:"userId"`
	ProviderName        string            `json:"providerName"`
	PatientChart        PatientChart      `json:"patientChart"`
	QueueID             int               `json:"queueId"`
	QueueName           string            `json:"queueName"`
	Document            string            `gorm:"type:tsvector"`
	Count               int64             `json:"count"`
}

// AppointmentSearchInput ...
type AppointmentSearchInput struct {
	SearchTerm          *string    `json:"searchTerm"`
	UserID              *int       `json:"userId"`
	PatientID           *int       `json:"patientId"`
	AppointmentStatusID *string    `json:"appointmentStatusId"`
	VisitTypeID         *string    `json:"visitTypeId"`
	CheckInTime         *time.Time `json:"checkInTime"`
}

// AfterCreate ...
func (r *Appointment) AfterCreate(tx *gorm.DB) error {
	var patient Patient
	err := tx.Where("id = ?", r.PatientID).Take(&patient).Error
	if err != nil {
		return err
	}

	r.FirstName = patient.FirstName
	r.LastName = patient.LastName
	r.PhoneNo = patient.PhoneNo

	var provider User
	tx.Where("id = ?", r.UserID).Take(&provider)
	r.ProviderName = provider.FirstName + " " + provider.LastName

	tx.Model(r).Updates(&r)

	return nil
}
