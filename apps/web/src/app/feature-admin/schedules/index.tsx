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

import React from "react";

import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import SchedulesAdminTable, { Schedule } from "./SchedulesAdminTable";
import { useQuery } from "@tanstack/react-query";
import PocketBaseClient from "../../pocketbase-client";
import CreateScheduleForm from "./CreateScheduleForm";
import CreateSlotForm from "./CreateSlotForm";
import { getAppointmentReasons, getSlotStatus } from "../../api";

export const ScheduleAdminPage: React.FC = () => {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  // Query
  const schedulesQuery = useQuery(["schedules"], () =>
    PocketBaseClient.records.getList("schedules", 1, 20)
  );

  const practiceCodesQuery = useQuery(["practiceCodes"], () =>
    PocketBaseClient.records.getList("codings", 1, 500, {
      filter: `system='http://hl7.org/fhir/ValueSet/c80-practice-codes'`,
    })
  );

  const appointmentTypesQuery = useQuery(["appointmentTypes"], () =>
    getAppointmentReasons()
  );

  const slotStatusesQuery = useQuery(["slotStatuses"], () => getSlotStatus());

  const schedules: Schedule[] =
    schedulesQuery.data?.items.map((e) => ({
      id: e.id,
      resourceType: e.resourceType,
      resource: e.actorDisplay,
      serviceType: e.serviceTypeDisplay,
      speciality: e.specialtyDisplay,
      startPeriod: e.startPeriod,
      endPeriod: e.endPeriod,
      recurring: e.recurring,
    })) ?? [];

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <SchedulesAdminTable
            schedules={schedules}
            onSlotSelect={(scheduleId, start, end) => {
              bottomSheetDispatch({
                type: "show",
                snapPoint: 0,
                children: (
                  <CreateSlotForm
                    schedule={scheduleId}
                    startPeriod={start}
                    endPeriod={end}
                    specialties={
                      practiceCodesQuery.data?.items.map((e) => ({
                        value: e.id,
                        label: e.display,
                      })) ?? []
                    }
                    appointmentTypes={
                      appointmentTypesQuery.data?.data.expansion?.contains.map(
                        (e: any) => ({
                          value: e.code,
                          label: e.display,
                        })
                      ) ?? []
                    }
                    statuses={
                      slotStatusesQuery.data?.data.expansion?.contains.map((e: any) => ({
                        value: e.code,
                        label: e.display,
                      })) ?? []
                    }
                    onCancel={() => bottomSheetDispatch({ type: "hide" })}
                    onSuccess={(message) => {
                      bottomSheetDispatch({ type: "hide" });

                      notifDispatch({
                        type: "showNotification",
                        notifTitle: "Success",
                        notifSubTitle: message,
                        variant: "success",
                      });
                      schedulesQuery.refetch();
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
                snapPoint: 0,
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

                      schedulesQuery.refetch();
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
