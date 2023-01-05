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
import { formatISO } from "date-fns";
import { Bundle, Schedule, Slot } from "fhir/r4";
import { Spinner } from "flowbite-react";
import { ISelectOption } from "@tensoremr/models";

interface Props {
  onSlotSelect: (slot: Slot, schedule: Schedule) => void;
  onError?: (message: string) => void;
  onClose: () => void;
}

interface ISearchField {
  practioner: ISelectOption | null;
  speciality: ISelectOption | null;
  serviceType: ISelectOption | null;
  appointmentType: ISelectOption | null;
}

export default function SlotFinder({ onSlotSelect, onError, onClose }: Props) {
  // State
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [searchFields, setSearchFields] = useState<ISearchField>({
    practioner: null,
    speciality: null,
    serviceType: null,
    appointmentType: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Query
  const practitioners =
    useSWR("users", () =>
      getAllUsers("", )
    ).data?.data.map((e) => ({
      value: e.id,
      label: `${e.firstName} ${e.lastName}`,
    })) ?? [];

  const specialities =
    useSWR("specialities", () =>
      getPracticeCodes()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const serviceTypes =
    useSWR("serviceTypes", () =>
      getServiceTypes()
    )?.data?.data?.concept?.map((e) => ({
      value: e.code,
      label: e.display,
      system: "http://hl7.org/fhir/ValueSet/service-type",
    })) ?? [];

  const appointmentTypes =
    useSWR("appointmentTypes", () =>
      getAppointmentReasons()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  // Effect
  useEffect(() => {
    const searchParams = ["_include=Slot:schedule"];
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

    searchSlots(searchParams.join("&"))
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

  const events =
    slots?.map((e) => {
      return {
        groupId: e.id,
        start: formatISO(new Date(e.start)),
        end: formatISO(new Date(e.end)),
        title: getSlotTitle(schedules, e),
        color: getSlotColor(e.status),
      };
    }) ?? [];

  return (
    <div>
      <div className="float-right">
        <button onClick={onClose}>
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
                  <div className="w-2 h-2 rounded-full bg-[#9333ea]"></div>
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

            <div className="mt-10 px-10 rounded-md p-5 shadow-md bg-slate-50 text-sm sm:h-72 md:h-80 lg:h-96 xl:h-full  overflow-y-scroll">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                headerToolbar={{
                  left: "prev,next",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek,timeGridDay",
                }}
                initialView="dayGridMonth"
                events={events}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents={true}
                eventMaxStack={1}
                validRange={{
                  start: new Date(),
                }}
                eventClick={(evt) => {
                  const slot = slots.find((e) => e.id === evt.event.groupId);
                  if (slot) {
                    if (slot.status !== "free") {
                      alert(
                        "This slot is not free and cannot be used at the moment"
                      );
                      return;
                    }
                    
                    const schedule = schedules?.find(
                      (s) => s.id === slot.schedule.reference.split("/")[1]
                    );
                    onSlotSelect(slot, schedule);
                  }
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
        const names = a.display?.split(" ");

        return names ? `${names[0]} ${names[1].charAt(0)}` : "";
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
  if (status === "busy-unavailable") return "#9333ea";
  if (status === "entered-in-error") return "#475569";
};
