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

import React, { useEffect, useState } from "react";
import MyBreadcrumb, { IBreadcrumb } from "../../components/breadcrumb";
import { format } from "date-fns";
import useSWR from "swr";
import { PaginationInput } from "../../model";
import { getAllTasks, getPatient } from "../../api";
import { Spinner, TextInput } from "flowbite-react";
import { TablePagination } from "../../components/table-pagination";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { Encounter, Patient, Task } from "fhir/r4";
import { parsePatientMrn, parsePatientName } from "../../util/fhir";
import { Transition } from "@headlessui/react";
import EncounterDetails from "../encounters/encounter-details";
import Link from "next/link";

interface ISearchField {
  date?: string;
  type?: string;
  status?: string;
}

export default function Tasks() {
  const [crumbs] = useState<IBreadcrumb[]>([
    { href: "/", title: "Home", icon: "home" },
    { href: "/tasks", title: "Tasks", icon: "task_alt" },
  ]);
  const [page, setPage] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });
  const [searchParams, setSearchParams] = useState<ISearchField>({
    date: format(new Date(), "yyyy-MM-dd"),
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [encounters, setEncounters] = useState<Encounter[]>([]);
  const [expandedIdx, setExpandedIdx] = useState<number>(-1);

  const { data, isLoading, isValidating, mutate } = useSWR("encounters", () => {
    const params = ["_include=Task:encounter"];

    if (searchParams.date) {
      params.push(`period=ap${searchParams.date}`);
    }

    if (searchParams.type) {
      params.push(`encounter.class=${searchParams.type}`);
    }

    if (searchParams.status) {
      params.push(`status=${searchParams.status}`);
    }

    return getAllTasks(page, params.join("&"));
  });

  useEffect(() => {
    mutate();
  }, [searchParams, page]);

  useEffect(() => {
    const matches: Task[] =
      data?.data?.entry
        ?.filter((e) => e.search.mode === "match")
        .map((e) => e.resource as Task) ?? [];
    setTasks(matches);

    const include: Encounter[] =
      data?.data?.entry
        ?.filter((e) => e.search.mode === "include")
        .map((e) => e.resource as Encounter) ?? [];
    setEncounters(include);
  }, [data?.data]);

  const handleNext = () => {
    setPage({
      ...page,
      page: page.page + 1,
    });
  };

  const handlePrevious = () => {
    if (page.page > 1) {
      setPage({
        ...page,
        page: page.page - 1,
      });
    }
  };

  return (
    <div className="h-screen overflow-y-auto mb-10">
      <MyBreadcrumb crumbs={crumbs} />
      <div className="flex bg-white w-full h-16 p-4 mt-4 rounded-sm shadow-md justify-between items-center">
        <div className="flex items-center space-x-4">
          <select
            name="type"
            value={searchParams.type}
            className="border-l-2 border-gray-200 rounded-md text-sm"
            onChange={(evt) => {
              if (evt.target.value === "") {
                setSearchParams({
                  ...searchParams,
                  type: "",
                });
              } else {
                setSearchParams({
                  ...searchParams,
                  type: evt.target.value,
                });
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
            value={searchParams.status}
            className=" border-l-2 border-gray-200 rounded-md text-sm"
            onChange={(evt) => {
              if (evt.target.value === "") {
                setSearchParams({
                  ...searchParams,
                  status: "",
                });
              } else {
                setSearchParams({
                  ...searchParams,
                  status: evt.target.value,
                });
              }
            }}
          >
            <option value="">All status</option>
            <option value="draft">Draft</option>
            <option value="requested">Requested</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="ready">Ready</option>
            <option value="cancelled">Cancelled</option>
            <option value="in-progress">In-progress</option>
            <option value="on-hold">On-hold</option>
            <option value="failed">Failed</option>
            <option value="completed">Completed</option>
            <option value="Entered-in-error">Entered-in-error</option>
          </select>
          <input
            type="date"
            id="date"
            name="date"
            value={searchParams.date}
            className="border-l-2 border-gray-200 rounded-md text-sm"
            onChange={(evt) => {
              setSearchParams({
                ...searchParams,
                date: evt.target.value,
              });
            }}
          />
          <div className="left-1/2 -ml-0.5 w-[1px] h-6 bg-gray-400"></div>
          <div>
            <TextInput
              id="mrn"
              type="text"
              icon={MagnifyingGlassIcon}
              placeholder="Accession ID"
              required={true}
              className="w-36"
            />
          </div>
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-200 shadow-md">
        <thead>
          <tr className="bg-gray-50">
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
              Status
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              Priority
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              Location
            </th>
            <th
              scope="col"
              className="px-6 py-3  text-left text-xs text-gray-500 uppercase tracking-wider"
            ></th>
          </tr>
        </thead>
        {!isLoading && !isValidating && (
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((e, i) => {
              const encounterRef = e.encounter?.reference.split("/")[1];
              const encounter = encounters.find((en) => en.id === encounterRef);

              return (
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
                      {encounter?.subject ? (
                        <PatientName
                          patientId={encounter?.subject.reference.split("/")[1]}
                        />
                      ) : (
                        "Unknown"
                      )}
                    </td>
                    <td className="px-6 py-4">{encounter?.class?.display}</td>
                    <td className="px-6 py-4">
                      {encounter?.type
                        ?.map((t) => t.coding.map((c) => c.display).join(", "))
                        .join(", ")}
                    </td>
                    <td className="px-6 py-4">{e?.status}</td>
                    <td className="px-6 py-4">{e?.priority}</td>
                    <td className="px-6 py-4">{e?.location?.display}</td>
                    <td className="px-6 py-4 flex items-center justify-center">
                      {expandedIdx === i ? (
                        <p className="material-symbols-outlined">expand_less</p>
                      ) : (
                        <p className="material-symbols-outlined">expand_more</p>
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
                        className="px-20 py-4 text-sm bg-teal-50  shadow-inner rounded-md rounded-b"
                      >
                        <div>
                          <EncounterDetails encounter={encounter} />
                          <div className="mt-5">
                            <Link href={`/encounters/${encounter?.id}`}>
                              <button
                                type="button"
                                className="border px-4 py-1 rounded-md flex items-center space-x-2 text-white bg-sky-700 hover:bg-sky-800 shadow-md"
                              >
                                <p className="material-symbols-outlined">open_in_new</p>
                                <p>Open Chart</p>
                              </button>
                            </Link>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </Transition.Root>
                </React.Fragment>
              );
            })}
          </tbody>
        )}
      </table>
      {(isLoading || isValidating) && (
        <div className="bg-white h-32 flex items-center justify-center w-full">
          <Spinner color="warning" aria-label="Appointments loading" />
        </div>
      )}
      {!isLoading && !isValidating && tasks?.length === 0 && (
        <div className="bg-white shadow-md h-32 flex items-center justify-center w-full">
          <div className="m-auto flex space-x-1 text-gray-500">
            <div className="material-symbols-outlined">inbox</div>
            <p className="text-center">Nothing here yet</p>
          </div>
        </div>
      )}
      {!isLoading && !isValidating && (
        <TablePagination
          totalCount={data?.data?.total ?? 0}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  );
}

interface PatientNameProps {
  patientId: string;
}

const PatientName: React.FC<PatientNameProps> = ({ patientId }) => {
  const patientQuery = useSWR(`patients/${patientId}`, () =>
    getPatient(patientId)
  );

  if (patientQuery.isLoading) {
    return <Spinner color="warning" aria-label="Patient loading" />;
  }

  const patient = patientQuery.data?.data as Patient;

  if (patient) {
    return (
      <div className="flex items-center">
        <div className="flex-shrink-0">
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
          <p className="text-sm font-medium text-gray-900">
            {parsePatientName(patient)}
          </p>
          <p className="text-sm text-gray-500">{parsePatientMrn(patient)}</p>
        </div>
      </div>
    );
  } else {
    return <div />;
  }
};
