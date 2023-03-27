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

import { Encounter } from "fhir/r4";
import { useRouter } from "next/router";
import { ReactElement, useState } from "react";
import { getEncounter } from "../../../../api";
import { PaginationInput } from "../../../../model";
import { NextPageWithLayout } from "../../../_app";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import useSWR from "swr";
import Button from "../../../../components/button";
import { EncounterLayout } from "..";
import DeviceRequestForm from "./device-request-form";

const Device: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const [expandedIdx, setExpandedIdx] = useState<number>(-1);

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
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Ordered by
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
        </table>
      </div>
    </div>
  );
};

Device.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default Device;
