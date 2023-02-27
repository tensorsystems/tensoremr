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
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import MyBreadcrumb, { IBreadcrumb } from "../../components/breadcrumb";
import { PaginationInput } from "../../model";
import { format } from "date-fns";
import Button from "../../components/button";
import { Spinner, TextInput } from "flowbite-react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import CareTeamForm from "./care-team-form";
import useSWR from "swr";
import { getAllCareTeams, getCareTeamStatuses } from "../../api";
import { CareTeam } from "fhir/r4";
import { TablePagination } from "../../components/table-pagination";
import FhirPatientName from "../../components/fhir-patient-name";
import FhirUserName from "../../components/fhir-user-name";

interface ISearchField {
  category?: string;
  participant?: string;
  patient?: string;
  status?: string;
}

export default function CareTeams() {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const [crumbs] = useState<IBreadcrumb[]>([
    { href: "/", title: "Home", icon: "home" },
    { href: "/care-teams", title: "Care Teams", icon: "groups" },
  ]);
  const [page, setPage] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });
  const [searchParams, setSearchParams] = useState<ISearchField>({});
  const [expandedIdx, setExpandedIdx] = useState<number>(-1);

  const careTeamStatuses =
    useSWR("careTeamStatuses", () =>
      getCareTeamStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const { data, isLoading, isValidating, mutate } = useSWR("careTeams", () => {
    const params = [];

    if (searchParams.category) {
      params.push(`category=${searchParams.category}`);
    }

    if (searchParams.participant) {
      params.push(`participant=${searchParams.participant}`);
    }

    if (searchParams.patient) {
      params.push(`patient=${searchParams.patient}`);
    }

    if (searchParams.status) {
      params.push(`status=${searchParams.status}`);
    }

    return getAllCareTeams(page, params.join("&"));
  });

  useEffect(() => {
    mutate();
  }, [searchParams, page]);

  const careTeams: CareTeam[] =
    data?.data?.entry?.map((e) => e.resource as CareTeam) ?? [];

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
            name="category"
            value={searchParams.category}
            className="border-l-2 border-gray-200 rounded-md text-sm w-36"
            onChange={(evt) => {
              if (evt.target.value === "") {
                setSearchParams({
                  ...searchParams,
                  category: "",
                });
              } else {
                setSearchParams({
                  ...searchParams,
                  category: evt.target.value,
                });
              }
            }}
          >
            <option value="">All Categories</option>
            {careTeamCategories.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
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
            {careTeamStatuses.map((e) => (
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
            />
          </div>
        </div>
        <div>
          <Button
            type="button"
            text="New Care Team"
            icon="add"
            variant="filled"
            onClick={() => {
              bottomSheetDispatch({
                type: "show",
                width: "medium",
                children: (
                  <CareTeamForm
                    onCancel={() => bottomSheetDispatch({ type: "hide" })}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: "hide" });

                      notifDispatch({
                        type: "showNotification",
                        notifTitle: "Success",
                        notifSubTitle: "Care Team saved successfully",
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
              Name
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
              Category
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
              Note
            </th>
          </tr>
        </thead>
        {!isLoading && !isValidating && (
          <tbody className="bg-white divide-y divide-gray-200">
            {careTeams.map((e) => (
              <React.Fragment key={e?.id}>
                <tr className="hover:bg-gray-100 cursor-pointer text-sm text-gray-900">
                  <td className="px-6 py-4">{e.name ?? ""}</td>
                  <td className="px-6 py-4">{e.status ?? ""}</td>
                  <td className="px-6 py-4">
                    {e.category?.map((c) => c.text).join(", ") ?? ""}
                  </td>
                  <td className="px-6 py-4">
                    {e.participant
                      ?.map<React.ReactNode>((p) => (
                        <FhirUserName
                          key={p.member.reference}
                          userId={p.member.reference.split("/")[1]}
                        />
                      ))
                      .reduce((prev, curr) => [prev, ", ", curr])}
                  </td>
                  <td className="px-6 py-4">
                    {e?.note?.map((n) => n.text).join(", ")}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        )}
      </table>
      {(isLoading || isValidating) && (
        <div className="bg-white h-32 flex items-center justify-center w-full">
          <Spinner color="warning" aria-label="Care Teams loading" />
        </div>
      )}
      {!isLoading && !isValidating && careTeams.length === 0 && (
        <div className="bg-white shadow-md h-32 flex items-center justify-center w-full">
          <div className="m-auto flex space-x-1 text-gray-500">
            <div className="material-icons md-inbox"></div>
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

export const careTeamCategories = [
  {
    value: "LA27975-4",
    label: "Event-focused care team",
    system: "http://loinc.org",
  },
  {
    value: "LA27977-0",
    label: "Episode of care-focused care team",
    system: "http://loinc.org",
  },
  {
    value: "LA27978-8",
    label: "Condition-focused care team",
    system: "http://loinc.org",
  },
  {
    value: "LA28865-6",
    label: "Longitudinal care-coordination focused care team",
    system: "http://loinc.org",
  },
  {
    value: "LA28866-4",
    label: "Home & Community Based Services (HCBS)-focused care team",
    system: "http://loinc.org",
  },
  {
    value: "LA27980-4",
    label: "Clinical research-focused care team",
    system: "http://loinc.org",
  },
  {
    value: "LA28867-2",
    label: "Public health-focused care team",
    system: "http://loinc.org",
  },
];
