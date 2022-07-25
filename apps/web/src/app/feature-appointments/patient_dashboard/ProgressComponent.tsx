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

import React from 'react';
import { PatientChart } from '@tensoremr/models';
import ProgressVitalSigns from './ProgressVitalSigns';

export const ProgressComponent: React.FC<{
  patientChart: PatientChart;
}> = ({ patientChart }) => {
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

  const hasIopApplanation =
    patientChart.vitalSigns?.rightApplanation ||
    patientChart.vitalSigns?.leftApplanation;

  const hasIopTonopen =
    patientChart.vitalSigns?.rightTonopen ||
    patientChart.vitalSigns?.leftTonopen;

  const hasIopDigital =
    patientChart.vitalSigns?.rightDigital ||
    patientChart.vitalSigns?.leftDigital;

  const hasIopNoncontact =
    patientChart.vitalSigns?.rightNoncontact ||
    patientChart.vitalSigns?.leftNoncontact;

  const hasLabOrders = (patientChart.labOrder?.labs.length ?? 0) > 0;
  const hasDiagnosticOrders =
    (patientChart.diagnosticProcedureOrder?.diagnosticProcedures.length ?? 0) >
    0;
  const hasSurgicalOrders =
    (patientChart.surgicalOrder?.surgicalProcedures.length ?? 0) > 0;
  const hasTreatmentOrders =
    (patientChart.treatmentOrder?.treatments.length ?? 0) > 0;
  const hasReferralOrders =
    (patientChart.referralOrder?.referrals.length ?? 0) > 0;
  const hasFollowUpOrders =
    (patientChart.followUpOrder?.followUps.length ?? 0) > 0;

  if (
    !hasVisionDistance &&
    !hasVisionNear &&
    !hasIopApplanation &&
    !hasIopTonopen &&
    !hasIopDigital &&
    !hasIopNoncontact &&
    !hasLabOrders &&
    !hasDiagnosticOrders &&
    !hasSurgicalOrders &&
    !hasTreatmentOrders &&
    !hasReferralOrders &&
    !hasFollowUpOrders &&
    (patientChart.medicalPrescriptionOrder?.medicalPrescriptions.length ??
      0) === 0 &&
    !patientChart.summaryNote
  ) {
    return (
      <div className="flex justify-center items-center my-4">
        <div className="flex space-x-1 text-gray-400">
          <span className="material-icons">hourglass_empty</span>
          <p>Empty</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProgressVitalSigns
        vitalSigns={patientChart.vitalSigns}
        showEmpty={false}
      />

      {patientChart.diagnoses.filter((e) => e?.differential === false).length >
        0 && (
        <div className="text-sm mt-2">
          <p className="text-base font-semibold text-gray-800">Diagnosis</p>
          <div className="mt-1 pl-3">
            <ul className="list-inside list-disc pl-3">
              {patientChart.diagnoses
                .filter((e) => e?.differential === false)
                .map((e) => (
                  <li key={e?.id}>{`${e?.fullDescription}, ${e?.location}`}</li>
                ))}
            </ul>
          </div>
        </div>
      )}

      {(hasDiagnosticOrders ||
        hasLabOrders ||
        hasSurgicalOrders ||
        hasTreatmentOrders ||
        hasReferralOrders ||
        hasFollowUpOrders) && (
        <div className="text-sm mt-2">
          <p className="text-base font-semibold text-gray-800">Plan</p>
          <div className="mt-1 pl-3">
            <ul className="list-inside list-disc pl-3">
              {hasDiagnosticOrders && (
                <li>
                  <span className="font-semibold">Diagnostic Procedures: </span>
                  <span>
                    {patientChart.diagnosticProcedureOrder?.diagnosticProcedures
                      .map((e) => e.diagnosticProcedureTypeTitle)
                      .join(', ')}
                  </span>
                </li>
              )}

              {hasLabOrders && (
                <li>
                  <span className="font-semibold">Lab: </span>
                  <span>
                    {patientChart.labOrder?.labs
                      .map((e) => e.labTypeTitle)
                      .join(', ')}
                  </span>
                </li>
              )}

              {hasSurgicalOrders && (
                <li>
                  <span className="font-semibold">Surgery: </span>
                  <span>
                    {patientChart.surgicalOrder?.surgicalProcedures
                      .map((e) => e.surgicalProcedureTypeTitle)
                      .join(', ')}
                  </span>
                </li>
              )}

              {hasTreatmentOrders && (
                <li>
                  <span className="font-semibold">Treatments: </span>
                  <span>
                    {patientChart.treatmentOrder?.treatments
                      .map((e) => e.treatmentTypeTitle)
                      .join(', ')}
                  </span>
                </li>
              )}

              {hasFollowUpOrders && (
                <li>
                  <span className="font-semibold">Follow Ups: </span>
                  <span>
                    {patientChart.followUpOrder?.followUps
                      .map((e) => e.receptionNote)
                      .join(', ')}
                  </span>
                </li>
              )}

              {hasReferralOrders && (
                <li>
                  <span className="font-semibold">Referrals: </span>
                  <span>
                    {'Dr. ' +
                      patientChart.referralOrder?.referrals
                        .map((e) => e.referredToName)
                        .join(', ')}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {(patientChart.medicalPrescriptionOrder?.medicalPrescriptions.length ??
        0) > 0 && (
        <div className="text-sm mt-2">
          <p className="text-base font-semibold text-gray-800">Prescriptions</p>
          <div className="mt-1 pl-3">
            <ul className="list-inside list-disc pl-3">
              {patientChart.medicalPrescriptionOrder?.medicalPrescriptions.map(
                (e) => (
                  <li key={e?.id}>{`${e?.medication}, ${e?.sig}`}</li>
                )
              )}
            </ul>
          </div>
        </div>
      )}

      <div className="text-sm mt-4">{patientChart.summaryNote}</div>
    </div>
  );
};
