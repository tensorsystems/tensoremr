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

import { useForm } from "react-hook-form";
import {
  createLocation,
  getCurrentOrganization,
  getDaysOfWeek,
  getLocationOperationalStatuses,
  getLocationPhysicalTypes,
  getLocationStatuses,
  getLocationTypes,
} from "../../../_api";
import useSWR from "swr";
import Select from "react-select";
import { Checkbox, Label } from "flowbite-react";
import Button from "../../../components/button";
import { useEffect, useState } from "react";
import { Location } from "fhir/r4";
import { AxiosError } from "axios";
import useSWRMutation from "swr/mutation";
import { useNotificationDispatch } from "@tensoremr/notification";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
}

export default function LocationForm({ onCancel, onSuccess }: Props) {
  const notifDispatch = useNotificationDispatch();
  const { register, setValue, handleSubmit } = useForm<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allDay, setAllDay] = useState<boolean>(false);

  const physicalTypes =
    useSWR("locationPhysicalTypes", () =>
      getLocationPhysicalTypes()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const locationTypes =
    useSWR("locationTypes", () =>
      getLocationTypes()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const locationStatuses =
    useSWR("locationStatuses", () =>
      getLocationStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const locationOperationalStatuses =
    useSWR("locationOperationalStatuses", () =>
      getLocationOperationalStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const locationDaysOfWeek =
    useSWR("locationDaysOfWeek", () =>
      getDaysOfWeek()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const locationMutation = useSWRMutation("locations", (key, { arg }) =>
    createLocation(arg)
  );

  useEffect(() => {
    register("physicalType");
    register("type");
    register("status");
    register("operationalStatus");
    register("daysOfWeek");
  }, []);

  const onSubmit = async (input: any) => {
    setIsLoading(true);

    try {
      const status = locationStatuses.find(
        (e) => e.value === input.status?.value
      );

      const operationalStatus = locationOperationalStatuses.find(
        (e) => e.value === input.operationalStatus?.value
      );
      const type = locationTypes.find((e) => e.value === input.type?.value);
      const physicalType = physicalTypes.find(
        (e) => e.value === input.physicalType?.value
      );

      const organizationId = await (await getCurrentOrganization())?.data?.id;

      const location: Location = {
        resourceType: "Location",
        status: status ? status.value : undefined,
        operationalStatus: operationalStatus
          ? {
              code: operationalStatus.value,
              display: operationalStatus.label,
              system: operationalStatus.system,
            }
          : undefined,
        name: input.name ? input.name : undefined,
        description: input.description ? input.description : undefined,
        type: type
          ? [
              {
                coding: [
                  {
                    code: type.value,
                    display: type.label,
                    system: type.system,
                  },
                ],
                text: type.label,
              },
            ]
          : undefined,
        physicalType: physicalType
          ? {
              coding: [
                {
                  code: physicalType.value,
                  display: physicalType.label,
                  system: physicalType.system,
                },
              ],
              text: physicalType.label,
            }
          : undefined,
        hoursOfOperation: [
          {
            daysOfWeek: input.daysOfWeek
              ? input.daysOfWeek.map((e) => e.value)
              : undefined,
            allDay: allDay,
            openingTime: input.openingTime ? input.openingTime : undefined,
            closingTime: input.closingTime ? input.closingTime : undefined,
          },
        ],
        managingOrganization: {
          reference: `Organization/${organizationId}`,
          type: "Organization",
        },
      };

      await locationMutation.trigger(location);
      onSuccess();
    } catch (error) {
      if (error instanceof AxiosError) {
        notifDispatch({
          type: "showNotification",
          notifTitle: "Error",
          notifSubTitle: error.response?.data?.message ?? error.message,
          variant: "failure",
        });
      } else if (error instanceof Error) {
        notifDispatch({
          type: "showNotification",
          notifTitle: "Error",
          notifSubTitle: error.message,
          variant: "failure",
        });
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="mb-10 mt-2">
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="text-xl font-extrabold text-teal-800">New Location</p>

        <div className="mt-4">
          <label htmlFor="name" className="block  font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Name"
            {...register("name")}
            className="mt-1 p-1 pl-4 block w-full border-gray-300 border rounded-md"
          />
        </div>

        <div className="mt-4">
          <label
            htmlFor="description"
            className="block  font-medium text-gray-700"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            placeholder="Description"
            {...register("description")}
            className="mt-1 p-1 pl-4 block w-full border-gray-300 border rounded-md"
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 ">Type</label>
          <Select
            isClearable
            options={physicalTypes}
            placeholder="Physical Type"
            className="mt-1"
            onChange={(evt) => {
              setValue("physicalType", evt);
            }}
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 ">Service Type</label>
          <Select
            isClearable
            options={locationTypes}
            placeholder="Service Type"
            className="mt-1"
            onChange={(evt) => {
              setValue("type", evt);
            }}
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700">Status</label>
          <Select
            isClearable
            options={locationStatuses}
            placeholder="Status"
            className="mt-1"
            onChange={(evt) => {
              setValue("status", evt);
            }}
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700">Operational Status</label>
          <Select
            isClearable
            options={locationOperationalStatuses}
            placeholder="Operational Status"
            className="mt-1"
            onChange={(evt) => {
              setValue("operationalStatus", evt);
            }}
          />
        </div>

        <div className="flex space-x-3 items-center mt-4">
          <div className="flex-1 ">
            <label className="block text-gray-700">Days of Operation</label>
            <Select
              isClearable
              isMulti
              options={locationDaysOfWeek}
              className="mt-1"
              onChange={(evt) => {
                setValue("daysOfWeek", evt);
              }}
            />
          </div>

          <div className="flex items-center space-x-2 mt-6">
            <Checkbox
              id="allDay"
              name="allDay"
              value={allDay + ""}
              onChange={(evt) => {
                setAllDay(evt.target.checked);
              }}
            />
            <Label htmlFor="recurring">All day</Label>
          </div>
        </div>

        {!allDay && (
          <div className="mt-4 flex space-x-6">
            <div className="w-full">
              <label
                htmlFor="openingTime"
                className="block font-medium text-gray-700"
              >
                Opening
              </label>
              <input
                type="time"
                id="openingTime"
                {...register("openingTime")}
                className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
              />
            </div>

            <div className="w-full">
              <label
                htmlFor="closingTime"
                className="block font-medium text-gray-700"
              >
                Closing
              </label>
              <input
                type="time"
                id="closingTime"
                {...register("closingTime")}
                className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
              />
            </div>
          </div>
        )}

        <div className="py-3 mt-2 bg-gray-50 text-right">
          <Button
            loading={isLoading}
            loadingText={"Saving"}
            type="submit"
            text="Create"
            icon="save"
            variant="filled"
            disabled={isLoading}
            onClick={() => null}
          />
        </div>
      </form>
    </div>
  );
}
