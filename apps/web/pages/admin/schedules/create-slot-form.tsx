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

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { Checkbox, Label } from "flowbite-react";
import useSWRMutation from "swr/mutation";
import { ClientResponseError } from "pocketbase";
import { format } from "date-fns";
import useSWR from "swr";
import Button from "../../../components/button";
import {
  createSlot,
  getAppointmentReasons,
  getPracticeCodes,
  getSlotStatus,
} from "../../../_api";
import { Extension, Reference, Slot } from "fhir/r4";

interface Props {
  schedule: string;
  startPeriod: Date;
  endPeriod: Date;
  onCancel?: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export default function CreateSlotForm(props: Props) {
  const { schedule, startPeriod, endPeriod, onError, onSuccess, onCancel } =
    props;

  const { register, handleSubmit, setValue } = useForm<any>({
    defaultValues: {
      schedule,
    },
  });

  // State
  const [recurring, setRecurring] = useState<boolean>(false);
  const [recurrenceType, setRecurrenceType] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const specialities =
    useSWR("specialities", () =>
      getPracticeCodes()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const appointmentTypes =
    useSWR("appointmentTypes", () =>
      getAppointmentReasons()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const statuses =
    useSWR("slotStatuses", () =>
      getSlotStatus()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const { trigger } = useSWRMutation("slots", (key, { arg }) => createSlot(arg));

  useEffect(() => {
    register("specialty");
    register("appointmentType", { required: true });
    register("status", { required: true });
    register("daysOfWeek");
  }, [register]);

  const onSubmit = async (input: any) => {
    setIsLoading(true);

    try {
      // Validation
      if (!input.appointmentType) {
        throw new Error("Appointment type is required");
      }

      if (!input.status) {
        throw new Error("Status is required");
      }

      if (recurring && !recurrenceType) {
        throw new Error("Recurrence type is required");
      }

      if (recurrenceType === "weekly" && !input.daysOfWeek) {
        throw new Error("Days of week is required");
      }

      const specialty = specialities.find((e) => e.value === input.specialty);
      const appointmentType = appointmentTypes.find(
        (e) => e.value === input.appointmentType
      );
      const status = statuses.find((e) => e.value === input.status);

      const scheduleRef: Reference = {
        reference: "Schedule/" + schedule,
        type: "Schedule",
      };

      const extensions: Extension[] = [
        {
          url: "extension.tensoremr.com/SlotRecurring",
          valueBoolean: recurring,
        },
      ];

      if (recurrenceType) {
        extensions.push({
          url: "extension.tensoremr.com/SlotRecurrenceType",
          valueString: recurrenceType,
        });
      }

      if (input.daysOfWeek) {
        extensions.push({
          url: "extension.tensoremr.com/SlotRecurrenceDaysOfWeek",
          valueString: input.daysOfWeek?.toString(),
        });
      }

      const slot: Slot = {
        resourceType: "Slot",
        specialty: [
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
        ],
        appointmentType: {
          coding: [
            {
              code: appointmentType.value,
              display: appointmentType.label,
              system: appointmentType.system,
              userSelected: true,
            },
          ],
        },
        status: status.value,
        schedule: scheduleRef,
        start: format(startPeriod, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        end: format(endPeriod, "yyyy-MM-dd'T'HH:mm:ssxxx"),
        comment: input.comment.length > 0 ? input.comment : undefined,
        extension: extensions,
      };

      await trigger(slot);
      onSuccess("Slot created succefully");
    } catch (error) {
      setIsLoading(false);
      if (error instanceof ClientResponseError) {
        // onError(pocketbaseErrorMessage(error) ?? '');
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        onError(error.message ?? "");
        setErrorMessage(error.message);
      }

      console.error(error);
    }
  };

  return (
    <div className="px-8 justify-center pt-4 pb-6">
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="text-2xl font-extrabold tracking-wider text-teal-600">
          Create Slot
        </p>

        <div className="mt-4">
          <label className="block text-gray-700 ">Specialty</label>
          <Select
            options={specialities}
            className="mt-1"
            onChange={(evt) => {
              setValue("specialty", evt?.value);
            }}
          />
        </div>

        <div className="mt-4">
          <div className="flex space-x-1 items-center">
            <label className="block text-gray-700">Appointment Type</label>
            <span className="text-red-600">*</span>
          </div>

          <Select
            options={appointmentTypes}
            className="mt-1"
            onChange={(evt) => {
              setValue("appointmentType", evt?.value);
            }}
          />
        </div>

        <div className="mt-4">
          <div className="flex space-x-1 items-center">
            <label className="block text-gray-700">Status</label>
            <span className="text-red-600">*</span>
          </div>
          <Select
            options={statuses}
            className="mt-1"
            onChange={(evt) => {
              if (evt?.value) {
                setValue("status", evt?.value);
              }
            }}
          />
        </div>

        <div className="mt-5 flex space-x-6">
          <div className="w-full border border-gray-300 rounded-md p-1">
            <label
              htmlFor="startPeriod"
              className="block  font-medium text-gray-700"
            >
              Start Period
            </label>
            {format(startPeriod, "hh:mm a")}
          </div>

          <div className="w-full border border-gray-300 rounded-md p-1">
            <label
              htmlFor="endPeriod"
              className="block font-medium text-gray-700"
            >
              End Period
            </label>
            {format(endPeriod, "hh:mm a")}
          </div>
        </div>

        <div className="w-full mt-4">
          <label htmlFor="comment" className="block  font-medium text-gray-700">
            Comment
          </label>
          <input
            type="text"
            id="comment"
            {...register("comment")}
            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
          />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Checkbox
            id="recurring"
            name="recurring"
            onChange={(evt) => {
              setRecurring(evt.target.checked);
            }}
          />
          <Label htmlFor="recurring">Recurring Slot</Label>
        </div>

        {recurring && (
          <div className="mt-4">
            <div className="flex space-x-1 items-center">
              <label className="block text-gray-700 text-sm">
                Recurrence Type
              </label>
            </div>
            <Select
              options={[
                { value: "daily", label: "Daily" },
                { value: "weekly", label: "Weekly" },
              ]}
              className="mt-1"
              onChange={(evt) => {
                if (evt?.value) setRecurrenceType(evt.value);
              }}
            />
          </div>
        )}

        {recurrenceType === "weekly" && (
          <div className="mt-4">
            <div className="flex space-x-1 items-center">
              <label className="block text-gray-700 text-sm">
                Days of Week
              </label>
            </div>
            <Select
              isMulti
              options={[
                { value: 0, label: "Sunday" },
                { value: 1, label: "Monday" },
                { value: 2, label: "Tuesday" },
                { value: 3, label: "Wednesday" },
                { value: 4, label: "Thursday" },
                { value: 5, label: "Friday" },
                { value: 6, label: "Saturday" },
              ]}
              className="mt-1"
              onChange={(values) => {
                setValue(
                  "daysOfWeek",
                  values.map((e) => e.value)
                );
              }}
            />
          </div>
        )}

        <div className="mt-4">
          {errorMessage && (
            <p className="text-red-600">Error: {errorMessage}</p>
          )}
        </div>

        <div className="mt-4">
          <Button
            loading={isLoading}
            loadingText={"Saving"}
            type="submit"
            text="Create"
            icon="save"
            variant="filled"
            disabled={false}
            onClick={() => null}
          />
        </div>
      </form>
    </div>
  );
}
