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
import { AppointmentInput, ISelectOption } from "@tensoremr/models";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";
import { useNotificationDispatch } from "@tensoremr/notification";
import Select from "react-select";
import Button from "./button";
import useSWR from "swr";
import {
  getAllUsers,
  getAppointmentReasons,
  getPatient,
  getPracticeCodes,
  getServiceTypes,
} from "../_api";
import SlotFinder from "./slot-finder";
import { Modal } from "./modal";
import {
  Appointment,
  AppointmentParticipant,
  Patient,
  Schedule,
  Slot,
} from "fhir/r4";
import { compareAsc, format, isWithinInterval, parseISO } from "date-fns";
import { createAppointment } from "../_api/appointment";
import { Checkbox, Label, Spinner } from "flowbite-react";

interface Props {
  patientId: string;
  updateId?: string;
  defaultValues?: AppointmentInput;
  onSuccess: () => void;
  onFailure: (message: string) => void;
  onCancel: () => void;
}

interface IAppointmentForm {
  appointmentType: ISelectOption;
  serviceType: ISelectOption;
  specialty: ISelectOption;
  start: string;
  end: string;
  minutesDuration: number;
  comment: string;
  participants: ISelectOption[];
}

export default function AppointmentForm(props: Props) {
  const notifDispatch = useNotificationDispatch();

  const { patientId, onSuccess, onCancel } = props;

  // States
  const [slotFinderOpen, setSlotFinderOpen] = useState<boolean>(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule>();
  const [selectedSlot, setSelectedSlot] = useState<Slot>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [participants, setParticipants] = useState<any[]>([]);
  const [useDuration, setUseDuration] = useState<boolean>(false);

  const { register, handleSubmit, setValue, watch } = useForm<IAppointmentForm>(
    {
      defaultValues: {
        minutesDuration: 15,
      },
    }
  );

  // Query
  const practitioners =
    useSWR("users", () => getAllUsers("")).data?.data.map((e) => ({
      value: e.id,
      label: `${e.firstName} ${e.lastName}`,
    })) ?? [];

  const patientQuery = useSWR(`patient/${patientId}`, () =>
    getPatient(patientId)
  );

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

  // Mutation
  const { trigger } = useSWRMutation("appointments", (key, { arg }) =>
    createAppointment(arg)
  );

  useEffect(() => {
    register("appointmentType");
    register("serviceType");
    register("specialty");
    register("start");
    register("end");
    register("minutesDuration");
  }, [register]);

  useEffect(() => {
    if (selectedSlot) {
      const appointmentTypeCoding = selectedSlot.appointmentType?.coding?.at(0);
      if (appointmentTypeCoding) {
        setValue("appointmentType", {
          value: appointmentTypeCoding.code,
          label: appointmentTypeCoding.display,
        });
      }

      const serviceTypeCoding = selectedSlot.serviceType?.at(0)?.coding?.at(0);
      if (serviceTypeCoding) {
        setValue("serviceType", {
          value: serviceTypeCoding.code,
          label: serviceTypeCoding.display,
        });
      }

      const specialtyCoding = selectedSlot.specialty?.at(0)?.coding?.at(0);
      if (specialtyCoding) {
        setValue("specialty", {
          value: specialtyCoding.code,
          label: specialtyCoding.display,
        });
      }

      setValue(
        "start",
        format(parseISO(selectedSlot.start), "yyyy-MM-dd'T'HH:mm")
      );
      setValue("end", format(parseISO(selectedSlot.end), "yyyy-MM-dd'T'HH:mm"));
    }
  }, [selectedSlot]);

  useEffect(() => {
    if (selectedSchedule) {
      const p: any[] = [];

      selectedSchedule.actor
        .filter((e) => e.type === "Practitioner")
        .forEach((actor) => {
          p.push({
            value: actor.reference?.split("/")[1],
            label: `${actor.display} (primary performer)`,
          });
        });

      const patient = patientQuery.data?.data as Patient;
      p.push({
        value: patient.id,
        label: `${patient.name
          .map((e) => `${e.given.join(", ")} ${e.family}`)
          .join(", ")} (subject)`,
      });

      setParticipants(p);
    }
  }, [selectedSchedule]);

  const onSubmit = async (input: any) => {
    setIsLoading(true);
    try {
      // Validate date range
      const start = parseISO(input.start);
      const end = parseISO(input.end);

      const errMessage = datesInvalid(
        start,
        end,
        parseISO(selectedSlot.start),
        parseISO(selectedSlot.end)
      );

      if (errMessage !== null) {
        throw new Error(errMessage);
      }

      const serviceType = serviceTypes.find(
        (e) => e.value === input.serviceType?.value
      );

      const specialty = specialities.find(
        (e) => e.value === input.specialty?.value
      );

      const appointmentType = appointmentTypes.find(
        (e) => e.value === input.appointmentType?.value
      );

      const appointmentParticipants: AppointmentParticipant[] = [];

      selectedSchedule.actor
        .filter((e) => e.type === "Practitioner")
        .forEach((actor) => {
          appointmentParticipants.push({
            type: [
              {
                coding: [
                  {
                    code: "PPRF",
                    display: "primary performer",
                    system:
                      "http://hl7.org/fhir/ValueSet/encounter-participant-type",
                  },
                ],
                text: "primary performer",
              },
            ],
            actor: {
              reference: `Practitioner/${actor.reference?.split("/")[1]}`,
              type: "Practitioner",
              display: actor.display,
            },
            status: "needs-action",
            required: "required",
          });
        });

      const patient = patientQuery.data?.data as Patient;
      appointmentParticipants.push({
        type: [
          {
            coding: [
              {
                code: "SBJ",
                display: "subject",
                system:
                  "http://hl7.org/fhir/ValueSet/encounter-participant-type",
              },
            ],
            text: "subject",
          },
        ],
        actor: {
          reference: `Patient/${patient.id}`,
          type: "Patient",
          display: `${patient.name
            .map((e) => `${e.given.join(", ")} ${e.family}`)
            .join(", ")}`,
        },
        status: "accepted",
        required: "required",
      });

      const appointment: Appointment = {
        resourceType: "Appointment",
        status: "proposed",
        serviceType: serviceType
          ? [
              {
                coding: [
                  {
                    code: serviceType.value,
                    display: serviceType.label,
                    system: serviceType.system,
                    userSelected: true,
                  },
                ],
              },
            ]
          : undefined,
        specialty: specialty
          ? [
              {
                coding: [
                  {
                    code: specialty.value,
                    display: specialty.label,
                    system: specialty.system,
                    userSelected: true,
                  },
                ],
              },
            ]
          : undefined,
        appointmentType: appointmentType
          ? {
              coding: [
                {
                  code: appointmentType.value,
                  display: appointmentType.label,
                  system: appointmentType.system,
                  userSelected: true,
                },
              ],
            }
          : undefined,
        start: useDuration
          ? undefined
          : format(parseISO(input.start), "yyyy-MM-dd'T'HH:mm:ssxxx"),
        end: useDuration
          ? undefined
          : format(parseISO(input.end), "yyyy-MM-dd'T'HH:mm:ssxxx"),
        minutesDuration: useDuration ? input.minutesDuration : undefined,
        slot: [
          {
            reference: `Slot/${selectedSlot.id}`,
            type: "Slot",
          },
        ],
        comment: input.comment.length > 0 ? input.comment : undefined,
        participant: appointmentParticipants,
      };

      await trigger(appointment);
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        notifDispatch({
          type: "showNotification",
          notifTitle: "Error",
          notifSubTitle: error.message,
          variant: "failure",
        });
      }

      console.error(error);
    }

    setIsLoading(false);
  };

  const values = watch();
  const patient = patientQuery?.data?.data as Patient;

  if (patientId && patientQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner color="warning" aria-label="Patient loading" />
      </div>
    );
  }

  return (
    <div className="my-10 mx-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="float-right">
          <button onClick={onCancel}>
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

        <p className="text-xl font-extrabold text-teal-800">{`Create Appointment`}</p>

        <p className="text-gray-500">
          {patient.name.map((e) => `${e.given.join(", ")} ${e.family}`)}
        </p>

        <div className="mt-8">
          <div>
            {selectedSlot ? (
              <button
                type="button"
                className="uppercase text-yellow-600 underline"
                onClick={() => {
                  setSelectedSlot(null);
                  setSlotFinderOpen(true);
                }}
              >
                Find other slots
              </button>
            ) : (
              <button
                type="button"
                className="uppercase text-teal-600 underline"
                onClick={() => setSlotFinderOpen(true)}
              >
                Find Available Slots
              </button>
            )}
          </div>
          <div className="mt-4" hidden={!selectedSlot}>
            <div className="flex space-x-1 items-center">
              <label className="block text-gray-700">Appointment Type</label>
            </div>

            <Select
              options={appointmentTypes}
              className="mt-1"
              value={values.appointmentType}
              onChange={(evt) => {
                setValue("appointmentType", evt);
              }}
            />
          </div>

          <div className="mt-4" hidden={!selectedSlot}>
            <label className="block text-gray-700 ">Service Type</label>
            <Select
              options={serviceTypes}
              placeholder="Service Type"
              className="mt-1"
              value={values.serviceType}
              onChange={(evt) => {
                setValue("serviceType", evt);
              }}
            />
          </div>

          <div className="mt-4" hidden={!selectedSlot}>
            <label className="block text-gray-700 ">Specialty</label>
            <Select
              options={specialities}
              className="mt-1"
              placeholder="Specialty of practitioner"
              value={values.specialty}
              onChange={(evt) => {
                setValue("specialty", evt);
              }}
            />
          </div>

          <div className="mt-4" hidden={!selectedSlot}>
            <label className="block text-gray-700 ">Participants</label>
            <Select
              isMulti
              className="mt-1"
              placeholder="Participants"
              value={participants}
              onChange={(evt) => {
                //setValue("specialty", evt);
              }}
            />
          </div>

          <div className="mt-5 flex items-center gap-2">
            <Checkbox
              id="useDuration"
              name="useDuration"
              value={useDuration + ""}
              onChange={(evt) => {
                setUseDuration(evt.target.checked);
              }}
            />
            <Label htmlFor="recurring">Use Duration</Label>
          </div>

          {useDuration ? (
            <div className="w-full mt-4">
              <label
                htmlFor="minutesDuration"
                className="block font-medium text-gray-700"
              >
                Minutes
              </label>
              <input
                type="number"
                id="minutesDuration"
                {...register("minutesDuration")}
                className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
              />
            </div>
          ) : (
            <div className="mt-3 flex space-x-6">
              <div className="w-full">
                <label
                  htmlFor="start"
                  className="block font-medium text-gray-700"
                >
                  Start
                </label>
                <input
                  required
                  type="datetime-local"
                  id="start"
                  disabled={!selectedSlot}
                  {...register("start", { required: true })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="end"
                  className="block font-medium text-gray-700"
                >
                  End
                </label>
                <input
                  required
                  type="datetime-local"
                  id="end"
                  disabled={!selectedSlot}
                  {...register("end", { required: true })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>
            </div>
          )}

          <div className="w-full mt-4">
            <label
              htmlFor="comment"
              className="block  font-medium text-gray-700"
            >
              Comment
            </label>
            <input
              type="text"
              id="comment"
              {...register("comment")}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          {/*error && (
            <div className="mt-4">
              <p className="text-red-600">Error: {error.message}</p>
            </div>
          )*/}

          <div className="py-3 mt-2 bg-gray-50 text-right">
            <Button
              loading={isLoading}
              loadingText={"Saving"}
              type="submit"
              text="Save"
              icon="save"
              variant="filled"
              disabled={!selectedSlot}
              onClick={() => null}
            />
          </div>
        </div>
      </form>
      <Modal open={slotFinderOpen} onClose={() => setSlotFinderOpen(false)}>
        <SlotFinder
          onError={(message) =>
            notifDispatch({
              type: "showNotification",
              notifTitle: "Error",
              notifSubTitle: message,
              variant: "failure",
            })
          }
          onClose={() => setSlotFinderOpen(false)}
          onSlotSelect={(slot, schedule) => {
            console.log("Slot", slot);
            setSlotFinderOpen(false);
            setSelectedSlot(slot);
            setSelectedSchedule(schedule);
          }}
        />
      </Modal>
    </div>
  );
}

const datesInvalid = (
  start: Date,
  end: Date,
  rangeStart: Date,
  rangeEnd: Date
) => {
  if (
    !isWithinInterval(start, {
      start: rangeStart,
      end: rangeEnd,
    })
  ) {
    return "Start time falls outside slot time";
  }

  if (
    !isWithinInterval(end, {
      start: rangeStart,
      end: rangeEnd,
    })
  ) {
    return "End time falls outside slot time";
  }

  if (compareAsc(end, start) !== 1) {
    return "Start time cannot come after end time";
  }

  return null;
};
