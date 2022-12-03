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

const GET_IOP = gql`
  query GetIop($filter: VitalSignsFilter!) {
    vitalSigns(filter: $filter) {
      id
      rightApplanation
      leftApplanation
      rightTonopen
      leftTonopen
      rightDigital
      leftDigital
      rightNoncontact
      leftNoncontact
      rightSchotzTonometer
      leftSchotzTonometer
    }
  }
`;

export const IopSideInfo: React.FC<{ patientChartId: string | undefined }> = ({
  patientChartId,
}) => {
  const { data } = useQuery<Query, QueryVitalSignsArgs>(GET_IOP, {
    variables: {
      filter: { patientChartId },
    },
  });

  const hasApplanation =
    data?.vitalSigns?.rightApplanation || data?.vitalSigns?.leftApplanation;
  const hasTonopen =
    data?.vitalSigns?.rightTonopen || data?.vitalSigns?.leftTonopen;
  const hasDigital =
    data?.vitalSigns?.rightDigital || data?.vitalSigns?.leftDigital;
  const hasNonContact =
    data?.vitalSigns?.rightNoncontact || data?.vitalSigns?.leftNoncontact;

  const hasSchotzTonometer =
    data?.vitalSigns.rightSchotzTonometer ||
    data?.vitalSigns.leftSchotzTonometer;

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
              IOP
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 p-1">
          <tr className="text-center font-bold">
            <td className="p-1">{''}</td>
            <td className="p-1">OD</td>
            <td className="p-1">OS</td>
          </tr>

          <tr hidden={!hasApplanation} className="text-gray-800 text-center">
            <td className="p-1">Applanation</td>
            <td className="p-1">{data?.vitalSigns?.rightApplanation}</td>
            <td className="p-1">{data?.vitalSigns?.leftApplanation}</td>
          </tr>

          <tr hidden={!hasTonopen} className="text-gray-800 text-center">
            <td className="p-1">Tonopen</td>
            <td className="p-1">{data?.vitalSigns?.rightTonopen}</td>
            <td className="p-1">{data?.vitalSigns?.leftTonopen}</td>
          </tr>

          <tr hidden={!hasDigital} className="text-gray-800 text-center">
            <td className="p-1">Digital</td>
            <td className="p-1">{data?.vitalSigns?.rightDigital}</td>
            <td className="p-1">{data?.vitalSigns?.leftDigital}</td>
          </tr>

          <tr hidden={!hasNonContact} className="text-gray-800 text-center">
            <td className="p-1">Non-Contact</td>
            <td className="p-1">{data?.vitalSigns?.rightNoncontact}</td>
            <td className="p-1">{data?.vitalSigns?.leftNoncontact}</td>
          </tr>

          <tr hidden={!hasSchotzTonometer} className="text-gray-800 text-center">
            <td className="p-1">Schotz Tonometer</td>
            <td className="p-1">{data?.vitalSigns?.rightSchotzTonometer}</td>
            <td className="p-1">{data?.vitalSigns?.leftSchotzTonometer}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
