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

import { Encounter } from "fhir/r4";
import React, { useState } from "react";
import { parseEncounterId } from "../util/fhir";
import FhirPatientName from "./fhir-patient-name";
import { Transition } from "@headlessui/react";
import EncounterDetails from "../pages/encounters/encounter-details";
import { ArrowDownCircleIcon, MapPinIcon } from "@heroicons/react/24/outline";
import cn from "classnames";
import { Button, Button as FlowButton, Spinner } from "flowbite-react";
import { TablePagination } from "./table-pagination";
import { FolderOpenIcon } from "@heroicons/react/24/solid";

interface Props {
  isLoading: boolean;
  isValidating: boolean;
  totalCount?: number;
  encounters: Encounter[];
  handleNext: () => void;
  handlePrev: () => void;
  onOpenChart?: (encounterId: string) => void;
}

export default function EncountersTable({
  isLoading,
  isValidating,
  encounters,
  totalCount,
  handleNext,
  handlePrev,
  onOpenChart,
}: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number>(-1);

  return (
    <div>
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
        {!isLoading && !isValidating && (
          <tbody className="bg-white divide-y divide-gray-200">
            {encounters.map((e, i) => (
              <React.Fragment key={e?.id}>
                <tr
                  className="hover:bg-gray-100 cursor-pointer text-sm text-gray-900"
                  onClick={() => {
                    if (expandedIdx === i) {
                      setExpandedIdx(-1);
                    } else {
                      setExpandedIdx(i);
                    }
                  }}
                >
                  <td className="px-6 py-4">
                    {parseEncounterId(e?.identifier ?? [])}
                  </td>
                  <td className="px-6 py-4">{e?.class?.display}</td>
                  <td className="px-6 py-4">
                    {e?.type
                      ?.map((t) => t.coding.map((c) => c.display).join(", "))
                      .join(", ")}
                  </td>
                  <td className="px-6 py-4">
                    {e?.subject ? (
                      <FhirPatientName
                        patientId={e.subject.reference.split("/")[1]}
                      />
                    ) : (
                      "Unknown"
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {e?.location
                      ?.map((l) => l.location?.display ?? "")
                      .join(", ")}
                  </td>
                  <td className="px-6 py-4">{e?.status}</td>
                  <td className="px-6 py-4 flex items-center justify-center">
                    {expandedIdx === i ? (
                      <p className="material-icons md-expand_less"></p>
                    ) : (
                      <p className="material-icons md-expand_more"></p>
                    )}
                  </td>
                </tr>
                <Transition.Root
                  show={expandedIdx === i}
                  as={React.Fragment}
                  enter="ease-in duration-700"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-out duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <tr>
                    <td
                      colSpan={8}
                      className="px-20 py-4 text-sm bg-teal-50  shadow-inner rounded-md rounded-b"
                    >
                      <div className="flex justify-between">
                        <div>
                          <EncounterDetails encounter={e} />
                          <div className="mt-4">
                            <Button
                              gradientMonochrome="teal"
                              onClick={() => {
                                onOpenChart(e?.id);
                              }}
                            >
                              <FolderOpenIcon className="mr-2 h-5 w-5" />
                              Open Chart
                            </Button>
                          </div>
                        </div>

                        <div>
                          <ol className="relative border-l border-gray-200 dark:border-gray-700 mt-4 ml-3">
                            {e.location?.map((e, i) => (
                              <li key={i} className="mb-10 ml-6">
                                <span
                                  className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900 ${
                                    e.status === "active"
                                      ? "bg-yellow-200"
                                      : "bg-green-200"
                                  }`}
                                >
                                  <MapPinIcon
                                    className={cn("w-3 h-3", {
                                      "text-green-600 dark:text-green-400":
                                        e.status !== "active",
                                      "text-yellow-600 dark:text-yellow-400 animate-pulse":
                                        e.status === "active",
                                    })}
                                  />
                                </span>
                                <h3 className="flex items-center mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                                  {e.location.display}
                                </h3>
                                <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                                  {e.status}
                                </time>
                                <FlowButton color="gray">
                                  Move
                                  <ArrowDownCircleIcon className="ml-2 h-4 w-4 text-green-600" />
                                </FlowButton>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </td>
                  </tr>
                </Transition.Root>
              </React.Fragment>
            ))}
          </tbody>
        )}
      </table>

      {(isLoading || isValidating) && (
        <div className="bg-white h-32 flex items-center justify-center w-full">
          <Spinner color="warning" aria-label="Encounters loading" />
        </div>
      )}
      {!isLoading && !isValidating && encounters.length === 0 && (
        <div className="bg-white shadow-md h-32 flex items-center justify-center w-full">
          <div className="m-auto flex space-x-1 text-gray-500">
            <div className="material-icons md-inbox"></div>
            <p className="text-center">Nothing here yet</p>
          </div>
        </div>
      )}
      {!isLoading && !isValidating && (
        <TablePagination
          totalCount={totalCount ?? 0}
          onNext={handleNext}
          onPrevious={handlePrev}
        />
      )}
    </div>
  );
}
