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

import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import {  Location } from "fhir/r4";
import React from "react";
import { ReactElement, useState } from "react";
import useSWR from "swr";
import { AdminLayout } from "..";
import { getAllLocations } from "../../../_api";
import { PaginationInput } from "../../../_model";
import { NextPageWithLayout } from "../../_app";
import LocationForm from "./location-form";

const Locations: NextPageWithLayout = () => {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  // State
  const [page, setPage] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });

  const { data, isLoading } = useSWR("schedules", () =>
    getAllLocations(page)
  );

  const locations: Location[] =
    data?.data?.entry.map((e) => e.resource as Location) ?? [];

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  scope="col"
                  colSpan={4}
                  className="px-6 py-3 bg-teal-700 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                >
                  Locations
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 bg-teal-700 text-gray-100 text-right"
                >
                  <button
                    onClick={() =>
                      bottomSheetDispatch({
                        type: "show",
                        width: "medium",
                        children: (
                          <div className="px-10 py-4">
                            <div className="">
                              <div className="float-right">
                                <button
                                  onClick={() => {
                                    bottomSheetDispatch({
                                      type: "hide",
                                    });
                                  }}
                                >
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
                              <LocationForm
                                onSuccess={() => {
                                  bottomSheetDispatch({
                                    type: "hide",
                                  });

                                  notifDispatch({
                                    type: "showNotification",
                                    notifTitle: "Success",
                                    notifSubTitle:
                                      "Location has been created successfully",
                                    variant: "success",
                                  });
                                }}
                                onCancel={() =>
                                  bottomSheetDispatch({
                                    type: "hide",
                                  })
                                }
                              />
                            </div>
                          </div>
                        ),
                      })
                    }
                    className="uppercase bg-teal-800 hover:bg-teal-600 py-1 px-2 rounded-md text-sm"
                  >
                    <div className="flex items-center">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="font-semibold">Add</div>
                    </div>
                  </button>
                </th>
              </tr>
              <tr>
                <th colSpan={5}>
                  <input
                    type="text"
                    name="search"
                    placeholder="Search"
                    className="p-3 pl-4 block w-full sm:text-md border-gray-300"
                  />
                </th>
              </tr>
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
                  Operational Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>

            {!isLoading && (
              <tbody className="bg-white divide-y divide-gray-200">
                {locations.map((e, i) => (
                  <React.Fragment key={e?.id}>
                    <tr className="hover:bg-gray-100 cursor-pointer text-sm text-gray-900">
                      <td className="px-6 py-4">
                        <div>
                            <p>{e.name}</p>
                            <p className="text-gray-500">
                                {e.description}
                            </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {e.physicalType.text}
                      </td>
                      <td className="px-6 py-4">
                        {e.type.map((t) => t.text).join(", ")}
                      </td>
                      <td className="px-6 py-4">
                        {e.operationalStatus?.display}
                      </td>
                      <td className="px-6 py-4">
                        {e.status}
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </div>
  );
};

Locations.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Locations;
