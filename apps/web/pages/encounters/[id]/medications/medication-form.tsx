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

import { Encounter, MedicationIngredient, MedicationStatement } from "fhir/r4";
import { useNotificationDispatch } from "@tensoremr/notification";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import AsyncSelect from "react-select/async";
import { ISelectOption } from "@tensoremr/models";
import {
  createMedication,
  createMedicationStatement,
  getAllRelatedInfo,
  getApproximateTerms,
  getMedicationStatementCategories,
  getMedicationStatementStatuses,
  getServerTime,
  getTimingAbbreviations,
  searchConceptChildren,
  updateMedication,
  updateMedicationStatement,
} from "../../../../api";
import { debounce } from "lodash";
import useSWR from "swr";
import Button from "../../../../components/button";
import useSWRMutation from "swr/mutation";
import { Tooltip } from "flowbite-react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import CodedInput from "../../../../components/coded-input";
import { format, parseISO } from "date-fns";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

const MedicationForm: React.FC<Props> = ({
  updateId,
  encounter,
  onSuccess,
}) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, control } = useForm<any>();

  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedMedication, setSelectedMedication] = useState<ISelectOption>();

  const createMedicationStatementMu = useSWRMutation(
    "medicationStatements",
    (key, { arg }) => createMedicationStatement(arg)
  );

  const updateMedicationStatementMu = useSWRMutation(
    "medicationStatements",
    (key, { arg }) => updateMedicationStatement(arg.id, arg.medicationStatement)
  );

  const medicationStatuses =
    useSWR("medicationStatementStatuses", () =>
      getMedicationStatementStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const medicationCategories =
    useSWR("medicationStatementCategories", () =>
      getMedicationStatementCategories()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const timingAbbreviations =
    useSWR("timingAbbreviations", () =>
      getTimingAbbreviations()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const searchMedications = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        getApproximateTerms(inputValue)
          .then((resp) => {
            const values = resp.data?.approximateGroup?.candidate
              ?.filter((e) => e.source === "RXNORM")
              ?.map((e) => ({
                value: e?.rxcui,
                label: e?.name,
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

  const searchAdditionalDosages = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 419492006",
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

  const searchMethods = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 422096002",
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

      const category = medicationCategories?.find(
        (e) => e.value === input.category
      );

      const sig = timingAbbreviations?.find((e) => e.value === input.sig);

      const medicationStatement: MedicationStatement = {
        resourceType: "MedicationStatement",
        status: input.status,
        category: category
          ? {
              coding: [
                {
                  code: category.value,
                  display: category.label,
                  system: category.system,
                },
              ],
              text: category.label,
            }
          : undefined,
        medicationCodeableConcept: {
          coding: [
            {
              code: input.code.value,
              display: input.code.label,
              system: "http://www.nlm.nih.gov/research/umls/rxnorm",
            },
          ],
          text: input.code.label,
        },
        subject: encounter.subject,
        context: {
          reference: `Encounter/${encounter.id}`,
          type: "Encounter",
        },
        dateAsserted: format(parseISO(time), "yyyy-MM-dd'T'HH:mm:ssxxx"),
        informationSource: encounter.subject,
        note:
          input.note.length > 0
            ? [
                {
                  text: input.note,
                },
              ]
            : undefined,
        dosage: [
          {
            additionalInstruction: input.additionalInstruction
              ? [
                  {
                    coding: [
                      {
                        code: input.additionalInstruction.value,
                        display: input.additionalInstruction.label,
                        system: "http://snomed.info/sct",
                      },
                    ],
                    text: input.additionalInstruction.label,
                  },
                ]
              : undefined,
            patientInstruction:
              input.patientInstruction?.length > 0
                ? input.patientInstruction
                : undefined,
            timing: {
              code: sig
                ? {
                    coding: [
                      {
                        code: sig.value,
                        display: sig.label,
                        system: sig.system,
                      },
                    ],
                    text: sig.label,
                  }
                : undefined,
              repeat: {
                boundsPeriod: {
                  start: input.dosagePeriodStart
                    ? format(
                        parseISO(input.dosagePeriodStart),
                        "yyyy-MM-dd'T'HH:mm:ssxxx"
                      )
                    : undefined,
                  end: input.dosagePeriodEnd
                    ? format(
                        parseISO(input.dosagePeriodEnd),
                        "yyyy-MM-dd'T'HH:mm:ssxxx"
                      )
                    : undefined,
                },
              },
            },
            method: input.method
              ? {
                  coding: [
                    {
                      code: input.method.code,
                      display: input.method.label,
                      system: "http://snomed.info/sct",
                    },
                  ],
                  text: input.method.label,
                }
              : undefined,
          },
        ],
      };

      if (updateId) {
        await updateMedicationStatementMu.trigger({
          id: updateId,
          medicationStatement,
        });
      } else {
        await createMedicationStatementMu.trigger(medicationStatement);
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
        {updateId ? "Update Medication" : "Add Medication"}
      </p>

      <div className="mt-4">
        <label htmlFor="search" className="block text-gray-700">
          Medication
        </label>

        <Controller
          name="code"
          control={control}
          render={({ field: { onChange, value, ref } }) => (
            <AsyncSelect
              ref={ref}
              placeholder="Search ..."
              cacheOptions
              isClearable
              value={value}
              loadOptions={searchMedications}
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
          {medicationStatuses.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <select
          {...register("category")}
          className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option></option>
          {medicationCategories.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label
          htmlFor="sig"
          className="block text-sm font-medium text-gray-700"
        >
          Sig
        </label>
        <select
          {...register("sig")}
          className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option></option>
          {timingAbbreviations.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <div className="flex-1">
          <label
            htmlFor="dosagePeriodStart"
            className="block font-medium text-gray-700"
          >
            Start Period
          </label>
          <input
            required
            type="datetime-local"
            name="dosagePeriodStart"
            id="dosagePeriodStart"
            {...register("dosagePeriodStart", { required: true })}
            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
          />
        </div>

        <div className="flex-1">
          <label
            htmlFor="dosagePeriodEnd"
            className="block font-medium text-gray-700"
          >
            End Period
          </label>
          <input
            required
            type="datetime-local"
            name="dosagePeriodEnd"
            id="dosagePeriodEnd"
            {...register("dosagePeriodEnd", { required: true })}
            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
          />
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="patientInstruction" className="block text-gray-700">
            Patient Instruction
          </label>
        </div>
        <input
          type="text"
          name="patientInstruction"
          id="patientInstruction"
          {...register("patientInstruction")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <Controller
          name="method"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CodedInput
              title="Method"
              conceptId="422096002"
              selectedItem={value}
              setSelectedItem={(item) => onChange(item)}
              searchOptions={searchMethods}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <Controller
          name="additionalInstruction"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CodedInput
              title="Additional Instructions"
              conceptId="419492006"
              selectedItem={value}
              setSelectedItem={(item) => onChange(item)}
              searchOptions={searchAdditionalDosages}
            />
          )}
        />
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
};

export default MedicationForm;
