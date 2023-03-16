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
import { Condition, Encounter } from "fhir/r4";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  createCondition,
  getCondition,
  getConditionCategories,
  getConditionSeverity,
  getConditionStatuses,
  getConditionVerStatuses,
  searchConceptChildren,
  updateCondition,
} from "../../../../api";
import CodedInput from "../../../../components/coded-input";
import { ISelectOption } from "../../../../model";
import useSWR from "swr";
import Select from "react-select";
import { Radio } from "flowbite-react";
import Button from "../../../../components/button";
import { format, parseISO } from "date-fns";
import useSWRMutation from "swr/mutation";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

export default function ProblemForm({ updateId, encounter, onSuccess }: Props) {
  const notifDispatch = useNotificationDispatch();
  const { register, setValue, handleSubmit, control, watch } = useForm<any>({});
  const { data: session } = useSession();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCode, setSelectedCode] = useState<ISelectOption>();
  const [selectedStage, setSelectedStage] = useState<ISelectOption>();
  const [selectedBodySite, setSelectedBodySite] = useState<ISelectOption>();

  useEffect(() => {
    if (updateId) {
      updateDefaultValues(updateId);
    }
  }, [updateId]);

  const updateDefaultValues = async (updateId: string) => {
    setIsLoading(true);

    const condition: Condition = (await getCondition(updateId))?.data;

    if (condition.code) {
      setSelectedCode({
        value: condition.code?.coding?.at(0).code,
        label: condition.code?.coding?.at(0).display,
      });
    }

    if (condition.clinicalStatus) {
      setValue("clinicalStatus", condition.clinicalStatus?.coding?.at(0)?.code);
    }

    if (condition.verificationStatus) {
      setValue(
        "verificationStatus",
        condition.verificationStatus?.coding?.at(0)?.code
      );
    }

    if (condition.category) {
      const categories = condition.category?.map((e) => ({
        value: e?.coding?.at(0)?.code,
        label: e?.coding?.at(0)?.display,
        system: e?.coding?.at(0)?.system,
      }));
      setValue("categories", categories);
    }

    if (condition.severity) {
      setValue("severity", condition.severity?.coding?.at(0)?.code);
    }

    if (condition.bodySite) {
      setSelectedBodySite({
        value: condition.bodySite?.at(0).coding?.at(0).code,
        label: condition.bodySite?.at(0).coding?.at(0).display,
      });
    }

    if (condition.stage) {
      setSelectedStage({
        value: condition.stage?.at(0).summary?.coding?.at(0)?.code,
        label: condition.stage?.at(0).summary?.coding?.at(0)?.display,
      });
    }

    if (condition.onsetPeriod) {
      setValue("onset", "onsetPeriod");
      if (condition.onsetPeriod.start) {
        setValue(
          "onsetPeriodStart",
          format(parseISO(condition.onsetPeriod.start), "yyyy-MM-dd'T'hh:mm")
        );
      }

      if (condition.onsetPeriod.end) {
        setValue(
          "onsetPeriodEnd",
          format(parseISO(condition.onsetPeriod.end), "yyyy-MM-dd'T'hh:mm")
        );
      }
    }

    if (condition.onsetAge) {
      setValue("onset", "onsetAge");
      setValue("onsetAge", condition.onsetAge?.value?.toString());
    }

    if (condition.onsetString) {
      setValue("onset", "onsetString");
      setValue("onsetAge", condition.onsetString);
    }

    if (condition.abatementPeriod) {
      setValue("abatement", "abatementPeriod");
      if (condition.abatementPeriod.start) {
        setValue(
          "abatementPeriodStart",
          format(
            parseISO(condition.abatementPeriod.start),
            "yyyy-MM-dd'T'hh:mm"
          )
        );
      }

      if (condition.abatementPeriod.end) {
        setValue(
          "abatementPeriodEnd",
          format(parseISO(condition.abatementPeriod.end), "yyyy-MM-dd'T'hh:mm")
        );
      }
    }

    if (condition.abatementAge) {
      setValue("abatement", "abatementAge");
      setValue("abatementAge", condition.abatementAge?.value?.toString());
    }

    if (condition.abatementString) {
      setValue("abatement", "abatementString");
      setValue("abatementAge", condition.abatementString);
    }

    setIsLoading(false);
  };

  const clinicialStatuses =
    useSWR("clinicialStatuses", () =>
      getConditionStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const verificationStatuses =
    useSWR("verificationStatuses", () =>
      getConditionVerStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const categories =
    useSWR("categories", () =>
      getConditionCategories()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const severities =
    useSWR("severities", () =>
      getConditionSeverity()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const createConditionMu = useSWRMutation("conditions", (key, { arg }) =>
    createCondition(arg)
  );

  const updateConditionMu = useSWRMutation("conditions", (key, { arg }) =>
    updateCondition(arg.id, arg.condition)
  );

  const searchCodes = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length >= 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 404684003",
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

  const searchStages = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 385356007",
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
      if (!selectedCode) {
        throw new Error("Problem field is required");
      }

      if (!input.categories) {
        throw new Error("Category field is required");
      }

      const clinicalStatus = clinicialStatuses.find(
        (e) => e.value === input.clinicalStatus
      );

      const verificationStatus = verificationStatuses.find(
        (e) => e.value === input.verificationStatus
      );

      const severity = severities.find((e) => e.value === input.severity);

      const abatementActive =
        values.clinicalStatus === "inactive" ||
        values.clinicalStatus === "resolved" ||
        values.clinicalStatus === "remission";

      const condition: Condition = {
        resourceType: "Condition",
        id: updateId ? updateId : undefined,
        code: {
          coding: [
            {
              code: selectedCode.value,
              display: selectedCode.label,
              system: "http://snomed.info/sct",
            },
          ],
          text: selectedCode.label,
        },
        clinicalStatus: {
          coding: [
            {
              code: clinicalStatus.value,
              display: clinicalStatus.label,
              system: clinicalStatus.system,
            },
          ],
          text: clinicalStatus.label,
        },
        verificationStatus: verificationStatus
          ? {
              coding: [
                {
                  code: verificationStatus.value,
                  display: verificationStatus.label,
                  system: verificationStatus.system,
                },
              ],
              text: verificationStatus.label,
            }
          : undefined,
        category: input.categories
          ? input.categories.map((e) => ({
              coding: [
                {
                  code: e.value,
                  display: e.label,
                  system: e.system,
                },
              ],
              text: e.label,
            }))
          : undefined,
        severity: severity
          ? {
              coding: [
                {
                  code: severity.value,
                  display: severity.label,
                  system: severity.system,
                },
              ],
              text: severity.label,
            }
          : undefined,
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
        stage: selectedStage
          ? [
              {
                summary: {
                  coding: [
                    {
                      code: selectedStage.value,
                      display: selectedStage.label,
                      system: "http://snomed.info/sct",
                    },
                  ],
                  text: selectedStage.label,
                },
              },
            ]
          : undefined,
        note:
          input.note.length > 0
            ? [
                {
                  text: input.note,
                },
              ]
            : undefined,
        onsetPeriod:
          input.onset === "onsetPeriod" &&
          (input.onsetPeriodStart || input.onsetPeriodEnd)
            ? {
                start: input.onsetPeriodStart
                  ? format(
                      parseISO(input.onsetPeriodStart),
                      "yyyy-MM-dd'T'HH:mm:ssxxx"
                    )
                  : undefined,
                end: input.onsetPeriodEnd
                  ? format(
                      parseISO(input.onsetPeriodEnd),
                      "yyyy-MM-dd'T'HH:mm:ssxxx"
                    )
                  : undefined,
              }
            : undefined,
        onsetAge:
          input.onset === "onsetAge" && input.onsetAge?.length > 0
            ? {
                value: parseInt(input.onsetAge),
                code: "a",
                system: "http://unitsofmeasure.org",
              }
            : undefined,
        onsetString:
          input.onset === "onsetString" && input.onsetString?.length > 0
            ? input.onsetString
            : undefined,
        abatementPeriod:
          abatementActive &&
          input.abatement === "abatementPeriod" &&
          (input.abatementPeriodStart || input.abatementPeriodEnd)
            ? {
                start: input.abatementPeriodStart
                  ? format(
                      parseISO(input.abatementPeriodStart),
                      "yyyy-MM-dd'T'HH:mm:ssxxx"
                    )
                  : undefined,
                end: input.abatementPeriodEnd
                  ? format(
                      parseISO(input.abatementPeriodEnd),
                      "yyyy-MM-dd'T'HH:mm:ssxxx"
                    )
                  : undefined,
              }
            : undefined,
        abatementAge:
          abatementActive &&
          input.abatement === "abatementAge" &&
          input.abatementAge
            ? {
                value: parseInt(input.abatementAge),
                code: "a",
                system: "http://unitsofmeasure.org",
              }
            : undefined,
        abatementString:
          abatementActive &&
          input.abatement === "abatementString" &&
          input.abatementString
            ? input.abatementString
            : undefined,
        subject: encounter.subject,
        encounter: {
          reference: `Encounter/${encounter.id}`,
          type: "Encounter",
        },
        recorder: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          reference: `Practitioner/${session.user.id}`,
          type: "Practitioner",
        },
      };

      if (updateId) {
        await updateConditionMu.trigger({
          id: updateId,
          condition,
        });
      } else {
        await createConditionMu.trigger(condition);
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

  const values = watch();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-lg font-bold tracking-wide text-teal-700 uppercase">
        {updateId ? "Update Problem" : "Add Problem"}
      </p>

      <div>
        <CodedInput
          title="Problem"
          conceptId="404684003"
          selectedItem={selectedCode}
          setSelectedItem={setSelectedCode}
          searchOptions={searchCodes}
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="clinicalStatus"
          className="block text-sm font-medium text-gray-700"
        >
          Status
        </label>
        <select
          required
          {...register("clinicalStatus", { required: true })}
          className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option></option>
          {clinicialStatuses.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label
          htmlFor="verificationStatus"
          className="block text-sm font-medium text-gray-700"
        >
          Verification Status
        </label>
        <select
          required
          {...register("verificationStatus", { required: true })}
          className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option></option>
          {verificationStatuses.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Category</label>
        <Controller
          name="categories"
          control={control}
          render={({ field: { onChange, value, ref } }) => (
            <Select
              isMulti
              ref={ref}
              value={value}
              options={categories}
              className="mt-1"
              onChange={onChange}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="severity"
          className="block text-sm font-medium text-gray-700"
        >
          Severity
        </label>
        <select
          {...register("severity")}
          className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option></option>
          {severities.map((e) => (
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

      <CodedInput
        title="Stage"
        conceptId="385356007"
        selectedItem={selectedStage}
        setSelectedItem={setSelectedStage}
        searchOptions={searchStages}
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

      <div className="mt-4 border rounded-md border-teal-600 p-4 bg-stone-50">
        <p className="text-gray-700 tracking-wide">Onset</p>

        <div className="mt-3">
          <div className="flex items-center space-x-4">
            <Controller
              name="onset"
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <Radio
                  ref={ref}
                  id="onset"
                  name="onset"
                  value={"onsetPeriod"}
                  onChange={onChange}
                  checked={value === "onsetPeriod"}
                />
              )}
            />

            <div className="flex space-x-6 flex-1 items-center">
              <div className="w-full flex-1">
                <input
                  id="onsetPeriodStart"
                  type="datetime-local"
                  {...register("onsetPeriodStart")}
                  disabled={values.onset !== "onsetPeriod"}
                  className={`mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md ${
                    values.onset !== "onsetPeriod" && "bg-gray-50"
                  }`}
                />
              </div>

              <div className="w-full flex-1">
                <input
                  id="onsetPeriodStart"
                  type="datetime-local"
                  {...register("onsetPeriodEnd")}
                  disabled={values.onset !== "onsetPeriod"}
                  className={`mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md ${
                    values.onset !== "onsetPeriod" && "bg-gray-50"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center space-x-4">
            <Controller
              name="onset"
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <Radio
                  ref={ref}
                  id="onset"
                  name="onset"
                  value={"onsetAge"}
                  onChange={onChange}
                  checked={value === "onsetAge"}
                />
              )}
            />

            <input
              type="number"
              name="onsetAge"
              id="onsetAge"
              {...register("onsetAge")}
              placeholder="Age"
              disabled={values.onset !== "onsetAge"}
              className={`mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md ${
                values.onset !== "onsetAge" && "bg-gray-50"
              }`}
            />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center space-x-4">
            <Controller
              name="onset"
              control={control}
              render={({ field: { onChange, value, ref } }) => (
                <Radio
                  ref={ref}
                  id="onset"
                  name="onset"
                  value={"onsetString"}
                  onChange={onChange}
                  checked={value === "onsetString"}
                />
              )}
            />

            <input
              type="text"
              id="onsetString"
              {...register("onsetString")}
              placeholder="Text"
              disabled={values.onset !== "onsetString"}
              className={`mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md ${
                values.onset !== "onsetString" && "bg-gray-50"
              }`}
            />
          </div>
        </div>
      </div>

      {(values.clinicalStatus === "inactive" ||
        values.clinicalStatus === "resolved" ||
        values.clinicalStatus === "remission") && (
        <div className="mt-4 border rounded-md border-teal-600 p-4 bg-stone-50">
          <p className="text-gray-700 tracking-wide">Abatement</p>

          <div className="mt-3">
            <div className="flex items-center space-x-4">
              <Controller
                name="abatement"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <Radio
                    ref={ref}
                    id="abatement"
                    name="abatement"
                    value={"abatementPeriod"}
                    onChange={onChange}
                    checked={value === "abatementPeriod"}
                  />
                )}
              />

              <div className="flex space-x-6 flex-1 items-center">
                <div className="w-full flex-1">
                  <input
                    id="abatementPeriodStart"
                    type="datetime-local"
                    {...register("abatementPeriodStart")}
                    disabled={values.abatement !== "abatementPeriod"}
                    className={`mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md ${
                      values.abatement !== "abatementPeriod" && "bg-gray-50"
                    }`}
                  />
                </div>

                <div className="w-full flex-1">
                  <input
                    id="abatementPeriodStart"
                    type="datetime-local"
                    {...register("abatementPeriodEnd")}
                    disabled={values.abatement !== "abatementPeriod"}
                    className={`mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md ${
                      values.abatement !== "abatementPeriod" && "bg-gray-50"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center space-x-4">
              <Controller
                name="abatement"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <Radio
                    ref={ref}
                    id="abatement"
                    name="abatement"
                    value={"abatementAge"}
                    onChange={onChange}
                    checked={value === "abatementAge"}
                  />
                )}
              />

              <input
                type="number"
                name="abatementAge"
                id="abatementAge"
                {...register("abatementAge")}
                placeholder="Age"
                disabled={values.abatement !== "abatementAge"}
                className={`mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md ${
                  values.abatement !== "abatementAge" && "bg-gray-50"
                }`}
              />
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center space-x-4">
              <Controller
                name="abatement"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <Radio
                    ref={ref}
                    id="abatement"
                    name="abatement"
                    value={"abatementString"}
                    onChange={onChange}
                    checked={value === "abatementString"}
                  />
                )}
              />

              <input
                type="text"
                id="abatementString"
                {...register("abatementString")}
                placeholder="Text"
                disabled={values.abatement !== "abatementString"}
                className={`mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md ${
                  values.abatement !== "abatementString" && "bg-gray-50"
                }`}
              />
            </div>
          </div>
        </div>
      )}

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
