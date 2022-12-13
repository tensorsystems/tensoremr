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
import { Lookup, SlotsRecord } from "@tensoremr/models";
import { ClientResponseError } from "pocketbase";
import { format } from "date-fns";
import AsyncSelect from "react-select/async";
import Button from "../../../components/button";

interface Props {
  schedule: string;
  startPeriod: Date;
  endPeriod: Date;
  specialties: Lookup[];
  appointmentTypes: Lookup[];
  statuses: Lookup[];
  onCancel?: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

interface Slot {
  serviceCategory?: string;
  serviceCategoryDisplay?: string;
  serviceType?: string;
  serviceTypeDisplay?: string;
  specialty?: string;
  specialtyDisplay?: string;
  appointmentType?: string;
  appointmentTypeDisplay?: string;
  schedule: string;
  status: string;
  statusDisplay: string;
  overbooked: boolean;
  comment?: string;
  startPeriod: string;
  endPeriod: string;
  startTime: string;
  endTime: string;
  recurring: boolean;
  recurrenceType: string;
  daysOfWeek?: number[];
}

export default function CreateSlotForm(props: Props) {
  const {
    schedule,
    startPeriod,
    endPeriod,
    specialties,
    appointmentTypes,
    statuses,
    onError,
    onSuccess,
    onCancel,
  } = props;

  const { register, handleSubmit, setValue } = useForm<Slot>({
    defaultValues: {
      schedule,
    },
  });

  // State
  const [serviceType, setServiceType] = useState<Lookup>();
  const [recurring, setRecurring] = useState<boolean>(false);
  const [recurrenceType, setRecurrenceType] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    register("specialty");
    register("appointmentType", { required: true });
    register("status", { required: true });
    register("daysOfWeek");
  }, [register]);

  const serviceTypesLoad = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    if (inputValue.length > 0) {
      // TO-DO: Implement
      // PocketBaseClient.records
      //   .getList('codings', 1, 20, {
      //     filter: `system='http://terminology.hl7.org/CodeSystem/service-type' && display~"${inputValue}"`,
      //   })
      //   .then((resp) => {
      //     const values = resp.items?.map((e) => ({
      //       value: e.id,
      //       label: e.display,
      //     }));
      //     if (values) {
      //       callback(values);
      //     }
      //   });
    }
  };

  const onSubmit = async (input: any) => {
    setIsLoading(true);

    try {
      // Validation
      if (!serviceType) {
        throw new Error("Service type is required");
      }

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

      const specialty = specialties.find((e) => e.value === input.specialty);
      const appointmentType = appointmentTypes.find(
        (e) => e.value === input.appointmentType
      );
      const status = statuses.find((e) => e.value === input.status);

      const slot: SlotsRecord = {
        serviceType: serviceType?.value,
        serviceTypeDisplay: serviceType?.label,
        specialty: specialty?.value,
        specialtyDisplay: specialty?.label,
        appointmentType: appointmentType?.value,
        appointmentTypeDisplay: appointmentType?.label,
        schedule: schedule,
        status: status?.value ?? "",
        statusDisplay: status?.label,
        recurring: recurring,
        recurrenceType: recurrenceType,
        startPeriod: format(startPeriod, "yyyy-MM-dd'T'H:mm:ss"),
        endPeriod: format(endPeriod, "yyyy-MM-dd'T'H:mm:ss"),
        startTime: format(startPeriod, "H:mm:ss"),
        endTime: format(endPeriod, "H:mm:ss"),
        daysOfWeek: input.daysOfWeek,
        overbooked: false,
        comment: input.comment,
      };

      // TO-DO: Impement
      // await PocketBaseClient.records.create('slots', slot);
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
    <div className="container mx-auto flex justify-center my-14">
      <div className="w-1/2">
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
            <div className="flex space-x-1 items-center">
              <label className="block text-gray-700">Service Type</label>
              <span className="text-red-600">*</span>
            </div>
            <AsyncSelect
              placeholder={"Service to be performed"}
              cacheOptions={true}
              defaultOptions
              isClearable={true}
              loadOptions={serviceTypesLoad}
              onChange={(selected: Lookup) => {
                setServiceType(selected);
              }}
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 ">Specialty</label>
            <Select
              options={specialties}
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
    </div>
  );
}
