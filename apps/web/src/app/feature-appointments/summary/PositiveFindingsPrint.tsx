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

import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Query,
  QueryPatientChartArgs,
  QuerySurgicalProcedureArgs,
  QueryTreatmentArgs,
  SurgicalProcedureInput,
  TreatmentInput,
} from '@tensoremr/models';
import {
  SketchDiagram,
  LabComponent,
  MedicationTable,
  EyeGlassTable,
  OcularMotilityOdDiagram,
  OcularMotilityOsDiagram,
  PreOpForm,
  IntraOpForm,
  TreatmentForm,
  IFileUploader,
} from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import corneaImage from './cornea.png';
import irisImage from './iris.png';
import circleImage from './circle.png';

import { getFileUrl, groupByHpiComponentType } from '@tensoremr/util';

export const GET_PATIENT_CHART = gql`
  query GetPatientChart($id: ID!, $details: Boolean) {
    patientChart(id: $id, details: $details) {
      id
      diagnosisNote
      differentialDiagnosisNote
      chiefComplaintsNote
      stickieNote
      summaryNote
      rightSummarySketch
      leftSummarySketch
      medicalRecommendation
      sickLeave
      diagnosisNote
      differentialDiagnosisNote

      physicalExamFindings {
        id
        abnormal
        examCategory {
          id
          title
        }
        examCategoryId
        patientChartId
        note
      }

      diagnoses {
        id
        differential
        location
        categoryCode
        diagnosisCode
        fullCode
        fullDescription
      }

      chiefComplaints {
        id
        title
        hpiComponents {
          id
          title
          hpiComponentType {
            id
            title
          }
        }
      }

      vitalSigns {
        id
        temperature
        pulse
        bloodPressureSystolic
        bloodPressureDiastolic
        respiratoryRate
        oxygenSaturation
        height
        weight
        bmi
        rightDistanceUncorrected
        leftDistanceUncorrected
        rightDistancePinhole
        leftDistancePinhole
        rightDistanceCorrected
        leftDistanceCorrected
        rightNearUncorrected
        leftNearUncorrected
        rightNearPinhole
        leftNearPinhole
        rightNearCorrected
        leftNearCorrected
        rightApplanation
        leftApplanation
        rightTonopen
        leftTonopen
        rightDigital
        leftDigital
        rightNoncontact
        leftNoncontact
      }

      opthalmologyExam {
        id
        rightOrbits
        leftOrbits
        rightLids
        leftLids
        rightLacrimalSystem
        leftLacrimalSystem
        externalExamNote
        rightCoverTest
        leftCoverTest
        coverTestNote
        rightRetina
        leftRetina
        leftRetinaSketch
        rightRetinaSketch
        funduscopyNote
        rightOcularMotility
        leftOcularMotility
        rsr
        rio
        rlr
        rmr
        rir
        rso
        rightFlick
        lsr
        lio
        llr
        lmr
        lir
        lso
        leftFlick
        distance
        near
        ocularMotilityNote
        rightOpticDisc
        leftOpticDisc
        rightOpticDiscSketch
        leftOpticDiscSketch
        rightCdr
        leftCdr
        opticDiscNote
        rightPupils
        leftPupils
        pupilsNote
        rightConjunctiva
        leftConjunctiva
        rightCornea
        leftCornea
        rightCorneaSketch
        leftCorneaSketch
        leftSclera
        rightSclera
        rightAnteriorChamber
        leftAnteriorChamber
        rightIris
        leftIris
        rightLens
        leftLens
        rightLensSketch
        leftLensSketch
        rightVitreos
        leftVitreos
        slitLampExamNote
      }

      diagnosticProcedureOrder {
        status
        createdAt
        diagnosticProcedures {
          id
          generalText
          rightDistanceSubjectiveSph
          leftDistanceSubjectiveSph
          rightDistanceSubjectiveCyl
          leftDistanceSubjectiveCyl
          rightDistanceSubjectiveAxis
          leftDistanceSubjectiveAxis
          rightNearSubjectiveSph
          leftNearSubjectiveSph
          rightNearSubjectiveCyl
          leftNearSubjectiveCyl
          rightNearSubjectiveAxis
          leftNearSubjectiveAxis
          rightDistanceObjectiveSph
          leftDistanceObjectiveSph
          rightDistanceObjectiveCyl
          leftDistanceObjectiveCyl
          rightDistanceObjectiveAxis
          leftDistanceObjectiveAxis
          rightNearObjectiveSph
          leftNearObjectiveSph
          rightNearObjectiveCyl
          leftNearObjectiveCyl
          rightNearObjectiveAxis
          leftNearObjectiveAxis
          rightDistanceFinalSph
          leftDistanceFinalSph
          rightDistanceFinalCyl
          leftDistanceFinalCyl
          rightDistanceFinalAxis
          leftDistanceFinalAxis
          rightNearFinalSph
          leftNearFinalSph
          rightNearFinalCyl
          leftNearFinalCyl
          rightNearFinalAxis
          leftNearFinalAxis
          rightVisualAcuity
          leftVisualAcuity
          farPd
          nearPd
          status
          diagnosticProcedureTypeTitle
          diagnosticProcedureType {
            title
          }
          images {
            id
            size
            hash
            fileName
            extension
            contentType
            createdAt
          }
          documents {
            id
            size
            hash
            fileName
            extension
            contentType
            createdAt
          }
          payments {
            id
            status
          }
        }
      }

      labOrder {
        status
        createdAt
        labs {
          id
          rightEyeText
          leftEyeText
          generalText
          status
          labType {
            id
            title
          }
          rightEyeImages {
            id
            size
            hash
            fileName
            extension
            contentType
            createdAt
          }
          leftEyeImages {
            id
            size
            hash
            fileName
            extension
            contentType
            createdAt
          }
          rightEyeSketches {
            id
            size
            hash
            fileName
            extension
            contentType
            createdAt
          }
          leftEyeSketches {
            id
            size
            hash
            fileName
            extension
            contentType
            createdAt
          }
          images {
            id
            size
            hash
            fileName
            extension
            contentType
            createdAt
          }
          documents {
            id
            size
            hash
            fileName
            extension
            contentType
            createdAt
          }
          payments {
            id
            status
          }
        }
      }

      medicalPrescriptionOrder {
        id
        medicalPrescriptions {
          id
          medication
          synonym
          sig
          refill
          generic
          substitutionAllowed
          directionToPatient
          prescribedDate
          history
          status
        }
      }

      eyewearPrescriptionOrder {
        id
        eyewearPrescriptions {
          id
          glass
          plastic
          singleVision
          photoChromatic
          glareFree
          scratchResistant
          bifocal
          progressive
          twoSeparateGlasses
          highIndex
          tint
          blueCut
          prescribedDate
          history
          status
        }
      }
    }
  }
`;

