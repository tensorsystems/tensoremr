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

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { TextInput } from "flowbite-react";
import { debounce } from "lodash";
import { useRef } from "react";

export interface IEncounterFilterFields {
  date?: string;
  type?: string;
  status?: string;
  practitioner?: string;
  mrn?: string;
  accessionId?: string;
}

interface Props {
  params: IEncounterFilterFields;
  onChange: (value: any) => void;
  practitioners: any;
}

export default function EncounterTableFilters({
  params,
  practitioners,
  onChange,
}: Props) {
  const mrnDebouncedSearch = useRef(
    debounce(async (mrn) => {
      onChange({ mrn });
    }, 500)
  ).current;

  const accessionIdDebouncedSearch = useRef(
    debounce(async (accessionId) => {
      onChange({ accessionId });
    }, 500)
  ).current;

  return (
    <div className="flex items-center space-x-4">
      <select
        name="type"
        value={params.type}
        className=" border-l-2 border-gray-200 rounded-md text-sm"
        onChange={(evt) => {
          if (evt.target.value === "") {
            onChange({ type: "" });
          } else {
            onChange({ type: evt.target.value });
          }
        }}
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
      <select
        name="status"
        value={params.status}
        className=" border-l-2 border-gray-200 rounded-md text-sm"
        onChange={(evt) => {
          if (evt.target.value === "") {
            onChange({ status: "" });
          } else {
            onChange({ status: evt.target.value });
          }
        }}
      >
        <option value="">All status</option>
        <option value="planned">Planned</option>
        <option value="arrived">Arrived</option>
        <option value="triaged">Triaged</option>
        <option value="in-progress">In-Progress</option>
        <option value="onleave">Onleave</option>
        <option value="finished">Finished</option>
        <option value="cancelled">Cancelled</option>
        <option value="entered-in-error">Entered-In-Error</option>
        <option value="unknown">Unknown</option>
      </select>
      <input
        type="date"
        id="date"
        name="date"
        value={params.date}
        className="border-l-2 border-gray-200 rounded-md text-sm"
        onChange={(evt) => {
          onChange({ date: evt.target.value });
        }}
      />
      <select
        name="actor"
        className="ml-6 border-l-2 border-gray-200 rounded-md text-sm"
        value={params.practitioner}
        onChange={(evt) => {
          if (evt.target.value === "") {
            onChange({ practitioner: "" });
          } else {
            onChange({ practitioner: evt.target.value });
          }
        }}
      >
        <option value={""}>All practitioners</option>
        {practitioners.map((e) => (
          <option key={e.value} value={e.value}>
            {e.label}
          </option>
        ))}
      </select>
      <div className="left-1/2 -ml-0.5 w-[1px] h-6 bg-gray-400"></div>
      <div>
        <TextInput
          id="mrn"
          type="text"
          icon={MagnifyingGlassIcon}
          placeholder="Accession ID"
          required={true}
          className="w-36"
          onChange={(evt) => accessionIdDebouncedSearch(evt.target.value)}
        />
      </div>
      <div>
        <TextInput
          id="mrn"
          type="text"
          icon={MagnifyingGlassIcon}
          placeholder="MRN"
          required={true}
          className="w-36"
          onChange={(evt) => mrnDebouncedSearch(evt.target.value)}
        />
      </div>
    </div>
  );
}
