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

import { useCallback, useEffect, useState } from "react";
import { ISelectOption } from "@tensoremr/models";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "flowbite-react";
import Button from "../../../../components/button";
import {
  createCondition,
  getCondition,
  getConditionSeverity,
  getConditionStatuses,
  getConditionVerStatuses,
  getExtensions,
  getServerTime,
  searchConceptChildren,
  updateCondition,
} from "../../../../api";
import { debounce } from "lodash";
import { Condition, Encounter } from "fhir/r4";
import { useForm } from "react-hook-form";
import { useNotificationDispatch } from "@tensoremr/notification";
import { format, parseISO } from "date-fns";
import useSWRMutation from "swr/mutation";
import CodedInput from "../../../../components/coded-input";
import useSWR from "swr";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

const DisorderForm: React.FC<Props> = ({ updateId, encounter, onSuccess }) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue } = useForm<any>();

  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedDisorder, setSelectedDisorder] = useState<ISelectOption>();
  const [selectedBodySite, setSelectedBodySite] = useState<ISelectOption>();

  // Effects
  useEffect(() => {
    if (updateId) {
      setIsLoading(true);
      getCondition(updateId)
        .then((res) => {
          setIsLoading(false);

          const condition: Condition = res?.data;

          const code = condition.code?.coding?.at(0);
          if (code) {
            setSelectedDisorder({ value: code.code, label: code.display });
          }

          const severity = condition.severity?.coding?.at(0);
          if (severity) {
            setValue("severity", severity.code);
          }

          const status = condition.clinicalStatus?.coding?.at(0);
          if (status) {
            setValue("status", status.code);
          }

          const verification = condition.verificationStatus?.coding?.at(0);
          if (verification) {
            setValue("verification", verification.code);
          }

          const bodySite = condition.bodySite?.at(0).coding?.at(0);
          if (bodySite) {
            setSelectedBodySite({
              value: bodySite.code,
              label: bodySite.display,
            });
          }

          if (condition.note?.length > 0) {
            setValue("note", condition.note.map((n) => n.text).join(", "));
          }
        })
        .catch((error) => {
          if (error instanceof Error) {
            notifDispatch({
              type: "showNotification",
              notifTitle: "Error",
              notifSubTitle: error.message,
              variant: "failure",
            });
          }

          console.error(error);
          setIsLoading(false);
        });
    }
  }, [updateId]);


  const createConditionMu = useSWRMutation("conditions", (key, { arg }) =>
    createCondition(arg)
  );

  const updateConditionMu = useSWRMutation("conditions", (key, { arg }) =>
    updateCondition(arg.id, arg.condition)
  );

  const conditionSeverities =
    useSWR("conditionSeverities", () =>
      getConditionSeverity()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const conditionStatuses =
    useSWR("conditionStatuses", () =>
      getConditionStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const conditionVerStatuses =
    useSWR("conditionVerStatuses", () =>
      getConditionVerStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const searchConceptChildrenLoad = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
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

  const searchBodySiteLoad = useCallback(
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

  const onSubmit = async (input: any) => {
    setIsLoading(true);

    try {
      const status = conditionStatuses.find((e) => e.value === input.status);
      const verificationStatus = conditionVerStatuses.find(
        (e) => e.value === input.verification
      );
      const severity = conditionSeverities.find(
        (e) => e.value === input.severity
      );

      const time = (await getServerTime()).data;
      const extensions = (await getExtensions()).data;

      const condition: Condition = {
        resourceType: "Condition",
        id: updateId ? updateId : undefined,
        clinicalStatus: status
          ? {
              coding: [
                {
                  code: status.value,
                  display: status.label,
                  system: status.system,
                },
              ],
              text: status.label,
            }
          : undefined,
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
        category: [
          {
            coding: [
              {
                code: "problem-list-item",
                display: "Problem List Item",
                system:
                  "http://terminology.hl7.org/CodeSystem/condition-category",
              },
            ],
            text: "problem-list-item",
          },
        ],
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
        code: selectedDisorder
          ? {
              coding: [
                {
                  code: selectedDisorder.value,
                  display: selectedDisorder.label,
                  system: "http://snomed.info/sct",
                },
              ],
              text: selectedDisorder.label,
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
        subject: encounter.subject,
        encounter: {
          reference: `Encounter/${encounter.id}`,
          type: "Encounter",
        },
        recordedDate: format(parseISO(time), "yyyy-MM-dd'T'HH:mm:ssxxx"),
        recorder: {
          // @ts-ignore
          reference: `Practitioner/${session.user?.id}`,
          type: "Practitioner",
        },
        note:
          input.note.length > 0
            ? [
                {
                  text: input.note,
                },
              ]
            : undefined,
        extension: [
          {
            url: extensions.EXT_CONDITION_TYPE,
            valueString: "disorder-history",
          },
        ],
      };

      if (updateId) {
        await updateConditionMu.trigger({ id: updateId, condition: condition });
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-lg font-bold tracking-wide text-teal-700 uppercase">
        {updateId ? "Update Disorder" : "Add Past Disorder"}
      </p>

      <CodedInput
        title="Disorder History"
        conceptId="404684003"
        selectedItem={selectedDisorder}
        setSelectedItem={setSelectedDisorder}
        searchOptions={searchConceptChildrenLoad}
      />

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
          {conditionSeverities.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
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
          {conditionStatuses.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label
          htmlFor="verification"
          className="block text-sm font-medium text-gray-700"
        >
          Verification
        </label>
        <select
          {...register("verification")}
          className="mt-1 block w-full p-2border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option></option>
          {conditionVerStatuses.map((e) => (
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
        searchOptions={searchBodySiteLoad}
      />

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="note" className="block font-medium text-gray-700">
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
        <div className="flex space-x-6">
          <div className="text-gray-700">Source of Info</div>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="illnessType"
              value={"Natural Illness"}
              defaultChecked={true}
            />
            <span className="ml-2">Patient Reported</span>
          </label>

          <label className="inline-flex items-center">
            <input
              type="radio"
              name="illnessType"
              value={"Industrial Accident"}
            />
            <span className="ml-2">External</span>
          </label>
        </div>
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

export default DisorderForm;
