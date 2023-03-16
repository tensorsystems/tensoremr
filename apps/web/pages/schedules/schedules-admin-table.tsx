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

import React from "react";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Transition } from "@headlessui/react";
import { format, parseISO } from "date-fns";
import SlotCalendar from "./slot-calendar";
import { Schedule } from "fhir/r4";
import { Spinner } from "flowbite-react";
import useSWR from "swr";
import { getExtensions } from "../../api";
import { TablePagination } from "../../components/table-pagination";

interface Props {
  isLoading?: boolean;
  schedules?: Schedule[];
  totalCount: number;
  onNext: () => void;
  onPrevious: () => void;
  onCreate: () => void;
  onSlotSelect: (
    scheduleId: string,
    scheduleStart: Date,
    scheduleEnd: Date,
    slotStart: Date,
    slotEnd: Date
  ) => void;
}

export default function SchedulesAdminTable(props: Props) {
  const {
    schedules,
    isLoading,
    totalCount,
    onNext,
    onPrevious,
    onCreate,
    onSlotSelect,
  } = props;

  const [expandedIdx, setExpandedIdx] = useState<number>(-1);

  const extensions = useSWR("extensions", () => getExtensions()).data?.data;

  return (
    <div className="shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              scope="col"
              colSpan={6}
              className="px-6 py-3 bg-teal-700 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
            >
              <div className="flex items-center space-x-2">
                <p className="material-symbols-outlined">schedule</p>
                <p>Schedules</p>
              </div>
            </th>
            <th
              scope="col"
              className="px-6 py-3 bg-teal-700 text-gray-100 text-right"
            >
              <button
                onClick={onCreate}
                className="uppercase bg-teal-800 hover:bg-teal-600 py-1 px-2 rounded-md text-sm"
              >
                <div className="flex items-center space-x-1">
                  <div>
                    <PlusIcon className="h-6 w-6" />
                  </div>
                  <div className="font-semibold">Add</div>
                </div>
              </button>
            </th>
          </tr>
          <tr className="bg-gray-50 text-gray-500 text-left text-xs uppercase tracking-wider">
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs  uppercase tracking-wider"
            >
              Resource
            </th>
            <th scope="col" className="px-6 py-3">
              Service Type
            </th>
            <th scope="col" className="px-6 py-3">
              Speciality
            </th>
            <th scope="col" className="px-6 py-3">
              From
            </th>
            <th scope="col" className="px-6 py-3">
              To
            </th>
            <th scope="col" className="px-6 py-3"></th>
            <th
              scope="col"
              className="px-6 py-3  text-left text-xs text-gray-500 uppercase tracking-wider"
            ></th>
          </tr>
        </thead>

        {!isLoading && (
          <tbody className="bg-white divide-y divide-gray-200">
            {schedules?.map((e, i) => (
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
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <ResourceIcon resourceType={e.actor?.at(0)?.type} />
                      </div>
                      <div className="ml-4">
                        <div>{e.actor?.at(0)?.type}</div>
                        <div className="text-gray-500">
                          {e.actor?.at(0)?.display}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {e.serviceType?.map(
                      (e) => e.coding?.map((c) => c.display).join(", ") ?? ""
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {e.specialty?.map(
                      (e) => e.coding?.map((c) => c.display).join(", ") ?? ""
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {e.planningHorizon?.start &&
                      format(parseISO(e.planningHorizon?.start), "LLL d, y")}
                  </td>

                  <td className="px-6 py-4">
                    {e.planningHorizon?.end &&
                      format(parseISO(e.planningHorizon?.end), "LLL d, y")}
                  </td>
                  <td>
                    {e.extension?.find(
                      (ext) => ext.url === extensions?.EXT_SCHEDULE_RECURRING
                    )?.valueBoolean && (
                      <span className="material-symbols-outlined text-center text-cyan-600">autorenew</span>
                    )}
                  </td>

                  <td className="px-6 py-4 flex items-center justify-center">
                    {expandedIdx === i ? (
                      <span className="material-symbols-outlined">expand_less</span>
                    ) : (
                      <span className="material-symbols-outlined">expand_more</span>
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
                      colSpan={7}
                      className="px-20 py-4 text-sm bg-teal-50  shadow-lg rounded-md rounded-b"
                    >
                      <p className="mb-4 text-lg font-light text-yellow-600">
                        Edit Slots
                      </p>
                      <SlotCalendar
                        scheduleId={e.id}
                        startPeriod={
                          e.planningHorizon?.start ?? new Date().toString()
                        }
                        endPeriod={
                          e.planningHorizon?.end ?? new Date().toString()
                        }
                        onSlotSelect={onSlotSelect}
                      />
                    </td>
                  </tr>
                </Transition.Root>
              </React.Fragment>
            ))}
          </tbody>
        )}
      </table>
      <TablePagination
        totalCount={totalCount}
        onNext={onNext}
        onPrevious={onPrevious}
      />
      {isLoading && (
        <div className="flex items-center justify-center w-full py-10 bg-white">
          <Spinner color="warning" aria-label="Button loading" />
        </div>
      )}
    </div>
  );
}

interface ResourceIconProps {
  resourceType: string;
}

function ResourceIcon(props: ResourceIconProps) {
  const { resourceType } = props;

  const resource = resourceType?.toLowerCase();

  if (resource === "practitioner") {
    return (
      <span
        className="material-symbols-outlined text-gray-500"
        style={{
          fontSize: "36px",
        }}
      >
        account_circle
      </span>
    );
  }

  if (resource === "room") {
    return (
      <span
        className="material-symbols-outlined text-gray-500"
        style={{
          fontSize: "36px",
        }}
      >meeting_room</span>
    );
  }

  if (resource === "device") {
    return (
      <span
        className="material-symbols-outlined text-gray-500"
        style={{
          fontSize: "36px",
        }}
      >computer</span>
    );
  }

  return (
    <span
      className="material-symbols-outlined text-gray-500 schedule"
      style={{
        fontSize: "36px",
      }}
    ></span>
  );
}
