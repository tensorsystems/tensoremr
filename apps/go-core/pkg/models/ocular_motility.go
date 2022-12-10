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

// OcularMotility ...
type OcularMotility struct {
	gorm.Model
	ID                  int     `gorm:"primaryKey"`
	RightOcularMotility *string `json:"rightOcularMotility"`
	LeftOcularMotility  *string `json:"leftOcularMotility"`
	Rsr                 *string `json:"rsr"`
	Rio                 *string `json:"rio"`
	Rlr                 *string `json:"rlr"`
	Rmr                 *string `json:"rmr"`
	Rir                 *string `json:"rir"`
	Rso                 *string `json:"rso"`
	RightFlick          *bool   `json:"rightFlick"`
	Lsr                 *string `json:"lsr"`
	Lio                 *string `json:"lio"`
	Llr                 *string `json:"llr"`
	Lrl                 *string `json:"lrl"`
	Lmr                 *string `json:"lmr"`
	Lir                 *string `json:"lir"`
	Lso                 *string `json:"lso"`
	LeftFlick           *bool   `json:"leftFlick"`
	Distance            *string `json:"distance"`
	Near                *string `json:"near"`
	Note                *string `json:"note"`
	PatientChartID      int     `json:"patientChartId"`
}
