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

import { Encounter, MedicationAdministration } from "fhir/r4";
import { useNotificationDispatch } from "@tensoremr/notification";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import AsyncSelect from "react-select/async";

import { debounce } from "lodash";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";

import {
  createMedicationAdministration,
  getMedicationAdminCategories,
  getMedicationAdministration,
  getMedicationAdminStatuses,
  getRxApproximateTerms,
  searchConceptChildren,
  updateMedicationAdministration,
} from "../../../../api";
import Button from "../../../../components/button";
import { Tooltip } from "flowbite-react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import CodedInput from "../../../../components/coded-input";
import { format, parseISO } from "date-fns";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

export default function MedicationAdministrationForm({
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

    const medicationAdmin: MedicationAdministration = (
      await getMedicationAdministration(updateId)
    )?.data;

    if (medicationAdmin?.medicationCodeableConcept) {
      setValue("medication", {
        value: medicationAdmin?.medicationCodeableConcept?.coding?.at(0)?.code,
        label:
          medicationAdmin?.medicationCodeableConcept?.coding?.at(0)?.display,
      });
    }

    if (medicationAdmin?.status) {
      setValue("status", medicationAdmin?.status);
    }

    if (medicationAdmin?.category) {
      setValue("category", medicationAdmin?.category?.coding?.at(0)?.code);
    }

    if (medicationAdmin?.effectiveDateTime) {
      setValue(
        "effectiveDateTime",
        format(
          parseISO(medicationAdmin?.effectiveDateTime),
          "yyyy-MM-dd'T'hh:mm"
        )
      );
    }

    if (medicationAdmin?.dosage?.dose?.value) {
      setValue("dose", medicationAdmin?.dosage?.dose?.value);
    }

    if (medicationAdmin?.dosage?.site) {
      setValue("bodySite", {
        value: medicationAdmin?.dosage?.site?.coding?.at(0)?.code,
        label: medicationAdmin?.dosage?.site?.coding?.at(0)?.display,
      });
    }

    if (medicationAdmin?.dosage?.method) {
      setValue("method", {
        value: medicationAdmin?.dosage?.method?.coding?.at(0)?.code,
        label: medicationAdmin?.dosage?.method?.coding?.at(0)?.display,
      });
    }

    if (medicationAdmin?.dosage?.route) {
      setValue("route", {
        value: medicationAdmin?.dosage?.route?.coding?.at(0)?.code,
        label: medicationAdmin?.dosage?.route?.coding?.at(0)?.display,
      });
    }

    if (medicationAdmin?.note?.at(0)?.text) {
      setValue("note", medicationAdmin?.note?.at(0)?.text);
    }

    setIsLoading(false);
  };

  const createMedicationAdministrationtMu = useSWRMutation(
    "medications",
    (key, { arg }) => createMedicationAdministration(arg)
  );

  const updateMedicationAdministrationMu = useSWRMutation(
    "medications",
    (key, { arg }) =>
      updateMedicationAdministration(arg.id, arg.medicationAdministration)
  );

  const medicationAdminStatuses =
    useSWR("medicationAdminStatuses", () =>
      getMedicationAdminStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const medicationAdminCategories =
    useSWR("medicationAdminCategories", () =>
      getMedicationAdminCategories()
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

  const searchRoutes = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 284009009",
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
      const category = medicationAdminCategories?.find(
        (e) => e.value === input.category
      );

      const medicationAdministration: MedicationAdministration = {
        resourceType: "MedicationAdministration",
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
        status: input.status,
        category: category
          ? {
              coding: [
                {
                  code: category?.value,
                  display: category?.label,
                  system: category.system,
                },
              ],
              text: category.label,
            }
          : undefined,
        effectiveDateTime: format(
          parseISO(input.effectiveDateTime),
          "yyyy-MM-dd'T'HH:mm:ssxxx"
        ),
        dosage: input.dose
          ? {
              dose: {
                value: parseInt(input.dose),
              },
              site: input.bodySite
                ? {
                    coding: [
                      {
                        code: input.bodySite?.value,
                        display: input.bodySite?.label,
                        system: "http://snomed.info/sct",
                      },
                    ],
                    text: input.bodySite?.label,
                  }
                : undefined,
              method: input.method
                ? {
                    coding: [
                      {
                        code: input.method?.value,
                        display: input.method?.label,
                        system: "http://snomed.info/sct",
                      },
                    ],
                    text: input.method?.label,
                  }
                : undefined,
              route: input.route
                ? {
                    coding: [
                      {
                        code: input.route?.value,
                        display: input.route?.label,
                        system: "http://snomed.info/sct",
                      },
                    ],
                    text: input.route?.label,
                  }
                : undefined,
            }
          : undefined,
        note: input.note
          ? [
              {
                text: input.note,
              },
            ]
          : undefined,
        subject: encounter.subject,
        context: {
          reference: `Encounter/${encounter.id}`,
          type: "Encounter",
        },
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
        await updateMedicationAdministrationMu.trigger({
          id: updateId,
          medicationAdministration,
        });
      } else {
        await createMedicationAdministrationtMu.trigger(
          medicationAdministration
        );
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
        {updateId
          ? "Update Medication Administration"
          : "Add Medication Administration"}
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
          {medicationAdminStatuses.map((e) => (
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
          required
          {...register("category")}
          className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option></option>
          {medicationAdminCategories.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="effective" className="block text-sm text-gray-700">
          Effective
        </label>
        <input
          type="datetime-local"
          name="effectiveDateTime"
          id="effectiveDateTime"
          {...register("effectiveDateTime")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="dose" className="block text-sm text-gray-700">
          Dose
        </label>
        <input
          required
          type="text"
          name="dose"
          id="dose"
          {...register("dose", { required: true })}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <Controller
          name="bodySite"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CodedInput
              title="Body Site"
              conceptId="442083009"
              selectedItem={value}
              setSelectedItem={(item) => onChange(item)}
              searchOptions={searchBodySites}
            />
          )}
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
          name="route"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CodedInput
              title="Route"
              conceptId="284009009"
              selectedItem={value}
              setSelectedItem={(item) => onChange(item)}
              searchOptions={searchRoutes}
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
}
