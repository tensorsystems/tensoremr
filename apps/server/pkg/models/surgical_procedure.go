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

// SurgeryStatus ...
type SurgeryStatus string

// SurgicalProcedureOrder statuses ...
const (
	SurgeryStatusOrdered   SurgeryStatus = "ORDERED"
	SurgeryStatusCompleted SurgeryStatus = "COMPLETED"
)

// SurgicalProcedure ...
type SurgicalProcedure struct {
	gorm.Model
	ID              int `gorm:"primaryKey"`
	SurgicalOrderID int `json:"surgicalOrderId"`
	PatientChartID  int `json:"patientChartId"`

	// Preasnesthetic
	Respiratory                  *string    `json:"respiratory"`
	Cardiovascular               *string    `json:"cardiovascular"`
	Abdomen                      *string    `json:"abdomen"`
	Gus                          *string    `json:"gus"`
	Ismss                        *string    `json:"ismss"`
	Cns                          *string    `json:"cns"`
	PreanestheticAllergies       *bool      `json:"preanestheticAllergies"`
	PreanestheticAllergiesNote   *string    `json:"preanestheticAllergiesNote"`
	PhysicalBloodPressure        *string    `json:"physicalBloodPressure"`
	PhysicalPr                   *string    `json:"physicalPr"`
	PhysicalRr                   *string    `json:"physicalRr"`
	PhysicalSaO2                 *string    `json:"physicalSaO2"`
	PhysicalTemperature          *string    `json:"physicalTemperature"`
	PhysicalWeight               *string    `json:"physicalWeight"`
	PhysicalHeent                *string    `json:"physicalHeent"`
	PhysicalArtificalDenture     *bool      `json:"physicalArtificalDenture"`
	PhysicalArtificalDentureNote *string    `json:"physicalArtificalDentureNote"`
	PhysicalLgs                  *string    `json:"physicalLgs"`
	PhysicalChest                *string    `json:"physicalChest"`
	PhysicalCvs                  *string    `json:"physicalCvs"`
	PhysicalAbdomen              *string    `json:"physicalAbdomen"`
	PhysicalGus                  *string    `json:"physicalGus"`
	PhysicalIs                   *string    `json:"physicalIs"`
	PhysicalMss                  *string    `json:"physicalMss"`
	PhysicalCns                  *string    `json:"physicalCns"`
	WbcActive                    *bool      `json:"wbcActive"`
	WbcResults                   *string    `json:"wbcResults"`
	WbcDate                      *time.Time `json:"wbcDate"`
	HgbhctActive                 *bool      `json:"hgbhctActive"`
	HgbhctResults                *string    `json:"hgbhctResults"`
	HgbhctDate                   *time.Time `json:"hgbhctDate"`
	PltActive                    *bool      `json:"pltActive"`
	PltResults                   *string    `json:"pltResults"`
	PltDate                      *time.Time `json:"pltDate"`
	CoagulationPtActive          *bool      `json:"coagulationPtActive"`
	CoagulationPtResults         *string    `json:"coagulationPtResults"`
	CoagulationPtDate            *time.Time `json:"coagulationPtDate"`
	CoagulationPttActive         *bool      `json:"coagulationPttActive"`
	CoagulationPttResults        *string    `json:"coagulationPttResults"`
	CoagulationPttDate           *time.Time `json:"coagulationPttDate"`
	CoagulationInrActive         *bool      `json:"coagulationInrActive"`
	CoagulationInrResults        *string    `json:"coagulationInrResults"`
	CoagulationInrDate           *time.Time `json:"coagulationInrDate"`
	SerumAlbuminActive           *bool      `json:"serumAlbuminActive"`
	SerumAlbuminResults          *string    `json:"serumAlbuminResults"`
	SerumAlbuminDate             *time.Time `json:"serumAlbuminDate"`
	TotalProteinActive           *bool      `json:"totalProteinActive"`
	TotalProteinResults          *string    `json:"totalProteinResults"`
	TotalProteinDate             *time.Time `json:"totalProteinDate"`
	BilirubinTotalActive         *bool      `json:"bilirubinTotalActive"`
	BilirubinTotalResults        *string    `json:"bilirubinTotalResults"`
	BilirubinTotalDate           *time.Time `json:"bilirubinTotalDate"`
	BilirubinDirectActive        *bool      `json:"bilirubinDirectActive"`
	BilirubinDirectResults       *string    `json:"bilirubinDirectResults"`
	BilirubinDirectDate          *time.Time `json:"bilirubinDirectDate"`
	AstsgotActive                *bool      `json:"astsgotActive"`
	AstsgotResults               *string    `json:"astsgotResults"`
	AstsgotDate                  *time.Time `json:"astsgotDate"`
	AltsgptActive                *bool      `json:"altsgptActive"`
	AltsgptResults               *string    `json:"altsgptResults"`
	AltsgptDate                  *time.Time `json:"altsgptDate"`
	AlpActive                    *bool      `json:"alpActive"`
	AlpResults                   *string    `json:"alpResults"`
	AlpDate                      *time.Time `json:"alpDate"`
	RenalCrActive                *bool      `json:"renalCrActive"`
	RenalCrResults               *string    `json:"renalCrResults"`
	RenalCrDate                  *time.Time `json:"renalCrDate"`
	RenalBunActive               *bool      `json:"renalBunActive"`
	RenalBunResults              *string    `json:"renalBunResults"`
	RenalBunDate                 *time.Time `json:"renalBunDate"`
	ThyroidFreeT3Active          *bool      `json:"thyroidFreeT3Active"`
	ThyroidFreeT3Results         *string    `json:"thyroidFreeT3Results"`
	ThyroidFreeT3Date            *time.Time `json:"thyroidFreeT3Date"`
	ThyroidTotalT4Active         *bool      `json:"thyroidTotalT4Active"`
	ThyroidTotalT4Results        *string    `json:"thyroidTotalT4Results"`
	ThyroidTotalT4Date           *time.Time `json:"thyroidTotalT4Date"`
	ThyroidTshActive             *bool      `json:"thyroidTshActive"`
	ThyroidTshResults            *string    `json:"thyroidTshResults"`
	ThyroidTshDate               *time.Time `json:"thyroidTshDate"`
	ElectrolytesNaPlusActive     *bool      `json:"electrolytesNaPlusActive"`
	ElectrolytesNaPlusResults    *string    `json:"electrolytesNaPlusResults"`
	ElectrolytesNaPlusDate       *time.Time `json:"electrolytesNaPlusDate"`
	ElectrolytesKPlusActive      *bool      `json:"electrolytesKPlusActive"`
	ElectrolytesKPlusResults     *string    `json:"electrolytesKPlusResults"`
	ElectrolytesKPlusDate        *time.Time `json:"electrolytesKPlusDate"`
	ElectrolytesClMinusActive    *bool      `json:"electrolytesClMinusActive"`
	ElectrolytesClMinusResults   *string    `json:"electrolytesClMinusResults"`
	ElectrolytesClMinusDate      *time.Time `json:"electrolytesClMinusDate"`
	ElectrolytesCa2PlusActive    *bool      `json:"electrolytesCa2PlusActive"`
	ElectrolytesCa2PlusResults   *string    `json:"electrolytesCa2PlusResults"`
	ElectrolytesCa2PlusDate      *time.Time `json:"electrolytesCa2PlusDate"`
	ElectrolytesMg2PlusActive    *bool      `json:"electrolytesMg2PlusActive"`
	ElectrolytesMg2PlusResults   *string    `json:"electrolytesMg2PlusResults"`
	ElectrolytesMg2PlusDate      *time.Time `json:"electrolytesMg2PlusDate"`
	ElectrolytesPMinusActive     *bool      `json:"electrolytesPMinusActive"`
	ElectrolytesPMinusResults    *string    `json:"electrolytesPMinusResults"`
	ElectrolytesPMinusDate       *time.Time `json:"electrolytesPMinusDate"`
	Asa1                         *bool      `json:"asa1"`
	Asa2                         *bool      `json:"asa2"`
	Asa3                         *bool      `json:"asa3"`
	Asa4                         *bool      `json:"asa4"`
	Asa5                         *bool      `json:"asa5"`
	Opv1                         *bool      `json:"opv1"`
	Opv2                         *bool      `json:"opv2"`
	Opv3                         *bool      `json:"opv3"`
	Opv4                         *bool      `json:"opv4"`
	BleedingTendancy             *bool      `json:"bleedingTendancy"`
	BleedingTendancyNote         *string    `json:"bleedingTendancyNote"`
	Dm                           *bool      `json:"dm"`
	DmNote                       *string    `json:"dmNote"`
	Hypertension                 *bool      `json:"hypertension"`
	HypertensionNote             *string    `json:"hypertensionNote"`
	Cardiac                      *bool      `json:"cardiac"`
	CardiacNote                  *string    `json:"cardiacNote"`
	PreanestheticAsthma          *bool      `json:"preanestheticAsthma"`
	PreanestheticAsthmaNote      *string    `json:"preanestheticAsthmaNote"`
	Rvi                          *bool      `json:"rvi"`
	RviNote                      *string    `json:"rviNote"`
	Renal                        *bool      `json:"renal"`
	RenalNote                    *string    `json:"renalNote"`

	PreanestheticPerformedBy *int    `json:"preanestheticPerformedBy"`
	FitForSurgery            *bool   `json:"fitForSurgery"`
	FitForSurgeryNote        *string `json:"fitForSurgeryNote"`
	PreanestheticDocuments   []File  `json:"preanestheticDocuments" gorm:"many2many:surgical_procedure_preanesthetic_documents"`

	// Pre-operation
	RightCorrected        *string `json:"rightCorrected"`
	LeftCorrected         *string `json:"leftCorrected"`
	RightIop              *string `json:"rightIop"`
	LeftIop               *string `json:"leftIop"`
	RightAnteriorSegment  *string `json:"rightAnteriorSegment"`
	LeftAnteriorSegment   *string `json:"leftAnteriorSegment"`
	RightPosteriorSegment *string `json:"rightPosteriorSegment"`
	LeftPosteriorSegment  *string `json:"leftPosteriorSegment"`
	RightBiometry         *string `json:"rightBiometry"`
	LeftBiometry          *string `json:"leftBiometry"`
	Diabetes              *string `json:"diabetes"`
	Hpn                   *string `json:"hpn"`
	Asthma                *string `json:"asthma"`
	CardiacDisease        *string `json:"cardiacDisease"`
	Allergies             *string `json:"allergies"`
	BloodPressure         *string `json:"bloodPressure"`
	BloodSugar            *string `json:"bloodSugar"`
	URIAnalysis           *string `json:"uriAnalysis"`

	// Intra-operation
	PerformOnEye         string  `json:"performOnEye"`
	La                   *bool   `json:"la"`
	Ga                   *bool   `json:"ga"`
	Retrobulbar          *bool   `json:"retrobulbar"`
	Peribulbar           *bool   `json:"peribulbar"`
	Subtenones           *bool   `json:"subtenones"`
	Topical              *bool   `json:"topical"`
	ConjFlapLimbal       *bool   `json:"conjFlapLimbal"`
	ConjFlapFornix       *bool   `json:"conjFlapFornix"`
	SectionLimbal        *bool   `json:"sectionLimbal"`
	SectionCorneral      *bool   `json:"sectionCorneral"`
	SectionScleralTunnel *bool   `json:"sectionScleralTunnel"`
	CapsulotomyLinear    *bool   `json:"capsulotomyLinear"`
	CapsulotomyCanOpener *bool   `json:"capsulotomyCanOpener"`
	CapsulotomyCcc       *bool   `json:"capsulotomyCcc"`
	IolPlacementBag      *bool   `json:"iolPlacementBag"`
	IolSulcus            *bool   `json:"iolSulcus"`
	IolBagSulcus         *bool   `json:"iolBagSulcus"`
	IrodectpmyNone       *bool   `json:"irodectpmyNone"`
	IrodectpmyPl         *bool   `json:"irodectpmyPl"`
	IrodectpmySl         *bool   `json:"irodectpmySl"`
	Sphincterectomy      *bool   `json:"sphincterectomy"`
	LensExtractionIcce   *bool   `json:"lensExtractionIcce"`
	LensExtractionEcce   *bool   `json:"lensExtractionEcce"`
	LensExtractionPhaco  *bool   `json:"lensExtractionPhaco"`
	SutureNone           *bool   `json:"sutureNone"`
	SutureContinuous     *bool   `json:"sutureContinuous"`
	SutureInterrupted    *bool   `json:"sutureInterrupted"`
	Drapes               *bool   `json:"drapes"`
	Ringer               *bool   `json:"ringer"`
	Bss                  *bool   `json:"bss"`
	Air                  *bool   `json:"air"`
	Hpmc                 *bool   `json:"hpmc"`
	Healon               *bool   `json:"healon"`
	Pilo                 *bool   `json:"pilo"`
	Adrenalin            *bool   `json:"adrenalin"`
	Antibiotic           *bool   `json:"antibiotic"`
	Steroid              *bool   `json:"steroid"`
	Suture80             *bool   `json:"suture80"`
	Suture90             *bool   `json:"suture90"`
	Suture100            *bool   `json:"suture100"`
	IrrigatingSolution   *string `json:"irrigatingSolution"`
	Visco                *string `json:"visco"`
	Interacameral        *string `json:"interacameral"`
	Subconj              *string `json:"subconj"`
	Suture               *string `json:"suture"`
	Silk                 *bool   `json:"silk"`
	Nylon                *bool   `json:"nylon"`
	PcTear               *bool   `json:"pcTear"`
	VitreousLoss         *bool   `json:"vitreousLoss"`
	DescematesStrip      *bool   `json:"descematesStrip"`
	EndothelialDamage    *bool   `json:"endothelialDamage"`
	NucluesDrop          *bool   `json:"nucluesDrop"`
	IridoDialysis        *bool   `json:"iridoDialysis"`
	IrisDamage           *bool   `json:"irisDamage"`
	RetainedCortex       *bool   `json:"retainedCortex"`
	Hyphema              *bool   `json:"hyphema"`
	ComplicationsOthers  *string `json:"complicationsOthers"`
	ComplicationsNote    *string `json:"complicationsNote"`
	Vitrectomy           *string `json:"vitrectomy"`
	TypeOfIolAc          *bool   `json:"typeOfIolAc"`
	TypeOfIolPc          *bool   `json:"typeOfIolPc"`
	TypeOfIol            *string `json:"typeOfIol"`
	IolModel             *string `json:"iolModel"`
	Company              *string `json:"company"`
	Aclol                *string `json:"aclol"`
	AclolPlanned         *bool   `json:"aclolPlanned"`
	AclolUnplanned       *bool   `json:"aclolUnplanned"`
	Unplanned            *string `json:"unplanned"`

	// PPV Intra-Op
	TwentyG                   *bool `json:"twentyG"`
	TwentyThreeG              *bool `json:"twentyThreeG"`
	TwentyFiveG               *bool `json:"twentyFiveG"`
	Tca                       *bool `json:"tca"`
	BrilliantBlue             *bool `json:"brilliantBlue"`
	Ilmp                      *bool `json:"ilmp"`
	MembranePeeling           *bool `json:"membranePeeling"`
	MembraneSegmentation      *bool `json:"membraneSegmentation"`
	MembraneDeliniation       *bool `json:"membraneDeliniation"`
	Retinotomy                *bool `json:"retinotomy"`
	Retinectomy               *bool `json:"retinectomy"`
	Fax                       *bool `json:"fax"`
	Pfcl                      *bool `json:"pfcl"`
	SiliconOilInjection       *bool `json:"siliconOilInjection"`
	SiliconOilExchange        *bool `json:"siliconOilExchange"`
	SiliconOilPfclExchange    *bool `json:"siliconOilPfclExchange"`
	SiliconOilOneThousandCsk  *bool `json:"siliconOilOneThousandCsk"`
	SiliconOilFiveThousandCsk *bool `json:"siliconOilFiveThousandCsk"`
	Endolaser                 *bool `json:"endolaser"`
	AtBreaks                  *bool `json:"atBreaks"`
	ThreeSixyDegree           *bool `json:"threeSixyDegree"`
	Prp                       *bool `json:"prp"`
	CryopexyAtBreaks          *bool `json:"cryopexyAtBreaks"`
	Endodiathermy             *bool `json:"endodiathermy"`
	EncirclingBand            *bool `json:"encirclingBand"`
	SclerotomyStitches        *bool `json:"sclerotomyStitches"`

	// PPV Complications
	ComplicationChrodialEffusion         *bool `json:"complicationChrodialEffusion"`
	ComplicationIntraocilarHemorrhage    *bool `json:"complicationIntraocilarHemorrhage"`
	ComplicationSuprachorodialHemorrhage *bool `json:"complicationSuprachorodialHemorrhage"`
	ComplicationIatrogenicBreaks         *bool `json:"complicationIatrogenicBreaks"`
	ComplicationRetinalDetachment        *bool `json:"complicationRetinalDetachment"`
	ComplicationLensTouch                *bool `json:"complicationLensTouch"`
	ComplicationPfcl                     *bool `json:"complicationPfcl"`
	ComplicationSubretialPfcl            *bool `json:"complicationSubretialPfcl"`
	ComplicationSubretialOil             *bool `json:"complicationSubretialOil"`
	ComplicationMacularFold              *bool `json:"complicationMacularFold"`

	AdditionalNotes     *string `json:"additionalNotes"`
	SpecialInstructions *string `json:"specialInstructions"`
	Treatment           *string `json:"treatment"`
	AssistantName       *string `json:"assistantName"`

	SurgicalProcedureTypeID    int                   `json:"surgicalProcedureTypeId"`
	SurgicalProcedureType      SurgicalProcedureType `json:"surgicalProcedureType"`
	SurgicalProcedureTypeTitle string                `json:"surgicalProcedureTypeTitle"`
	Payments                   []Payment             `json:"payments" gorm:"many2many:surgery_payments;constraint:OnUpdate:CASCADE,OnDelete:CASCADE;"`
	PaymentVoucher             *string               `json:"paymentVoucher"`
	Status                     SurgeryStatus         `json:"status"`
	PaymentStatus              OrderPaymentStatus    `json:"paymentStatus"`
	OrderNote                  string                `json:"orderNote"`
	ReceptionNote              string                `json:"receptionNote"`
	CheckInTime                *time.Time            `json:"checkInTime"`
	RoomID                     *int                   `json:"roomId"`
	Count                      int64                 `json:"count"`
}
