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

import { ReactElement } from "react";
import { EncounterLayout } from "..";
import { NextPageWithLayout } from "../../../_app";

const Medications: NextPageWithLayout = () => {
  return (
    <div className="h-screen overflow-y-auto mb-10 bg-white p-4 rounded-sm shadow-md">
      <p className="text-2xl text-gray-800 font-bold font-mono">Medications</p>

      <hr className="mt-3" />
      <div>
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-4">
            <select
              name="type"
              className=" border-l-2 border-gray-200 rounded-md text-sm"
            >
              <option value="">All Types</option>
              <option value="AMB">Outpatient</option>
              <option value="EMER">Emergency</option>
              <option value="FLD">Field</option>
              <option value="HH">Home Health</option>
              <option value="IMP">Inpatient</option>
              <option value="OBSENC">Observation</option>
              <option value="PRENC">Pre-Admission</option>
              <option value="SS">Shory Stay</option>
              <option value="VR">Virtual</option>
            </select>
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-50">
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Service
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Patient
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Participants
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3  text-left text-xs text-gray-500 uppercase tracking-wider"
              ></th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

Medications.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default Medications;
