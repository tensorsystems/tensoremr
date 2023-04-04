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

import {
  Condition,
  Encounter,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
} from "fhir/r4";
import { useNotificationDispatch } from "@tensoremr/notification";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import {
  createQuestionnaireResponse,
  getCondition,
  getConditionStatuses,
  getConditionVerStatuses,
  getServerTime,
  searchConceptChildren,
  updateQuestionnaireResponse,
} from "../../../../api";
import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import { debounce } from "lodash";
import Button from "../../../../components/button";
import CodedInput from "../../../../components/coded-input";
import { format, parseISO } from "date-fns";
import { Tooltip } from "flowbite-react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useSession } from "../../../../context/SessionProvider";
import { getUserIdFromSession } from "../../../../util/ory";
interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

const FamilyHistoryForm: React.FC<Props> = ({
  updateId,
  encounter,
  onSuccess,
}) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue, control } = useForm<any>();
  const { session } = useSession();

  const [isLoading, setIsLoading] = useState<boolean>(false);

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
            setValue("code", { value: code.code, label: code.display });
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

  const createQuestionnaireResponseMu = useSWRMutation(
    "questionnaireResponse",
    (key, { arg }) => createQuestionnaireResponse(arg)
  );

  const updateQuestionnaireResponseMu = useSWRMutation(
    "questionnaireResponse",
    (key, { arg }) =>
      updateQuestionnaireResponse(arg.id, arg.questionnaireResponse)
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
          eclFilter: "<< 57177007",
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
      const userId = session ? getUserIdFromSession(session) : "";
      const responseItems: QuestionnaireResponseItem[] = [];

      if (input.code) {
        responseItems.push({
          linkId: "7369230702555",
          text: "Exercise History",
          answer: [
            {
              valueCoding: {
                code: input.code.value,
                system: "http://snomed.info/sct",
                display: input.code.label,
              },
            },
          ],
        });
      }

      if (status) {
        responseItems.push({
          linkId: "5994139999323",
          text: "Status",
          answer: [
            {
              valueCoding: {
                code: status.value,
                system: status.system,
                display: status.label,
              },
            },
          ],
        });
      }

      if (verificationStatus) {
        responseItems.push({
          linkId: "877540205676",
          text: "Verification",
          answer: [
            {
              valueCoding: {
                code: verificationStatus.value,
                system: verificationStatus.system,
                display: verificationStatus.label,
              },
            },
          ],
        });
      }

      if (input.note.length > 0) {
        responseItems.push({
          linkId: "4740848440352",
          text: "Note",
          answer: [
            {
              valueString: input.note,
            },
          ],
        });
      }

      const questionnaireResponse: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        meta: {
          profile: [
            "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaireresponse|2.7",
          ],
          tag: [
            {
              code: "lformsVersion: 30.0.0-beta.6",
            },
          ],
        },
        status: "completed",
        authored: format(parseISO(time), "yyyy-MM-dd'T'HH:mm:ssxxx"),
        subject: encounter.subject,
        encounter: {
          reference: `Encounter/${encounter.id}`,
          type: "Encounter",
        },
        author: {
          reference: `Practitioner/${userId}`,
          type: "Practitioner",
        },
        questionnaire:
          "http://localhost:8081/questionnaire/local/Family-history.R4.json",
        item: responseItems,
      };

      if (updateId) {
        await updateQuestionnaireResponseMu.trigger({
          id: updateId,
          questionnaireResponse: questionnaireResponse,
        });
      } else {
        await createQuestionnaireResponseMu.trigger(questionnaireResponse);
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
        {updateId ? "Update Family History" : "Add Family History"}
      </p>

      <div className="mt-4">
        <Controller
          name="code"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CodedInput
              title="Family History"
              conceptId="57177007"
              selectedItem={value}
              setSelectedItem={(item) => onChange(item)}
              searchOptions={searchCodes}
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
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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

export default FamilyHistoryForm;
