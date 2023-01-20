/* eslint-disable @typescript-eslint/ban-ts-comment */
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

import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Query, QueryPatientChartArgs } from "@tensoremr/models";
import { OcularMotilityOdDiagram } from "../OcularMotilityOdDiagram";
import { OcularMotilityOsDiagram } from "../OcularMotilityOsDiagram";
import { SketchDiagram } from "../SketchDiagram";
import corneaImage from "./cornea.png";
import circleImage from "./circle.png";
import { LabComponent } from "../LabComponent";
import { MedicationTable } from "../MedicationTable";
import { EyeGlassTable } from "../EyeGlassTable";
import { DiagnosticProcedureComponent } from "../DiagnosticProcedureComponent";
// @ts-ignore
import { SketchField, Tools } from "react-sketch2";
import { groupByHpiComponentType } from "@tensoremr/util";

export const GET_PATIENT_CHART = gql`
  query GetPatientChart($id: ID!, $details: Boolean) {
    patientChart(id: $id, details: $details) {
      id
      appointmentId
      diagnosisNote
      differentialDiagnosisNote
      chiefComplaintsNote
      stickieNote
      summaryNote
      rightSummarySketch
      leftSummarySketch
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
          dicomStudyUid
          modalities
        }
      }

      labOrder {
        status
        createdAt
        labs {
          id
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

      surgicalProcedure {
        id
        surgicalProcedureTypeTitle
      }
      treatment {
        id
        treatmentTypeTitle
        receptionNote
        result
      }
    }
  }
`;

