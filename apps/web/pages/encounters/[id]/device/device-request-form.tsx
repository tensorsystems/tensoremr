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
import { DeviceRequest, Encounter } from "fhir/r4";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import {
  createDeviceRequest,
  getDeviceRequest,
  getRequestIntents,
  getRequestPriorities,
  getRequestStatuses,
  searchConceptChildren,
  updateDeviceRequest,
} from "../../../../api";
import useSWRMutation from "swr/mutation";
import CodedInput from "../../../../components/coded-input";
import { debounce } from "lodash";
import { Tooltip } from "flowbite-react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Button from "../../../../components/button";
import { format, parseISO } from "date-fns";
import { useSession } from "../../../../context/SessionProvider";
import { getUserIdFromSession } from "../../../../util/ory";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

export default function DeviceRequestForm({
  updateId,
  encounter,
  onSuccess,
}: Props) {
  const notifDispatch = useNotificationDispatch();
  const { register, setValue, handleSubmit, control } = useForm<any>({
    defaultValues: {
      status: "active",
    },
  });
  const { session } = useSession();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (updateId) updateDefaultValues(updateId);
  }, [updateId]);

  const updateDefaultValues = async (updateId: string) => {
    setIsLoading(true);

    const deviceRequest: DeviceRequest = (await getDeviceRequest(updateId))
      ?.data;

    if (deviceRequest.codeCodeableConcept) {
      setValue("code", {
        value: deviceRequest?.codeCodeableConcept?.coding?.at(0)?.code,
        label: deviceRequest?.codeCodeableConcept?.coding?.at(0)?.display,
      });
    }

    if (deviceRequest?.status) {
      setValue("status", deviceRequest?.status);
    }

    if (deviceRequest?.intent) {
      setValue("intent", deviceRequest?.intent);
    }

    if (deviceRequest?.priority) {
      setValue("priority", deviceRequest?.priority);
    }

    if (deviceRequest?.occurrencePeriod?.start) {
      setValue(
        "occurrencePeriodStart",
        format(
          parseISO(deviceRequest?.occurrencePeriod?.start),
          "yyyy-MM-dd'T'hh:mm"
        )
      );
    }

    if (deviceRequest?.occurrencePeriod?.end) {
      setValue(
        "occurrencePeriodEnd",
        format(
          parseISO(deviceRequest?.occurrencePeriod?.end),
          "yyyy-MM-dd'T'hh:mm"
        )
      );
    }

    if(deviceRequest?.note?.at(0)?.text) {
      setValue("note", deviceRequest?.note?.at(0)?.text)
    }

    setIsLoading(false);
  };

  const statuses =
    useSWR("requestStatuses", () =>
      getRequestStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const intents =
    useSWR("requestIntents", () =>
      getRequestIntents()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const priorities =
    useSWR("requestPriorities", () =>
      getRequestPriorities()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const createDeviceRequestMu = useSWRMutation(
    "deviceRequests",
    (key, { arg }) => createDeviceRequest(arg)
  );

  const updateDeviceRequestMu = useSWRMutation(
    "deviceRequests",
    (key, { arg }) => updateDeviceRequest(arg.id, arg.deviceRequest)
  );

  const searchDevices = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 49062001",
          limit: 20,
        })
          .then((resp) => {
            const values = resp.data?.items?.map((e) => ({
              value: e.id,
              label: e?.pt?.term,
            }));

            if (values) {
              callback(values);
            }
          })
          .catch((error) => {
            notifDispatch({
              type: "showNotification",
              notifTitle: "Error",
              notifSubTitle: error.message,
              variant: "failure",
            });

            console.error(error);
          });
      }
    }, 600),
    []
  );

  const onSubmit = async (input: any) => {
    setIsLoading(true);
    try {
      const userId = session ? getUserIdFromSession(session) : "";

      const deviceRequest: DeviceRequest = {
        resourceType: "DeviceRequest",
        id: updateId ? updateId : undefined,
        codeCodeableConcept: {
          coding: [
            {
              code: input.code.value,
              display: input.code.label,
              system: "http://snomed.info/sct",
            },
          ],
          text: input.code.label,
        },
        status: input.status ? input.status : undefined,
        intent: input.intent ? input.intent : undefined,
        priority: input.priority ? input.priority : undefined,
        occurrencePeriod:
          input.occurrencePeriodStart && input.occurrencePeriodEnd
            ? {
                start: format(
                  parseISO(input.occurrencePeriodStart),
                  "yyyy-MM-dd'T'HH:mm:ssxxx"
                ),
                end: format(
                  parseISO(input.occurrencePeriodEnd),
                  "yyyy-MM-dd'T'HH:mm:ssxxx"
                ),
              }
            : undefined,
        subject: encounter.subject,
        encounter: {
          reference: `Encounter/${encounter.id}`,
          type: "Encounter",
        },
        requester: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          reference: `Practitioner/${userId}`,
          type: "Practitioner",
        },
        note: input.note
          ? [
              {
                text: input.note,
              },
            ]
          : undefined,
      };

      if (updateId) {
        await updateDeviceRequestMu.trigger({
          id: updateId,
          deviceRequest,
        });
      } else {
        await createDeviceRequestMu.trigger(deviceRequest);
      }

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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-lg font-bold tracking-wide text-teal-700 uppercase">
        {updateId ? "Update Device Request" : "Add Device Request"}
      </p>

      <div className="mt-4">
        <Controller
          name="code"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CodedInput
              title="Device"
              conceptId="49062001"
              selectedItem={value}
              setSelectedItem={(item) => onChange(item)}
              searchOptions={searchDevices}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          required
          {...register("status", { required: true })}
          className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option></option>
          {statuses.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label
          htmlFor="intent"
          className="block text-sm font-medium text-gray-700"
        >
          Intent
        </label>
        <select
          required
          {...register("intent", { required: true })}
          className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option></option>
          {intents.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700"
        >
          Priority
        </label>
        <select
          required
          {...register("priority")}
          className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option></option>
          {priorities.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <div className="flex-1">
          <label
            htmlFor="occurrencePeriodStart"
            className="block text-sm text-gray-700"
          >
            Start Period
          </label>
          <input
            type="datetime-local"
            name="occurrencePeriodStart"
            id="occurrencePeriodStart"
            {...register("occurrencePeriodStart")}
            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
          />
        </div>

        <div className="flex-1">
          <label
            htmlFor="occurrencePeriodEnd"
            className="block text-sm text-gray-700"
          >
            End Period
          </label>
          <input
            type="datetime-local"
            name="occurrencePeriodEnd"
            id="occurrencePeriodEnd"
            {...register("occurrencePeriodEnd")}
            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="note" className="block text-gray-700">
            Free Text Note
          </label>

          <Tooltip content="This field is not coded. Decision support and interactions will not be active">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          </Tooltip>
        </div>
        <input
          type="text"
          name="note"
          id="note"
          {...register("note")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        {false && <p className="text-red-600">Error: </p>}
      </div>
      <Button
        pill={true}
        loading={isLoading}
        loadingText={"Saving"}
        type="submit"
        text={updateId ? "Update" : "Save"}
        icon="save"
        variant="filled"
        disabled={isLoading}
      />
    </form>
  );
}
