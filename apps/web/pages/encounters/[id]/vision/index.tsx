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

import { ReactElement, useState } from "react";
import { EncounterLayout } from "..";
import { NextPageWithLayout } from "../../../_app";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import useSWR from "swr";
import { getBatch, getEncounter } from "../../../../api";
import { useRouter } from "next/router";
import {
  Encounter,
  MedicationAdministration,
  MedicationRequest,
} from "fhir/r4";
import React from "react";
import { Transition } from "@headlessui/react";
import { Spinner } from "flowbite-react";
import { format, parseISO } from "date-fns";
import { PencilIcon } from "@heroicons/react/24/outline";
import Button from "../../../../components/button";

const Vision: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;

  return (
    <div className="h-screen overflow-y-auto mb-10 bg-white p-4 rounded-sm shadow-md">
      <p className="text-2xl text-gray-800 font-bold font-mono">Vision</p>
      <hr className="mt-3" />
      <div className="mt-10">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-3">
            <div />
          </div>
          <div>
            <Button
              type="button"
              text="Add Prescription"
              icon="add"
              variant="filled"
              onClick={() => {
                bottomSheetDispatch({
                  type: "show",
                  width: "medium",
                  children: (
                    <div className="px-8 py-6">
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
                      {/* <ProblemForm
                        encounter={encounter}
                        onSuccess={() => {
                          notifDispatch({
                            type: "showNotification",
                            notifTitle: "Success",
                            notifSubTitle: "Problem saved successfully",
                            variant: "success",
                          });
                          bottomSheetDispatch({ type: "hide" });
                        }}
                      /> */}
                    </div>
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
                Problem
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
                Verification
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Severity
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Body Site
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Category
              </th>

              <th
                scope="col"
                className="px-6 py-3  text-left text-xs text-gray-500 uppercase tracking-wider"
              ></th>
            </tr>
          </thead>
        </table>
      </div>
    </div>
  );
};

Vision.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default Vision;
