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
	"database/sql/driver"

	"gorm.io/gorm"
)

// PaymentStatus ...
type PaymentStatus string

// Payment statuses ...
const (
	PaidPaymentStatus            PaymentStatus = "PAID"
	NotPaidPaymentStatus         PaymentStatus = "NOTPAID"
	WaiverRequestedPaymentStatus PaymentStatus = "PAYMENT_WAIVER_REQUESTED"
)

// Scan ...
func (p *PaymentStatus) Scan(value interface{}) error {
	*p = PaymentStatus(value.(string))
	return nil
}

// Value ...
func (p PaymentStatus) Value() (driver.Value, error) {
	return string(p), nil
}

// Payment ...
type Payment struct {
	gorm.Model
	ID        int           `gorm:"primaryKey"`
	InvoiceNo string        `json:"invoiceNo"`
	Status    PaymentStatus `json:"status" sql:"payment_status"`
	BillingID int           `json:"billingId"`
	Billing   Billing       `json:"billing"`
}
