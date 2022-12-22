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

import React, { useEffect, useState } from "react";
import Select from "react-select";
import useSWR from "swr";
import {
  getAllUsers,
  getAppointmentReasons,
  getPracticeCodes,
  getServiceTypes,
  searchSlots,
} from "../_api";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import { format, formatISO, parseISO } from "date-fns";
import { Bundle, Schedule, Slot } from "fhir/r4";
import {
  EXT_SLOT_RECURRENCE_DAYS_OF_WEEK,
  EXT_SLOT_RECURRING,
} from "../extensions";
import { Spinner } from "flowbite-react";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
  onError?: (message: string) => void;
}

interface ISelectOption {
  value: string;
  label: string;
}

interface ISearchField {
  practioner: ISelectOption | null;
  speciality: ISelectOption | null;
  serviceType: ISelectOption | null;
  appointmentType: ISelectOption | null;
}

export default function SlotFinder({ onError }: Props) {
  // State
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [searchFields, setSearchFields] = useState<ISearchField>({
    practioner: null,
    speciality: null,
    serviceType: null,
    appointmentType: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Query
  const practitioners =
    useSWR("users", () =>
      getAllUsers("", process.env.STORYBOOK_APP_SERVER_URL)
    ).data?.data.map((e) => ({
      value: e.id,
      label: `${e.firstName} ${e.lastName}`,
    })) ?? [];

  const specialities =
    useSWR("specialities", () =>
      getPracticeCodes(process.env.STORYBOOK_FHIR_URL)
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const serviceTypes =
    useSWR("serviceTypes", () =>
      getServiceTypes(process.env.STORYBOOK_APP_SERVER_URL)
    )?.data?.data?.concept?.map((e) => ({
      value: e.code,
      label: e.display,
      system: "http://hl7.org/fhir/ValueSet/service-type",
    })) ?? [];

  const appointmentTypes =
    useSWR("appointmentTypes", () =>
      getAppointmentReasons(process.env.STORYBOOK_FHIR_URL)
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  // Effect
  useEffect(() => {
    const searchParams = ["_include=Slot:schedule:actor:display"];
    if (searchFields.practioner) {
      searchParams.push(
        `schedule.actor=Practitioner/${searchFields.practioner.value}`
      );
    }

    if (searchFields.serviceType) {
      searchParams.push(`service-type=${searchFields.serviceType.value}`);
    }

    if (searchFields.speciality) {
      searchParams.push(`specialty=${searchFields.speciality.value}`);
    }

    if (searchFields.appointmentType) {
      searchParams.push(
        `appointment-type=${searchFields.appointmentType.value}`
      );
    }

    setIsLoading(true);

    searchSlots(searchParams.join("&"), process.env.STORYBOOK_FHIR_URL)
      .then((res) => {
        const bundle: Bundle = res.data;
        const slots =
          bundle.entry
            ?.filter((e) => e.search.mode === "match")
            .map((e) => e.resource as Slot) ?? [];
        const schedules =
          bundle.entry
            ?.filter((e) => e.search.mode === "include")
            .map((e) => e.resource as Schedule) ?? [];
        setSlots(slots);
        setSchedules(schedules);
        setIsLoading(false);
      })
      .catch((error) => {
        onError && onError(error.message);
        setIsLoading(false);
      });
  }, [searchFields]);

  const recurringEvents =
    slots
      ?.filter((e) => {
        const recurringExt = e.extension.find(
          (e) => e.url === EXT_SLOT_RECURRING
        );
        return recurringExt.valueBoolean === true;
      })
      .map((e) => {
        const daysOfWeek = e.extension.find(
          (e) => e.url === EXT_SLOT_RECURRENCE_DAYS_OF_WEEK
        );

        return {
          groupId: e.id,
          title: getSlotTitle(schedules, e),
          startTime: format(parseISO(e.start), "HH:mm:ss"),
          endTime: format(parseISO(e.end), "HH:mm:ss"),
          daysOfWeek: daysOfWeek ? `[${daysOfWeek.valueString}]` : undefined,
          color: getSlotColor(e.status),
        };
      }) ?? [];

  const nonRecurringEvents =
    slots
      ?.filter((e) => {
        const recurringExt = e.extension.find(
          (e) => e.url === EXT_SLOT_RECURRING
        );
        return recurringExt.valueBoolean === false;
      })
      .map((e) => {
        return {
          start: formatISO(new Date(e.start)),
          end: formatISO(new Date(e.end)),
          title: getSlotTitle(schedules, e),
          color: getSlotColor(e.status),
        };
      }) ?? [];

  return (
    <div className="my-8 mx-6">
      <div>
        <div>
          <p className="text-2xl font-extrabold tracking-wider text-teal-600">
            Find Slots
          </p>
        </div>
        <div className="mt-4 flex items-center space-x-5">
          <div className="flex-1 z-10">
            <Select
              options={practitioners}
              placeholder="Practitioner"
              className="mt-1"
              value={searchFields.practioner}
              onChange={(evt) => {
                setSearchFields({
                  ...searchFields,
                  practioner: evt,
                });
              }}
            />
          </div>
          <div className="flex-1 z-10">
            <Select
              options={serviceTypes}
              placeholder="Service Type"
              className="mt-1"
              value={searchFields.serviceType}
              onChange={(evt) => {
                setSearchFields({
                  ...searchFields,
                  serviceType: evt,
                });
              }}
            />
          </div>
          <div className="flex-1 z-10">
            <Select
              options={specialities}
              placeholder="Speciality"
              className="mt-1"
              value={searchFields.speciality}
              onChange={(evt) => {
                setSearchFields({
                  ...searchFields,
                  speciality: evt,
                });
              }}
            />
          </div>
          <div className="flex-1 z-10">
            <Select
              options={appointmentTypes}
              placeholder="Appointment Type"
              className="mt-1"
              value={searchFields.appointmentType}
              onChange={(evt) => {
                setSearchFields({
                  ...searchFields,
                  appointmentType: evt,
                });
              }}
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => {
                setSearchFields({
                  practioner: null,
                  speciality: null,
                  serviceType: null,
                  appointmentType: null,
                });
              }}
            >
              <span className="material-icons text-red-500 py-1">
                clear_all
              </span>
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center mt-10">
            <Spinner color="warning" aria-label="Calendar loading" />
          </div>
        ) : (
          <div>
            <div className="mt-4 flex justify-between">
              <div className="text-xs text-slate-600">
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-[#047857]"></div>
                  <div>Free</div>
                </div>
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-[#dc2626]"></div>
                  <div>Busy</div>
                </div>
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-[#f59e0b]"></div>
                  <div>Busy tentative</div>
                </div>
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-[#0d9488]"></div>
                  <div>Busy unavailable</div>
                </div>
                <div className="flex space-x-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-[#475569]"></div>
                  <div>Entered in error</div>
                </div>
              </div>
              <div className="text-xs text-slate-600">
                <div className="flex space-x-1 items-center">
                  <div>R - </div>
                  <div>Routine</div>
                </div>
                <div className="flex space-x-1 items-center">
                  <div>W - </div>
                  <div>Walkin</div>
                </div>
                <div className="flex space-x-1 items-center">
                  <div>C - </div>
                  <div>Checkup</div>
                </div>
                <div className="flex space-x-1 items-center">
                  <div>F - </div>
                  <div>Followup</div>
                </div>
                <div className="flex space-x-1 items-center">
                  <div>E - </div>
                  <div>Emergency</div>
                </div>
              </div>
            </div>

            <div className="mt-10 px-10 rounded-md p-5 shadow-md bg-slate-50 text-sm">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "prev,next",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                initialView="timeGridWeek"
                events={[...recurringEvents, ...nonRecurringEvents]}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                select={(evt) => {
                  // onSlotSelect(scheduleId, evt.start, evt.end);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const getSlotTitle = (schedules: Schedule[], e: Slot) => {
  const schedule = schedules?.find(
    (s) => s.id === e.schedule.reference.split("/")[1]
  );

  let title = "";
  if (schedule) {
    const name = schedule.actor
      .map((a) => {
        const names = a.display.split(" ");

        return `${names[0]} ${names[1].charAt(0)}`;
      })
      .join(", ");

    title = name;
  }

  if (e.appointmentType?.coding?.length > 0) {
    const initial = getAppointmentTypeInitialFromCode(
      e.appointmentType.coding[0].code
    );
    title = title.concat(` (${initial})`);
  }

  return title;
};

const getAppointmentTypeInitialFromCode = (value: string) => {
  if (value === "ROUTINE") return "R";
  if (value === "WALKIN") return "W";
  if (value === "CHECKUP") return "C";
  if (value === "FOLLOWUP") return "F";
  if (value === "EMERGENCY") return "E";
  return "";
};

const getSlotColor = (status: string) => {
  if (status === "free") return "#047857";
  if (status === "busy") return "#dc2626";
  if (status === "busy-tentative") return "#f59e0b";
  if (status === "busy-unavailable") return "#0d9488";
  if (status === "entered-in-error") return "#475569";
};
