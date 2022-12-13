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


import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";

import { useQuery } from "@tanstack/react-query";
import { formatISO } from "date-fns";

interface Props {
  scheduleId: string;
  startPeriod: string;
  endPeriod: string;
  onSlotSelect: (scheduleId: string, start: Date, end: Date) => void;
}

export default function SlotCalendar(props: Props) {
  const { scheduleId, startPeriod, endPeriod, onSlotSelect } = props;

  // Query
  // const slotsQuery = useQuery(['slots'], () =>
  //   PocketBaseClient.records.getFullList('slots', 100, {
  //     filter: `schedule="${scheduleId}"`,
  //   })
  // );

  // const recurringEvents =
  //   slotsQuery.data
  //     ?.filter((e) => e.recurring === true)
  //     .map((e) => ({
  //       groupId: e.id,
  //       startTime: e.startTime,
  //       endTime: e.endTime,
  //       daysOfWeek: e.daysOfWeek ? e.daysOfWeek : undefined,
  //     })) ?? [];

  // const nonRecurringEvents =
  //   slotsQuery.data
  //     ?.filter((e) => e.recurring === false)
  //     .map((e) => {
  //       return {
  //         start: formatISO(new Date(e.startPeriod)),
  //         end: formatISO(new Date(e.endPeriod)),
  //       };
  //     }) ?? [];

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      headerToolbar={{
        left: "prev,next",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      initialView="dayGridMonth"
      validRange={{
        start: startPeriod,
        end: endPeriod,
      }}
      //    events={[...recurringEvents, ...nonRecurringEvents]}
      editable={true}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      select={(evt) => {
        onSlotSelect(scheduleId, evt.start, evt.end);
      }}
    />
  );
}
