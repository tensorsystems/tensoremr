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
import useSWR from "swr";

import { formatISO, parseISO } from "date-fns";
import { getSlotsBySchedule } from "../../_api";
import { Slot } from "fhir/r4";
import { Spinner } from "flowbite-react";

interface Props {
  scheduleId: string;
  startPeriod: string;
  endPeriod: string;
  onSlotSelect: (
    scheduleId: string,
    scheduleStart: Date,
    scheduleEnd: Date,
    slotStart: Date,
    slotEnd: Date
  ) => void;
}

export default function SlotCalendar(props: Props) {
  const { scheduleId, startPeriod, endPeriod, onSlotSelect } = props;

  // Query
  const slotsQuery = useSWR("slots", () => getSlotsBySchedule(scheduleId));

  const slots: Slot[] = slotsQuery?.data?.data.entry?.map(
    (e) => e.resource as Slot
  );

  const events =
    slots?.map((e) => {
      return {
        start: formatISO(new Date(e.start)),
        end: formatISO(new Date(e.end)),
        title: e.appointmentType.coding.map((e) => e.code).join(", "),
      };
    }) ?? [];

  if (slotsQuery.isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner color="warning" aria-label="Button loading" />
      </div>
    );
  }

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
      eventMaxStack={1}
      events={events}
      editable={true}
      selectable={true}
      selectMirror={true}
      dayMaxEvents={true}
      select={(evt) => {
        onSlotSelect(
          scheduleId,
          parseISO(startPeriod),
          parseISO(endPeriod),
          evt.start,
          evt.end
        );
      }}
    />
  );
}
