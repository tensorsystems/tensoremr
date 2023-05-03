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
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "flowbite-react";
import Button from "../../../../components/button";
import {
  createQuestionnaireResponse,
  getConditionSeverity,
  getConditionStatuses,
  getConditionVerStatuses,
  getQuestionnaireResponse,
  getServerTime,
  searchConceptChildren,
  updateQuestionnaireResponse,
} from "../../../../api";
import { debounce } from "lodash";
import {
  Encounter,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
} from "fhir/r4";
import { Controller, useForm } from "react-hook-form";
import { useNotificationDispatch } from "@tensoremr/notification";
import { format, parseISO } from "date-fns";
import useSWRMutation from "swr/mutation";
import CodedInput from "../../../../components/coded-input";
import useSWR from "swr";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

const DisorderForm: React.FC<Props> = ({ updateId, encounter, onSuccess }) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue, control } = useForm<any>();
  const session: any = useSessionContext();
  
  // State
  const [isLoading, setIsLoading] = useState<boolean>(false);



  // Effects
  useEffect(() => {
    if (updateId) {
      getDefaultValues(updateId);
    }
  }, [updateId]);

  const getDefaultValues = async (updateId: string) => {
    setIsLoading(true);

    const questionnaireResponse: QuestionnaireResponse = (
      await getQuestionnaireResponse(updateId)
    )?.data;

    const condition = questionnaireResponse?.item?.find(
      (e) => e.linkId === "7369230702555"
    );

    if (condition) {
      setValue("code", {
        value: condition?.answer?.at(0)?.valueCoding?.code,
        label: condition?.answer?.at(0)?.valueCoding?.display,
      });
    }

    const severity = questionnaireResponse?.item?.find(
      (e) => e.linkId === "2094373707873"
    );

    if (severity) {
      setValue("severity", severity?.answer?.at(0)?.valueCoding?.code);
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

    const bodySite = questionnaireResponse?.item?.find(
      (e) => e.linkId === "4235783381591"
    );

    if (bodySite) {
      setValue("bodySite", {
        value: bodySite?.answer?.at(0)?.valueCoding?.code,
        label: bodySite?.answer?.at(0)?.valueCoding?.display,
      });
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

      const responseItems: QuestionnaireResponseItem[] = [];

      if (input.code) {
        responseItems.push({
          linkId: "7369230702555",
          text: "Condition",
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

      if (severity) {
        responseItems.push({
          linkId: "2094373707873",
          text: "Severity",
          answer: [
            {
              valueCoding: {
                code: severity.value,
                system: severity.system,
                display: severity.label,
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

      if (input.bodySite) {
        responseItems.push({
          linkId: "4235783381591",
          text: "Body site",
          answer: [
            {
              valueCoding: {
                code: input.bodySite.value,
                display: input.bodySite.label,
                system: "http://snomed.info/sct",
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
          reference: `Practitioner/${session?.userId}`,
          type: "Practitioner",
        },
        questionnaire:
          "http://localhost:8081/questionnaire/local/Past-Disorder.R4.json",
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <p className="text-lg font-bold tracking-wide text-teal-700 uppercase">
        {updateId ? "Update Disorder" : "Add Past Disorder"}
      </p>

      <div className="mt-4">
        <Controller
          name="code"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CodedInput
              title="Disorder History"
              conceptId="404684003"
              selectedItem={value}
              setSelectedItem={(item) => onChange(item)}
              searchOptions={searchConceptChildrenLoad}
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
              searchOptions={searchBodySiteLoad}
            />
          )}
        />
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

export default DisorderForm;
