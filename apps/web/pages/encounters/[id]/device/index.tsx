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

import { DeviceRequest, Encounter } from "fhir/r4";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { getDeviceRequests, getEncounter } from "../../../../api";
import { PaginationInput } from "../../../../model";
import { NextPageWithLayout } from "../../../_app";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import useSWR from "swr";
import Button from "../../../../components/button";
import { EncounterLayout } from "..";
import DeviceRequestForm from "./device-request-form";
import { Spinner } from "flowbite-react";
import { TablePagination } from "../../../../components/table-pagination";
import React from "react";
import { format, parseISO } from "date-fns";

const Device: NextPageWithLayout = () => {
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

  const devicesQuery = useSWR(encounter ? "deviceRequests" : null, () =>
    getDeviceRequests(
      page,
      `patient=${encounter?.subject?.reference?.split("/")[1]}`
    )
  );

  const devices: DeviceRequest[] =
    devicesQuery?.data?.data?.entry?.map((e) => e.resource as DeviceRequest) ??
    [];

  console.log("Devices", devices);

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
    <div className="h-screen overflow-y-auto mb-10 bg-white p-4 rounded-sm shadow-md">
      <p className="text-2xl text-gray-800 font-bold font-mono">Devices</p>
      <hr className="mt-3" />
      <div className="mt-10">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-3">
            <div />
          </div>
          <div>
            <Button
              type="button"
              text="Add Device"
              icon="add"
              variant="filled"
              onClick={() => {
                bottomSheetDispatch({
                  type: "show",
                  width: "medium",
                  children: (
                    <div className="px-5 py-4">
                      <DeviceRequestForm
                        encounter={encounter}
                        onSuccess={() => {
                          notifDispatch({
                            type: "showNotification",
                            notifTitle: "Success",
                            notifSubTitle: "Device request saved successfully",
                            variant: "success",
                          });
                          bottomSheetDispatch({ type: "hide" });
                        }}
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
                Device
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
                Intent
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
                Period
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Note
              </th>
            </tr>
          </thead>
          {!devicesQuery.isLoading && (
            <tbody className="bg-white divide-y divide-gray-200">
              {devices?.map((e, i) => (
                <React.Fragment key={e?.id}>
                  <tr
                    key={e?.id}
                    className="hover:bg-gray-100 cursor-pointer text-sm text-gray-900"
                    onClick={() => {
                      bottomSheetDispatch({
                        type: "show",
                        width: "medium",
                        children: (
                          <div className="px-5 py-4">
                            <DeviceRequestForm
                              updateId={e?.id}
                              encounter={encounter}
                              onSuccess={() => {
                                notifDispatch({
                                  type: "showNotification",
                                  notifTitle: "Success",
                                  notifSubTitle:
                                    "Device request saved successfully",
                                  variant: "success",
                                });
                                bottomSheetDispatch({ type: "hide" });
                              }}
                            />
                          </div>
                        ),
                      });
                    }}
                  >
                    <td className="px-6 py-4">
                      {e?.codeCodeableConcept?.text}
                    </td>
                    <td className="px-6 py-4">{e?.status}</td>
                    <td className="px-6 py-4">{e?.intent}</td>
                    <td className="px-6 py-4">{e?.priority}</td>
                    <td className="px-6 py-4">
                      {e?.occurrencePeriod?.start &&
                        `From ${format(
                          parseISO(e?.occurrencePeriod?.start),
                          "MMM d, y"
                        )}`}
                      {e?.occurrencePeriod?.end &&
                        ` To ${format(
                          parseISO(e?.occurrencePeriod?.end),
                          "MMM d, y"
                        )}`}
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
        {devicesQuery?.isLoading && (
          <div className="bg-white h-32 flex items-center justify-center w-full">
            <Spinner color="warning" aria-label="Appointments loading" />
          </div>
        )}
        {!devicesQuery?.isLoading && devices.length === 0 && (
          <div className="bg-white shadow-md h-32 flex items-center justify-center w-full">
            <div className="m-auto flex space-x-1 text-gray-500">
              <div className="material-symbols-outlined">inbox</div>
              <p className="text-center">Nothing here yet</p>
            </div>
          </div>
        )}
        {!devicesQuery?.isLoading && (
          <div className="shadow-md">
            <TablePagination
              totalCount={devicesQuery?.data?.data?.total ?? 0}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </div>
        )}
      </div>
    </div>
  );
};

Device.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default Device;
