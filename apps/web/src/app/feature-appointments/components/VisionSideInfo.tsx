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
import React from 'react';
import { Query, QueryVitalSignsArgs } from '@tensoremr/models';

const GET_VISUAL_ACUITY = gql`
  query GetVisualAcuity($filter: VitalSignsFilter!) {
    vitalSigns(filter: $filter) {
      id
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
    }
  }
`;

export const VisionSideInfo: React.FC<{
  patientChartId: string | undefined;
}> = ({ patientChartId }) => {
  const { data } = useQuery<Query, QueryVitalSignsArgs>(GET_VISUAL_ACUITY, {
    variables: {
      filter: { patientChartId },
    },
  });

  const hasDistanceUncorrected =
    data?.vitalSigns?.rightDistanceUncorrected ||
    data?.vitalSigns?.leftDistanceUncorrected;

  const hasDistanceCorrected =
    data?.vitalSigns?.rightDistanceCorrected ||
    data?.vitalSigns?.leftDistanceCorrected;

  const hasDistancePinhole =
    data?.vitalSigns?.rightDistancePinhole ||
    data?.vitalSigns?.leftDistancePinhole;

  const hasNearUncorrected =
    data?.vitalSigns?.rightNearUncorrected ||
    data?.vitalSigns?.leftNearUncorrected;

  const hasNearCorrected =
    data?.vitalSigns?.rightNearCorrected || data?.vitalSigns?.leftNearCorrected;

  const hasNearPinhole =
    data?.vitalSigns?.rightNearPinhole || data?.vitalSigns?.leftNearPinhole;

  return (
    <div className="shadow overflow-hidden rounded-lg text-xs">
      <table className="w-full">
        <thead>
          <tr>
            <th
              scope="col"
              colSpan={3}
              className="px-4 py-2 bg-teal-700 text-left text-gray-50 uppercase tracking-wider"
            >
              Vision
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 p-1">
          <tr className="text-center font-bold">
            <td className="p-1"></td>
            <td className="p-1">OD</td>
            <td className="p-1">OS</td>
          </tr>

          <tr
            hidden={!hasDistanceUncorrected}
            className="text-gray-800 text-center"
          >
            <td className="p-1">D. Uncorrected</td>
            <td className="p-1">
              {data?.vitalSigns?.rightDistanceUncorrected}
            </td>
            <td className="p-1">{data?.vitalSigns?.leftDistanceUncorrected}</td>
          </tr>

          <tr
            hidden={!hasDistanceCorrected}
            className="text-gray-800 text-center"
          >
            <td className="p-1">D. Corrected</td>
            <td className="p-1">{data?.vitalSigns?.rightDistanceCorrected}</td>
            <td className="p-1">{data?.vitalSigns?.leftDistanceCorrected}</td>
          </tr>

          <tr
            hidden={!hasDistancePinhole}
            className="text-gray-800 text-center"
          >
            <td className="p-1">D. Pinhole</td>
            <td className="p-1">{data?.vitalSigns?.rightDistancePinhole}</td>
            <td className="p-1">{data?.vitalSigns?.leftDistancePinhole}</td>
          </tr>

          <tr
            hidden={!hasNearUncorrected}
            className="text-gray-800 text-center"
          >
            <td className="p-1">N. Uncorrected</td>
            <td className="p-1">{data?.vitalSigns?.rightNearUncorrected}</td>
            <td className="p-1">{data?.vitalSigns?.leftNearUncorrected}</td>
          </tr>

          <tr hidden={!hasNearCorrected} className="text-gray-800 text-center">
            <td className="p-1">N. Corrected</td>
            <td className="p-1">{data?.vitalSigns?.rightNearCorrected}</td>
            <td className="p-1">{data?.vitalSigns?.leftNearCorrected}</td>
          </tr>

          <tr hidden={!hasNearPinhole} className="text-gray-800 text-center">
            <td className="p-1">N. Pinhole</td>
            <td className="p-1">{data?.vitalSigns?.rightNearPinhole}</td>
            <td className="p-1">{data?.vitalSigns?.leftNearPinhole}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
