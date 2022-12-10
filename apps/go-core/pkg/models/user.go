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

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// User ...
type User struct {
	gorm.Model
	ID int `gorm:"primaryKey"`

	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`

	Email    string `json:"email" gorm:"uniqueIndex"`
	Password string `json:"password"`

	OldUserName string `json:"oldUserName"`

	UserTypes []UserType `gorm:"many2many:user_type_roles;" json:"userTypes"`

	Appointments []Appointment `json:"appointments"`

	Active bool `json:"active"`

	SignatureID *int  `json:"signatureId"`
	Signature   *File `json:"signature"`

	ProfilePicID *int  `json:"profilePicId"`
	ProfilePic   *File `json:"profilePic"`

	// Confirm
	ConfirmSelector string
	ConfirmVerifier string
	Confirmed       bool

	// Lock
	AttemptCount int
	LastAttempt  *time.Time
	Locked       *time.Time

	// Recover
	RecoverSelector    string
	RecoverVerifier    string
	RecoverTokenExpiry *time.Time

	// OAuth2
	OAuth2UID          string
	OAuth2Provider     string
	OAuth2AccessToken  string
	OAuth2RefreshToken string
	OAuth2Expiry       *time.Time

	// 2fa
	TOTPSecretKey      string
	SMSPhoneNumber     string
	SMSSeedPhoneNumber string
	RecoveryCodes      string

	Document string `gorm:"type:tsvector"`
	Count    int64  `json:"count"`
}

// HashPassword encrypts user password
func (r *User) HashPassword() error {
	bytes, err := bcrypt.GenerateFromPassword([]byte(r.Password), 14)
	if err != nil {
		return err
	}

	r.Password = string(bytes)
	return nil
}

// HashPassword encrypts user password
func (r *User) CheckPasswordEquality(password1 string, password2 string) bool {
	bytes1, err := bcrypt.GenerateFromPassword([]byte(password1), 14)
	if err != nil {
		return false
	}

	bytes2, err := bcrypt.GenerateFromPassword([]byte(password2), 14)
	if err != nil {
		return false
	}

	return string(bytes1) == string(bytes2)
}

// CheckPassword checks user password
func (r *User) CheckPassword(password1 string, password2 string) error {
	err := bcrypt.CompareHashAndPassword([]byte(password1), []byte(password2))
	if err != nil {
		return err
	}

	return nil
}