interface Props {
  patientChartId: string;
  forPrint?: boolean;
  locked: boolean;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const PositiveFindings: React.FC<Props> = ({
  patientChartId,
  forPrint = false,
  locked,
  onSuccess,
  onError,
}) => {
  const { data, refetch } = useQuery<Query, QueryPatientChartArgs>(
    GET_PATIENT_CHART,
    {
      variables: {
        id: patientChartId,
        details: true,
      },
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  const [selectedColor] = useState("#000000");
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
  const rightSummarySketch = useRef<any>(null);
  const leftSummarySketch = useRef<any>(null);

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
      JSON.parse(patientChart.opthalmologyExam.rightCorneaSketch).objects
        .length > 0) ||
    (patientChart.opthalmologyExam.leftCorneaSketch &&
      JSON.parse(patientChart.opthalmologyExam.leftCorneaSketch).objects
        .length > 0);

  const hasSlitLampLensSketch =
    (patientChart.opthalmologyExam.rightLensSketch &&
      JSON.parse(patientChart.opthalmologyExam.rightLensSketch).objects.length >
        0) ||
    (patientChart.opthalmologyExam.leftLensSketch &&
      JSON.parse(patientChart.opthalmologyExam.leftLensSketch).objects.length >
        0);

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
      JSON.parse(patientChart.opthalmologyExam.rightRetinaSketch).objects
        .length > 0) ||
    (patientChart.opthalmologyExam.leftRetinaSketch &&
      JSON.parse(patientChart.opthalmologyExam.leftRetinaSketch).objects
        .length > 0);

  const hasFunduscopyNote = patientChart.opthalmologyExam.funduscopyNote;

  const hasOpticDiscCdr =
    patientChart.opthalmologyExam.rightCdr ||
    patientChart.opthalmologyExam.leftCdr;
  const hasOpticDisc =
    patientChart.opthalmologyExam.rightOpticDisc ||
    patientChart.opthalmologyExam.leftOpticDisc;

  const hasOpticDiscSketch =
    (patientChart.opthalmologyExam.rightOpticDiscSketch &&
      JSON.parse(patientChart.opthalmologyExam.rightOpticDiscSketch).objects
        .length > 0) ||
    (patientChart.opthalmologyExam.leftOpticDiscSketch &&
      JSON.parse(patientChart.opthalmologyExam.leftOpticDiscSketch).objects
        .length > 0);

  const hasOpticDiscNote = patientChart.opthalmologyExam.opticDiscNote;

  const hasDiagnosis =
    patientChart.diagnoses.length > 0 ||
    (patientChart.diagnosisNote?.length ?? 0) > 0 ||
    (patientChart.differentialDiagnosisNote?.length ?? 0) > 0;

  const hasSummaryNote = patientChart.summaryNote;

  const hasSummaryNoteSketch =
    (patientChart.rightSummarySketch &&
      JSON.parse(patientChart.rightSummarySketch).objects.length > 0) ||
    (patientChart.leftSummarySketch &&
      JSON.parse(patientChart.leftSummarySketch).objects.length > 0);

  const getOrderTypeName = (orderType: string | undefined) => {
    switch (orderType) {
      case "FOLLOW_UP":
        return "Follow-Up";
      case "PATIENT_IN_HOUSE_REFERRAL":
        return "In-House Referral";
      case "PATIENT_OUTSOURCE_REFERRAL":
        return "Outsourced Referral";
      case "TREATMENT":
        return "Treatment";
      case "SURGICAL_PROCEDURE":
        return "Surgery";
      default:
        return "";
    }
  };

  return (
    <div className="text-sm print-container">
      {patientChart.chiefComplaints?.length > 0 && (
        <div>
          <div className="mt-5 flex space-x-6 items-center">
            <div className="flex items-center space-x-2">
              <div>
                <span className="material-icons md-format_list_bulleted text-teal-600">
                  
                </span>
              </div>
              <p className="text-xl tracking-wider text-gray-800 font-light">
                Chief complaints
              </p>
            </div>
            <div style={{ height: "1px" }} className="bg-gray-300 flex-1" />
          </div>

          <div className="mt-1 ml-2">
            {patientChart.chiefComplaints.map((e) => (
              <div className="pl-4 border-l border-indigo-600 mt-3" key={e?.id}>
                <p className="text-base font-semibold">{e?.title}</p>
                <ul className="list-inside list-disc pl-3">
                  {groupByHpiComponentType(e?.hpiComponents)?.map((q) => (
                    <li key={q[0]}>{`${q[0]}: ${q[1]
                      .map((h) => h?.title.trim())
                      .join(", ")}`}</li>
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

      <div className="mt-5 flex space-x-6 items-center">
        <div className="flex items-center space-x-2">
          <div>
            <span className="material-icons md-show_chart text-teal-600"></span>
          </div>
          <p className="text-xl tracking-wider text-gray-800 font-light">
            Vital Signs
          </p>
        </div>
        <div style={{ height: "1px" }} className="bg-gray-300 flex-1" />
      </div>

      <div className="ml-2">
        {(hasVisionDistance || hasVisionNear) && (
          <div className="text-sm mt-2 pl-4 border-l border-indigo-600">
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
          <div className="text-sm mt-2 pl-4 border-l border-indigo-600">
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
          <div className="text-sm mt-2 pl-4 border-l border-indigo-600">
            <span className="text-base font-semibold">Temperature: </span>{" "}
            <span>{`${patientChart.vitalSigns?.temperature} C°`}</span>
          </div>
        )}

        {hasPulse && (
          <div className="text-sm mt-1 pl-4 border-l border-indigo-600">
            <span className="text-base font-semibold">Pulse: </span>{" "}
            <span>{`${patientChart.vitalSigns?.pulse} bpm`}</span>
          </div>
        )}

        {hasBloodPressure && (
          <div className="text-sm mt-1 pl-4 border-l border-indigo-600">
            <span className="text-base font-semibold">Blood Pressure: </span>{" "}
            <span>{`${patientChart.vitalSigns?.bloodPressureSystolic} / ${patientChart.vitalSigns?.bloodPressureDiastolic}`}</span>
          </div>
        )}

        {hasRespiratoryRate && (
          <div className="text-sm mt-1 pl-4 border-l border-indigo-600">
            <span className="text-base font-semibold">Respiratory Rate: </span>{" "}
            <span>{`${patientChart.vitalSigns?.respiratoryRate} rpm`}</span>
          </div>
        )}

        {hasOxygenSaturation && (
          <div className="text-sm mt-1 pl-4 border-l border-indigo-600">
            <span className="text-base font-semibold">Oxygen Saturation: </span>{" "}
            <span>{`${patientChart.vitalSigns?.oxygenSaturation}%`}</span>
          </div>
        )}

        {hasHeight && (
          <div className="text-sm mt-1 pl-4 border-l border-indigo-600">
            <span className="text-base font-semibold">Height: </span>{" "}
            <span>{`${patientChart.vitalSigns?.height} cm`}</span>
          </div>
        )}

        {hasWeight && (
          <div className="text-sm mt-1 pl-4 border-l border-indigo-600">
            <span className="text-base font-semibold">Weight: </span>{" "}
            <span>{`${patientChart.vitalSigns?.weight} kg`}</span>
          </div>
        )}

        {hasBmi && (
          <div className="text-sm mt-1 pl-4 border-l border-indigo-600">
            <span className="text-base font-semibold">BMI: </span>{" "}
            <span>{`${patientChart.vitalSigns?.bmi}`}</span>
          </div>
        )}
      </div>

      <div className="page-break" />

      <div className="mt-5 flex space-x-6 items-center">
        <div className="flex items-center space-x-2">
          <div>
            <span className="material-icons text-teal-600 md-find_in_page"></span>
          </div>
          <p className="text-xl tracking-wider text-gray-800 font-light">
            Physical Examination
          </p>
        </div>
        <div style={{ height: "1px" }} className="bg-gray-300 flex-1" />
      </div>

      <div className="ml-2">
        <ul className="list-inside list-disc pl-4 border-l border-indigo-600">
          {patientChart.physicalExamFindings.map((e) => (
            <li key={e?.id}>
              <span className="font-semibold">{e?.examCategory.title}: </span>
              <span>{`${e?.abnormal ? "Abnormal, " : "Normal, "} ${
                e?.note
              }`}</span>
            </li>
          ))}
        </ul>

        {(hasExternalExamLacrimal ||
          hasExternalExamLids ||
          hasExternalExamOrbits ||
          hasExternalExamNote) && (
          <div className="text-sm mt-5 pl-4 border-l border-indigo-600">
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
          <div className="text-sm mt-5 pl-4 border-l border-indigo-600">
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
          <div className="text-sm mt-5 pl-4 border-l border-indigo-600">
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
          <div className="text-sm mt-5 pl-4 border-l border-indigo-600">
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
          <div className="text-sm mt-5 pl-4 border-l border-indigo-600">
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
                      alt={"Right Cornea"}
                      refValue={rightCorneaSketch}
                      selectedColor={selectedColor}
                      selectedLineWeight={selectedLineWeight}
                      width="18em"
                      height="11rem"
                      image={corneaImage}
                      imageClassname="w-64 h-48"
                      value={patientChart.opthalmologyExam.rightCorneaSketch}
                      readOnly={true}
                      onChange={() => null}
                    />
                  </div>
                  <div>
                    <p className="text-center mb-5">OS</p>
                    <SketchDiagram
                      alt={"Left Cornea"}
                      refValue={leftCorneaSketch}
                      selectedColor={selectedColor}
                      selectedLineWeight={selectedLineWeight}
                      width="18em"
                      height="11rem"
                      image={corneaImage}
                      imageClassname="w-64 h-48"
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
                    <div className="outer-circle">
                      <div className="inner-circle">
                        <SketchField
                          ref={rightLensSketch}
                          width="150px"
                          height="150px"
                          className="sketch-field"
                          tool={Tools.Pencil}
                          lineColor={selectedColor}
                          lineWidth={selectedLineWeight}
                          value={patientChart.opthalmologyExam.rightLensSketch}
                          disabled={true}
                          onChange={() => null}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-center mb-5">OS</p>
                    <div className="outer-circle">
                      <div className="inner-circle">
                        <SketchField
                          ref={leftLensSketch}
                          width="150px"
                          height="150px"
                          className="sketch-field"
                          tool={Tools.Pencil}
                          lineColor={selectedColor}
                          lineWidth={selectedLineWeight}
                          value={patientChart.opthalmologyExam.leftLensSketch}
                          disabled={true}
                          onChange={() => null}
                        />
                      </div>
                    </div>
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
          <div className="text-sm mt-5 pl-4 border-l border-indigo-600">
            <p className="text-base font-semibold">Funduscopy</p>

            <ul className="list-inside list-disc pl-3">
              {hasFunduscopyRetina && (
                <div className="mt-1 pl-3">
                  <p className="">Retina</p>

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

              {hasFunduscopyRetinaSketch && (
                <div className="mt-1 flex justify-around border">
                  <div>
                    <p className="text-center mb-5">OD</p>
                    <SketchField
                      ref={rightRetinaSketch}
                      width="200px"
                      height="200px"
                      style={{
                        border: "1px solid #7F7F7F",
                        borderRadius: "50%",
                      }}
                      tool={Tools.Pencil}
                      lineColor={selectedColor}
                      lineWidth={selectedLineWeight}
                      value={patientChart.opthalmologyExam.rightRetinaSketch}
                      readOnly={true}
                      onChange={() => null}
                    />
                  </div>
                  <div>
                    <p className="text-center mb-5">OS</p>
                    <SketchField
                      ref={leftRetinaSketch}
                      width="200px"
                      height="200px"
                      style={{
                        border: "1px solid #7F7F7F",
                        borderRadius: "50%",
                      }}
                      tool={Tools.Pencil}
                      lineColor={selectedColor}
                      lineWidth={selectedLineWeight}
                      value={patientChart.opthalmologyExam.leftRetinaSketch}
                      readOnly={true}
                      onChange={() => null}
                    />
                  </div>
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
          <div className="text-sm mt-5 pl-4 border-l border-indigo-600">
            <p className="text-base font-semibold">Optic Disc</p>
            {hasOpticDiscSketch && (
              <div className="mt-1 flex justify-around">
                <div>
                  <p className="text-center mb-5">OD</p>
                  <SketchField
                    ref={rightOpticDiscSketch}
                    width="150px"
                    height="150px"
                    style={{
                      border: "1px solid #7F7F7F",
                      borderRadius: "50%",
                    }}
                    tool={Tools.Pencil}
                    lineColor={selectedColor}
                    lineWidth={selectedLineWeight}
                    value={patientChart.opthalmologyExam.rightOpticDiscSketch}
                    readOnly={true}
                    onChange={() => null}
                  />
                </div>
                <div>
                  <p className="text-center mb-5">OS</p>
                  <SketchField
                    ref={leftOpticDiscSketch}
                    width="150px"
                    height="150px"
                    style={{
                      border: "1px solid #7F7F7F",
                      borderRadius: "50%",
                    }}
                    tool={Tools.Pencil}
                    lineColor={selectedColor}
                    lineWidth={selectedLineWeight}
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

      {(patientChart.diagnosticProcedureOrder?.diagnosticProcedures.length ??
        0) > 0 && (
        <div className="text-sm mt-5">
          <div className="page-break" />

          <div className="mt-5 flex space-x-6 items-center">
            <div className="flex items-center space-x-2">
              <div>
                <span className="material-icons text-teal-600 md-airline_seat_recline_normal">
                  
                </span>
              </div>
              <p className="text-xl tracking-wider text-gray-800 font-light">
                Diagnostic Procedures
              </p>
            </div>
            <div style={{ height: "1px" }} className="bg-gray-300 flex-1" />
          </div>

          {patientChart.diagnosticProcedureOrder?.diagnosticProcedures.map(
            (e, i) => (
              <div className="mt-5 ml-2" key={e.id}>
                {i !== 0 && <div className="page-break" />}
                <div className="pl-4 border-l border-indigo-600">
                  <p className="font-semibold text-lg">{`${e.diagnosticProcedureType.title}`}</p>
                  <div className="mt-2">
                    <DiagnosticProcedureComponent
                      values={e}
                      readOnly={true}
                      onRefersh={() => null}
                      onSuccess={(message) => onSuccess(message)}
                      onError={(message) => onError(message)}
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {(patientChart.labOrder?.labs.length ?? 0) > 0 && (
        <div className="text-sm mt-5">
          <div className="mt-5 flex space-x-6 items-center">
            <div className="flex items-center space-x-2">
              <div>
                <span className="material-icons text-teal-600 md-biotech"></span>
              </div>
              <p className="text-xl tracking-wider text-gray-800 font-light">
                Labratory
              </p>
            </div>
            <div style={{ height: "1px" }} className="bg-gray-300 flex-1" />
          </div>

          {patientChart.labOrder?.labs.map((e, i) => (
            <div className="pl-4 border-l border-indigo-600" key={e.id}>
              {i !== 0 && <div className="page-break" />}
              <p className="text-base font-semibold">{`${e.labType.title}`}</p>
              <div className="mt-2 ml-2">
                <LabComponent
                  values={e}
                  readOnly={true}
                  onRefresh={() => null}
                  onSuccess={(message) => onSuccess(message)}
                  onError={(message) => onError(message)}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {patientChart.surgicalProcedure.id.toString() !== "0" && (
        <div className="text-sm mt-5">
          <div className="mt-5 flex space-x-6 items-center">
            <div className="flex items-center space-x-2">
              <div>
                <span className="material-icons text-teal-600 md-airline_seat_flat">
                  
                </span>
              </div>
              <p className="text-xl tracking-wider text-gray-800 font-light">
                {`${patientChart.surgicalProcedure.surgicalProcedureTypeTitle} Surgery`}
              </p>
            </div>
            <div style={{ height: "1px" }} className="bg-gray-300 flex-1" />
          </div>

          <div
            onClick={() => {
              // history.push(
              //   `/appointments/${patientChart.appointmentId}/intra-op`
              // );
            }}
            className="ml-8 mt-2 text-blue-700"
          >
            Open full chart to see results
          </div>
        </div>
      )}

      {patientChart.treatment.id.toString() !== "0" && (
        <div className="text-sm mt-5">
          <div className="mt-5 flex space-x-6 items-center">
            <div className="flex items-center space-x-2">
              <div>
                <span className="material-icons text-teal-600 md-healing"></span>
              </div>
              <p className="text-xl tracking-wider text-gray-800 font-light">
                {`${patientChart.treatment.treatmentTypeTitle} Treatment`}
              </p>
            </div>
            <div style={{ height: "1px" }} className="bg-gray-300 flex-1" />
          </div>

          <div className="ml-8 mt-2">
            <ul>
              {patientChart.treatment.receptionNote && (
                <li>
                  <span className="font-semibold">Note:</span>{" "}
                  {patientChart.treatment.receptionNote}
                </li>
              )}
              {patientChart.treatment.result && (
                <li>
                  <span className="font-semibold">Result:</span>{" "}
                  {patientChart.treatment.result}
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {hasDiagnosis && (
        <div className="text-sm mt-2">
          <div className="page-break" />

          <div className="mt-5 flex space-x-6 items-center">
            <div className="flex items-center space-x-2">
              <div>
                <span className="material-icons text-teal-600 md-fact_check"></span>
              </div>
              <p className="text-xl tracking-wider text-gray-800 font-light">
                Diagnosis
              </p>
            </div>
            <div style={{ height: "1px" }} className="bg-gray-300 flex-1" />
          </div>

          <div className="mt-1 ml-2">
            {patientChart.diagnoses.map((e) => (
              <div key={e?.id}>
                <ul className="list-inside list-disc pl-3">
                  <li>{`${e?.fullDescription} ${
                    e?.location && `(${e.location})`
                  } ${e?.differential ? "(Differential)" : ""}`}</li>
                </ul>
              </div>
            ))}

            {patientChart.diagnosisNote && (
              <div
                dangerouslySetInnerHTML={{
                  __html: patientChart.diagnosisNote,
                }}
                className="text-sm mt-2 ml-2"
              />
            )}

            {patientChart.differentialDiagnosisNote && (
              <div
                dangerouslySetInnerHTML={{
                  __html: patientChart.differentialDiagnosisNote,
                }}
                className="text-sm mt-2 ml-2"
              />
            )}
          </div>
        </div>
      )}

      {(patientChart.medicalPrescriptionOrder?.medicalPrescriptions.length ??
        0) > 0 && (
        <div className="text-sm mt-2">
          <div className="page-break" />

          <div className="mt-5 flex space-x-6 items-center">
            <div className="flex items-center space-x-2">
              <div>
                <span className="material-icons text-teal-600 md-local_pharmacy">
                  
                </span>
              </div>
              <p className="text-xl tracking-wider text-gray-800 font-light">
                Medical Prescriptions
              </p>
            </div>
            <div style={{ height: "1px" }} className="bg-gray-300 flex-1" />
          </div>
          <div className="ml-2">
            <MedicationTable
              readOnly
              items={
                patientChart.medicalPrescriptionOrder?.medicalPrescriptions
              }
              onPrint={() => null}
              locked={locked}
            />
          </div>
        </div>
      )}

      {(patientChart.eyewearPrescriptionOrder?.eyewearPrescriptions.length ??
        0) > 0 && (
        <div className="text-sm mt-2">
          <div className="page-break" />

          <div className="mt-5 flex space-x-6 items-center">
            <div className="flex items-center space-x-2">
              <div>
                <span className="material-icons text-teal-600 md-local_pharmacy">
                  
                </span>
              </div>
              <p className="text-xl tracking-wider text-gray-800 font-light">
                Eyewear Prescriptions
              </p>
            </div>
            <div style={{ height: "1px" }} className="bg-gray-300 flex-1" />
          </div>

          <div className="ml-2">
            <EyeGlassTable
              readOnly
              items={
                patientChart.eyewearPrescriptionOrder?.eyewearPrescriptions
              }
              onPrint={() => null}
            />
          </div>
        </div>
      )}

      {(hasSummaryNote || hasSummaryNoteSketch) && (
        <div>
          {hasSummaryNoteSketch && (
            <div className="mt-5 flex justify-around">
              <div>
                <p className="text-center mb-5">OD</p>
                <SketchDiagram
                  alt={"Right Summary Sketch"}
                  refValue={rightSummarySketch}
                  selectedColor={selectedColor}
                  selectedLineWeight={selectedLineWeight}
                  width="15rem"
                  height="13rem"
                  image={circleImage}
                  imageClassname="w-60 h-52"
                  value={patientChart.rightSummarySketch}
                  readOnly={true}
                  onChange={() => null}
                />
              </div>
              <div>
                <p className="text-center mb-5">OS</p>
                <SketchDiagram
                  alt={"Left Summary Sketch"}
                  refValue={leftSummarySketch}
                  selectedColor={selectedColor}
                  selectedLineWeight={selectedLineWeight}
                  width="15rem"
                  height="11rem"
                  image={circleImage}
                  imageClassname="w-60 h-52"
                  value={patientChart.leftSummarySketch}
                  readOnly={true}
                  onChange={() => null}
                />
              </div>
            </div>
          )}

          {hasSummaryNote && (
            <div className="text-sm mt-5">
              <div className="mt-5 flex space-x-6 items-center">
                <div className="flex items-center space-x-2">
                  <div>
                    <span className="material-icons text-teal-600 md-card_membership">
                      
                    </span>
                  </div>
                  <p className="text-xl tracking-wider text-gray-800 font-light">
                    Summary
                  </p>
                </div>
                <div style={{ height: "1px" }} className="bg-gray-300 flex-1" />
              </div>

              <div className="ml-8 mt-2 text-base">
                {patientChart.summaryNote}
              </div>
            </div>
          )}
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
