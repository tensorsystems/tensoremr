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
import { debounce } from "lodash";
import {
  createQuestionnaireResponse,
  getCondition,
  getConditionStatuses,
  getConditionVerStatuses,
  getQuestionnaireResponse,
  getServerTime,
  searchConceptChildren,
  updateQuestionnaireResponse,
} from "../../../../api";
import CodedInput from "../../../../components/coded-input";
import Button from "../../../../components/button";
import useSWR from "swr";
import { format, parseISO } from "date-fns";
import useSWRMutation from "swr/mutation";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "flowbite-react";
import { useSession } from "../../../../context/SessionProvider";
import { getUserIdFromSession } from "../../../../util/ory";

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
  const { register, handleSubmit, setValue, control } = useForm<any>();
  const { session } = useSession();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (updateId) {
      updateDefaultValues(updateId);
    }
  }, [updateId]);
  
  const updateDefaultValues = async (updateId: string) => {
    setIsLoading(true);

    const questionnaireResponse: QuestionnaireResponse = (
      await getQuestionnaireResponse(updateId)
    )?.data;

    const code = questionnaireResponse?.item?.find(
      (e) => e.linkId === "7369230702555"
    );

    if (code) {
      setValue("code", {
        value: code?.answer?.at(0)?.valueCoding?.code,
        label: code?.answer?.at(0)?.valueCoding?.display,
      });
    }

    const status = questionnaireResponse?.item?.find(
      (e) => e.linkId === "5994139999323"
    );

    if (status) {
      setValue("status", status?.answer?.at(0)?.valueCoding?.code);
    }

    const verification = questionnaireResponse?.item?.find(
      (e) => e.linkId === "877540205676"
    );

    if (verification) {
      setValue("verification", verification?.answer?.at(0)?.valueCoding?.code);
    }

    const note = questionnaireResponse?.item?.find(
      (e) => e.linkId === "4740848440352"
    );

    if (note) {
      setValue(
        "note",
        note?.answer?.map((answer) => answer?.valueString)?.join(", ")
      );
    }

    setIsLoading(false);
  };

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

      const userId = session ? getUserIdFromSession(session) : "";
      const responseItems: QuestionnaireResponseItem[] = [];

      if (input.code) {
        responseItems.push({
          linkId: "7369230702555",
          text: "Eating Pattern",
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
          "http://localhost:8081/questionnaire/local/Eating-pattern-history.R4.json",
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
        {updateId ? "Update Eating Pattern" : "Add Eating Pattern"}
      </p>

      <div className="mt-4">
        <Controller
          name="code"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CodedInput
              title="Eating Pattern"
              conceptId="289136006"
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
