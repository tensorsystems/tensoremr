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

package service

import (
	"gorm.io/gorm"
)

type ParseMessages struct {
	DB *gorm.DB
}

func ProvideParseMessagesService(DB *gorm.DB) ParseMessages {
	return ParseMessages{DB: DB}
}

func (s *ParseMessages) ParseDiagnosticWorklist(redisMessage map[string]interface{}) (*ImageryWorklistMessage, error) {
	// diagnosticProcedureId := int(redisMessage["diagnosticProcedureId"].(float64))

	// var diagnosticProcedure models.DiagnosticProcedure
	// if err := s.DB.Where("id = ?", diagnosticProcedureId).Take(&diagnosticProcedure).Error; err != nil {
	// 	return nil, err
	// }

	// var diagnosticProcedureOrder models.DiagnosticProcedureOrder
	// if err := s.DB.Where("id = ?", diagnosticProcedure.DiagnosticProcedureOrderID).Take(&diagnosticProcedureOrder).Error; err != nil {
	// 	return nil, err
	// }

	// var patientChart models.PatientChart
	// if err := s.DB.Where("id = ?", diagnosticProcedure.PatientChartID).Take(&patientChart).Error; err != nil {
	// 	return nil, err
	// }

	// var appointment models.Appointment
	// if err := s.DB.Where("id = ?", patientChart.AppointmentID).Take(&appointment).Error; err != nil {
	// 	return nil, err
	// }

	// var patient models.Patient
	// if err := s.DB.Where("id = ?", diagnosticProcedureOrder.PatientID).Take(&patient).Error; err != nil {
	// 	return nil, err
	// }

	// var physician models.User
	// if err := s.DB.Where("id = ?", appointment.UserID).Take(&physician).Error; err != nil {
	// 	return nil, err
	// }

	// sendingFacility := ""
	// sTmp := redisMessage["sendingFacility"].(string)
	// if len(sTmp) > 0 {
	// 	sendingFacility = strings.ToUpper(strings.ReplaceAll(sTmp, " ", ""))
	// } else {
	// 	sendingFacility = "TENSOREMRFACILITY"
	// }

	// patientSex := ""
	// if patient.Gender == "Male" {
	// 	patientSex = "M"
	// } else if patient.Gender == "Female" {
	// 	patientSex = "F"
	// } else {
	// 	patientSex = "U"
	// }

	// mwl := ImageryWorklistMessage{
	// 	StudyInstanceUId:             redisMessage["studyInstanceUId"].(string),
	// 	AppointmentID:                strconv.Itoa(appointment.ID),
	// 	Modality:                     redisMessage["modality"].(string),
	// 	PatientDateOfBirth:           util.FormatHl7Date(patient.DateOfBirth),
	// 	RequestedProcedureId:         strconv.Itoa(diagnosticProcedure.ID),
	// 	SendingFacility:              sendingFacility,
	// 	TimeOfMessage:                util.FormatHl7Date(time.Now()),
	// 	PatientID:                    strconv.Itoa(patient.ID),
	// 	PatientSex:                   patientSex,
	// 	PatientPhoneNo:               patient.PhoneNo,
	// 	PatientFirstName:             patient.FirstName,
	// 	PatientLastName:              patient.LastName,
	// 	PhysicianID:                  strconv.Itoa(physician.ID),
	// 	PhysicianFirstName:           physician.FirstName,
	// 	PhysicianLastName:            physician.LastName,
	// 	DiagnosticProcedureID:        strconv.Itoa(diagnosticProcedure.ID),
	// 	DiagnosticProcedureTypeID:    strconv.Itoa(diagnosticProcedure.DiagnosticProcedureTypeID),
	// 	DiagnosticProcedureTypeTitle: diagnosticProcedure.DiagnosticProcedureTypeTitle,
	// }

	return nil, nil
}
