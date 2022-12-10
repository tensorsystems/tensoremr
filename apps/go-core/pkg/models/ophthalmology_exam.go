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

// OpthalmologyExam ...
type OpthalmologyExam struct {
	gorm.Model
	ID             int `gorm:"primaryKey"`
	PatientChartID int `json:"patientChartId" gorm:"uniqueIndex"`

	// External Exam
	RightOrbits         *string `json:"rightOrbits"`
	LeftOrbits          *string `json:"leftOrbits"`
	RightLids           *string `json:"rightLids"`
	LeftLids            *string `json:"leftLids"`
	RightLacrimalSystem *string `json:"rightLacrimalSystem"`
	LeftLacrimalSystem  *string `json:"leftLacrimalSystem"`
	ExternalExamNote    *string `json:"externalExamNote"`

	// Ocular Motility
	RightOcularMotility *string `json:"rightOcularMotility"`
	LeftOcularMotility  *string `json:"leftOcularMotility"`
	Rsr                 *string `json:"rsr"`
	Rio                 *string `json:"rio"`
	Rlr                 *string `json:"rlr"`
	Rmr                 *string `json:"rmr"`
	Rir                 *string `json:"rir"`
	Rso                 *string `json:"rso"`
	RightFlick          *bool   `json:"rightFlick" gorm:"default:false"`
	Lsr                 *string `json:"lsr"`
	Lio                 *string `json:"lio"`
	Llr                 *string `json:"llr"`
	Lrl                 *string `json:"lrl"`
	Lmr                 *string `json:"lmr"`
	Lir                 *string `json:"lir"`
	Lso                 *string `json:"lso"`
	LeftFlick           *bool   `json:"leftFlick" gorm:"default:false"`
	Distance            *string `json:"distance"`
	Near                *string `json:"near"`
	OcularMotilityNote  *string `json:"ocularMotility"`

	// Cover Test
	RightCoverTest *string `json:"rightCoverTest"`
	LeftCoverTest  *string `json:"leftCoverTest"`
	CoverTestNote  *string `json:"coverTestNote"`

	// Funduscopy
	RightRetina       *string `json:"rightRetina"`
	LeftRetina        *string `json:"leftRetina"`
	LeftRetinaSketch  *string `json:"leftRetinaSketch"`
	RightRetinaSketch *string `json:"rightRetinaSketch"`
	FunduscopyNote    *string `json:"funduscopyNote"`

	// Optic Disc
	RightOpticDisc       *string `json:"rightOpticDisc"`
	LeftOpticDisc        *string `json:"leftOpticDisc"`
	RightOpticDiscSketch *string `json:"rightOpticDiscSketch"`
	LeftOpticDiscSketch  *string `json:"leftOpticDiscSketch"`
	RightCdr             *string `json:"rightCdr"`
	LeftCdr              *string `json:"leftCdr"`
	OpticDiscNote        *string `json:"opticDiscNote"`

	// Pupils
	RightPupils *string `json:"rightPupils"`
	LeftPupils  *string `json:"leftPupils"`
	PupilsNote  *string `json:"pupilsNote"`

	// Slit Lamp Exam
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
	SlitLampExamNote     *string `json:"slitLampExamNote"`
}
