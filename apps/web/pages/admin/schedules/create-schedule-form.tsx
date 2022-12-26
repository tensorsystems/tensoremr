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

import { useNotificationDispatch } from "@tensoremr/notification";
import { addMonths, format, parseISO } from "date-fns";
import { Checkbox, Label, Radio } from "flowbite-react";
import { ClientResponseError } from "pocketbase";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";
import { Reference, Schedule } from "fhir/r4";
import Button from "../../../components/button";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { getAllUsers, getPracticeCodes, getServiceTypes } from "../../../_api";
import { createSchedule } from "../../../_api";
import { EXT_SCHEDULE_RECURRING } from "../../../extensions";

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

type ResourceType =
  | "Practitioner"
  | "Patient"
  | "Device"
  | "HealthcareService"
  | "Room";

export default function CreateScheduleForm(props: Props) {
  const { onSuccess, onCancel } = props;

  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue, getValues } = useForm<any>({
    defaultValues: {
      resourceType: "practitioner",
      recurring: false,
      startPeriod: format(new Date(), "yyyy-MM-dd"),
      endPeriod: format(addMonths(new Date(), 1), "yyyy-MM-dd"),
    },
  });

  // State
  const [resourceType, setResourceType] =
    useState<ResourceType>("Practitioner");
  const [startPeriod, setStartPeriod] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Query
  const practitioners =
    useSWR("users", () => getAllUsers("")).data?.data.map((e) => ({
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
    useSWR("serviceTypes", () => getServiceTypes())?.data?.data?.concept?.map(
      (e) => ({
        value: e.code,
        label: e.display,
        system: "http://hl7.org/fhir/ValueSet/service-type",
      })
    ) ?? [];

  // Mutation
  const { trigger } = useSWRMutation("schedules", (key, { arg }) =>
    createSchedule(arg)
  );

  // Effects
  useEffect(() => {
    register("practitioner", { required: true });
    register("specialty");
    register("recurring");
  }, [register]);

  const onSubmit = async (input: any) => {
    setIsLoading(true);

    try {
      let reference = "";
      let resourceDisplay = "";

      if (resourceType === "Practitioner" && input.practitioner) {
        const practitioner = practitioners.find(
          (e) => e.value === input.practitioner
        );

        reference = "Practitioner/" + practitioner.value;
        resourceDisplay = practitioner.label;
      }

      if (reference.length === 0) {
        throw new Error("Something went wrong");
      }

      const actor: Reference = {
        reference: reference,
        display: resourceDisplay,
        type: resourceType,
      };

      const serviceType = serviceTypes.find(
        (e) => e.value === input.serviceType
      );
      const specialty = specialities.find((e) => e.value === input.specialty);

      const schedule: Schedule = {
        resourceType: "Schedule",
        active: true,
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
        actor: [actor],
        extension: [
          {
            url: EXT_SCHEDULE_RECURRING,
            valueBoolean: input.recurring,
          },
        ],
        planningHorizon: {
          start: format(startPeriod, "yyyy-MM-dd"),
          end: format(addMonths(startPeriod, 1), "yyyy-MM-dd"),
        },
      };

      await trigger(schedule);
      onSuccess();
    } catch (error) {
      setIsLoading(false);
      if (error instanceof ClientResponseError) {
        // notifDispatch({
        //   type: "showNotification",
        //   notifTitle: "Error",
        //   notifSubTitle: pocketbaseErrorMessage(error) ?? "",
        //   variant: "failure",
        // });
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        notifDispatch({
          type: "showNotification",
          notifTitle: "Error",
          notifSubTitle: error.message,
          variant: "failure",
        });

        setErrorMessage(error.message);
      }

      console.error(error);
    }

    setIsLoading(false);
  };

  const handleResourceTypeChange = () => {
    const values = getValues();

    setResourceType(values.resourceType);
  };

  const handleStartPeriodChange = (
    evt: React.ChangeEvent<HTMLInputElement>
  ) => {
    const startPeriod = parseISO(evt.target.value);
    setStartPeriod(startPeriod);
  };

  return (
    <div className="px-8 justify-center pt-4 pb-6">
      <div>
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
            Add Schedule
          </p>

          <div className="mt-4 border rounded-md shadow-sm">
            <div className="w-full bg-gray-100 p-2">
              <fieldset>
                <legend>Resource Type</legend>
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center gap-2">
                    <Radio
                      id="practitioner"
                      value="practitioner"
                      {...register("resourceType", { required: true })}
                      onChange={handleResourceTypeChange}
                    />
                    <Label htmlFor="practitioner">Practitioner</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio
                      id="patient"
                      value="patient"
                      {...register("resourceType", { required: true })}
                      onChange={handleResourceTypeChange}
                    />
                    <Label htmlFor="patient">Patient</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <Radio
                      id="device"
                      value="device"
                      {...register("resourceType", { required: true })}
                      onChange={handleResourceTypeChange}
                    />
                    <Label htmlFor="device">Device</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio
                      id="healthcareService"
                      value="healthcareService"
                      {...register("resourceType", { required: true })}
                      onChange={handleResourceTypeChange}
                    />
                    <Label htmlFor="healthcareService">
                      Healthcare Service
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio
                      id="location"
                      value="location"
                      {...register("resourceType", { required: true })}
                      onChange={handleResourceTypeChange}
                    />
                    <Label htmlFor="location">Room</Label>
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="p-3">
              {resourceType === "Practitioner" && (
                <Select
                  placeholder="Select practitioner"
                  options={practitioners}
                  name="practitioner"
                  onChange={(evt) => {
                    setValue("practitioner", evt.value);
                  }}
                />
              )}
            </div>
          </div>

          <div className="mt-5 flex space-x-6">
            <div className="w-full">
              <label
                htmlFor="startPeriod"
                className="block  font-medium text-gray-700"
              >
                Start Period
              </label>
              <input
                required
                type="date"
                id="startPeriod"
                {...register("startPeriod", { required: true })}
                className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                onChange={(evt) => handleStartPeriodChange(evt)}
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="endPeriod"
                className="block font-medium text-gray-700"
              >
                End Period
              </label>
              <input
                disabled
                required
                type="date"
                name="endPeriod"
                id="endPeriod"
                value={format(addMonths(startPeriod, 1), "yyyy-MM-dd")}
                className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Checkbox
              id="recurring"
              name="recurring"
              onChange={(evt) => {
                setValue("recurring", evt.target.checked);
              }}
            />
            <Label htmlFor="recurring">Recurring Schedule</Label>
          </div>

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
              text="Save"
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
