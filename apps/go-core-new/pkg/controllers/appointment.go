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

package controllers

import (
	"net/http"
	"time"

	"github.com/labstack/echo/v5"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/models"
	"github.com/tensorsystems/tensoremr/apps/go-core-new/pkg/repository"
)

type AppointmentPayload struct {
	CheckInTime            string `json:"checkInTime"`
	Emergency              bool   `json:"emergency"`
	Department             string `json:"department"`
	PatientID              string `json:"patientId"`
	PatientName            string `json:"patientName"`
	ProviderID             string `json:"providerId"`
	ProviderName           string `json:"providerName"`
	RoomID                 string `json:"roomId"`
	RoomName               string `json:"roomName"`
	AppointmentStatusID    string `json:"appointmentStatusId"`
	AppointmentStatusTitle string `json:"appointmentStatusTitle"`
	VisitTypeID            string `json:"visitTypeId"`
	VisitTypeTitle         string `json:"visitTypeTitle"`
	QueueID                string `json:"queueId"`
	QueueName              string `json:"queueName"`
}

func CreateAppointment(c echo.Context) error {
	payload := new(AppointmentPayload)
	if err := c.Bind(payload); err != nil {
		return err
	}

	checkInTime, err := time.Parse("2006-01-02T15:04:05-0700", payload.CheckInTime)
	if err != nil {
		return err
	}

	var appointment models.Appointment
	appointment.CheckInTime = checkInTime
	appointment.Emergency = payload.Emergency
	appointment.Department = payload.Department
	appointment.PatientID = payload.PatientID
	appointment.PatientName = payload.PatientName
	appointment.ProviderID = payload.ProviderID
	appointment.ProviderName = payload.ProviderName
	appointment.RoomID = payload.RoomID
	appointment.RoomName = payload.RoomName
	appointment.AppointmentStatusID = payload.AppointmentStatusID
	appointment.AppointmentStatusTitle = payload.AppointmentStatusTitle
	appointment.VisitTypeID = payload.VisitTypeID
	appointment.VisitTypeTitle = payload.VisitTypeTitle
	appointment.QueueID = payload.QueueID
	appointment.QueueName = payload.QueueName

	repository := repository.AppointmentRepository{}
	if err := repository.SaveAppointment(appointment); err != nil {
		return err
	}

	return c.String(http.StatusOK, "Hello")
}
