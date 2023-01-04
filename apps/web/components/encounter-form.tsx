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

import useSWR from "swr";
import {
  getEncounterStatuses,
  getEncounterTypes,
  getServiceTypes,
} from "../_api";
import Select from "react-select";

interface Props {
  onCancel: () => void;
}

const encounterTypes = [
  { value: "AMB", label: "Outpatient" },
  { value: "EMER", label: "Emergency" },
  { value: "FLD", label: "Field" },
  { value: "HH", label: "Home health" },
  { value: "OBSENC", label: "Observation" },
  { value: "PRENC", label: "Pre-admission" },
  { value: "SS", label: "Short Stay" },
  { value: "VR", label: "Virtual" },
];

export default function EncounterForm({ onCancel }: Props) {
  const serviceTypes =
    useSWR("serviceTypes", () =>
      getServiceTypes(process.env.STORYBOOK_APP_SERVER_URL)
    )?.data?.data?.concept?.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const encounterStatuses =
    useSWR("encounterStatuses", () =>
      getEncounterStatuses(process.env.STORYBOOK_FHIR_URL)
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  return (
    <div className="my-10 mx-8">
      <form>
        <div className="float-right">
          <button onClick={onCancel}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-8 w-8 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="text-xl font-extrabold text-teal-800">New Encounter</p>

        <div className="mt-4">
          <label className="block text-gray-700 ">Type</label>
          <Select
            options={encounterTypes}
            placeholder="Encounter Type"
            className="mt-1"
            // value={values.serviceType}
            onChange={(evt) => {
              //setValue("serviceType", evt);
            }}
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 ">Service Type</label>
          <Select
            options={serviceTypes}
            placeholder="Service Type"
            className="mt-1"
            // value={values.serviceType}
            onChange={(evt) => {
              //setValue("serviceType", evt);
            }}
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 ">Status</label>
          <Select
            options={encounterStatuses}
            placeholder="Encounter Status"
            className="mt-1"
            // value={values.serviceType}
            onChange={(evt) => {
              //setValue("serviceType", evt);
            }}
          />
        </div>
      </form>
    </div>
  );
}
