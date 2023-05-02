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

import { Encounter, MedicationRequest } from "fhir/r4";
import { useNotificationDispatch } from "@tensoremr/notification";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import AsyncSelect from "react-select/async";

import { debounce } from "lodash";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import {
  createMedicationRequest,
  getDurationUnits,
  getMedicationRequest,
  getMedicationRequestCategories,
  getMedicationRequestCourseOfTherapies,
  getMedicationRequestIntents,
  getRequestPriorities,
  getRxApproximateTerms,
  getServerTime,
  getTimingAbbreviations,
  updateMedicationRequest,
} from "../../../../api";
import Button from "../../../../components/button";
import { Tooltip } from "flowbite-react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { format, parseISO } from "date-fns";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

export default function MedicationRequestForm({
  updateId,
  encounter,
  onSuccess,
}: Props) {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, control, setValue } = useForm<any>({});
  const session: any = useSessionContext();

  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (updateId) {
      updateDefaultValues(updateId);
    }
  }, [updateId]);

  const updateDefaultValues = async (updateId: string) => {
    setIsLoading(true);

    const medicationRequest: MedicationRequest = (
      await getMedicationRequest(updateId)
    )?.data;

    if (medicationRequest?.medicationCodeableConcept) {
      setValue("medication", {
        value:
          medicationRequest?.medicationCodeableConcept?.coding?.at(0)?.code,
        label:
          medicationRequest?.medicationCodeableConcept?.coding?.at(0)?.display,
      });
    }

    if (medicationRequest?.intent) {
      setValue("intent", medicationRequest?.intent);
    }

    if (medicationRequest?.category?.length > 0) {
      setValue(
        "category",
        medicationRequest?.category?.at(0)?.coding?.at(0)?.code
      );
    }

    if (medicationRequest?.priority) {
      setValue("priority", medicationRequest?.priority);
    }

    if (medicationRequest?.dosageInstruction?.at(0)) {
      const dosage = medicationRequest?.dosageInstruction?.at(0);

      if (dosage?.timing?.code) {
        setValue("sig", dosage?.timing?.code?.coding?.at(0)?.code);
      }

      if (dosage?.additionalInstruction?.at(0)?.text) {
        setValue(
          "additionalInstruction",
          dosage?.additionalInstruction?.at(0)?.text
        );
      }
    }

    if (medicationRequest?.courseOfTherapyType) {
      setValue(
        "courseOfTherapyType",
        medicationRequest?.courseOfTherapyType?.coding?.at(0)?.code
      );
    }

    if (medicationRequest?.priority) {
      setValue("priority", medicationRequest?.priority);
    }

    if (medicationRequest?.dispenseRequest) {
      if (medicationRequest?.dispenseRequest?.initialFill?.quantity?.value) {
        setValue(
          "initialFillQuantity",
          medicationRequest?.dispenseRequest?.initialFill?.quantity?.value
        );
      }

      if (medicationRequest?.dispenseRequest?.initialFill?.duration?.value) {
        setValue(
          "initialFillDuration",
          medicationRequest?.dispenseRequest?.initialFill?.duration?.value
        );
      }

      if (medicationRequest?.dispenseRequest?.initialFill?.duration?.code) {
        setValue(
          "initialFillDurationUnit",
          medicationRequest?.dispenseRequest?.initialFill?.duration?.code
        );
      }

      if (medicationRequest?.dispenseRequest?.dispenseInterval?.value) {
        setValue(
          "dispenseInterval",
          medicationRequest?.dispenseRequest?.dispenseInterval?.value
        );
      }

      if (medicationRequest?.dispenseRequest?.dispenseInterval?.code) {
        setValue(
          "dispenseIntervalUnit",
          medicationRequest?.dispenseRequest?.dispenseInterval?.code
        );
      }

      if (medicationRequest?.dispenseRequest?.validityPeriod?.start) {
        setValue(
          "dosagePeriodStart",
          format(
            parseISO(medicationRequest?.dispenseRequest?.validityPeriod?.start),
            "yyyy-MM-dd'T'hh:mm"
          )
        );
      }

      if (medicationRequest?.dispenseRequest?.validityPeriod?.end) {
        setValue(
          "dosagePeriodEnd",
          format(
            parseISO(medicationRequest?.dispenseRequest?.validityPeriod?.end),
            "yyyy-MM-dd'T'hh:mm"
          )
        );
      }

      if (medicationRequest?.dispenseRequest?.numberOfRepeatsAllowed) {
        setValue(
          "numberOfRepeatsAllowed",
          medicationRequest?.dispenseRequest?.numberOfRepeatsAllowed
        );
      }

      if (medicationRequest?.dispenseRequest?.quantity?.value) {
        setValue(
          "quantity",
          medicationRequest?.dispenseRequest?.quantity?.value
        );
      }
    }

    if (medicationRequest?.substitution?.allowedBoolean) {
      setValue(
        "substitutionAllowed",
        medicationRequest?.substitution?.allowedBoolean
      );
    }

    if (medicationRequest?.note) {
      setValue("note", medicationRequest?.note?.at(0)?.text);
    }

    setIsLoading(false);
  };

  const createMedicationRequestMu = useSWRMutation(
    "medications",
    (key, { arg }) => createMedicationRequest(arg)
  );

  const updateMedicationRequestMu = useSWRMutation(
    "medications",
    (key, { arg }) => updateMedicationRequest(arg.id, arg.medicationRequest)
  );

  const medicationRequestIntents =
    useSWR("medicationRequestIntents", () =>
      getMedicationRequestIntents()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const medicationRequestCategories =
    useSWR("medicationRequestCategories", () =>
      getMedicationRequestCategories()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const requestPriorities =
    useSWR("requestPriorities", () =>
      getRequestPriorities()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const medicationRequestCourseOfTherapies =
    useSWR("medicationRequestCourseOfTherapies", () =>
      getMedicationRequestCourseOfTherapies()
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

  const durationUnits =
    useSWR("durationUnits", () =>
      getDurationUnits()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const searchMedications = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        getRxApproximateTerms(inputValue)
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

  const onSubmit = async (input: any) => {
    setIsLoading(true);

    try {
      const time = (await getServerTime()).data;

      const category = medicationRequestCategories?.find(
        (e) => e.value === input.category
      );

      const sig = timingAbbreviations?.find((e) => e.value === input.sig);
      const courseOfTherapyType = medicationRequestCourseOfTherapies?.find(
        (e) => e.value === input.courseOfTherapyType
      );

      if (input.initialFillDuration && !input.initialFillDurationUnit) {
        throw new Error("Initial fill unit is required");
      }

      if (input.dispenseInterval && !input.dispenseIntervalUnit) {
        throw new Error("Dispense interval unit is required");
      }

      const medicationRequest: MedicationRequest = {
        resourceType: "MedicationRequest",
        id: updateId ? updateId : undefined,
        medicationCodeableConcept: {
          coding: [
            {
              code: input.medication.value,
              display: input.medication.label,
              system: "http://www.nlm.nih.gov/research/umls/rxnorm",
            },
          ],
          text: input.medication.label,
        },
        status: "active",
        intent: input.intent,
        category: category
          ? [
              {
                coding: [
                  {
                    code: category?.value,
                    display: category?.label,
                    system: category.system,
                  },
                ],
                text: category.label,
              },
            ]
          : undefined,
        priority: input.priority,
        dosageInstruction: [
          {
            additionalInstruction: input.additionalInstruction
              ? [
                  {
                    text: input.additionalInstruction,
                  },
                ]
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
            },
          },
        ],
        courseOfTherapyType: courseOfTherapyType
          ? {
              coding: [
                {
                  code: courseOfTherapyType?.value,
                  display: courseOfTherapyType?.label,
                  system: courseOfTherapyType.system,
                },
              ],
              text: courseOfTherapyType.label,
            }
          : undefined,
        dispenseRequest:
          input.initialFillQuantity ||
          input.initialFillDuration ||
          input.dispenseInterval ||
          input.dosagePeriodStart ||
          input.dosagePeriodEnd ||
          input.numberOfRepeatsAllowed ||
          input.quantity
            ? {
                initialFill:
                  input.initialFillQuantity || input.initialFillDuration
                    ? {
                        quantity: input.initialFillQuantity
                          ? {
                              value: parseInt(input.initialFillQuantity),
                            }
                          : undefined,
                        duration: input.initialFillDuration
                          ? {
                              value: parseInt(input.initialFillDuration),
                              code: input.initialFillDurationUnit,
                              system: "http://unitsofmeasure.org",
                            }
                          : undefined,
                      }
                    : undefined,
                dispenseInterval: input.dispenseInterval
                  ? {
                      value: parseInt(input.dispenseInterval),
                      code: input.dispenseIntervalUnit,
                      system: "http://unitsofmeasure.org",
                    }
                  : undefined,
                validityPeriod:
                  input.dosagePeriodStart || input.dosagePeriodEnd
                    ? {
                        start: format(
                          parseISO(input.dosagePeriodStart),
                          "yyyy-MM-dd'T'HH:mm:ssxxx"
                        ),
                        end: format(
                          parseISO(input.dosagePeriodEnd),
                          "yyyy-MM-dd'T'HH:mm:ssxxx"
                        ),
                      }
                    : undefined,
                numberOfRepeatsAllowed: input.numberOfRepeatsAllowed
                  ? parseInt(input.numberOfRepeatsAllowed)
                  : undefined,
                quantity: input.quantity
                  ? {
                      value: parseInt(input.quantity),
                    }
                  : undefined,
              }
            : undefined,
        authoredOn: format(parseISO(time), "yyyy-MM-dd'T'HH:mm:ssxxx"),
        substitution: {
          allowedBoolean: input.substitutionAllowed,
        },
        subject: encounter.subject,
        encounter: {
          reference: `Encounter/${encounter.id}`,
          type: "Encounter",
        },
        recorder: {
          reference: `Practitioner/${session?.userId}`,
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
        await updateMedicationRequestMu.trigger({
          id: updateId,
          medicationRequest,
        });
      } else {
        await createMedicationRequestMu.trigger(medicationRequest);
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
        {updateId ? "Update Prescription" : "Add Prescription"}
      </p>
      <div className="mt-4">
        <label htmlFor="search" className="block text-gray-700">
          Medication
        </label>

        <Controller
          name="medication"
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
          {medicationRequestIntents.map((e) => (
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
          {medicationRequestCategories.map((e) => (
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
          {...register("priority")}
          className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option></option>
          {requestPriorities.map((e) => (
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

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label
            htmlFor="additionalInstruction"
            className="block text-gray-700"
          >
            Additional Instructions
          </label>

          <Tooltip content="This field is not coded. Decision support and interactions will not be active">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          </Tooltip>
        </div>
        <input
          type="text"
          id="additionalInstruction"
          {...register("additionalInstruction")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="courseOfTherapyType"
          className="block text-sm font-medium text-gray-700"
        >
          Course of Therapy
        </label>
        <select
          {...register("courseOfTherapyType")}
          className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option></option>
          {medicationRequestCourseOfTherapies.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 border rounded-md border-teal-600 p-4 bg-stone-50">
        <p className="text-gray-700 tracking-wide">Dispense</p>

        <div className="mt-4">
          <label
            htmlFor="initialFillQuantity"
            className="block text-gray-700 text-sm"
          >
            Initial Fill Quanitity
          </label>
          <input
            type="number"
            name="initialFillQuantity"
            id="initialFillQuantity"
            {...register("initialFillQuantity")}
            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
          />
        </div>

        <div className="flex items-center space-x-3 mt-4">
          <div className="flex-1">
            <label
              htmlFor="initialFillDuration"
              className="block text-gray-700 text-sm"
            >
              Initial Fill Duration
            </label>
            <input
              type="number"
              name="initialFillDuration"
              id="initialFillDuration"
              {...register("initialFillDuration")}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="initialFillDurationUnit"
              className="block text-gray-700 text-sm"
            >
              Unit
            </label>
            <select
              {...register("initialFillDurationUnit")}
              className="mt-1 block border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option></option>
              {durationUnits.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-3 mt-4">
          <div className="flex-1">
            <label
              htmlFor="dispenseInterval"
              className="block text-gray-700 text-sm"
            >
              Dispense Interval
            </label>
            <input
              type="number"
              name="dispenseInterval"
              id="dispenseInterval"
              {...register("dispenseInterval")}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="dispenseIntervalUnit"
              className="block text-sm text-gray-700"
            >
              Unit
            </label>
            <select
              {...register("dispenseIntervalUnit")}
              className="mt-1 block border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option></option>
              {durationUnits.map((e) => (
                <option key={e.value} value={e.value}>
                  {e.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <div className="flex-1">
            <label
              htmlFor="dosagePeriodStart"
              className="block text-sm text-gray-700"
            >
              Valid Start Period
            </label>
            <input
              type="datetime-local"
              name="dosagePeriodStart"
              id="dosagePeriodStart"
              {...register("dosagePeriodStart")}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>

          <div className="flex-1">
            <label
              htmlFor="dosagePeriodEnd"
              className="block text-sm text-gray-700"
            >
              Valid End Period
            </label>
            <input
              type="datetime-local"
              name="dosagePeriodEnd"
              id="dosagePeriodEnd"
              {...register("dosagePeriodEnd")}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
        </div>

        <div className="mt-4">
          <label
            htmlFor="numberOfRepeatsAllowed"
            className="block text-gray-700 text-sm"
          >
            No. of Repeats Allowed
          </label>
          <input
            type="number"
            name="numberOfRepeatsAllowed"
            id="numberOfRepeatsAllowed"
            {...register("numberOfRepeatsAllowed")}
            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="quantity" className="block text-gray-700 text-sm">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            {...register("quantity")}
            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
          />
        </div>
      </div>

      <div className="mt-4">
        <label>
          <input type="checkbox" {...register("substitutionAllowed")} />{" "}
          <span className="ml-1">Substitution Allowed</span>
        </label>
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
