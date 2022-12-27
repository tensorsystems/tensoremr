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
import { ReactElement } from "react";
import { AdminLayout } from "..";
import useSWR from "swr";
import { NextPageWithLayout } from "../../_app";
import CreateScheduleForm from "./create-schedule-form";
import CreateSlotForm from "./create-slot-form";
import SchedulesAdminTable from "./schedules-admin-table";
import { getAllSchedules } from "../../../_api/schedule";
import { Bundle, Schedule } from "fhir/r4";

const Schedules: NextPageWithLayout = () => {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const { data, isLoading, mutate } = useSWR("schedules", () =>
    getAllSchedules()
  );

  const schedules: Bundle = data?.data;

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <SchedulesAdminTable
            isLoading={isLoading}
            schedules={
              schedules?.entry?.map((e) => e.resource as Schedule) ?? []
            }
            onSlotSelect={(
              scheduleId,
              scheduleStart,
              scheduleEnd,
              slotStart,
              slotEnd
            ) => {
              bottomSheetDispatch({
                type: "show",
                width: "medium",
                children: (
                  <CreateSlotForm
                    scheduleStart={scheduleStart}
                    scheduleEnd={scheduleEnd}
                    slotStart={slotStart}
                    slotEnd={slotEnd}
                    schedule={scheduleId}
                    onCancel={() => bottomSheetDispatch({ type: "hide" })}
                    onSuccess={(message) => {
                      bottomSheetDispatch({ type: "hide" });

                      notifDispatch({
                        type: "showNotification",
                        notifTitle: "Success",
                        notifSubTitle: message,
                        variant: "success",
                      });
                      mutate();
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
            onCreate={() => {
              bottomSheetDispatch({
                type: "show",
                width: "medium",
                children: (
                  <CreateScheduleForm
                    onSuccess={() => {
                      bottomSheetDispatch({ type: "hide" });

                      notifDispatch({
                        type: "showNotification",
                        notifTitle: "Success",
                        notifSubTitle: "Schedule created succesfully",
                        variant: "success",
                      });

                      mutate();
                    }}
                    onCancel={() => bottomSheetDispatch({ type: "hide" })}
                  />
                ),
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

Schedules.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Schedules;
