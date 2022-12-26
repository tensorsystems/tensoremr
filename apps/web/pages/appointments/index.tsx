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

import MyBreadcrumb, { IBreadcrumb } from "../../components/breadcrumb";
import { useEffect, useState } from "react";
import { useNotificationDispatch } from "@tensoremr/notification";
import { searchAppointments } from "../../_api/appointment";
import { Appointment } from "fhir/r4";
import AppointmentTable, { IAppointmentItem } from "./appointment-table";
import { differenceInMinutes, format, parseISO } from "date-fns";
import { CogIcon } from "@heroicons/react/outline";
import useSWR from "swr";
import { getAllUsers, getAppointmentReasons } from "../../_api";
import Select from "react-select";

interface ISearchField {
  date: string | null;
  status?: string;
  appointmentType?: string;
  actor?: string;
}

export default function Appointments() {
  const notifDispatch = useNotificationDispatch();

  const [crumbs] = useState<IBreadcrumb[]>([
    { href: "/", title: "Home", icon: "home" },
    { href: "/appointments", title: "Appointments", icon: "schedule" },
  ]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useState<ISearchField>({
    date: format(new Date(), "yyyy-MM-dd"),
  });

  // Query
  const appointmentTypes =
    useSWR("appointmentTypes", () =>
      getAppointmentReasons(process.env.STORYBOOK_FHIR_URL)
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.code,
      system: e.system,
    })) ?? [];

  const practitioners =
    useSWR("users", () =>
      getAllUsers("", process.env.STORYBOOK_APP_SERVER_URL)
    ).data?.data.map((e) => ({
      value: e.id,
      label: `${e.firstName} ${e.lastName}`,
    })) ?? [];

  // Effects
  useEffect(() => {
    const params = [];

    if (searchParams.date) {
      params.push(`date=${searchParams.date}`);
    }

    if (searchParams.status) {
      params.push(`status=${searchParams.status}`);
    }

    if (searchParams.appointmentType) {
      params.push(`appointment-type=${searchParams.appointmentType}`);
    }

    if (searchParams.actor) {
      params.push(`actor=${searchParams.actor}`);
    }

    setIsLoading(true);
    searchAppointments(params.join("&"))
      .then((res) => {
        const a: Appointment[] =
          res?.data?.entry?.map((e) => e.resource as Appointment) ?? [];
        setAppointments(a);
        setIsLoading(false);
      })
      .catch((error) => {
        notifDispatch({
          type: "showNotification",
          notifTitle: "Error",
          notifSubTitle: error.message,
          variant: "failure",
        });
        setIsLoading(false);
      });
  }, [searchParams]);

  const appointmentItems: IAppointmentItem[] =
    appointments?.map((e) => ({
      id: e.id,
      patientId:
        e.participant
          .find((e) => e.actor.type === "Patient")
          .actor?.reference.split("/")[1] ?? "",
      mrn: e.identifier?.find((e) => e.type.text === "Medical record number")
        ?.value,
      patientName:
        e.participant.find((e) => e.actor.type === "Patient").actor?.display ??
        "",
      providerName:
        e.participant.find((e) => e.actor.type === "Practitioner")?.actor
          ?.display ?? "",
      appointmentType: e.appointmentType.coding.map((e) => e.code).join(", "),
      serviceType: e.serviceType
        .map((e) => e.coding.map((e) => e.display))
        .join(", "),
      status: e.status,
      response:
        e.participant.find((e) => e.actor.type === "Practitioner")?.status ??
        "",
      specialty: e.specialty
        ?.map((e) => e.coding?.map((e) => e.display))
        .join(", "),
      start: e.start ? parseISO(e.start) : undefined,
      end: e.start ? parseISO(e.end) : undefined,
      duration: e.minutesDuration
        ? e.minutesDuration
        : differenceInMinutes(parseISO(e.end), parseISO(e.start)),
      comment: e.comment,
    })) ?? [];

  return (
    <div className="h-screen">
      <MyBreadcrumb crumbs={crumbs} />
      <div className="flex bg-white w-full h-16 p-4 mt-4 rounded-md shadow-md justify-between items-center">
        <div className="flex items-center text-gray-700">
          <input
            type="date"
            id="date"
            name="date"
            value={searchParams.date}
            className="border-l-2 border-gray-200 rounded-md text-sm"
            onChange={(evt) => {
              setSearchParams({
                ...searchParams,
                date: evt.target.value,
              });
            }}
          />

          <select
            hidden
            name="userId"
            className="ml-6 border-l-2 border-gray-200 rounded-md text-sm"
          >
            <option value={"all"}>All Doctors</option>
          </select>
          <select
            className="ml-6 border-l-2 border-gray-200 rounded-md text-sm"
            name="status"
            value={searchParams.status}
            onChange={(evt) => {
              if (evt.target.value === "") {
                setSearchParams({
                  ...searchParams,
                  status: "",
                });
              } else {
                setSearchParams({
                  ...searchParams,
                  status: evt.target.value,
                });
              }
            }}
          >
            <option value={""}>All Statuses</option>
            <option value={"proposed"}>proposed</option>
            <option value={"pending"}>pending</option>
            <option value={"booked"}>booked</option>
            <option value={"arrived"}>arrived</option>
            <option value={"fulfilled"}>fulfilled</option>
            <option value={"cancelled"}>cancelled</option>
            <option value={"noshow"}>noshow</option>
            <option value={"entered-in-error"}>entered-in-error</option>
            <option value={"checked-in"}>checked-in</option>
            <option value={"waitlist"}>waitlist</option>
          </select>
          <select
            name="appointmentType"
            className="ml-6 border-l-2 border-gray-200 rounded-md text-sm"
            value={searchParams.appointmentType}
            onChange={(evt) => {
              if (evt.target.value === "") {
                setSearchParams({
                  ...searchParams,
                  appointmentType: "",
                });
              } else {
                setSearchParams({
                  ...searchParams,
                  appointmentType: evt.target.value,
                });
              }
            }}
          >
            <option value={""}>All Types</option>
            {appointmentTypes.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
          <select
            name="actor"
            className="ml-6 border-l-2 border-gray-200 rounded-md text-sm"
            value={searchParams.actor}
            onChange={(evt) => {
              if (evt.target.value === "") {
                setSearchParams({
                  ...searchParams,
                  actor: "",
                });
              } else {
                setSearchParams({
                  ...searchParams,
                  actor: evt.target.value,
                });
              }
            }}
          >
            <option value={""}>All practitioners</option>
            {practitioners.map((e) => (
              <option key={e.value} value={e.value}>
                {e.label}
              </option>
            ))}
          </select>
          <div className="ml-6 border-l-2 p-1 pl-6">
            <button className="uppercase tracking-wider text-xs rounded-md text-red-700 transform hover:scale-105">
              Clear
            </button>
          </div>
        </div>
        <div>
          <button>
            <CogIcon className="w-6 h-6 transform hover:scale-105" />
          </button>
        </div>
      </div>
      <div className="mt-4">
        <AppointmentTable items={appointmentItems} isLoading={isLoading} />
      </div>
    </div>
  );
}
