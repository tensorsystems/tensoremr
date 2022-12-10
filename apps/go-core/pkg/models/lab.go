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

// LabStatus ...
type LabStatus string

// LabStatus statuses ...
const (
	LabOrderedStatus   LabStatus = "ORDERED"
	LabCompletedStatus LabStatus = "COMPLETED"
)

// Lab ...
type Lab struct {
	gorm.Model
	ID             int `gorm:"primaryKey"`
	LabOrderID     int `json:"labOrderId"`
	PatientChartID int `json:"patinetChartId"`

	// Hematology (CBC)
	CbcWbcActive         *bool      `json:"cbcWbcActive"`
	CbcWbcResults        *string    `json:"cbcWbcResults"`
	CbcWbcDate           *time.Time `json:"cbcWbcDate"`
	CbcHgbActive         *bool      `json:"cbcHgbActive"`
	CbcHgbResults        *string    `json:"cbcHgbResults"`
	CbcHgbDate           *time.Time `json:"cbcHgbDate"`
	CbcHctActive         *bool      `json:"cbcHctActive"`
	CbcHctResults        *string    `json:"cbcHctResults"`
	CbcHctDate           *time.Time `json:"cbcHctDate"`
	CbcEsrActive         *bool      `json:"cbcEsrActive"`
	CbcEsrResults        *string    `json:"cbcEsrResults"`
	CbcEsrDate           *time.Time `json:"cbcEsrDate"`
	CbcBloodGroupActive  *bool      `json:"cbcBloodGroupActive"`
	CbcBloodGroupResults *string    `json:"cbcBloodGroupResults"`
	CbcBloodGroupDate    *time.Time `json:"cbcBloodGroupDate"`
	CbcRhActive          *bool      `json:"cbcRhActive"`
	CbcRhResults         *string    `json:"cbcRhResults"`
	CbcRhDate            *time.Time `json:"cbcRhDate"`
	CbcBloodFilmActive   *bool      `json:"cbcBloodFilmActive"`
	CbcBloodFilmResults  *string    `json:"cbcBloodFilmResults"`
	CbcBloodFilmDate     *time.Time `json:"cbcBloodFilmDate"`
	CbcPltActive         *bool      `json:"cbcPltActive"`
	CbcPltResults        *string    `json:"cbcPltResults"`
	CbcPltDate           *time.Time `json:"cbcPltDate"`

	// Liver Function Test
	LiverCoagulationPtActive   *bool      `json:"liverCoagulationPtActive"`
	LiverCoagulationPtResults  *string    `json:"liverCoagulationPtResults"`
	LiverCoagulationPtDate     *time.Time `json:"liverCoagulationPtDate"`
	LiverCoagulationPttActive  *bool      `json:"liverCoagulationPttActive"`
	LiverCoagulationPttResults *string    `json:"liverCoagulationPttResults"`
	LiverCoagulationPttDate    *time.Time `json:"liverCoagulationPttDate"`
	LiverCoagulationInrActive  *bool      `json:"liverCoagulationInrActive"`
	LiverCoagulationInrResults *string    `json:"liverCoagulationInrResults"`
	LiverCoagulationInrDate    *time.Time `json:"liverCoagulationInrDate"`
	LiverAstsgotActive         *bool      `json:"liverAstsgotActive"`
	LiverAstsgotResults        *string    `json:"liverAstsgotResults"`
	LiverAstsgotDate           *time.Time `json:"liverAstsgotDate"`
	LiverAltsgptActive         *bool      `json:"liverAltsgptActive"`
	LiverAltsgptResults        *string    `json:"liverAltsgptResults"`
	LiverAltsgptDate           *time.Time `json:"liverAltsgptDate"`
	LiverAlpActive             *bool      `json:"liverAlpActive"`
	LiverAlpResults            *string    `json:"liverAlpResults"`
	LiverAlpDate               *time.Time `json:"liverAlpDate"`

	// Renal Function Test
	RenalCrActive   *bool      `json:"renalCrActive"`
	RenalCrResults  *string    `json:"renalCrResults"`
	RenalCrDate     *time.Time `json:"renalCrDate"`
	RenalBunActive  *bool      `json:"renalBunActive"`
	RenalBunResults *string    `json:"renalBunResults"`
	RenalBunDate    *time.Time `json:"renalBunDate"`

	// Thyroid Function Test
	ThyroidFreeT3Active   *bool      `json:"thyroidFreeT3Active"`
	ThyroidFreeT3Results  *string    `json:"thyroidFreeT3Results"`
	ThyroidFreeT3Date     *time.Time `json:"thyroidFreeT3Date"`
	ThyroidTotalT4Active  *bool      `json:"thyroidTotalT4Active"`
	ThyroidTotalT4Results *string    `json:"thyroidTotalT4Results"`
	ThyroidTotalT4Date    *time.Time `json:"thyroidTotalT4Date"`
	ThyroidTshActive      *bool      `json:"thyroidTshActive"`
	ThyroidTshResults     *string    `json:"thyroidTshResults"`
	ThyroidTshDate        *time.Time `json:"thyroidTshDate"`

	// Electrolytes
	ElectrolytesNaPlusActive   *bool      `json:"electrolytesNaPlusActive"`
	ElectrolytesNaPlusResults  *string    `json:"electrolytesNaPlusResults"`
	ElectrolytesNaPlusDate     *time.Time `json:"electrolytesNaPlusDate"`
	ElectrolytesKPlusActive    *bool      `json:"electrolytesKPlusActive"`
	ElectrolytesKPlusResults   *string    `json:"electrolytesKPlusResults"`
	ElectrolytesKPlusDate      *time.Time `json:"electrolytesKPlusDate"`
	ElectrolytesClMinusActive  *bool      `json:"electrolytesClMinusActive"`
	ElectrolytesClMinusResults *string    `json:"electrolytesClMinusResults"`
	ElectrolytesClMinusDate    *time.Time `json:"electrolytesClMinusDate"`
	ElectrolytesCa2PlusActive  *bool      `json:"electrolytesCa2PlusActive"`
	ElectrolytesCa2PlusResults *string    `json:"electrolytesCa2PlusResults"`
	ElectrolytesCa2PlusDate    *time.Time `json:"electrolytesCa2PlusDate"`
	ElectrolytesMg2PlusActive  *bool      `json:"electrolytesMg2PlusActive"`
	ElectrolytesMg2PlusResults *string    `json:"electrolytesMg2PlusResults"`
	ElectrolytesMg2PlusDate    *time.Time `json:"electrolytesMg2PlusDate"`
	ElectrolytesPMinusActive   *bool      `json:"electrolytesPMinusActive"`
	ElectrolytesPMinusResults  *string    `json:"electrolytesPMinusResults"`
	ElectrolytesPMinusDate     *time.Time `json:"electrolytesPMinusDate"`

	// Stool Examination
	StoolConsistencyActive    *bool      `json:"stoolConsistencyActive"`
	StoolConsistencyResults   *string    `json:"stoolConsistencyResults"`
	StoolConsistencyDate      *time.Time `json:"stoolConsistencyDate"`
	StoolOpActive             *bool      `json:"stoolOpActive"`
	StoolOpResults            *string    `json:"stoolOpResults"`
	StoolOpDate               *time.Time `json:"stoolOpDate"`
	StoolConcentrationActive  *bool      `json:"stoolConcentrationActive"`
	StoolConcentrationResults *string    `json:"stoolConcentrationResults"`
	StoolConcentrationDate    *time.Time `json:"stoolConcentrationDate"`
	StoolOccultBloodActive    *bool      `json:"stoolOccultBloodActive"`
	StoolOccultBloodResults   *string    `json:"stoolOccultBloodResults"`
	StoolOccultBloodDate      *time.Time `json:"stoolOccultBloodDate"`

	// Microscopy
	MicroscopyEpitCellsActive  *bool      `json:"microscopyEpitCellsActive"`
	MicroscopyEpitCellsResults *string    `json:"microscopyEpitCellsResults"`
	MicroscopyEpitCellsDate    *time.Time `json:"microscopyEpitCellsDate"`
	MicroscopyWbcActive        *bool      `json:"microscopyWbcActive"`
	MicroscopyWbcResults       *string    `json:"microscopyWbcResults"`
	MicroscopyWbcDate          *time.Time `json:"microscopyWbcDate"`
	MicroscopyRbcActive        *bool      `json:"microscopyRbcActive"`
	MicroscopyRbcResults       *string    `json:"microscopyRbcResults"`
	MicroscopyRbcDate          *time.Time `json:"microscopyRbcDate"`
	MicroscopyCastsActive      *bool      `json:"microscopyCastsActive"`
	MicroscopyCastsResults     *string    `json:"microscopyCastsResults"`
	MicroscopyCastsDate        *time.Time `json:"microscopyCastsDate"`
	MicroscopyCrystalsActive   *bool      `json:"microscopyCrystalsActive"`
	MicroscopyCrystalsResults  *string    `json:"microscopyCrystalsResults"`
	MicroscopyCrystalsDate     *time.Time `json:"microscopyCrystalsDate"`
	MicroscopyBacteriaActive   *bool      `json:"microscopyBacteriaActive"`
	MicroscopyBacteriaResults  *string    `json:"microscopyBacteriaResults"`
	MicroscopyBacteriaDate     *time.Time `json:"microscopyBacteriaDate"`
	MicroscopyHcgActive        *bool      `json:"microscopyHcgActive"`
	MicroscopyHcgResults       *string    `json:"microscopyHcgResults"`
	MicroscopyHcgDate          *time.Time `json:"microscopyHcgDate"`

	// Urinalysis
	UrinalysisColorActive        *bool      `json:"urinalysisColorActive"`
	UrinalysisColorResults       *string    `json:"urinalysisColorResults"`
	UrinalysisColorDate          *time.Time `json:"urinalysisColorDate"`
	UrinalysisAppearanceActive   *bool      `json:"urinalysisAppearanceActive"`
	UrinalysisAppearanceResults  *string    `json:"urinalysisAppearanceResults"`
	UrinalysisAppearanceDate     *time.Time `json:"urinalysisAppearanceDate"`
	UrinalysisPhActive           *bool      `json:"urinalysisPhActive"`
	UrinalysisPhResults          *string    `json:"urinalysisPhResults"`
	UrinalysisPhDate             *time.Time `json:"urinalysisPhDate"`
	UrinalysisSgActive           *bool      `json:"urinalysisSgActive"`
	UrinalysisSgResults          *string    `json:"urinalysisSgResults"`
	UrinalysisSgDate             *time.Time `json:"urinalysisSgDate"`
	UrinalysisProteinActive      *bool      `json:"urinalysisProteinActive"`
	UrinalysisProteinResults     *string    `json:"urinalysisProteinResults"`
	UrinalysisProteinDate        *time.Time `json:"urinalysisProteinDate"`
	UrinalysisGlucoseActive      *bool      `json:"urinalysisGlucoseActive"`
	UrinalysisGlucoseResults     *string    `json:"urinalysisGlucoseResults"`
	UrinalysisGlucoseDate        *time.Time `json:"urinalysisGlucoseDate"`
	UrinalysisLeukocyteActive    *bool      `json:"urinalysisLeukocyteActive"`
	UrinalysisLeukocyteResults   *string    `json:"urinalysisLeukocyteResults"`
	UrinalysisLeukocyteDate      *time.Time `json:"urinalysisLeukocyteDate"`
	UrinalysisKetoneActive       *bool      `json:"urinalysisKetoneActive"`
	UrinalysisKetoneResults      *string    `json:"urinalysisKetoneResults"`
	UrinalysisKetoneDate         *time.Time `json:"urinalysisKetoneDate"`
	UrinalysisBilirubinActive    *bool      `json:"urinalysisBilirubinActive"`
	UrinalysisBilirubinResults   *string    `json:"urinalysisBilirubinResults"`
	UrinalysisBilirubinDate      *time.Time `json:"urinalysisBilirubinDate"`
	UrinalysisUrobilingenActive  *bool      `json:"urinalysisUrobilingenActive"`
	UrinalysisUrobilingenResults *string    `json:"urinalysisUrobilingenResults"`
	UrinalysisUrobilingenDate    *time.Time `json:"urinalysisUrobilingenDate"`
	UrinalysisBloodActive        *bool      `json:"urinalysisBloodActive"`
	UrinalysisBloodResults       *string    `json:"urinalysisBloodResults"`
	UrinalysisBloodDate          *time.Time `json:"urinalysisBloodDate"`

	// Serology
	SerologyVdrlActive        *bool      `json:"serologyVdrlActive"`
	SerologyVdrlResults       *string    `json:"serologyVdrlResults"`
	SerologyVdrlDate          *time.Time `json:"serologyVdrlDate"`
	SerologyWidalHActive      *bool      `json:"serologyWidalHActive"`
	SerologyWidalHResults     *string    `json:"serologyWidalHResults"`
	SerologyWidalHDate        *time.Time `json:"serologyWidalHDate"`
	SerologyWidalOActive      *bool      `json:"serologyWidalOActive"`
	SerologyWidalOResults     *string    `json:"serologyWidalOResults"`
	SerologyWidalODate        *time.Time `json:"serologyWidalODate"`
	SerologyWeilFelixActive   *bool      `json:"serologyWeilFelixActive"`
	SerologyWeilFelixResults  *string    `json:"serologyWeilFelixResults"`
	SerologyWeilFelixDate     *time.Time `json:"serologyWeilFelixDate"`
	SerologyHbsAgActive       *bool      `json:"serologyHbsAgActive"`
	SerologyHbsAgResults      *string    `json:"serologyHbsAgResults"`
	SerologyHbsAgDate         *time.Time `json:"serologyHbsAgDate"`
	SerologyHcvAbActive       *bool      `json:"serologyHcvAbActive"`
	SerologyHcvAbResults      *string    `json:"serologyHcvAbResults"`
	SerologyHcvAbDate         *time.Time `json:"serologyHcvAbDate"`
	SerologyAsoActive         *bool      `json:"serologyAsoActive"`
	SerologyAsoResults        *string    `json:"serologyAsoResults"`
	SerologyAsoDate           *time.Time `json:"serologyAsoDate"`
	SerologyRfActive          *bool      `json:"serologyRfActive"`
	SerologyRfResults         *string    `json:"serologyRfResults"`
	SerologyRfDate            *time.Time `json:"serologyRfDate"`
	SerologyHpayloryAgActive  *bool      `json:"serologyHpayloryAgActive"`
	SerologyHpayloryAgResults *string    `json:"serologyHpayloryAgResults"`
	SerologyHpayloryAgDate    *time.Time `json:"serologyHpayloryAgDate"`
	SerologyHpyloryAbActive   *bool      `json:"serologyHpyloryAbActive"`
	SerologyHpyloryAbResults  *string    `json:"serologyHpyloryAbResults"`
	SerologyHpyloryAbDate     *time.Time `json:"serologyHpyloryAbDate"`

	// Bacterology
	BacterologySampleActive     *bool      `json:"bacterologySampleActive"`
	BacterologySampleResults    *string    `json:"bacterologySampleResults"`
	BacterologySampleDate       *time.Time `json:"bacterologySampleDate"`
	BacterologyKohActive        *bool      `json:"bacterologyKohActive"`
	BacterologyKohResults       *string    `json:"bacterologyKohResults"`
	BacterologyKohDate          *time.Time `json:"bacterologyKohDate"`
	BacterologyGramStainActive  *bool      `json:"bacterologyGramStainActive"`
	BacterologyGramStainResults *string    `json:"bacterologyGramStainResults"`
	BacterologyGramStainDate    *time.Time `json:"bacterologyGramStainDate"`
	BacterologyWetFilmActive    *bool      `json:"bacterologyWetFilmActive"`
	BacterologyWetFilmResults   *string    `json:"bacterologyWetFilmResults"`
	BacterologyWetFilmDate      *time.Time `json:"bacterologyWetFilmDate"`
	BacterologyAfb1Active       *bool      `json:"bacterologyAfb1Active"`
	BacterologyAfb1Results      *string    `json:"bacterologyAfb1Results"`
	BacterologyAfb1Date         *time.Time `json:"bacterologyAfb1Date"`
	BacterologyAfb2Active       *bool      `json:"bacterologyAfb2Active"`
	BacterologyAfb2Results      *string    `json:"bacterologyAfb2Results"`
	BacterologyAfb2Date         *time.Time `json:"bacterologyAfb2Date"`
	BacterologyAfb3Active       *bool      `json:"bacterologyAfb3Active"`
	BacterologyAfb3Results      *string    `json:"bacterologyAfb3Results"`
	BacterologyAfb3Date         *time.Time `json:"bacterologyAfb3Date"`
	BacterologyCultureActive    *bool      `json:"bacterologyCultureActive"`
	BacterologyCultureResults   *string    `json:"bacterologyCultureResults"`
	BacterologyCultureDate      *time.Time `json:"bacterologyCultureDate"`

	// Chemistry
	ChemistryFbsRbsActive              *bool      `json:"chemistryFbsRbsActive"`
	ChemistryFbsRbsResults             *string    `json:"chemistryFbsRbsResults"`
	ChemistryFbsRbsDate                *time.Time `json:"chemistryFbsRbsDate"`
	ChemistrySgotActive                *bool      `json:"chemistrySgotActive"`
	ChemistrySgotResults               *string    `json:"chemistrySgotResults"`
	ChemistrySgotDate                  *time.Time `json:"chemistrySgotDate"`
	ChemistrySgptActive                *bool      `json:"chemistrySgptActive"`
	ChemistrySgptResults               *string    `json:"chemistrySgptResults"`
	ChemistrySgptDate                  *time.Time `json:"chemistrySgptDate"`
	ChemistryAlkalinePhosphatesActive  *bool      `json:"chemistryAlkalinePhosphatesActive"`
	ChemistryAlkalinePhosphatesResults *string    `json:"chemistryAlkalinePhosphatesResults"`
	ChemistryAlkalinePhosphatesDate    *time.Time `json:"chemistryAlkalinePhosphatesDate"`
	ChemistryBilirubinTotalActive      *bool      `json:"chemistryBilirubinTotalActive"`
	ChemistryBilirubinTotalResults     *string    `json:"chemistryBilirubinTotalResults"`
	ChemistryBilirubinTotalDate        *time.Time `json:"chemistryBilirubinTotalDate"`
	ChemistryBilirubinDirectActive     *bool      `json:"chemistryBilirubinDirectActive"`
	ChemistryBilirubinDirectResults    *string    `json:"chemistryBilirubinDirectResults"`
	ChemistryBilirubinDirectDate       *time.Time `json:"chemistryBilirubinDirectDate"`
	ChemistryUreaActive                *bool      `json:"chemistryUreaActive"`
	ChemistryUreaResults               *string    `json:"chemistryUreaResults"`
	ChemistryUreaDate                  *time.Time `json:"chemistryUreaDate"`
	ChemistryBunActive                 *bool      `json:"chemistryBunActive"`
	ChemistryBunResults                *string    `json:"chemistryBunResults"`
	ChemistryBunDate                   *time.Time `json:"chemistryBunDate"`
	ChemistryCreatnineActive           *bool      `json:"chemistryCreatnineActive"`
	ChemistryCreatnineResults          *string    `json:"chemistryCreatnineResults"`
	ChemistryCreatnineDate             *time.Time `json:"chemistryCreatnineDate"`
	ChemistryUricAcidActive            *bool      `json:"chemistryUricAcidActive"`
	ChemistryUricAcidResults           *string    `json:"chemistryUricAcidResults"`
	ChemistryUricAcidDate              *time.Time `json:"chemistryUricAcidDate"`
	ChemistryTotalProteinActive        *bool      `json:"chemistryTotalProteinActive"`
	ChemistryTotalProteinResults       *string    `json:"chemistryTotalProteinResults"`
	ChemistryTotalProteinDate          *time.Time `json:"chemistryTotalProteinDate"`
	ChemistryTriglyceridesActive       *bool      `json:"chemistryTriglyceridesActive"`
	ChemistryTriglyceridesResults      *string    `json:"chemistryTriglyceridesResults"`
	ChemistryTriglyceridesDate         *time.Time `json:"chemistryTriglyceridesDate"`
	ChemistryCholestrolActive          *bool      `json:"chemistryCholestrolActive"`
	ChemistryCholestrolResults         *string    `json:"chemistryCholestrolResults"`
	ChemistryCholestrolDate            *time.Time `json:"chemistryCholestrolDate"`
	ChemistryHdlActive                 *bool      `json:"chemistryHdlActive"`
	ChemistryHdlResults                *string    `json:"chemistryHdlResults"`
	ChemistryHdlDate                   *time.Time `json:"chemistryHdlDate"`
	ChemistryLdlActive                 *bool      `json:"chemistryLdlActive"`
	ChemistryLdlResults                *string    `json:"chemistryLdlResults"`
	ChemistryLdlDate                   *time.Time `json:"chemistryLdlDate"`

	RightEyeText     *string   `json:"rightEyeText"`
	LeftEyeText      *string   `json:"leftEyeText"`
	GeneralText      *string   `json:"generalText"`
	RightEyeImages   []File    `json:"rightEyeImages" gorm:"many2many:lab_right_eye_images" `
	LeftEyeImages    []File    `json:"leftEyeImages" gorm:"many2many:lab_left_eye_images"`
	RightEyeSketches []File    `json:"rightEyeSketches" gorm:"many2many:lab_right_eye_sketches"`
	LeftEyeSketches  []File    `json:"leftEyeSketches" gorm:"many2many:lab_left_eye_sketches"`
	Images           []File    `json:"images" gorm:"many2many:lab_images"`
	Documents        []File    `json:"documents" gorm:"many2many:lab_documents"`
	LabTypeID        int       `json:"labTypeId"`
	LabType          LabType   `json:"labType"`
	LabTypeTitle     string    `json:"labTypeTitle"`
	Payments         []Payment `json:"payments" gorm:"many2many:lab_payments;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	OrderNote        string    `json:"orderNote"`
	ReceptionNote    string    `json:"receptionNote"`
	Status           LabStatus `json:"status"`
	Count            int64     `json:"count"`
}
