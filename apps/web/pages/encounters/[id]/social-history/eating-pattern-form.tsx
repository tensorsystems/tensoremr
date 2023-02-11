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

import { Condition, Encounter } from "fhir/r4";
import { useNotificationDispatch } from "@tensoremr/notification";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ISelectOption } from "@tensoremr/models";
import { debounce } from "lodash";
import {
  createCondition,
  getCondition,
  getConditionStatuses,
  getConditionVerStatuses,
  getExtensions,
  getServerTime,
  searchConceptChildren,
  updateCondition,
} from "../../../../api";
import CodedInput from "../../../../components/coded-input";
import Button from "../../../../components/button";
import useSWR from "swr";
import { format, parseISO } from "date-fns";
import useSWRMutation from "swr/mutation";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "flowbite-react";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

const EatingPatternForm: React.FC<Props> = ({
  updateId,
  encounter,
  onSuccess,
}) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue } = useForm<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCode, setSelectedCode] =
    useState<ISelectOption>();

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
            setSelectedCode({ value: code.code, label: code.display });
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

  // @ts-ignore
  const { data: session } = useSession();

  const createConditionMu = useSWRMutation("conditions", (key, { arg }) =>
    createCondition(arg)
  );

  const updateConditionMu = useSWRMutation("conditions", (key, { arg }) =>
    updateCondition(arg.id, arg.condition)
  );

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

  const searchCodes = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 289136006",
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

      const time = (await getServerTime()).data;

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
                code: "eating-pattern",
                display: "Eating Pattern",
              },
            ],
            text: "eating-pattern",
          },
        ],
        code: selectedCode
          ? {
              coding: [
                {
                  code: selectedCode.value,
                  display: selectedCode.label,
                  system: "http://snomed.info/sct",
                },
              ],
              text: selectedCode.label,
            }
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
    <form onSubmit={handleSubmit(onSubmit)} className="mb-10">
      <p className="text-lg font-bold tracking-wide text-teal-700 uppercase">
        {updateId ? "Update Eating Pattern" : "Add Eating Pattern"}
      </p>

      <CodedInput
        title="Eating Pattern"
        conceptId="289136006"
        selectedItem={selectedCode}
        setSelectedItem={setSelectedCode}
        searchOptions={searchCodes}
      />

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

export default EatingPatternForm;