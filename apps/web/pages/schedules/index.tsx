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
import useSWR from "swr";
import CreateScheduleForm from "./create-schedule-form";
import CreateSlotForm from "./create-slot-form";
import SchedulesAdminTable from "./schedules-admin-table";
import { getAllSchedules } from "../../_api/schedule";
import { Bundle, Schedule } from "fhir/r4";
import MyBreadcrumb, { IBreadcrumb } from "../../components/breadcrumb";
import { useEffect, useState } from "react";
import { PaginationInput } from "../../_model";

export default function SchedulesPage() {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();
  const [page, setPage] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });

  const [crumbs] = useState<IBreadcrumb[]>([
    { href: "/", title: "Home", icon: "home" },
    { href: "/schedules", title: "Schedules", icon: "event" },
  ]);

  const { data, isLoading, isValidating, mutate } = useSWR("schedules", () =>
    getAllSchedules(page)
  );

  useEffect(() => {
    mutate();
  }, [page]);

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

  const schedules: Bundle = data?.data;

  return (
    <div className="h-full">
      <MyBreadcrumb crumbs={crumbs} />

      <div className="overflow-x-auto">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <SchedulesAdminTable
            isLoading={isLoading || isValidating}
            schedules={
              schedules?.entry?.map((e) => e.resource as Schedule) ?? []
            }
            totalCount={schedules?.total ?? 0}
            onNext={handleNext}
            onPrevious={handlePrevious}
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
}
