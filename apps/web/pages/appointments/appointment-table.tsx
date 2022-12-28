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
import cn from "classnames";
import { Transition } from "@headlessui/react";
import { format } from "date-fns";
import useSWR from "swr";
import { getPatient } from "../../_api";
import { Spinner } from "flowbite-react";
import { Patient } from "fhir/r4";
import { parsePatientMrn } from "../../_util/fhir";

export interface IAppointmentItem {
  id: string;
  patientId: string;
  patientName: string;
  providerName: string;
  appointmentType: string;
  serviceType: string;
  status: string;
  response: string;
  specialty: string | undefined;
  start: Date | undefined;
  end: Date | undefined;
  duration: number;
  comment: string | undefined;
}

interface Props {
  variant: "search" | "requests";
  isLoading: boolean;
  items: IAppointmentItem[];
  onRespond: (response: "accepted" | "declined", appointmentId) => void;
}

export default function AppointmentTable({ items, variant, isLoading, onRespond }: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number>(-1);

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200 shadow-md">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Patient
            </th>

            <th
              scope="col"
              className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Type
            </th>
            <th
              scope="col"
              className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Providers
            </th>
            <th
              scope="col"
              className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Service
            </th>
            <th
              scope="col"
              className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            {variant === "requests" && (
              <th
                scope="col"
                className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Your Response
              </th>
            )}
            <th scope="col" className="px-6 py-3 bg-gray-50"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {!isLoading &&
            items.map((e, i) => (
              <React.Fragment key={e.id}>
                <tr
                  className="hover:bg-gray-100 cursor-pointer"
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
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-10 w-10 text-gray-600"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {e.patientName}
                        </div>
                        <PatientMrn patientId={e.patientId} />
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {e.appointmentType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {e.providerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {e.serviceType}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                      {e.status}
                    </span>
                  </td>
                  {variant === "requests" && (
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                          {
                            "bg-yellow-100 text-yellow-800":
                              e.response === "needs-action" || "tentative",
                          },
                          {
                            "bg-green-100 text-green-800":
                              e.response === "accepted",
                          },
                          {
                            "bg-red-100 text-red-800":
                              e.response === "declined",
                          }
                        )}
                      >
                        {e.response}
                      </span>
                    </td>
                  )}
                  <td className="px-6 py-4 flex items-center justify-center">
                    <span className="material-icons">
                      {expandedIdx === i ? "expand_less" : "expand_more"}
                    </span>
                  </td>
                </tr>
                <Transition.Root
                  show={expandedIdx === i}
                  as={React.Fragment}
                  enter="ease-in duration-500"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-out duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <tr>
                    <td
                      colSpan={7}
                      className="px-20 py-4 text-sm rounded-md rounded-b bg-zinc-50 shadow-inner"
                    >
                      <div className="flex justify-between">
                        <div className="text-xs">
                          {e.specialty ? (
                            <InfoItem title="Specialty" value={e.specialty} />
                          ) : (
                            <div />
                          )}

                          {e.start ? (
                            <InfoItem
                              title="Start"
                              value={format(e.start, "LLL do yyyy hh:mm a")}
                            />
                          ) : (
                            <div />
                          )}

                          {e.end ? (
                            <InfoItem
                              title="End"
                              value={format(e.end, "LLL do yyyy hh:mm a")}
                            />
                          ) : (
                            <div />
                          )}

                          <InfoItem
                            title="Duration"
                            value={`${e.duration} minutes`}
                          />

                          {e.comment ? (
                            <InfoItem title="Comment" value={e.comment} />
                          ) : (
                            <div />
                          )}
                        </div>
                        {e.response === "needs-action" &&
                          variant === "requests" && (
                            <div className="flex space-x-4">
                              <button
                                type="button"
                                className="text-green-500 hover:bg-green-100 rounded-md px-4"
                                onClick={() => onRespond("accepted", e.id)}
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                className="text-red-500 hover:bg-red-100 rounded-md px-4"
                                onClick={() => onRespond("declined", e.id)}
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        {e.response === "accepted" &&
                          variant === "requests" && (
                            <p className="px-4 py-2 text-green-500">Accepted</p>
                          )}
                        {e.response === "declined" &&
                          variant === "requests" && (
                            <p className="px-4 py-2 text-red-500">Declined</p>
                          )}
                      </div>
                    </td>
                  </tr>
                </Transition.Root>
              </React.Fragment>
            ))}
        </tbody>
      </table>
      {isLoading && (
        <div className="bg-white h-32 flex items-center justify-center w-full">
          <Spinner color="warning" aria-label="Appointments loading" />
        </div>
      )}
      {!isLoading && items.length === 0 && (
        <div className="bg-white shadow-md h-32 flex items-center justify-center w-full">
          <div className="m-auto flex space-x-1 text-gray-500">
            <div className="material-icons">inbox</div>
            <p className="text-center">Nothing here yet</p>
          </div>
        </div>
      )}
    </div>
  );
}

interface InfoItemProps {
  title: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ title, value }) => {
  return (
    <div className="flex space-x-1 mt-1">
      <p className="text-gray-900 tracking-wide">{`${title}:`}</p>
      <p className="text-gray-700">{value}</p>
    </div>
  );
};

interface PatientMrnProps {
  patientId: string;
}

const PatientMrn: React.FC<PatientMrnProps> = ({ patientId }) => {
  const patientQuery = useSWR(`patients/${patientId}`, () =>
    getPatient(patientId)
  );

  if (patientQuery.isLoading) {
    return <Spinner color="warning" aria-label="Patient loading" />;
  }

  const patient = patientQuery.data?.data as Patient;
  if (patient) {
    return <p className="text-sm text-gray-500">{parsePatientMrn(patient)}</p>;
  } else {
    return <div />;
  }
};
