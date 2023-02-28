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

import React, { useState } from "react";
import {
  CheckIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { TablePagination } from "./table-pagination";
import { Button, Spinner, TextInput } from "flowbite-react";

interface Props {
  onSelect: () => void;
}

export default function WorkflowTable({ onSelect }: Props) {
  const [selectedWorkflow, setSelectedWorkflow] = useState<
    "encounters" | "tasks" | "service-requests"
  >("encounters");

  const handleNext = () => {
    console.log("Next");
  };

  const handlePrevious = () => {
    console.log("Previous");
  };

  return (
    <div className="shadow border-b border-gray-200 sm:rounded-lg">
      <div className="px-4 pt-3 bg-gray-50">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Workflow
        </p>
      </div>
      <div className="flex items-center justify-between py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        <div className="flex justify-end space-x-4 items-center">
          <Button
            onClick={() => setSelectedWorkflow("encounters")}
            gradientMonochrome={
              selectedWorkflow === "encounters" ? "teal" : "dark"
            }
          >
            <UserGroupIcon className="mr-3 h-4 w-4" />
            Encounters
          </Button>
          <Button
            onClick={() => setSelectedWorkflow("tasks")}
            gradientMonochrome={selectedWorkflow === "tasks" ? "teal" : "dark"}
            label="2"
          >
            <CheckIcon className="mr-3 h-4 w-4" />
            Tasks
          </Button>
          <Button
            onClick={() => setSelectedWorkflow("service-requests")}
            gradientMonochrome={
              selectedWorkflow === "service-requests" ? "teal" : "dark"
            }
          >
            <InboxIcon className="mr-3 h-4 w-4" />
            Service Requests
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="date"
            id="date"
            name="date"
            className="border-l-2 border-gray-200 rounded-md text-sm"
          />
          <select
            name="type"
            className=" border-l-2 border-gray-200 rounded-md text-sm"
            onChange={(evt) => {
              // TO-DO
            }}
          >
            <option value="">All Status</option>
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
            name="type"
            className=" border-l-2 border-gray-200 rounded-md text-sm"
            onChange={(evt) => {
              // TO-DO
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
          <TextInput
            id="mrn"
            type="text"
            icon={MagnifyingGlassIcon}
            placeholder="MRN"
            required={true}
            className="w-36"
          />
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th></th>
            <th
              scope="col"
              className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              Patient
            </th>
            <th
              scope="col"
              className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              Visit Type
            </th>
            <th
              scope="col"
              className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              Checked-In
            </th>
            <th
              scope="col"
              className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            ></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr className="hover:bg-gray-100 cursor-pointer"></tr>
        </tbody>
      </table>
      {false && (
        <div className="bg-white h-32 flex items-center justify-center w-full">
          <Spinner color="warning" aria-label="Encounters loading" />
        </div>
      )}
      {true && (
        <div className="bg-white shadow-md h-32 flex items-center justify-center w-full">
          <div className="m-auto flex space-x-1 text-gray-500">
            <div className="material-icons md-inbox"></div>
            <p className="text-center">Nothing here yet</p>
          </div>
        </div>
      )}
      {true && (
        <TablePagination
          totalCount={0}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  );
}
