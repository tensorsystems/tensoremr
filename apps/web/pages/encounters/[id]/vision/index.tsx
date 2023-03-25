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
import { getEncounter, getVisionPrescriptions } from "../../../../api";
import { useRouter } from "next/router";
import { Encounter, VisionPrescription } from "fhir/r4";
import React from "react";
import { Transition } from "@headlessui/react";
import { Spinner } from "flowbite-react";
import { format, parseISO } from "date-fns";
import { PencilIcon } from "@heroicons/react/24/outline";
import Button from "../../../../components/button";
import VisionPrescriptionForm from "./vision-prescription-form";
import { PaginationInput } from "../../../../model";
import { TablePagination } from "../../../../components/table-pagination";

const Vision: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;

  const [page, setPage] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });

  const prescriptionsQuery = useSWR(
    encounter?.id ? "prescriptions" : null,
    () =>
      getVisionPrescriptions(
        page,
        `patient=${encounter?.subject?.reference?.split("/")[1]}`
      )
  );

  const prescriptions: VisionPrescription[] =
    prescriptionsQuery?.data?.data?.entry?.map(
      (e) => e.resource as VisionPrescription
    ) ?? [];

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

  console.log("Prescriptions", prescriptions);

  return (
    <div className="h-screen overflow-y-auto mb-10 bg-white p-4 rounded-sm shadow-md">
      <p className="text-2xl text-gray-800 font-bold font-mono">Vision Prescription</p>
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
                    <div className="px-5 py-4">
                      <VisionPrescriptionForm
                        encounter={encounter}
                        onSuccess={() => {
                          notifDispatch({
                            type: "showNotification",
                            notifTitle: "Success",
                            notifSubTitle:
                              "Vision prescription saved successfully",
                            variant: "success",
                          });
                          bottomSheetDispatch({ type: "hide" });
                        }}
                        onClose={() =>
                          bottomSheetDispatch({
                            type: "hide",
                          })
                        }
                      />
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
                Product
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
                Right Eye
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Left Eye
              </th>
              <th
                scope="col"
                className="px-6 py-3  text-left text-xs text-gray-500 uppercase tracking-wider"
              ></th>
            </tr>
          </thead>
          {!prescriptionsQuery.isLoading && (
            <tbody className="bg-white divide-y divide-gray-200">
              {prescriptions?.map((e) => (
                <tr
                  key={e?.id}
                  className="hover:bg-gray-100 cursor-pointer text-sm text-gray-900"
                >
                  <td className="px-6 py-4">{e?.status}</td>
                  <td className="px-6 py-4">{e?.status}</td>
                  <td className="px-6 py-4">{e?.status}</td>
                  <td className="px-6 py-4">{e?.status}</td>
                  <td className="px-6 py-4"></td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {prescriptionsQuery?.isLoading && (
          <div className="bg-white h-32 flex items-center justify-center w-full">
            <Spinner color="warning" aria-label="Appointments loading" />
          </div>
        )}
        {!prescriptionsQuery?.isLoading && prescriptions.length === 0 && (
          <div className="bg-white shadow-md h-32 flex items-center justify-center w-full">
            <div className="m-auto flex space-x-1 text-gray-500">
              <div className="material-symbols-outlined">inbox</div>
              <p className="text-center">Nothing here yet</p>
            </div>
          </div>
        )}
        {!prescriptionsQuery?.isLoading && (
          <div className="shadow-md">
            <TablePagination
              totalCount={prescriptionsQuery?.data?.data?.total ?? 0}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </div>
        )}
      </div>
    </div>
  );
};

Vision.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default Vision;