const GET_SURGERY = gql`
  query GetSurgery($patientChartId: ID!) {
    surgicalProcedure(patientChartId: $patientChartId) {
      id
      rightCorrected
      leftCorrected
      rightIop
      leftIop
      rightAnteriorSegment
      leftAnteriorSegment
      rightPosteriorSegment
      leftPosteriorSegment
      rightBiometry
      leftBiometry
      diabetes
      hpn
      asthma
      cardiacDisease
      allergies
      bloodPressure
      bloodSugar
      uriAnalysis
      orderNote
      la
      ga
      retrobulbar
      peribulbar
      subtenones
      topical
      conjFlapLimbal
      conjFlapFornix
      sectionLimbal
      sectionCorneral
      sectionScleralTunnel
      capsulotomyLinear
      capsulotomyCanOpener
      capsulotomyCcc
      iolPlacementBag
      iolSulcus
      iolBagSulcus
      irodectpmyNone
      irodectpmyPl
      irodectpmySl
      sphincterectomy
      lensExtractionIcce
      lensExtractionEcce
      lensExtractionPhaco
      sutureNone
      sutureContinuous
      sutureInterrupted
      drapes
      ringer
      bss
      air
      hpmc
      healon
      pilo
      adrenalin
      antibiotic
      steroid
      suture80
      suture90
      suture100
      irrigatingSolution
      visco
      interacameral
      subconj
      suture
      silk
      nylon
      pcTear
      vitreousLoss
      descematesStrip
      endothelialDamage
      nucluesDrop
      iridoDialysis
      irisDamage
      retainedCortex
      hyphema
      complicationsOthers
      complicationsNote
      vitrectomy
      typeOfIolAc
      typeOfIolPc
      typeOfIol
      iolModel
      company
      aclol
      aclolPlanned
      aclolUnplanned
      unplanned
      twentyG
      twentyThreeG
      twentyFiveG
      tca
      brilliantBlue
      ilmp
      membranePeeling
      membraneSegmentation
      membraneDeliniation
      retinotomy
      retinectomy
      fax
      pfcl
      siliconOilInjection
      siliconOilExchange
      siliconOilPfclExchange
      siliconOilOneThousandCsk
      siliconOilFiveThousandCsk
      endolaser
      atBreaks
      threeSixyDegree
      prp
      cryopexyAtBreaks
      endodiathermy
      encirclingBand
      sclerotomyStitches
      complicationChrodialEffusion
      complicationIntraocilarHemorrhage
      complicationSuprachorodialHemorrhage
      complicationIatrogenicBreaks
      complicationRetinalDetachment
      complicationLensTouch
      complicationPfcl
      complicationSubretialPfcl
      complicationSubretialOil
      complicationMacularFold
      additionalNotes
      specialInstructions
      treatment
      assistantName
      performOnEye
      surgicalProcedureType {
        id
        title
      }
    }
  }
`;

const GET_TREATMENT = gql`
  query GetTreatment($patientChartId: ID!) {
    treatment(patientChartId: $patientChartId) {
      id
      note
      result
      treatmentType {
        id
        title
      }
    }
  }
`;

interface Props {
  locked: boolean;
  patientChartId: string;
  showHistory?: boolean;
  showChiefComplaints?: boolean;
  showVitalSigns?: boolean;
  showPhysicalExamination?: boolean;
  showDiagnosticProcedures?: boolean;
  showLabratory?: boolean;
  showDiagnosis?: boolean;
  showDifferentialDiagnosis?: boolean;
  showSurgery?: boolean;
  showTreatment?: boolean;
  showPrescriptions?: boolean;
}

