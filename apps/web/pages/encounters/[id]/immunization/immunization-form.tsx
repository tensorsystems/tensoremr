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
import { Encounter, Immunization } from "fhir/r4";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";
import Select from "react-select";
import useSWRMutation from "swr/mutation";
import {
  createImmunization,
  getImmunization,
  getImmunizationFundingSources,
  getImmunizationRoutes,
  getImmunizationStatuses,
  getImmunizationSubpotentReason,
  getServerTime,
  searchConceptChildren,
  updateImmunization,
} from "../../../../api";
import CodedInput from "../../../../components/coded-input";
import { debounce } from "lodash";
import { Label } from "flowbite-react";
import Button from "../../../../components/button";
import { format, parseISO } from "date-fns";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

export default function ImmunizationForm({
  updateId,
  encounter,
  onSuccess,
}: Props) {
  const notifDispatch = useNotificationDispatch();
  const { register, setValue, handleSubmit, control, watch } = useForm<any>({
    defaultValues: {
      status: "active",
    },
  });

  const isSubpotent = watch().isSubpotent;

  const session: any = useSessionContext();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (updateId) updateDefaultValues(updateId);
  }, [updateId]);

  const updateDefaultValues = async (updateId: string) => {
    setIsLoading(true);

    const immunization: Immunization = (await getImmunization(updateId))?.data;

    if (immunization?.vaccineCode) {
      setValue("vaccineCode", {
        value: immunization?.vaccineCode?.coding?.at(0)?.code,
        label: immunization?.vaccineCode?.coding?.at(0)?.display,
      });
    }

    if (immunization?.status) {
      setValue("status", immunization?.status);
    }

    if (immunization?.occurrenceString) {
      setValue("occurrenceString", immunization?.occurrenceString);
    }

    if (immunization?.site) {
      setValue("site", {
        value: immunization?.site?.coding?.at(0)?.code,
        label: immunization?.site?.coding?.at(0)?.display,
      });
    }

    if (immunization?.route) {
      setValue("route", immunization?.route?.coding?.at(0)?.code);
    }

    if (immunization?.doseQuantity) {
      setValue("doseQuantity", immunization?.doseQuantity?.value);
    }

    if (immunization?.isSubpotent) {
      setValue("isSubpotent", immunization?.isSubpotent);
    }

    if (immunization?.subpotentReason) {
      setValue("subpotentReason", {
        value: immunization?.subpotentReason?.at(0)?.coding?.at(0)?.code,
        label: immunization?.subpotentReason?.at(0)?.coding?.at(0)?.display,
      });
    }

    if (immunization?.fundingSource) {
      setValue("fundingSource", {
        value: immunization?.fundingSource?.coding?.at(0)?.code,
        label: immunization?.fundingSource?.coding?.at(0)?.display,
      });
    }

    setIsLoading(false);
  };

  const createImmunizationMu = useSWRMutation("immunizations", (key, { arg }) =>
    createImmunization(arg)
  );

  const updateImmunizationMu = useSWRMutation("immunizations", (key, { arg }) =>
    updateImmunization(arg.id, arg.immunization)
  );

  const statuses =
    useSWR("immunizationStatuses", () =>
      getImmunizationStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const routes =
    useSWR("immunizationRoutes", () =>
      getImmunizationRoutes()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const immunizationSubpotentReasons =
    useSWR("immunizationSubpotentReasons", () =>
      getImmunizationSubpotentReason()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const immunizationFundingSources =
    useSWR("immunizationFundingSources", () =>
      getImmunizationFundingSources()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const searchImmunizations = useCallback(
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

  const searchBodySites = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 33879002",
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
      const time = (await getServerTime()).data;

      const route = routes?.find((r) => r.value === input.route);

      const immunization: Immunization = {
        resourceType: "Immunization",
        id: updateId ? updateId : undefined,
        occurrenceString: input.occurrenceString
          ? input.occurrenceString
          : undefined,
        vaccineCode: input?.vaccineCode
          ? {
              coding: [
                {
                  code: input?.vaccineCode?.value,
                  display: input?.vaccineCode?.label,
                },
              ],
              text: input?.vaccineCode?.label,
            }
          : undefined,
        status: input?.status,
        site: input.site
          ? {
              coding: [
                {
                  code: input?.site?.value,
                  display: input?.site?.label,
                },
              ],
              text: input?.site?.label,
            }
          : undefined,
        route: route
          ? {
              coding: [
                {
                  code: route.value,
                  display: route.label,
                },
              ],
              text: route.label,
            }
          : undefined,
        doseQuantity: input?.doseQuantity
          ? {
              value: parseInt(input.doseQuantity),
            }
          : undefined,
        isSubpotent: isSubpotent,
        subpotentReason: input.subpotentReason
          ? [
              {
                coding: [
                  {
                    code: input.subpotentReason.value,
                    display: input.subpotentReason.label,
                    system: input.subpotentReason.system,
                  },
                ],
                text: input.subpotentReason.label,
              },
            ]
          : undefined,
        fundingSource: input.fundingSource
          ? {
              coding: [
                {
                  code: input.fundingSource.value,
                  display: input.fundingSource.label,
                  system: input.fundingSource.system,
                },
              ],
              text: input.fundingSource.label,
            }
          : undefined,
        note: input.note
          ? [
              {
                text: input.note,
              },
            ]
          : undefined,
        patient: encounter.subject,
        encounter: {
          reference: `Encounter/${encounter.id}`,
          type: "Encounter",
        },
        recorded: format(parseISO(time), "yyyy-MM-dd'T'HH:mm:ssxxx"),
        performer: [
          {
            actor: {
              reference: `Practitioner/${session?.userId}`,
              type: "Practitioner",
            },
          },
        ],
      };

      if (updateId) {
        await updateImmunizationMu.trigger({
          id: updateId,
          immunization: immunization,
        });
      } else {
        await createImmunizationMu.trigger(immunization);
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
        {updateId ? "Update Immunization" : "Add Immunizaton"}
      </p>

      <div className="mt-4">
        <Controller
          name="vaccineCode"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CodedInput
              title="Vaccine"
              conceptId="33879002"
              selectedItem={value}
              setSelectedItem={(item) => onChange(item)}
              searchOptions={searchImmunizations}
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

      <div className="w-full mt-4">
        <label htmlFor="occurrenceString" className="block text-gray-700">
          Occurance
        </label>
        <input
          required
          id="occurrenceString"
          type="text"
          placeholder="Occurrence"
          {...register("occurrenceString", { required: true })}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <Controller
          name="site"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CodedInput
              title="Site"
              conceptId="442083009"
              selectedItem={value}
              setSelectedItem={(item) => onChange(item)}
              searchOptions={searchBodySites}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="route"
          className="block text-sm font-medium text-gray-700"
        >
          Route
        </label>
        <select
          {...register("route")}
          className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option></option>
          {routes.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="doseQuantity" className="block text-gray-700">
          Dosage
        </label>
        <input
          type="text"
          name="doseQuantity"
          id="doseQuantity"
          {...register("doseQuantity")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4 flex space-x-4 items-center">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isSubpotent"
            name="isSubpotent"
            {...register("isSubpotent")}
          />

          <Label htmlFor="isSubpotent">Subpotent</Label>
        </div>
        <div hidden={!isSubpotent} className="flex-1">
          <Controller
            name="subpotentReason"
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Select
                isClearable
                ref={ref}
                value={value}
                options={immunizationSubpotentReasons}
                placeholder="Reason"
                onChange={(evt) => {
                  onChange(evt);
                }}
              />
            )}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Funding Source</label>
        <Controller
          name="fundingSource"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={immunizationFundingSources}
              placeholder="Funding source"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="mt-4">
        {false && <p className="text-red-600">Error: </p>}
      </div>
      <div className="mt-5">
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
      </div>
    </form>
  );
}
