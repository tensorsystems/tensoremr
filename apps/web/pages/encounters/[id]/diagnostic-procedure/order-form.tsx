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
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  createServiceRequest,
  getExtensions,
  getRequestPriorities,
  getRequestStatuses,
  getServiceRequest,
  searchConceptChildren,
  searchLoincForms,
  updateServiceRequest,
} from "../../../../api";
import AsyncSelect from "react-select/async";
import useSWR from "swr";
import Button from "../../../../components/button";
import CodedInput from "../../../../components/coded-input";
import { ISelectOption } from "../../../../model";
import { Encounter, ServiceRequest } from "fhir/r4";
import useSWRMutation from "swr/mutation";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

export default function DiagnosticOrderForm({
  updateId,
  encounter,
  onSuccess,
}: Props) {
  const notifDispatch = useNotificationDispatch();
  const { register, setValue, handleSubmit, control } = useForm<any>({
    defaultValues: {
      status: "active",
      priority: "routine",
    },
  });
  const session: any = useSessionContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedProcedure, setSelectedProcedure] = useState<ISelectOption>();
  const [selectedBodySite, setSelectedBodySite] = useState<ISelectOption>();

  const statuses =
    useSWR("requestStatuses", () => getRequestStatuses())
      .data?.data?.expansion?.contains.map((e) => ({
        value: e.code,
        label: e.display,
        system: e.system,
      }))
      ?.filter(
        (e) =>
          e.value !== "draft" && e.value !== "on-hold" && e.value !== "unknown"
      ) ?? [];

  const priorities =
    useSWR("requestPriorities", () =>
      getRequestPriorities()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const createServiceRequestMu = useSWRMutation(
    "diagnosticServiceRequests",
    (key, { arg }) => createServiceRequest(arg)
  );

  const updateServiceRequestMu = useSWRMutation(
    "diagnosticServiceRequests",
    (key, { arg }) => updateServiceRequest(arg.id, arg.serviceRequest)
  );

  useEffect(() => {
    if (updateId) {
      updateDefaultValues(updateId);
    }
  }, [updateId]);

  const updateDefaultValues = async (updateId: string) => {
    setIsLoading(true);
    const serviceRequest: ServiceRequest = (await getServiceRequest(updateId))
      ?.data;

    const extensions = (await getExtensions()).data;

    if (serviceRequest.code) {
      setSelectedProcedure({
        value: serviceRequest?.code?.coding?.at(0)?.code,
        label: serviceRequest?.code?.coding?.at(0)?.display,
      });
    }

    const form = serviceRequest?.extension?.find(
      (ext) => ext.url === extensions.EXT_ORDER_FORM
    );

    if (form) {
      setValue("form", {
        value: form.valueCoding?.code,
        label: form.valueCoding?.display,
        system: form.valueCoding?.system,
      });
    }

    if (serviceRequest)
      if (serviceRequest.status) {
        const statusOptions =
          (await getRequestStatuses()).data?.expansion?.contains.map((e) => ({
            value: e.code,
            label: e.display,
            system: e.system,
          })) ?? [];

        setValue(
          "status",
          statusOptions.find((s) => s.value === serviceRequest.status)?.value
        );
      }

    if (serviceRequest.priority) {
      const priorityOptions =
        (await getRequestPriorities()).data?.expansion?.contains.map((e) => ({
          value: e.code,
          label: e.display,
          system: e.system,
        })) ?? [];

      setValue(
        "priority",
        priorityOptions.find((s) => s.value === serviceRequest.priority)?.value
      );
    }

    if (serviceRequest.quantityQuantity) {
      setValue("quantity", serviceRequest.quantityQuantity?.value?.toString());
    }

    if (serviceRequest.bodySite) {
      setSelectedBodySite({
        value: serviceRequest?.bodySite?.at(0)?.coding?.at(0)?.code,
        label: serviceRequest?.bodySite?.at(0)?.coding?.at(0)?.display,
      });
    }

    if (serviceRequest.note) {
      setValue("note", serviceRequest.note?.map((e) => e.text).join(", "));
    }

    setIsLoading(false);
  };

  const searchForms = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length >= 3) {
        searchLoincForms(inputValue)
          .then((resp) => {
            const values = resp?.data?.map((e) => ({
              value: e?.Id,
              label: e?.Properties?.LONG_COMMON_NAME,
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

  const searchBodySites = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 442083009",
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

  const searchProcedures = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length >= 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 71388002",
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
      const extensions = (await getExtensions()).data;

      const serviceRequest: ServiceRequest = {
        resourceType: "ServiceRequest",
        id: updateId ? updateId : undefined,
        status: input.status,
        intent: "order",
        priority: input.priority,
        category: [
          {
            coding: [
              {
                code: "103693007",
                display: "Diagnostic procedure",
                system: "http://snomed.info/sct",
              },
            ],
            text: "Diagnostic procedure",
          },
        ],
        code: selectedProcedure
          ? {
              coding: [
                {
                  code: selectedProcedure.value,
                  display: selectedProcedure.label,
                  system: "http://loinc.org",
                },
              ],
              text: selectedProcedure.label,
            }
          : undefined,
        quantityQuantity: input.quantity
          ? {
              value: parseInt(input.quantity),
            }
          : undefined,
        subject: encounter.subject,
        encounter: {
          reference: `Encounter/${encounter.id}`,
          type: "Encounter",
        },

        requester: {
          reference: `Practitioner/${session?.userId}`,
          type: "Practitioner",
        },
        bodySite: selectedBodySite
          ? [
              {
                coding: [
                  {
                    code: selectedBodySite.value,
                    display: selectedBodySite.label,
                    system: "http://snomed.info/sct",
                  },
                ],
                text: selectedBodySite.label,
              },
            ]
          : undefined,
        occurrencePeriod: encounter.period,
        note:
          input.note.length > 0
            ? [
                {
                  text: input.note,
                },
              ]
            : undefined,
        extension: input.form
          ? [
              {
                url: extensions.EXT_ORDER_FORM,
                valueCoding: {
                  code: input.form.value,
                  display: input.form.label,
                  system: "http://loinc.org",
                },
              },
            ]
          : undefined,
      };

      if (updateId) {
        await updateServiceRequestMu.trigger({
          id: updateId,
          serviceRequest,
        });
      } else {
        await createServiceRequestMu.trigger(serviceRequest);
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
        {updateId ? "Update Diagnostic Procedure" : "Add Diagnostic Procedure"}
      </p>

      <div>
        <CodedInput
          title="Procedure"
          conceptId="71388002"
          selectedItem={selectedProcedure}
          setSelectedItem={setSelectedProcedure}
          searchOptions={searchProcedures}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="search" className="block text-gray-700">
          Form
        </label>

        <Controller
          name="form"
          control={control}
          render={({ field: { onChange, value, ref } }) => (
            <AsyncSelect
              ref={ref}
              placeholder="Search ..."
              cacheOptions
              isClearable
              value={value}
              loadOptions={searchForms}
              onChange={(selected) => {
                onChange(selected);
              }}
              className="mt-1"
            />
          )}
          rules={{ required: true }}
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
          htmlFor="priority"
          className="block text-sm font-medium text-gray-700"
        >
          Priority
        </label>
        <select
          required
          {...register("priority", { required: true })}
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

      <CodedInput
        title="Body Site"
        conceptId="442083009"
        selectedItem={selectedBodySite}
        setSelectedItem={setSelectedBodySite}
        searchOptions={searchBodySites}
      />

      <div className="mt-4">
        <label htmlFor="note" className="block text-gray-700">
          Note
        </label>
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