export const PositiveFindingsPrint: React.FC<Props> = ({
  locked,
  patientChartId,
  showHistory,
  showChiefComplaints,
  showVitalSigns,
  showPhysicalExamination,
  showDiagnosticProcedures,
  showLabratory,
  showDiagnosis,
  showDifferentialDiagnosis,
  showSurgery,
  showTreatment,
  showPrescriptions,
}) => {
  const notifDispatch = useNotificationDispatch();

  const { data, refetch } = useQuery<Query, QueryPatientChartArgs>(
    GET_PATIENT_CHART,
    {
      variables: {
        id: patientChartId,
        details: true,
      },
    }
  );

  const surgeryQuery = useQuery<Query, QuerySurgicalProcedureArgs>(
    GET_SURGERY,
    {
      variables: {
        patientChartId,
      },
    }
  );

  const surgicalProcedureForm = useForm<SurgicalProcedureInput>({
    defaultValues: {
      patientChartId: patientChartId,
    },
  });

  useEffect(() => {
    const surgicalProcedure = surgeryQuery.data?.surgicalProcedure;
    if (surgicalProcedure) {
      surgicalProcedureForm.reset({
        rightCorrected: surgicalProcedure.rightCorrected,
        leftCorrected: surgicalProcedure.leftCorrected,
        rightIop: surgicalProcedure.rightIop,
        leftIop: surgicalProcedure.leftIop,
        rightAnteriorSegment: surgicalProcedure.rightAnteriorSegment,
        leftAnteriorSegment: surgicalProcedure.leftAnteriorSegment,
        rightPosteriorSegment: surgicalProcedure.rightPosteriorSegment,
        leftPosteriorSegment: surgicalProcedure.leftPosteriorSegment,
        rightBiometry: surgicalProcedure.rightBiometry,
        leftBiometry: surgicalProcedure.leftBiometry,
        bloodPressure: surgicalProcedure.bloodPressure,
        bloodSugar: surgicalProcedure.bloodSugar,
        uriAnalysis: surgicalProcedure.uriAnalysis,
        diabetes: surgicalProcedure.diabetes,
        asthma: surgicalProcedure.asthma,
        hpn: surgicalProcedure.hpn,
        cardiacDisease: surgicalProcedure.cardiacDisease,
        allergies: surgicalProcedure.allergies,
        assistantName: surgicalProcedure.assistantName,
        performOnEye: surgicalProcedure.performOnEye,
        la: surgicalProcedure.la,
        ga: surgicalProcedure.ga,
        retrobulbar: surgicalProcedure.retrobulbar,
        peribulbar: surgicalProcedure.peribulbar,
        subtenones: surgicalProcedure.subtenones,
        topical: surgicalProcedure.topical,
        conjFlapLimbal: surgicalProcedure.conjFlapLimbal,
        conjFlapFornix: surgicalProcedure.conjFlapFornix,
        sectionLimbal: surgicalProcedure.sectionLimbal,
        sectionCorneral: surgicalProcedure.sectionCorneral,
        sectionScleralTunnel: surgicalProcedure.sectionScleralTunnel,
        capsulotomyLinear: surgicalProcedure.capsulotomyLinear,
        capsulotomyCanOpener: surgicalProcedure.capsulotomyCanOpener,
        capsulotomyCcc: surgicalProcedure.capsulotomyCcc,
        iolPlacementBag: surgicalProcedure.iolPlacementBag,
        iolSulcus: surgicalProcedure.iolSulcus,
        iolBagSulcus: surgicalProcedure.iolBagSulcus,
        irodectpmyNone: surgicalProcedure.irodectpmyNone,
        irodectpmyPl: surgicalProcedure.irodectpmyPl,
        irodectpmySl: surgicalProcedure.irodectpmySl,
        sphincterectomy: surgicalProcedure.sphincterectomy,
        lensExtractionIcce: surgicalProcedure.lensExtractionIcce,
        lensExtractionEcce: surgicalProcedure.lensExtractionEcce,
        lensExtractionPhaco: surgicalProcedure.lensExtractionPhaco,
        sutureNone: surgicalProcedure.sutureNone,
        sutureContinuous: surgicalProcedure.sutureContinuous,
        sutureInterrupted: surgicalProcedure.sutureInterrupted,
        drapes: surgicalProcedure.drapes,
        ringer: surgicalProcedure.ringer,
        bss: surgicalProcedure.bss,
        air: surgicalProcedure.air,
        hpmc: surgicalProcedure.hpmc,
        healon: surgicalProcedure.healon,
        pilo: surgicalProcedure.pilo,
        adrenalin: surgicalProcedure.adrenalin,
        antibiotic: surgicalProcedure.antibiotic,
        steroid: surgicalProcedure.steroid,
        suture80: surgicalProcedure.suture80,
        suture90: surgicalProcedure.suture90,
        suture100: surgicalProcedure.suture100,
        irrigatingSolution: surgicalProcedure.irrigatingSolution,
        visco: surgicalProcedure.visco,
        interacameral: surgicalProcedure.interacameral,
        subconj: surgicalProcedure.subconj,
        suture: surgicalProcedure.suture,
        silk: surgicalProcedure.silk,
        nylon: surgicalProcedure.nylon,
        pcTear: surgicalProcedure.pcTear,
        vitreousLoss: surgicalProcedure.vitreousLoss,
        descematesStrip: surgicalProcedure.descematesStrip,
        endothelialDamage: surgicalProcedure.endothelialDamage,
        nucluesDrop: surgicalProcedure.nucluesDrop,
        iridoDialysis: surgicalProcedure.iridoDialysis,
        irisDamage: surgicalProcedure.irisDamage,
        retainedCortex: surgicalProcedure.retainedCortex,
        hyphema: surgicalProcedure.hyphema,
        complicationsOthers: surgicalProcedure.complicationsOthers,
        complicationsNote: surgicalProcedure.complicationsNote,
        vitrectomy: surgicalProcedure.vitrectomy,
        typeOfIolAc: surgicalProcedure.typeOfIolAc,
        typeOfIolPc: surgicalProcedure.typeOfIolPc,
        typeOfIol: surgicalProcedure.typeOfIol,
        iolModel: surgicalProcedure.iolModel,
        company: surgicalProcedure.company,
        aclol: surgicalProcedure.aclol,
        aclolPlanned: surgicalProcedure.aclolPlanned,
        aclolUnplanned: surgicalProcedure.aclolUnplanned,
        unplanned: surgicalProcedure.unplanned,
        additionalNotes: surgicalProcedure.additionalNotes,
        specialInstructions: surgicalProcedure.specialInstructions,
        treatment: surgicalProcedure.treatment,
        twentyG: surgicalProcedure.twentyG,
        twentyThreeG: surgicalProcedure.twentyThreeG,
        twentyFiveG: surgicalProcedure.twentyFiveG,
        tca: surgicalProcedure.tca,
        brilliantBlue: surgicalProcedure.brilliantBlue,
        ilmp: surgicalProcedure.ilmp,
        membranePeeling: surgicalProcedure.membranePeeling,
        membraneSegmentation: surgicalProcedure.membraneSegmentation,
        membraneDeliniation: surgicalProcedure.membraneDeliniation,
        retinotomy: surgicalProcedure.retinotomy,
        retinectomy: surgicalProcedure.retinectomy,
        fax: surgicalProcedure.fax,
        pfcl: surgicalProcedure.pfcl,
        siliconOilInjection: surgicalProcedure.siliconOilInjection,
        siliconOilExchange: surgicalProcedure.siliconOilExchange,
        siliconOilPfclExchange: surgicalProcedure.siliconOilPfclExchange,
        siliconOilOneThousandCsk: surgicalProcedure.siliconOilOneThousandCsk,
        siliconOilFiveThousandCsk: surgicalProcedure.siliconOilFiveThousandCsk,
        endolaser: surgicalProcedure.endolaser,
        atBreaks: surgicalProcedure.atBreaks,
        threeSixyDegree: surgicalProcedure.threeSixyDegree,
        prp: surgicalProcedure.prp,
        cryopexyAtBreaks: surgicalProcedure.cryopexyAtBreaks,
        endodiathermy: surgicalProcedure.endodiathermy,
        encirclingBand: surgicalProcedure.encirclingBand,
        sclerotomyStitches: surgicalProcedure.sclerotomyStitches,
        complicationChrodialEffusion:
          surgicalProcedure.complicationChrodialEffusion,
        complicationIntraocilarHemorrhage:
          surgicalProcedure.complicationIntraocilarHemorrhage,
        complicationSuprachorodialHemorrhage:
          surgicalProcedure.complicationSuprachorodialHemorrhage,
        complicationIatrogenicBreaks:
          surgicalProcedure.complicationIatrogenicBreaks,
        complicationRetinalDetachment:
          surgicalProcedure.complicationRetinalDetachment,
        complicationLensTouch: surgicalProcedure.complicationLensTouch,
        complicationPfcl: surgicalProcedure.complicationPfcl,
        complicationSubretialPfcl: surgicalProcedure.complicationSubretialPfcl,
        complicationSubretialOil: surgicalProcedure.complicationSubretialOil,
        complicationMacularFold: surgicalProcedure.complicationMacularFold,
      });
    }
  }, [surgeryQuery.data?.surgicalProcedure]);

  const treatmentQuery = useQuery<Query, QueryTreatmentArgs>(GET_TREATMENT, {
    variables: {
      patientChartId,
    },
  });

  const treatmentForm = useForm<TreatmentInput>({
    defaultValues: {
      patientChartId: patientChartId,
    },
  });

  useEffect(() => {
    const treatment = treatmentQuery.data?.treatment;

    if (treatment !== undefined) {
      treatmentForm.reset({
        note: treatment.note,
        result: treatment.result,
        patientChartId: treatment.patientChartId,
      });
    }
  }, [treatmentQuery.data?.treatment]);

  useEffect(() => {
    refetch();
    surgeryQuery.refetch();
    treatmentQuery.refetch();
  }, []);

  const [selectedColor] = useState('#000000');
  const [selectedLineWeight] = useState(3);

  const patientChart = data?.patientChart;

  const ocularMotilityForm = useForm<any>();

  const rightCorneaSketch = useRef<any>(null);
  const leftCorneaSketch = useRef<any>(null);
  const rightLensSketch = useRef<any>(null);
  const leftLensSketch = useRef<any>(null);
  const rightRetinaSketch = useRef<any>(null);
  const leftRetinaSketch = useRef<any>(null);
  const rightOpticDiscSketch = useRef<any>(null);
  const leftOpticDiscSketch = useRef<any>(null);

  useEffect(() => {
    if (data?.patientChart.opthalmologyExam) {
      ocularMotilityForm.reset({
        rightOcularMotility:
          patientChart?.opthalmologyExam?.rightOcularMotility,
        leftOcularMotility: patientChart?.opthalmologyExam?.leftOcularMotility,
        rsr: patientChart?.opthalmologyExam?.rsr,
        rio: patientChart?.opthalmologyExam?.rio,
        rlr: patientChart?.opthalmologyExam?.rlr,
        rmr: patientChart?.opthalmologyExam?.rmr,
        rir: patientChart?.opthalmologyExam?.rir,
        rso: patientChart?.opthalmologyExam?.rso,
        rightFlick: patientChart?.opthalmologyExam?.rightFlick,
        lsr: patientChart?.opthalmologyExam?.lsr,
        lio: patientChart?.opthalmologyExam?.lio,
        llr: patientChart?.opthalmologyExam?.llr,
        lmr: patientChart?.opthalmologyExam?.lmr,
        lir: patientChart?.opthalmologyExam?.lir,
        lso: patientChart?.opthalmologyExam?.lso,
        leftFlick: patientChart?.opthalmologyExam?.leftFlick,
        distance: patientChart?.opthalmologyExam?.distance,
        near: patientChart?.opthalmologyExam?.near,
        ocularMotilityNote: patientChart?.opthalmologyExam?.ocularMotilityNote,
      });
    }
  }, [data]);

  if (!patientChart) {
    return <div></div>;
  }

  const hasVisionDistance =
    patientChart.vitalSigns?.rightDistanceUncorrected ||
    patientChart.vitalSigns?.leftDistanceUncorrected ||
    patientChart.vitalSigns?.rightDistancePinhole ||
    patientChart.vitalSigns?.leftDistancePinhole ||
    patientChart.vitalSigns?.rightDistanceCorrected ||
    patientChart.vitalSigns?.leftDistanceCorrected;

  const hasVisionNear =
    patientChart.vitalSigns?.rightNearUncorrected ||
    patientChart.vitalSigns?.leftNearUncorrected ||
    patientChart.vitalSigns?.rightNearPinhole ||
    patientChart.vitalSigns?.leftNearPinhole ||
    patientChart.vitalSigns?.rightNearCorrected ||
    patientChart.vitalSigns?.leftNearCorrected;

  const hasiopApplanation =
    patientChart.vitalSigns?.rightApplanation ||
    patientChart.vitalSigns?.leftApplanation;

  const hasiopTonopen =
    patientChart.vitalSigns?.rightTonopen ||
    patientChart.vitalSigns?.leftTonopen;

  const hasiopDigital =
    patientChart.vitalSigns?.rightDigital ||
    patientChart.vitalSigns?.leftDigital;

  const hasiopNoncontact =
    patientChart.vitalSigns?.rightNoncontact ||
    patientChart.vitalSigns?.leftNoncontact;

  const hasTemperature = patientChart.vitalSigns?.temperature;
  const hasPulse = patientChart.vitalSigns?.pulse;
  const hasBloodPressure =
    patientChart.vitalSigns?.bloodPressureSystolic ||
    patientChart.vitalSigns?.bloodPressureDiastolic;
  const hasRespiratoryRate = patientChart.vitalSigns?.respiratoryRate;
  const hasOxygenSaturation = patientChart.vitalSigns?.oxygenSaturation;
  const hasHeight = patientChart.vitalSigns?.height;
  const hasWeight = patientChart.vitalSigns?.weight;
  const hasBmi = patientChart.vitalSigns?.bmi;

  const hasExternalExamLacrimal =
    patientChart.opthalmologyExam?.leftLacrimalSystem ||
    patientChart.opthalmologyExam?.rightLacrimalSystem;

  const hasExternalExamLids =
    patientChart.opthalmologyExam?.leftLids ||
    patientChart.opthalmologyExam?.rightLids;

  const hasExternalExamOrbits =
    patientChart.opthalmologyExam?.rightOrbits ||
    patientChart.opthalmologyExam?.leftOrbits;

  const hasExternalExamNote = patientChart.opthalmologyExam?.externalExamNote;

  const hasOcularMotility =
    patientChart?.opthalmologyExam.rightOcularMotility ||
    patientChart?.opthalmologyExam.leftOcularMotility;

  const hasOcularMotilityDiagram =
    patientChart?.opthalmologyExam.rsr ||
    patientChart?.opthalmologyExam.rio ||
    patientChart?.opthalmologyExam.rlr ||
    patientChart?.opthalmologyExam.rmr ||
    patientChart?.opthalmologyExam.rir ||
    patientChart?.opthalmologyExam.rso ||
    patientChart?.opthalmologyExam.rightFlick ||
    patientChart?.opthalmologyExam.lsr ||
    patientChart?.opthalmologyExam.lio ||
    patientChart?.opthalmologyExam.llr ||
    patientChart?.opthalmologyExam.lmr ||
    patientChart?.opthalmologyExam.lir ||
    patientChart?.opthalmologyExam.lso ||
    patientChart?.opthalmologyExam.leftFlick;

  const hasOcularMotilityDistance = patientChart?.opthalmologyExam.distance;
  const hasOcularMotilityNear = patientChart?.opthalmologyExam.near;

  const hasOcularMotilityNote =
    patientChart?.opthalmologyExam.ocularMotilityNote;

  const ocularMotilityValues = ocularMotilityForm.watch();

  const hasCoverTest =
    patientChart.opthalmologyExam.rightCoverTest ||
    patientChart.opthalmologyExam.leftCoverTest;

  const hasCoverTestNote = patientChart.opthalmologyExam.coverTestNote;

  const hasPupils =
    patientChart.opthalmologyExam.rightPupils ||
    patientChart.opthalmologyExam.leftPupils;

  const hasPupilsNote = patientChart.opthalmologyExam.pupilsNote;

  const hasSlitLampConjuctiva =
    patientChart.opthalmologyExam.rightConjunctiva ||
    patientChart.opthalmologyExam.leftConjunctiva;

  const hasSlitLampCornea =
    patientChart.opthalmologyExam.rightCornea ||
    patientChart.opthalmologyExam.leftCornea;

  const hasSlitLampCorneaSketch =
    (patientChart.opthalmologyExam.rightCorneaSketch &&
      JSON.parse(patientChart.opthalmologyExam.rightCorneaSketch?.toString())
        .objects.length > 0) ||
    (patientChart.opthalmologyExam.leftCorneaSketch &&
      JSON.parse(patientChart.opthalmologyExam.leftCorneaSketch?.toString())
        .objects.length > 0);

  const hasSlitLampLensSketch =
    (patientChart.opthalmologyExam.rightLensSketch &&
      JSON.parse(patientChart.opthalmologyExam.rightLensSketch?.toString())
        .objects.length > 0) ||
    (patientChart.opthalmologyExam.leftLensSketch &&
      JSON.parse(patientChart.opthalmologyExam.leftLensSketch?.toString())
        .objects.length > 0);

  const hasSlitLampSclera =
    patientChart.opthalmologyExam.rightSclera ||
    patientChart.opthalmologyExam.leftSclera;

  const hasSlitLampAnteriorChamber =
    patientChart.opthalmologyExam.rightAnteriorChamber ||
    patientChart.opthalmologyExam.leftAnteriorChamber;

  const hasSlitLampIris =
    patientChart.opthalmologyExam.rightIris ||
    patientChart.opthalmologyExam.leftIris;

  const hasSlitLampLens =
    patientChart.opthalmologyExam.rightLens ||
    patientChart.opthalmologyExam.leftLens;

  const hasSlitLampVitreos =
    patientChart.opthalmologyExam.rightVitreos ||
    patientChart.opthalmologyExam.leftVitreos;

  const hasSlitLampNote = patientChart.opthalmologyExam.slitLampExamNote;

  const hasFunduscopyRetina =
    patientChart.opthalmologyExam.rightRetina ||
    patientChart.opthalmologyExam.leftRetina;

  const hasFunduscopyRetinaSketch =
    (patientChart.opthalmologyExam.rightRetinaSketch &&
      JSON.parse(patientChart.opthalmologyExam.rightRetinaSketch?.toString())
        .objects.length > 0) ||
    (patientChart.opthalmologyExam.leftRetinaSketch &&
      JSON.parse(patientChart.opthalmologyExam.leftRetinaSketch?.toString())
        .objects.length > 0);

  const hasFunduscopyNote = patientChart.opthalmologyExam.funduscopyNote;

  const hasOpticDiscCdr =
    patientChart.opthalmologyExam.rightCdr ||
    patientChart.opthalmologyExam.leftCdr;
  const hasOpticDisc =
    patientChart.opthalmologyExam.rightOpticDisc ||
    patientChart.opthalmologyExam.leftOpticDisc;

  const hasOpticDiscSketch =
    (patientChart.opthalmologyExam.rightOpticDiscSketch &&
      JSON.parse(patientChart.opthalmologyExam.rightOpticDiscSketch?.toString())
        .objects.length > 0) ||
    (patientChart.opthalmologyExam.leftOpticDiscSketch &&
      JSON.parse(patientChart.opthalmologyExam.leftOpticDiscSketch?.toString())
        .objects.length > 0);

  const hasOpticDiscNote = patientChart.opthalmologyExam.opticDiscNote;

  const hasDiagnosis =
    patientChart.diagnoses.length > 0 ||
    (patientChart.diagnosisNote?.length ?? 0) > 0 ||
    (patientChart.differentialDiagnosisNote?.length ?? 0) > 0;

  const getOrderTypeName = (orderType: string | undefined) => {
    switch (orderType) {
      case 'FOLLOW_UP':
        return 'Follow-Up';
      case 'PATIENT_IN_HOUSE_REFERRAL':
        return 'In-House Referral';
      case 'PATIENT_OUTSOURCE_REFERRAL':
        return 'Outsourced Referral';
      case 'TREATMENT':
        return 'Treatment';
      case 'SURGICAL_PROCEDURE':
        return 'Surgery';
      default:
        return '';
    }
  };

  return (
    <div className="text-sm print-container">
      {patientChart.chiefComplaints?.length > 0 && showChiefComplaints && (
        <div>
          <p className="text-xl tracking-wider text-gray-800 font-light">
            Chief complaints
          </p>

          <hr className="my-5" />

          <div className="mt-1 pl-3">
            {patientChart.chiefComplaints.map((e) => (
              <div className="pl-4 border-l border-indigo-600 mt-3" key={e?.id}>
                <p className="text-base font-semibold">{e?.title}</p>
                <ul className="list-inside list-disc pl-3">
                  {groupByHpiComponentType(e?.hpiComponents)?.map((q) => (
                    <li key={q[0]}>{`${q[0]}: ${q[1]
                      .map((h) => h?.title.trim())
                      .join(', ')}`}</li>
                  ))}
                </ul>
              </div>
            ))}

            {patientChart.chiefComplaintsNote && (
              <div className="text-sm mt-2">
                {patientChart.chiefComplaintsNote}
              </div>
            )}
          </div>
        </div>
      )}

      {showVitalSigns && (
        <div>
          <p className="text-xl tracking-wider text-gray-800 font-light mt-5">
            Vital Signs
          </p>
          <hr className="mt-5 mb-5" />
          {(hasVisionDistance || hasVisionNear) && (
            <div className="text-sm mt-2">
              <p className="text-base font-semibold">Visual Acuity</p>

              <div className="mt-1 pl-3">
                {hasVisionDistance && (
                  <div>
                    <p className="">Distance</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart.vitalSigns?.rightDistanceUncorrected && (
                        <li>{`Uncorrected (OD): ${patientChart.vitalSigns?.rightDistanceUncorrected}`}</li>
                      )}

                      {patientChart.vitalSigns?.leftDistanceUncorrected && (
                        <li>{`Uncorrected (OS): ${patientChart.vitalSigns?.leftDistanceUncorrected}`}</li>
                      )}

                      {patientChart.vitalSigns?.rightDistanceCorrected && (
                        <li>{`Corrected (OD): ${patientChart.vitalSigns?.rightDistanceCorrected}`}</li>
                      )}

                      {patientChart.vitalSigns?.leftDistanceCorrected && (
                        <li>{`Corrected (OS): ${patientChart.vitalSigns?.leftDistanceCorrected}`}</li>
                      )}

                      {patientChart.vitalSigns?.rightDistancePinhole && (
                        <li>{`Pinhole (OD): ${patientChart.vitalSigns?.rightDistancePinhole}`}</li>
                      )}

                      {patientChart.vitalSigns?.leftDistancePinhole && (
                        <li>{`Pinhole (OS): ${patientChart.vitalSigns?.leftDistancePinhole}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasVisionNear && (
                  <div>
                    <p className="">Near</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart.vitalSigns?.rightNearUncorrected && (
                        <li>{`Uncorrected (OD): ${patientChart.vitalSigns?.rightNearUncorrected}`}</li>
                      )}

                      {patientChart.vitalSigns?.leftNearUncorrected && (
                        <li>{`Uncorrected (OS): ${patientChart.vitalSigns?.leftNearUncorrected}`}</li>
                      )}

                      {patientChart.vitalSigns?.rightNearCorrected && (
                        <li>{`Corrected (OD): ${patientChart.vitalSigns?.rightNearCorrected}`}</li>
                      )}

                      {patientChart.vitalSigns?.leftNearCorrected && (
                        <li>{`Corrected (OS): ${patientChart.vitalSigns?.leftNearCorrected}`}</li>
                      )}

                      {patientChart.vitalSigns?.rightNearPinhole && (
                        <li>{`Pinhole (OD): ${patientChart.vitalSigns?.rightNearPinhole}`}</li>
                      )}

                      {patientChart.vitalSigns?.leftNearPinhole && (
                        <li>{`Pinhole (OS): ${patientChart.vitalSigns?.leftNearPinhole}`}</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          {(hasiopApplanation ||
            hasiopTonopen ||
            hasiopDigital ||
            hasiopNoncontact) && (
            <div className="text-sm mt-2">
              <p className="text-base font-semibold">IOP</p>

              {hasiopApplanation && (
                <div className="mt-1 pl-3">
                  <p className="">Applanation</p>
                  <ul className="list-inside list-disc pl-3">
                    {patientChart.vitalSigns?.rightApplanation && (
                      <li>{`OD: ${patientChart.vitalSigns?.rightApplanation}`}</li>
                    )}

                    {patientChart.vitalSigns?.leftApplanation && (
                      <li>{`OS: ${patientChart.vitalSigns?.leftApplanation}`}</li>
                    )}
                  </ul>
                </div>
              )}

              {hasiopTonopen && (
                <div className="mt-1 pl-3">
                  <p className="">Tonopen</p>
                  <ul className="list-inside list-disc pl-3">
                    {patientChart.vitalSigns?.rightTonopen && (
                      <li>{`OD: ${patientChart.vitalSigns?.rightTonopen}`}</li>
                    )}

                    {patientChart.vitalSigns?.leftTonopen && (
                      <li>{`OS: ${patientChart.vitalSigns?.leftTonopen}`}</li>
                    )}
                  </ul>
                </div>
              )}

              {hasiopDigital && (
                <div className="mt-1 pl-3">
                  <p className="">Digital</p>
                  <ul className="list-inside list-disc pl-3">
                    {patientChart.vitalSigns?.rightDigital && (
                      <li>{`OD: ${patientChart.vitalSigns?.rightDigital}`}</li>
                    )}

                    {patientChart.vitalSigns?.leftDigital && (
                      <li>{`OS: ${patientChart.vitalSigns?.leftDigital}`}</li>
                    )}
                  </ul>
                </div>
              )}

              {hasiopNoncontact && (
                <div className="mt-1 pl-3">
                  <p className="">Non-Contact</p>
                  <ul className="list-inside list-disc pl-3">
                    {patientChart.vitalSigns?.rightNoncontact && (
                      <li>{`OD: ${patientChart.vitalSigns?.rightNoncontact}`}</li>
                    )}

                    {patientChart.vitalSigns?.leftNoncontact && (
                      <li>{`OS: ${patientChart.vitalSigns?.leftNoncontact}`}</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
          {hasTemperature && (
            <div className="text-sm mt-2">
              <span className="text-base font-semibold">Temperature: </span>{' '}
              <span>{`${patientChart.vitalSigns?.temperature} C°`}</span>
            </div>
          )}
          {hasPulse && (
            <div className="text-sm mt-1">
              <span className="text-base font-semibold">Pulse: </span>{' '}
              <span>{`${patientChart.vitalSigns?.pulse} bpm`}</span>
            </div>
          )}
          {hasBloodPressure && (
            <div className="text-sm mt-1">
              <span className="text-base font-semibold">Blood Pressure: </span>{' '}
              <span>{`${patientChart.vitalSigns?.bloodPressureSystolic} / ${patientChart.vitalSigns?.bloodPressureDiastolic}`}</span>
            </div>
          )}
          {hasRespiratoryRate && (
            <div className="text-sm mt-1">
              <span className="text-base font-semibold">
                Respiratory Rate:{' '}
              </span>{' '}
              <span>{`${patientChart.vitalSigns?.respiratoryRate} rpm`}</span>
            </div>
          )}
          {hasOxygenSaturation && (
            <div className="text-sm mt-1">
              <span className="text-base font-semibold">
                Oxygen Saturation:{' '}
              </span>{' '}
              <span>{`${patientChart.vitalSigns?.oxygenSaturation}%`}</span>
            </div>
          )}
          {hasHeight && (
            <div className="text-sm mt-1">
              <span className="text-base font-semibold">Height: </span>{' '}
              <span>{`${patientChart.vitalSigns?.height} cm`}</span>
            </div>
          )}
          {hasWeight && (
            <div className="text-sm mt-1">
              <span className="text-base font-semibold">Weight: </span>{' '}
              <span>{`${patientChart.vitalSigns?.weight} kg`}</span>
            </div>
          )}
          {hasBmi && (
            <div className="text-sm mt-1">
              <span className="text-base font-semibold">BMI: </span>{' '}
              <span>{`${patientChart.vitalSigns?.bmi}`}</span>
            </div>
          )}
        </div>
      )}

      {showPhysicalExamination && (
        <div>
          <div className="page-break" />

          <p className="text-xl tracking-wider text-gray-800 font-light mt-5">
            Physical Examination
          </p>

          <hr className="mt-5 mb-5" />

          <ul className="list-inside list-disc pl-3">
            {patientChart.physicalExamFindings.map((e) => (
              <li key={e?.id}>
                <span className="font-semibold">{e?.examCategory.title}: </span>
                <span>{`${e?.abnormal ? 'Abnormal, ' : 'Normal, '} ${
                  e?.note
                }`}</span>
              </li>
            ))}
          </ul>

          {(hasExternalExamLacrimal ||
            hasExternalExamLids ||
            hasExternalExamOrbits ||
            hasExternalExamNote) && (
            <div className="text-sm mt-5 pl-4 border-l-2 border-indigo-600">
              <p className="text-base font-semibold">External Exam</p>
              <ul className="list-inside list-disc pl-3">
                {hasExternalExamLacrimal && (
                  <div className="mt-1 pl-3">
                    <p className="">Lacrimal System</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart.opthalmologyExam.rightLacrimalSystem && (
                        <li>{`OD: ${patientChart.opthalmologyExam?.rightLacrimalSystem}`}</li>
                      )}

                      {patientChart.opthalmologyExam?.leftLacrimalSystem && (
                        <li>{`OS: ${patientChart.opthalmologyExam?.leftLacrimalSystem}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasExternalExamLids && (
                  <div className="mt-1 pl-3">
                    <p className="">Lids</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart.opthalmologyExam.rightLids && (
                        <li>{`OD: ${patientChart.opthalmologyExam?.rightLids}`}</li>
                      )}

                      {patientChart.opthalmologyExam?.leftLids && (
                        <li>{`OS: ${patientChart.opthalmologyExam?.leftLids}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasExternalExamOrbits && (
                  <div className="mt-1 pl-3">
                    <p className="">Orbits</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart.opthalmologyExam.rightOrbits && (
                        <li>{`OD: ${patientChart.opthalmologyExam?.rightOrbits}`}</li>
                      )}

                      {patientChart.opthalmologyExam?.leftOrbits && (
                        <li>{`OS: ${patientChart.opthalmologyExam?.leftOrbits}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasExternalExamNote && (
                  <div className="text-sm mt-2">
                    {patientChart.opthalmologyExam.externalExamNote}
                  </div>
                )}
              </ul>
            </div>
          )}

          {(hasOcularMotility ||
            hasOcularMotilityDistance ||
            hasOcularMotilityNear ||
            hasOcularMotilityNote) && (
            <div className="text-sm mt-5 pl-4 border-l-2 border-indigo-600">
              <p className="text-base font-semibold">Ocular Motility</p>
              {hasOcularMotilityDiagram && (
                <div className="mt-1 flex justify-around border">
                  <div>
                    <p className="text-center mb-5">OD</p>
                    <OcularMotilityOdDiagram
                      register={ocularMotilityForm.register}
                      readOnly={true}
                      values={ocularMotilityValues}
                      onChange={() => null}
                    />
                  </div>
                  <div>
                    <p className="text-center mb-5">OS</p>
                    <OcularMotilityOsDiagram
                      register={ocularMotilityForm.register}
                      readOnly={true}
                      values={ocularMotilityValues}
                      onChange={() => null}
                    />
                  </div>
                </div>
              )}

              <ul className="list-inside list-disc pl-3">
                {hasOcularMotility && (
                  <div className="mt-1 pl-3">
                    <p className="">Ocular Motility</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart?.opthalmologyExam.rightOcularMotility && (
                        <li>{`OD: ${patientChart?.opthalmologyExam?.rightOcularMotility}`}</li>
                      )}

                      {patientChart?.opthalmologyExam?.leftOcularMotility && (
                        <li>{`OS: ${patientChart?.opthalmologyExam?.leftOcularMotility}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasOcularMotilityDistance && (
                  <div className="text-sm mt-2">
                    Distance: {patientChart?.opthalmologyExam.distance}
                  </div>
                )}

                {hasOcularMotilityNear && (
                  <div className="text-sm mt-2">
                    Distance: {patientChart?.opthalmologyExam.near}
                  </div>
                )}

                {hasOcularMotilityNote && (
                  <div className="text-sm mt-2">
                    {patientChart?.opthalmologyExam.ocularMotilityNote}
                  </div>
                )}
              </ul>
            </div>
          )}

          {(hasCoverTest || hasCoverTestNote) && (
            <div className="text-sm mt-5 pl-4 border-l-2 border-indigo-600">
              <p className="text-base font-semibold">Cover Test</p>
              <ul className="list-inside list-disc pl-3">
                {hasCoverTest && (
                  <div className="mt-1 pl-3">
                    <p className="">Cover Test</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart.opthalmologyExam?.rightCoverTest && (
                        <li>{`OD: ${patientChart.opthalmologyExam?.rightCoverTest}`}</li>
                      )}

                      {patientChart.opthalmologyExam?.leftCoverTest && (
                        <li>{`OS: ${patientChart.opthalmologyExam?.leftCoverTest}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasCoverTestNote && (
                  <div className="text-sm mt-2">
                    {patientChart.opthalmologyExam.coverTestNote}
                  </div>
                )}
              </ul>
            </div>
          )}

          {(hasPupils || hasPupils) && (
            <div className="text-sm mt-5 pl-4 border-l-2 border-indigo-600">
              <p className="text-base font-semibold">Pupils</p>
              <ul className="list-inside list-disc pl-3">
                {hasPupils && (
                  <div className="mt-1 pl-3">
                    <p className="">Pupils</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart.opthalmologyExam?.rightPupils && (
                        <li>{`OD: ${patientChart.opthalmologyExam?.rightPupils}`}</li>
                      )}

                      {patientChart.opthalmologyExam?.leftPupils && (
                        <li>{`OS: ${patientChart.opthalmologyExam?.leftPupils}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasPupilsNote && (
                  <div className="text-sm mt-2">
                    {patientChart.opthalmologyExam.pupilsNote}
                  </div>
                )}
              </ul>
            </div>
          )}

          {(hasSlitLampConjuctiva ||
            hasSlitLampCornea ||
            hasSlitLampCorneaSketch ||
            hasSlitLampSclera ||
            hasSlitLampAnteriorChamber ||
            hasSlitLampIris ||
            hasSlitLampLens ||
            hasSlitLampLensSketch ||
            hasSlitLampVitreos ||
            hasSlitLampNote) && (
            <div className="text-sm mt-5 pl-4 border-l-2 border-indigo-600">
              <p className="text-base font-semibold">Slit Lamp Exam</p>
              <ul className="list-inside list-disc pl-3">
                {hasSlitLampConjuctiva && (
                  <div className="mt-1 pl-3">
                    <p className="">Conjuctiva</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart.opthalmologyExam?.rightConjunctiva && (
                        <li>{`OD: ${patientChart.opthalmologyExam?.rightConjunctiva}`}</li>
                      )}

                      {patientChart.opthalmologyExam?.leftConjunctiva && (
                        <li>{`OS: ${patientChart.opthalmologyExam?.leftConjunctiva}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasSlitLampCorneaSketch && (
                  <div className="mt-1 flex justify-around border">
                    <div>
                      <p className="text-center mb-5">OD</p>
                      <SketchDiagram
                        alt={'Right Cornea'}
                        refValue={rightCorneaSketch}
                        selectedColor={selectedColor}
                        selectedLineWeight={selectedLineWeight}
                        width="15rem"
                        height="11rem"
                        image={corneaImage}
                        imageClassname="w-60 h-44"
                        value={patientChart.opthalmologyExam.rightCorneaSketch}
                        readOnly={true}
                        onChange={() => null}
                      />
                    </div>
                    <div>
                      <p className="text-center mb-5">OS</p>
                      <SketchDiagram
                        alt={'Left Cornea'}
                        refValue={leftCorneaSketch}
                        selectedColor={selectedColor}
                        selectedLineWeight={selectedLineWeight}
                        width="15rem"
                        height="11rem"
                        image={corneaImage}
                        imageClassname="w-60 h-44"
                        value={patientChart.opthalmologyExam.leftCorneaSketch}
                        readOnly={true}
                        onChange={() => null}
                      />
                    </div>
                  </div>
                )}

                {hasSlitLampCornea && (
                  <div className="mt-1 pl-3">
                    <p className="">Cornea</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart.opthalmologyExam?.rightCornea && (
                        <li>{`OD: ${patientChart.opthalmologyExam?.rightCornea}`}</li>
                      )}

                      {patientChart.opthalmologyExam?.leftCornea && (
                        <li>{`OS: ${patientChart.opthalmologyExam?.leftCornea}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasSlitLampSclera && (
                  <div className="mt-1 pl-3">
                    <p className="">Sclera</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart.opthalmologyExam?.rightSclera && (
                        <li>{`OD: ${patientChart.opthalmologyExam?.rightSclera}`}</li>
                      )}

                      {patientChart.opthalmologyExam?.leftSclera && (
                        <li>{`OS: ${patientChart.opthalmologyExam?.leftSclera}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasSlitLampAnteriorChamber && (
                  <div className="mt-1 pl-3">
                    <p className="">Anterior Chamber</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart.opthalmologyExam?.rightAnteriorChamber && (
                        <li>{`OD: ${patientChart.opthalmologyExam?.rightAnteriorChamber}`}</li>
                      )}

                      {patientChart.opthalmologyExam?.leftAnteriorChamber && (
                        <li>{`OS: ${patientChart.opthalmologyExam?.leftAnteriorChamber}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasSlitLampIris && (
                  <div className="mt-1 pl-3">
                    <p className="">Iris</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart.opthalmologyExam?.rightIris && (
                        <li>{`OD: ${patientChart.opthalmologyExam?.rightIris}`}</li>
                      )}

                      {patientChart.opthalmologyExam?.leftIris && (
                        <li>{`OS: ${patientChart.opthalmologyExam?.leftIris}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasSlitLampLensSketch && (
                  <div className="mt-1 flex justify-around border">
                    <div>
                      <p className="text-center mb-5">OD</p>
                      <SketchDiagram
                        alt={'Right Cornea'}
                        refValue={rightLensSketch}
                        selectedColor={selectedColor}
                        selectedLineWeight={selectedLineWeight}
                        width="15rem"
                        height="11rem"
                        image={irisImage}
                        imageClassname="w-60 h-44"
                        value={patientChart.opthalmologyExam.rightLensSketch}
                        readOnly={true}
                        onChange={() => null}
                      />
                    </div>
                    <div>
                      <p className="text-center mb-5">OS</p>
                      <SketchDiagram
                        alt={'Left Cornea'}
                        refValue={leftLensSketch}
                        selectedColor={selectedColor}
                        selectedLineWeight={selectedLineWeight}
                        width="15rem"
                        height="11rem"
                        image={irisImage}
                        imageClassname="w-60 h-44"
                        value={patientChart.opthalmologyExam.leftLensSketch}
                        readOnly={true}
                        onChange={() => null}
                      />
                    </div>
                  </div>
                )}

                {hasSlitLampLens && (
                  <div className="mt-1 pl-3">
                    <p className="">Lens</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart.opthalmologyExam?.rightLens && (
                        <li>{`OD: ${patientChart.opthalmologyExam?.rightLens}`}</li>
                      )}

                      {patientChart.opthalmologyExam?.leftLens && (
                        <li>{`OS: ${patientChart.opthalmologyExam?.leftLens}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasSlitLampVitreos && (
                  <div className="mt-1 pl-3">
                    <p className="">Vitreos</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart.opthalmologyExam?.rightVitreos && (
                        <li>{`OD: ${patientChart.opthalmologyExam?.rightVitreos}`}</li>
                      )}

                      {patientChart.opthalmologyExam?.leftVitreos && (
                        <li>{`OS: ${patientChart.opthalmologyExam?.leftVitreos}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasSlitLampNote && (
                  <div className="text-sm mt-2">
                    {patientChart.opthalmologyExam.slitLampExamNote}
                  </div>
                )}
              </ul>
            </div>
          )}

          {(hasFunduscopyRetina ||
            hasFunduscopyRetinaSketch ||
            hasFunduscopyNote) && (
            <div className="text-sm mt-5 pl-4 border-l-2 border-indigo-600">
              <p className="text-base font-semibold">Funduscopy</p>
              {hasFunduscopyRetinaSketch && (
                <div className="mt-1 flex justify-around border">
                  <div>
                    <p className="text-center mb-5">OD</p>
                    <SketchDiagram
                      alt={'Right Retina'}
                      refValue={rightRetinaSketch}
                      selectedColor={selectedColor}
                      selectedLineWeight={selectedLineWeight}
                      width="15rem"
                      height="13rem"
                      image={circleImage}
                      imageClassname="w-60 h-52"
                      value={patientChart.opthalmologyExam.rightRetinaSketch}
                      readOnly={true}
                      onChange={() => null}
                    />
                  </div>
                  <div>
                    <p className="text-center mb-5">OS</p>
                    <SketchDiagram
                      alt={'Left Retian'}
                      refValue={leftRetinaSketch}
                      selectedColor={selectedColor}
                      selectedLineWeight={selectedLineWeight}
                      width="15rem"
                      height="11rem"
                      image={circleImage}
                      imageClassname="w-60 h-52"
                      value={patientChart.opthalmologyExam.leftRetinaSketch}
                      readOnly={true}
                      onChange={() => null}
                    />
                  </div>
                </div>
              )}

              <ul className="list-inside list-disc pl-3">
                {hasFunduscopyRetina && (
                  <div className="mt-1 pl-3">
                    <p className="">Retina</p>
                    {hasFunduscopyRetinaSketch && (
                      <div className="mt-1 flex justify-around border">
                        <div>
                          <p className="text-center mb-5">OD</p>
                          <SketchDiagram
                            alt={'Right Retina'}
                            refValue={rightRetinaSketch}
                            selectedColor={selectedColor}
                            selectedLineWeight={selectedLineWeight}
                            width="15rem"
                            height="13rem"
                            image={circleImage}
                            imageClassname="w-60 h-52"
                            value={
                              patientChart.opthalmologyExam.rightRetinaSketch
                            }
                            readOnly={true}
                            onChange={() => null}
                          />
                        </div>
                        <div>
                          <p className="text-center mb-5">OS</p>
                          <SketchDiagram
                            alt={'Left Retiana'}
                            refValue={leftRetinaSketch}
                            selectedColor={selectedColor}
                            selectedLineWeight={selectedLineWeight}
                            width="15rem"
                            height="11rem"
                            image={circleImage}
                            imageClassname="w-60 h-52"
                            value={
                              patientChart.opthalmologyExam.rightRetinaSketch
                            }
                            readOnly={true}
                            onChange={() => null}
                          />
                        </div>
                      </div>
                    )}

                    <ul className="list-inside list-disc pl-3">
                      {patientChart.opthalmologyExam?.rightRetina && (
                        <li>{`OD: ${patientChart.opthalmologyExam?.rightRetina}`}</li>
                      )}

                      {patientChart.opthalmologyExam?.leftRetina && (
                        <li>{`OS: ${patientChart.opthalmologyExam?.leftRetina}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasFunduscopyNote && (
                  <div className="text-sm mt-2">
                    {patientChart.opthalmologyExam.funduscopyNote}
                  </div>
                )}
              </ul>
            </div>
          )}

          {(hasOpticDisc ||
            hasOpticDiscSketch ||
            hasOpticDiscCdr ||
            hasOpticDiscNote) && (
            <div className="text-sm mt-5 pl-4 border-l-2 border-indigo-600">
              <p className="text-base font-semibold">Optic Disc</p>
              {hasOpticDiscSketch && (
                <div className="mt-1 flex justify-around">
                  <div>
                    <p className="text-center mb-5">OD</p>
                    <SketchDiagram
                      alt={'Right Optic Disc'}
                      refValue={rightOpticDiscSketch}
                      selectedColor={selectedColor}
                      selectedLineWeight={selectedLineWeight}
                      width="15rem"
                      height="13rem"
                      image={circleImage}
                      imageClassname="w-60 h-52"
                      value={patientChart.opthalmologyExam.rightOpticDiscSketch}
                      readOnly={true}
                      onChange={() => null}
                    />
                  </div>
                  <div>
                    <p className="text-center mb-5">OS</p>
                    <SketchDiagram
                      alt={'Left Optic Disc'}
                      refValue={leftOpticDiscSketch}
                      selectedColor={selectedColor}
                      selectedLineWeight={selectedLineWeight}
                      width="15rem"
                      height="11rem"
                      image={circleImage}
                      imageClassname="w-60 h-52"
                      value={patientChart.opthalmologyExam.leftOpticDiscSketch}
                      readOnly={true}
                      onChange={() => null}
                    />
                  </div>
                </div>
              )}
              <ul className="list-inside list-disc pl-3">
                {hasOpticDiscCdr && (
                  <div className="mt-1 pl-3">
                    <p className="">CDR</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart.opthalmologyExam?.rightCdr && (
                        <li>{`OD: ${patientChart.opthalmologyExam?.rightCdr}`}</li>
                      )}

                      {patientChart.opthalmologyExam?.leftCdr && (
                        <li>{`OS: ${patientChart.opthalmologyExam?.leftCdr}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasOpticDisc && (
                  <div className="mt-1 pl-3">
                    <p className="">Optic Disc</p>
                    <ul className="list-inside list-disc pl-3">
                      {patientChart.opthalmologyExam?.rightOpticDisc && (
                        <li>{`OD: ${patientChart.opthalmologyExam?.rightOpticDisc}`}</li>
                      )}

                      {patientChart.opthalmologyExam?.leftOpticDisc && (
                        <li>{`OS: ${patientChart.opthalmologyExam?.leftOpticDisc}`}</li>
                      )}
                    </ul>
                  </div>
                )}

                {hasOpticDisc && (
                  <div className="text-sm mt-2">
                    {patientChart.opthalmologyExam.opticDiscNote}
                  </div>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {(patientChart.diagnosticProcedureOrder?.diagnosticProcedures.length ??
        0) > 0 &&
        showDiagnosticProcedures && (
          <div className="text-sm mt-5">
            <div className="page-break" />
            <p className="text-xl tracking-wider text-gray-800 font-light mt-5">
              Diagnostic Procedures
            </p>

            <hr className="mt-5 mb-5" />

            {patientChart.diagnosticProcedureOrder?.diagnosticProcedures.map(
              (e, i) => {
                const images: Array<IFileUploader> =
                  e?.images.map((e: any) => ({
                    id: e?.id,
                    fileUrl: getFileUrl({
                      baseUrl: import.meta.env.APP_SERVER_URL,
                      fileName: e?.fileName,
                      hash: e?.hash,
                      extension: e?.extension,
                    }),
                    name: e?.fileName ?? '',
                    size: e?.size,
                    createdAt: e?.createdAt,
                    contentType: e?.contentType ?? '',
                  })) ?? [];

                return (
                  <div className="mt-10" key={e.id}>
                    {i !== 0 && <div className="page-break" />}
                    <div className="pl-4 border-l-2 border-indigo-600">
                      <p className="font-semibold text-lg">{`${e.diagnosticProcedureType.title}`}</p>
                      <div className="text-sm mt-2">{e.generalText}</div>

                      {images.map((image) => (
                        <div key={image.id}>
                          {i !== 0 && <div className="page-break" />}
                          <img
                            alt="Diagnostic"
                            className="rounded-lg h-auto w-full object-cover"
                            src={
                              image.fileObject !== undefined
                                ? URL.createObjectURL(image.fileObject)
                                : image.fileUrl
                            }
                          />
                          <div className="text-center text-xl mt-10 font-semibold">{`${e.diagnosticProcedureType.title} - ${image.name}`}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}

      {(patientChart.labOrder?.labs.length ?? 0) > 0 && showLabratory && (
        <div className="text-sm mt-5">
          <div className="page-break" />

          <p className="text-xl tracking-wider text-gray-800 font-light mt-5">
            Labratory
          </p>

          <hr className="mt-5 mb-5" />

          {patientChart.labOrder?.labs.map((e, i) => (
            <div key={e.id}>
              {i !== 0 && <div className="page-break" />}
              <p className="text-base font-semibold">{`${e.labType.title}`}</p>
              <div className="mt-2">
                <LabComponent
                  values={e}
                  readOnly={true}
                  forPrint={true}
                  onRefresh={() => null}
                  onSuccess={(message) => {
                    notifDispatch({
                      type: 'showNotification',
                      notifTitle: 'Success',
                      notifSubTitle: message,
                      variant: 'success',
                    });
                  }}
                  onError={(message) => {
                    notifDispatch({
                      type: 'showNotification',
                      notifTitle: 'Error',
                      notifSubTitle: message,
                      variant: 'error',
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasDiagnosis && showDiagnosis && (
        <div className="text-sm mt-2">
          <div className="page-break" />
          <p className="text-xl tracking-wider text-gray-800 font-light mt-5">
            Diagnosis
          </p>

          <hr className="my-5" />

          <div className="mt-1 pl-3">
            {patientChart.diagnoses.map((e) => (
              <div key={e?.id}>
                <ul className="list-inside list-disc pl-3">
                  <li>{`${e?.fullDescription} ${
                    e?.location && `(${e.location})`
                  } ${e?.differential ? '(Differential)' : ''}`}</li>
                </ul>
              </div>
            ))}

            {patientChart.diagnosisNote && (
              <div className="text-sm mt-2">{patientChart.diagnosisNote}</div>
            )}

            {patientChart.differentialDiagnosisNote && (
              <div className="text-sm mt-2">
                {patientChart.differentialDiagnosisNote}
              </div>
            )}
          </div>
        </div>
      )}

      {showSurgery && (
        <div className="text-sm mt-2">
          <div className="page-break" />

          <div className="text-xl tracking-wider text-gray-800 font-light mt-5">{`${surgeryQuery?.data?.surgicalProcedure?.surgicalProcedureType.title} Pre-op`}</div>

          <hr className="mt-5 mb-5" />

          <PreOpForm
            register={surgicalProcedureForm.register}
            locked={true}
            handleChanges={() => null}
          />
        </div>
      )}

      {showSurgery && (
        <div className="text-sm mt-2">
          <div className="page-break" />
          <div className="text-xl tracking-wider text-gray-800 font-light mt-5">{`${surgeryQuery?.data?.surgicalProcedure?.surgicalProcedureType.title} Intra-op`}</div>
          <hr className="mt-5 mb-5" />
          <IntraOpForm
            locked={true}
            register={surgicalProcedureForm.register}
            aclolUnplanned={
              surgeryQuery.data?.surgicalProcedure.aclolUnplanned ?? false
            }
            handleChanges={() => null}
          />
        </div>
      )}

      {showTreatment && (
        <div className="text-sm mt-2">
          <div className="page-break" />
          <div className="text-xl tracking-wider text-gray-800 font-light mt-5">{`${treatmentQuery?.data?.treatment?.treatmentType.title} Intra-op`}</div>
          <hr className="mt-5 mb-5" />
          <TreatmentForm
            locked={true}
            register={treatmentForm.register}
            handleChange={() => null}
          />
        </div>
      )}

      {(patientChart.medicalPrescriptionOrder?.medicalPrescriptions.length ??
        0) > 0 &&
        showPrescriptions && (
          <div className="text-sm mt-2">
            <div className="page-break" />
            <p className="text-xl tracking-wider text-gray-800 font-light mt-5">
              Medical Prescriptions
            </p>
            <hr className="mt-5 mb-5" />

            <MedicationTable
              readOnly
              locked={locked}
              items={
                patientChart.medicalPrescriptionOrder?.medicalPrescriptions
              }
              onPrint={() => null}
            />
          </div>
        )}

      {(patientChart.eyewearPrescriptionOrder?.eyewearPrescriptions.length ??
        0) > 0 &&
        showPrescriptions && (
          <div className="text-sm mt-2">
            <div className="page-break" />
            <p className="text-xl tracking-wider text-gray-800 font-light mt-5">
              Eyewear Prescriptions
            </p>
            <hr className="mt-5 mb-5" />

            <EyeGlassTable
              readOnly
              items={
                patientChart.eyewearPrescriptionOrder?.eyewearPrescriptions
              }
              onPrint={() => null}
            />
          </div>
        )}

      {/* {(ordersQuery.data?.orders.totalCount ?? 0) > 0 && (
        <div className="text-sm mt-5">
          <p className="text-xl tracking-wider text-gray-800 font-light">
            Orders
          </p>
          <table className="table-auto divide-y divide-gray-200 mt-4 w-full shadow-lg rounded-lg">
            <thead className="bg-teal-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                >
                  Order Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                >
                  Note
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ordersQuery.data?.orders.edges.map((e) => (
                <tr key={e?.node.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {getOrderTypeName(e?.node.orderType)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {e?.node.note}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {e?.node.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )} */}
    </div>
  );
};
