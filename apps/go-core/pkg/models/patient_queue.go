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
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// QueueType ...
type QueueType string

// Queue Types ...
const (
	UserQueue       QueueType = "USER"
	DiagnosticQueue QueueType = "DIAGNOSTIC"
	LabQueue        QueueType = "LAB"
	TreatmentQueue  QueueType = "TREATMENT"
	SurgicalQueue   QueueType = "SURGICAL"
	PreExamQueue    QueueType = "PREEXAM"
	PreOperation    QueueType = "PREOPERATION"
)

// PatientQueue ...
type PatientQueue struct {
	gorm.Model
	ID        int            `gorm:"primaryKey" json:"id"`
	QueueName string         `json:"queueName" gorm:"uniqueIndex"`
	Queue     datatypes.JSON `json:"queue"`
	QueueType QueueType      `json:"queueType"`
}
