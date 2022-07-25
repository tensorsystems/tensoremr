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

// Patient ...
type Patient struct {
	gorm.Model
	ID                     int            `gorm:"primaryKey"`
	FirstName              string         `json:"firstName" gorm:"not null;"`
	LastName               string         `json:"lastName" gorm:"not null;"`
	FullName               string         `json:"fullName"`
	Gender                 string         `json:"gender"`
	PhoneNo                string         `json:"phoneNo" gorm:"size:100;not null;"`
	PhoneNo2               string         `json:"phoneNo2" gorm:"size:100;not null;"`
	TelNo                  string         `json:"telNo"`
	HomePhone              string         `json:"homePhone"`
	Email                  string         `json:"email" gorm:"size:100;not null;"`
	DateOfBirth            time.Time      `json:"dateOfBirth"`
	IDNo                   string         `json:"idNo"`
	IDType                 string         `json:"idType"`
	MartialStatus          string         `json:"martialStatus"`
	Occupation             string         `json:"occupation"`
	Credit                 *bool          `json:"credit"`
	CreditCompany          *string        `json:"creditCompany"`
	EmergencyContactName   string         `json:"emergencyContactName"`
	EmergencyContactRel    string         `json:"emergencyContactRel"`
	EmergencyContactPhone  string         `json:"emergencyContactPhone"`
	EmergencyContactPhone2 string         `json:"emergencyContactPhone2"`
	EmergencyContactMemo   string         `json:"emergencyContactMemo"`
	City                   string         `json:"city"`
	SubCity                string         `json:"subCity"`
	Region                 string         `json:"region"`
	Woreda                 string         `json:"woreda"`
	Zone                   string         `json:"zone"`
	Kebele                 string         `json:"kebele"`
	HouseNo                string         `json:"houseNo"`
	Memo                   string         `json:"memo"`
	CardNo                 string         `json:"cardNo"`
	PaperRecord            bool           `json:"paperRecord"`
	PaperRecordDocumentID  *int           `json:"paperRecordDocumentId"`
	PaperRecordDocument    *File          `json:"paperRecordDocument"`
	Documents              []File         `json:"documents" gorm:"many2many:patient_documents"`
	PatientHistory         PatientHistory `json:"patientHistory"`
	Appointments           []Appointment  `json:"appointments"`
	Document               string         `gorm:"type:tsvector"`
	Count                  int64          `json:"count"`
}

// AfterCreate ...
func (r *Patient) AfterCreate(tx *gorm.DB) error {
	r.FullName = r.FirstName + " " + r.LastName

	if err := tx.Model(r).Save(&r).Error; err != nil {
		return err
	}

	return nil
}

// AfterUpdate ...
func (r *Patient) AfterUpdate(tx *gorm.DB) (err error) {
	for _, appointment := range r.Appointments {
		appointment.FirstName = r.FirstName
		appointment.LastName = r.LastName
		appointment.PhoneNo = r.PhoneNo

		var provider User
		tx.Where("id = ?", appointment.UserID).Take(&provider)
		appointment.ProviderName = provider.FirstName + " " + provider.LastName

		tx.Model(appointment).Updates(&appointment)
	}

	return
}
