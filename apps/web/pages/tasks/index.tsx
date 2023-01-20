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
import { format } from "date-fns";
import useSWR from "swr";
import { PaginationInput } from "../../_model";
import { getAllTasks } from "../../_api";
import { Spinner, TextInput } from "flowbite-react";
import { TablePagination } from "../../components/table-pagination";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface ISearchField {
  date?: string;
  type?: string;
}

export default function Tasks() {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

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

  const { data, isLoading, isValidating, mutate } = useSWR("encounters", () => {
    const params = [];

    if (searchParams.date) {
      params.push(`date=ap${searchParams.date}`);
    }

    if (searchParams.type) {
      params.push(`class=${searchParams.type}`);
    }

    return getAllTasks(page, params.join("&"));
  });

  useEffect(() => {
    mutate();
  }, [searchParams, page]);

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
          <select
            name="status"
            className=" border-l-2 border-gray-200 rounded-md text-sm"
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
            className="border-l-2 border-gray-200 rounded-md text-sm"
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
          </tr>
        </thead>
        {!isLoading && !isValidating && (
          <tbody className="bg-white divide-y divide-gray-200"></tbody>
        )}
      </table>
      {(isLoading || isValidating) && (
        <div className="bg-white h-32 flex items-center justify-center w-full">
          <Spinner color="warning" aria-label="Appointments loading" />
        </div>
      )}
      {!isLoading && !isValidating && [].length === 0 && (
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
