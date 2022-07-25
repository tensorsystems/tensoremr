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

import { useQuery } from '@apollo/client';
import React from 'react';
import { MEDICATION_PRESCRIPTIONS } from '@tensoremr/util';
import { Query, QuerySearchMedicalPrescriptionsArgs } from '@tensoremr/models';

export const MedicationSideInfo: React.FC<{
  patientId: string | undefined;
}> = ({ patientId }) => {
  const { data } = useQuery<Query, QuerySearchMedicalPrescriptionsArgs>(
    MEDICATION_PRESCRIPTIONS,
    {
      variables: {
        page: { page: 0, size: 20 },
        filter: { patientId, status: 'Active' },
      },
    }
  );

  return (
    <div className="shadow overflow-hidden rounded-lg text-xs">
      <table className="w-full">
        <thead>
          <tr>
            <th
              scope="col"
              colSpan={1}
              className="px-3 py-2 bg-teal-700 text-left text-gray-50 uppercase tracking-wider"
            >
              Active Medications
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 p-2">
          {data?.searchMedicalPrescriptions.edges.map((e) => (
            <tr key={e?.node.id} className="text-gray-800">
              <td className="p-2">{e?.node.medication}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
