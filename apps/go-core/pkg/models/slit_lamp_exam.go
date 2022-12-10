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

import "gorm.io/gorm"

// SlitLampExam ...
type SlitLampExam struct {
	gorm.Model
	ID                   int     `gorm:"primaryKey"`
	RightConjunctiva     *string `json:"rightConjunctiva"`
	LeftConjunctiva      *string `json:"leftConjunctiva"`
	RightCornea          *string `json:"rightCornea"`
	LeftCornea           *string `json:"leftCornea"`
	RightCorneaSketch    *string `json:"rightCorneaSketch"`
	LeftCorneaSketch     *string `json:"leftCorneaSketch"`
	LeftSclera           *string `json:"leftSclera"`
	RightSclera          *string `json:"rightSclera"`
	RightAnteriorChamber *string `json:"rightAnteriorChamber"`
	LeftAnteriorChamber  *string `json:"leftAnteriorChamber"`
	RightIris            *string `json:"rightIris"`
	LeftIris             *string `json:"leftIris"`
	RightLens            *string `json:"rightLens"`
	LeftLens             *string `json:"leftLens"`
	RightLensSketch      *string `json:"rightLensSketch"`
	LeftLensSketch       *string `json:"leftLensSketch"`
	RightVitreos         *string `json:"rightVitreos"`
	LeftVitreos          *string `json:"leftVitreos"`
	Note                 *string `json:"note"`
	PatientChartID       int     `json:"patientChartId"`
}
