/* eslint-disable @typescript-eslint/ban-ts-comment */
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

import { Encounter, Immunization } from "fhir/r4";
import { useNotificationDispatch } from "@tensoremr/notification";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import useSWR from "swr";
import {
  createImmunization,
  getExtensions,
  getImmunization,
  getImmunizationFundingSources,
  getImmunizationOrigins,
  getImmunizationReasons,
  getImmunizationRoutes,
  getImmunizationSites,
  getImmunizationStatuses,
  getImmunizationSubpotentReason,
  getServerTime,
  getVaccineCodes,
  updateImmunization,
} from "../../../../api";
import { ISelectOption } from "@tensoremr/models";
import Select from "react-select";
import { Checkbox, Label } from "flowbite-react";
import Button from "../../../../components/button";
import { format, parseISO } from "date-fns";
import useSWRMutation from "swr/mutation";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

const ImmunizationForm: React.FC<Props> = ({
  updateId,
  encounter,
  onSuccess,
}) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue, control } = useForm<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubpotent, setIsSubpotent] = useState<boolean>(false);

  // @ts-ignore
  const { data: session } = useSession();

  const createImmunizationMu = useSWRMutation("immunizations", (key, { arg }) =>
    createImmunization(arg)
  );

  const updateImmunizationMu = useSWRMutation("immunizations", (key, { arg }) =>
    updateImmunization(arg.id, arg.immunization)
  );

  const vaccineCodes =
    useSWR("vaccineCodes", () =>
      getVaccineCodes()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const immunizationStatuses =
    useSWR("immunizationStatuses", () =>
      getImmunizationStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const immunizationOrigins =
    useSWR("immunizationOrigins", () =>
      getImmunizationOrigins()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const immunizationSites =
    useSWR("immunizationSites", () =>
      getImmunizationSites()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const immunizationRoutes =
    useSWR("immunizationRoutes", () =>
      getImmunizationRoutes()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const immunizationReasons =
    useSWR("immunizationReasons", () =>
      getImmunizationReasons()
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

  // Effects
  useEffect(() => {
    if (updateId) {
      updateDefaultValues(updateId);
    }
  }, [updateId]);

  const updateDefaultValues = async (updateId: string) => {
    setIsLoading(true);
    const immunization: Immunization = (await getImmunization(updateId))?.data;

    const status = immunization?.status;
    if (status) {
      const statusOptions =
        (await getImmunizationStatuses()).data?.expansion?.contains.map(
          (e) => ({
            value: e.code,
            label: e.display,
            system: e.system,
          })
        ) ?? [];
      setValue(
        "status",
        statusOptions.find((s) => s.value === status)
      );
    }

    const vaccineCode = immunization?.vaccineCode?.coding?.at(0);
    if (vaccineCode) {
      setValue("vaccineCode", {
        label: vaccineCode.display,
        value: vaccineCode.code,
      });
    }

    const occurrenceString = immunization?.occurrenceString;
    if (occurrenceString) {
      setValue("occurrenceString", occurrenceString);
    }

    const reportOrigin = immunization?.reportOrigin?.coding?.at(0);
    if (reportOrigin) {
      setValue("reportOrigin", {
        label: reportOrigin.display,
        value: reportOrigin.code,
      });
    }

    const site = immunization?.site?.coding?.at(0);
    if (site) {
      setValue("site", {
        label: site.display,
        value: site.code,
      });
    }

    const route = immunization?.route?.coding?.at(0);
    if (route) {
      setValue("route", {
        label: route.display,
        value: route.code,
      });
    }

    const dosage = immunization?.doseQuantity;
    if (dosage) {
      setValue("doseQuantity", dosage.value);
    }

    const reason = immunization?.reasonCode?.at(0)?.coding?.at(0);
    if (reason) {
      setValue("reason", {
        label: reason.display,
        value: reason.code,
      });
    }

    setIsSubpotent(immunization?.isSubpotent ?? false);

    const subpotentReason = immunization?.subpotentReason?.at(0)?.coding?.at(0);
    if (subpotentReason) {
      setValue("subpotentReason", {
        label: subpotentReason.display,
        value: subpotentReason.code,
      });
    }

    const fundingSource = immunization?.fundingSource?.coding?.at(0);
    if (fundingSource) {
      setValue("fundingSource", {
        label: fundingSource.display,
        value: fundingSource.code,
      });
    }
    setIsLoading(false);
  };

  const onSubmit = async (input: any) => {
    setIsLoading(true);

    try {
      const time = (await getServerTime()).data;
      const extensions = (await getExtensions()).data;

      const vaccineCode = vaccineCodes.find(
        (e) => e.value === input.vaccineCode.value
      );

      const immunization: Immunization = {
        resourceType: "Immunization",
        id: updateId ? updateId : undefined,
        status: input.status?.value ? input.status?.value : undefined,
        occurrenceString: input.occurrenceString
          ? input.occurrenceString
          : undefined,
        vaccineCode: vaccineCode
          ? {
              coding: [
                {
                  code: vaccineCode.value,
                  display: vaccineCode.label,
                  system: vaccineCode.system,
                },
              ],
              text: vaccineCode.label,
            }
          : undefined,
        patient: encounter.subject,
        recorded: format(parseISO(time), "yyyy-MM-dd'T'HH:mm:ssxxx"),
        reportOrigin: input.reportOrigin
          ? {
              coding: [
                {
                  code: input.reportOrigin.value,
                  display: input.reportOrigin.label,
                  system: input.reportOrigin.system,
                },
              ],
              text: input.reportOrigin.label,
            }
          : undefined,
        site: input.site
          ? {
              coding: [
                {
                  code: input.site.value,
                  display: input.site.label,
                  system: input.site.system,
                },
              ],
              text: input.site.label,
            }
          : undefined,
        route: input.route
          ? {
              coding: [
                {
                  code: input.route.value,
                  display: input.route.label,
                  system: input.route.system,
                },
              ],
              text: input.route.label,
            }
          : undefined,
        reasonCode: input.reason
          ? [
              {
                coding: [
                  {
                    code: input.reason.value,
                    display: input.reason.label,
                    system: input.reason.system,
                  },
                ],
                text: input.reason.label,
              },
            ]
          : undefined,
        doseQuantity: input.doseQuantity
          ? {
              value: parseInt(input.doseQuantity),
            }
          : undefined,
        note:
          input.note?.length > 0
            ? [
                {
                  text: input.note,
                },
              ]
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
        extension: [
          {
            url: extensions.EXT_CONDITION_TYPE,
            valueString: "immunization-history",
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
    <form onSubmit={handleSubmit(onSubmit)} className="mb-10">
      <p className="text-lg font-bold tracking-wide text-teal-700 uppercase">
        {updateId ? "Update Immunization" : "Add Immunization"}
      </p>

      <div className="mt-4">
        <label
          htmlFor="vaccineCode"
          className="block font-medium text-gray-700"
        >
          Vaccine
        </label>

        <Controller
          name="vaccineCode"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={vaccineCodes}
              placeholder="Search"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
          rules={{ required: true }}
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Status</label>
        <Controller
          name="status"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={immunizationStatuses}
              placeholder="Status"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="w-full mt-4">
        <label htmlFor="occurrenceString" className="block text-gray-700">
          Occurance
        </label>
        <input
          id="occurrenceString"
          type="text"
          placeholder="Occurrence"
          {...register("occurrenceString")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Origin</label>

        <Controller
          name="reportOrigin"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={immunizationOrigins}
              placeholder="Origin"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Site</label>

        <Controller
          name="site"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={immunizationSites}
              placeholder="Site"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Route</label>

        <Controller
          name="route"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={immunizationRoutes}
              placeholder="Route"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="w-full mt-4">
        <label htmlFor="doseQuantity" className="block text-gray-700">
          Dosage
        </label>
        <input
          id="doseQuantity"
          type="number"
          placeholder="Dosage Quantity"
          {...register("doseQuantity")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Reason</label>

        <Controller
          name="reason"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={immunizationReasons}
              placeholder="Reason"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="mt-4 flex space-x-4 items-center">
        <div className="flex items-center gap-2">
          <Checkbox
            id="isSubpotent"
            checked={isSubpotent}
            onChange={() => setIsSubpotent(!isSubpotent)}
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
              placeholder="Reason"
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
};

export default ImmunizationForm;
