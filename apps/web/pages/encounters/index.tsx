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

import React, { useEffect, useRef, useState } from "react";
import MyBreadcrumb, { IBreadcrumb } from "../../components/breadcrumb";
import Button from "../../components/button";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import EncounterForm from "../../components/encounter-form";
import { PaginationInput } from "../../_model";
import { getAllEncounters, getAllUsers, getPatient } from "../../_api";
import useSWR from "swr";
import { Encounter, Patient } from "fhir/r4";
import { Spinner, TextInput } from "flowbite-react";
import { parsePatientName } from "../../_util/fhir";
import { format } from "date-fns";
import { Button as FlowButton } from "flowbite-react";
import { debounce } from "lodash";
import { TablePagination } from "../../components/table-pagination";
import { Transition } from "@headlessui/react";
import {
  MapPinIcon,
  MagnifyingGlassIcon,
  ArrowDownCircleIcon,
} from "@heroicons/react/24/solid";
import EncounterDetails from "./encounter-details";
import cn from "classnames";

interface ISearchField {
  date?: string;
  type?: string;
  status?: string;
  practitioner?: string;
  mrn?: string;
}

export default function Encounters() {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const [crumbs] = useState<IBreadcrumb[]>([
    { href: "/", title: "Home", icon: "home" },
    { href: "/encounters", title: "Encounters", icon: "supervisor_account" },
  ]);
  const [page, setPage] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });
  const [searchParams, setSearchParams] = useState<ISearchField>({
    date: format(new Date(), "yyyy-MM-dd"),
  });
  const [expandedIdx, setExpandedIdx] = useState<number>(-1);

  const practitioners =
    useSWR("users", () => getAllUsers("")).data?.data.map((e) => ({
      value: e.id,
      label: `${e.firstName} ${e.lastName}`,
    })) ?? [];

  const mrnDebouncedSearch = useRef(
    debounce(async (mrn) => {
      setSearchParams({
        ...searchParams,
        mrn,
      });
    }, 500)
  ).current;

  const { data, isLoading, isValidating, mutate } = useSWR("encounters", () => {
    const params = [];

    if (searchParams.date) {
      params.push(`date=ap${searchParams.date}`);
    }

    if (searchParams.type) {
      params.push(`class=${searchParams.type}`);
    }

    if (searchParams.status) {
      params.push(`status=${searchParams.status}`);
    }

    if (searchParams.practitioner) {
      params.push(`practitioner=${searchParams.practitioner}`);
    }

    if (searchParams.mrn) {
      params.push(`patient.identifier=${searchParams.mrn}`);
    }

    return getAllEncounters(page, params.join("&"));
  });

  useEffect(() => {
    mutate();
  }, [searchParams, page]);

  const encounters: Encounter[] =
    data?.data?.entry?.map((e) => e.resource as Encounter) ?? [];

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
            className=" border-l-2 border-gray-200 rounded-md text-sm"
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
            value={searchParams.date}
            className="border-l-2 border-gray-200 rounded-md text-sm"
            onChange={(evt) => {
              setSearchParams({
                ...searchParams,
                date: evt.target.value,
              });
            }}
          />
          <select
            name="actor"
            className="ml-6 border-l-2 border-gray-200 rounded-md text-sm"
            value={searchParams.practitioner}
            onChange={(evt) => {
              if (evt.target.value === "") {
                setSearchParams({
                  ...searchParams,
                  practitioner: "",
                });
              } else {
                setSearchParams({
                  ...searchParams,
                  practitioner: evt.target.value,
                });
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
          <div className="left-1/2 -ml-0.5 w-[1px] h-6 bg-gray-500"></div>
          <div>
            <TextInput
              id="mrn"
              type="mrn"
              icon={MagnifyingGlassIcon}
              placeholder="MRN"
              required={true}
              className="w-full"
              onChange={(evt) => mrnDebouncedSearch(evt.target.value)}
            />
          </div>
        </div>
        <div>
          <Button
            type="button"
            text="New Encounter"
            icon="add"
            variant="filled"
            onClick={() => {
              bottomSheetDispatch({
                type: "show",
                width: "medium",
                children: (
                  <EncounterForm
                    onCancel={() => bottomSheetDispatch({ type: "hide" })}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: "hide" });

                      notifDispatch({
                        type: "showNotification",
                        notifTitle: "Success",
                        notifSubTitle: "Encounter saved successfully",
                        variant: "success",
                      });
                    }}
                    onError={(message) => {
                      notifDispatch({
                        type: "showNotification",
                        notifTitle: "Error",
                        notifSubTitle: message,
                        variant: "failure",
                      });
                    }}
                  />
                ),
              });
            }}
          />
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-200 shadow-md">
        <thead>
          <tr className="bg-gray-50">
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
                  <td className="px-6 py-4">{e?.class?.display}</td>
                  <td className="px-6 py-4">
                    {e?.type
                      ?.map((t) => t.coding.map((c) => c.display).join(", "))
                      .join(", ")}
                  </td>
                  <td className="px-6 py-4">
                    {e?.subject ? (
                      <PatientName
                        patientId={e.subject.reference.split("/")[1]}
                      />
                    ) : (
                      "Unknown"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {e.participant
                      .map(
                        (p) =>
                          `${p.individual.display} (${p.type
                            .map((t) => t.text)
                            .join(", ")})`
                      )
                      .join(", ")}
                  </td>
                  <td className="px-6 py-4">
                    {e?.location
                      ?.map((l) => l.location?.display ?? "")
                      .join(", ")}
                  </td>
                  <td className="px-6 py-4">{e?.status}</td>
                  <td className="px-6 py-4 flex items-center justify-center">
                    <span className="material-icons">
                      {expandedIdx === i ? "expand_less" : "expand_more"}
                    </span>
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
                      <div className="flex justify-between">
                        <EncounterDetails encounter={e} />
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
          <Spinner color="warning" aria-label="Appointments loading" />
        </div>
      )}
      {!isLoading && !isValidating && encounters.length === 0 && (
        <div className="bg-white shadow-md h-32 flex items-center justify-center w-full">
          <div className="m-auto flex space-x-1 text-gray-500">
            <div className="material-icons">inbox</div>
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
    return <p>{parsePatientName(patient)}</p>;
  } else {
    return <div />;
  }
};
