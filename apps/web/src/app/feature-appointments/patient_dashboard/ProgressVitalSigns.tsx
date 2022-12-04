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
import { VitalSigns } from '@tensoremr/models';

interface Props {
  showEmpty: boolean;
  vitalSigns: VitalSigns;
}

const ProgressVitalSigns: React.FC<Props> = ({ vitalSigns, showEmpty }) => {
  const hasVisionDistance =
    vitalSigns?.rightDistanceUncorrected ||
    vitalSigns?.leftDistanceUncorrected ||
    vitalSigns?.rightDistancePinhole ||
    vitalSigns?.leftDistancePinhole ||
    vitalSigns?.rightDistanceCorrected ||
    vitalSigns?.leftDistanceCorrected;

  const hasVisionNear =
    vitalSigns?.rightNearUncorrected ||
    vitalSigns?.leftNearUncorrected ||
    vitalSigns?.rightNearPinhole ||
    vitalSigns?.leftNearPinhole ||
    vitalSigns?.rightNearCorrected ||
    vitalSigns?.leftNearCorrected;

  const hasIopApplanation =
    vitalSigns?.rightApplanation || vitalSigns?.leftApplanation;

  const hasIopTonopen = vitalSigns?.rightTonopen || vitalSigns?.leftTonopen;

  const hasIopDigital = vitalSigns?.rightDigital || vitalSigns?.leftDigital;

  const hasIopNoncontact =
    vitalSigns?.rightNoncontact || vitalSigns?.leftNoncontact;

  if (
    !hasVisionDistance &&
    !hasVisionNear &&
    !hasIopApplanation &&
    !hasIopTonopen &&
    !hasIopDigital &&
    !hasIopNoncontact &&
    showEmpty
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
      {(hasVisionDistance || hasVisionNear) && (
        <div className="text-sm mt-2">
          <p className="text-base font-semibold text-gray-800">Visual Acuity</p>

          <div className="mt-1 pl-3">
            {hasVisionDistance && (
              <div>
                <p className="">Distance</p>
                <ul className="list-inside list-disc pl-3">
                  {vitalSigns?.rightDistanceUncorrected && (
                    <li>{`Uncorrected (OD): ${vitalSigns?.rightDistanceUncorrected}`}</li>
                  )}

                  {vitalSigns?.leftDistanceUncorrected && (
                    <li>{`Uncorrected (OS): ${vitalSigns?.leftDistanceUncorrected}`}</li>
                  )}

                  {vitalSigns?.rightDistanceCorrected && (
                    <li>{`Corrected (OD): ${vitalSigns?.rightDistanceCorrected}`}</li>
                  )}

                  {vitalSigns?.leftDistanceCorrected && (
                    <li>{`Corrected (OS): ${vitalSigns?.leftDistanceCorrected}`}</li>
                  )}

                  {vitalSigns?.rightDistancePinhole && (
                    <li>{`Pinhole (OD): ${vitalSigns?.rightDistancePinhole}`}</li>
                  )}

                  {vitalSigns?.leftDistancePinhole && (
                    <li>{`Pinhole (OS): ${vitalSigns?.leftDistancePinhole}`}</li>
                  )}
                </ul>
              </div>
            )}

            {hasVisionNear && (
              <div>
                <p className="">Near</p>
                <ul className="list-inside list-disc pl-3">
                  {vitalSigns?.rightNearUncorrected && (
                    <li>{`Uncorrected (OD): ${vitalSigns?.rightNearUncorrected}`}</li>
                  )}

                  {vitalSigns?.leftNearUncorrected && (
                    <li>{`Uncorrected (OS): ${vitalSigns?.leftNearUncorrected}`}</li>
                  )}

                  {vitalSigns?.rightNearCorrected && (
                    <li>{`Corrected (OD): ${vitalSigns?.rightNearCorrected}`}</li>
                  )}

                  {vitalSigns?.leftNearCorrected && (
                    <li>{`Corrected (OS): ${vitalSigns?.leftNearCorrected}`}</li>
                  )}

                  {vitalSigns?.rightNearPinhole && (
                    <li>{`Pinhole (OD): ${vitalSigns?.rightNearPinhole}`}</li>
                  )}

                  {vitalSigns?.leftNearPinhole && (
                    <li>{`Pinhole (OS): ${vitalSigns?.leftNearPinhole}`}</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {(hasIopApplanation ||
        hasIopTonopen ||
        hasIopDigital ||
        hasIopNoncontact) && (
        <div className="text-sm mt-2">
          <p className="text-base font-semibold text-gray-800">IOP</p>

          {hasIopApplanation && (
            <div className="mt-1 pl-3">
              <p className="">Applanation</p>
              <ul className="list-inside list-disc pl-3">
                {vitalSigns?.rightApplanation && (
                  <li>{`OD: ${vitalSigns?.rightApplanation}`}</li>
                )}

                {vitalSigns?.leftApplanation && (
                  <li>{`OS: ${vitalSigns?.leftApplanation}`}</li>
                )}
              </ul>
            </div>
          )}

          {hasIopTonopen && (
            <div className="mt-1 pl-3">
              <p className="">Tonopen</p>
              <ul className="list-inside list-disc pl-3">
                {vitalSigns?.rightTonopen && (
                  <li>{`OD: ${vitalSigns?.rightTonopen}`}</li>
                )}

                {vitalSigns?.leftTonopen && (
                  <li>{`OS: ${vitalSigns?.leftTonopen}`}</li>
                )}
              </ul>
            </div>
          )}

          {hasIopDigital && (
            <div className="mt-1 pl-3">
              <p className="">Digital</p>
              <ul className="list-inside list-disc pl-3">
                {vitalSigns?.rightDigital && (
                  <li>{`OD: ${vitalSigns?.rightDigital}`}</li>
                )}

                {vitalSigns?.leftDigital && (
                  <li>{`OS: ${vitalSigns?.leftDigital}`}</li>
                )}
              </ul>
            </div>
          )}

          {hasIopNoncontact && (
            <div className="mt-1 pl-3">
              <p className="">Non-Contact</p>
              <ul className="list-inside list-disc pl-3">
                {vitalSigns?.rightNoncontact && (
                  <li>{`OD: ${vitalSigns?.rightNoncontact}`}</li>
                )}

                {vitalSigns?.leftNoncontact && (
                  <li>{`OS: ${vitalSigns?.leftNoncontact}`}</li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressVitalSigns;
