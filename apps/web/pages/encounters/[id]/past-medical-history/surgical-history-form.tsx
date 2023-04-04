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
  Encounter,
  Procedure,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
} from "fhir/r4";
import { useNotificationDispatch } from "@tensoremr/notification";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { ISelectOption } from "@tensoremr/models";
import useSWRMutation from "swr/mutation";
import {
  createProcedure,
  createQuestionnaireResponse,
  getEventStatus,
  getExtensions,
  getProcedure,
  getProcedureOutcomes,
  getServerTime,
  searchConceptChildren,
  updateProcedure,
  updateQuestionnaireResponse,
} from "../../../../api";
import { debounce } from "lodash";
import Button from "../../../../components/button";
import CodedInput from "../../../../components/coded-input";
import { Tooltip } from "flowbite-react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { useSession } from "../../../../context/SessionProvider";
import { format, parseISO } from "date-fns";
import { getUserIdFromSession } from "../../../../util/ory";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

const SurgicalHistoryForm: React.FC<Props> = ({
  updateId,
  encounter,
  onSuccess,
}) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue, control } = useForm<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { session } = useSession();

  // Effects
  useEffect(() => {
    if (updateId) {
      setIsLoading(true);
      getProcedure(updateId)
        .then((res) => {
          setIsLoading(false);

          const procedure: Procedure = res?.data;

          const code = procedure?.code?.coding?.at(0);
          if (code) {
            setValue("code", { value: code.code, label: code.display });
          }

          const status = procedure?.status;
          if (status) {
            setValue("status", status);
          }

          const reason = procedure?.reasonCode?.at(0).coding?.at(0);
          if (reason) {
            setValue("reason", { value: reason.code, label: reason.display });
          }

          const performedOn = procedure?.performedString;
          if (performedOn) {
            setValue("performedString", performedOn);
          }

          const bodySite = procedure?.bodySite?.at(0).coding?.at(0);
          if (bodySite) {
            setValue("bodySite", {
              value: bodySite.code,
              label: bodySite.display,
            });
          }

          const outcome = procedure?.outcome?.coding?.at(0);
          if (outcome) {
            setValue("outcome", outcome.code);
          }

          const complication = procedure?.complication?.at(0).coding?.at(0);
          if (complication) {
            setValue("complication", {
              value: complication.code,
              label: complication.display,
            });
          }

          if (procedure?.note?.length > 0) {
            setValue("note", procedure?.note.map((n) => n.text).join(", "));
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

  const eventStatuses =
    useSWR("eventStatuses", () =>
      getEventStatus()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const procedureOutcomes =
    useSWR("procedureOutcomes", () =>
      getProcedureOutcomes()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const searchSurgicalProcedureLoad = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 71388002",
          limit: 20,
        }).then((resp) => {
          const values = resp.data?.items?.map((e) => ({
            value: e.id,
            label: e?.pt?.term,
          }));

          if (values) {
            callback(values);
          }
        });
      }
    }, 600),
    []
  );

  const searchReasonLoad = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 404684003",
          limit: 20,
        }).then((resp) => {
          const values = resp.data?.items?.map((e) => ({
            value: e.id,
            label: e?.pt?.term,
          }));

          if (values) {
            callback(values);
          }
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
        }).then((resp) => {
          const values = resp.data?.items?.map((e) => ({
            value: e.id,
            label: e?.pt?.term,
          }));

          if (values) {
            callback(values);
          }
        });
      }
    }, 600),
    []
  );

  const searchComplicationLoad = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 404684003",
          limit: 20,
        }).then((resp) => {
          const values = resp.data?.items?.map((e) => ({
            value: e.id,
            label: e?.pt?.term,
          }));

          if (values) {
            callback(values);
          }
        });
      }
    }, 600),
    []
  );

  const onSubmit = async (input: any) => {
    setIsLoading(true);

    try {
      const time = (await getServerTime()).data;
      const userId = session ? getUserIdFromSession(session) : "";

      const status = eventStatuses.find((e) => e.value === input.status);
      const outcome = procedureOutcomes.find((e) => e.value === input.outcome);

      const responseItems: QuestionnaireResponseItem[] = [];

      if (status) {
        responseItems.push({
          linkId: "2094373707873",
          text: "Status",
          answer: [
            {
              valueCoding: {
                code: status.value,
                display: status.label,
                system: status.system,
              },
            },
          ],
        });
      }

      responseItems.push({
        linkId: "7126288200581",
        text: "Category",
        answer: [
          {
            valueCoding: {
              code: "387713003",
              display: "Surgical procedure",
              system: "http://snomed.info/sct",
            },
          },
        ],
      });

      if (input.code) {
        responseItems.push({
          linkId: "7369230702555",
          text: "Surgical procedure",
          answer: [
            {
              valueCoding: {
                code: input.code.value,
                display: input.code.label,
                system: "http://snomed.info/sct",
              },
            },
          ],
        });
      }

      if (input.performedString.length > 0) {
        responseItems.push({
          linkId: "877540205676",
          text: "Performed On",
          answer: [
            {
              valueString: input.performedString,
            },
          ],
        });
      }

      if (input.reason) {
        responseItems.push({
          linkId: "5994139999323",
          text: "Reason",
          answer: [
            {
              valueCoding: {
                code: input.reason.value,
                display: input.reason.label,
                system: "http://snomed.info/sct",
              },
            },
          ],
        });
      }

      if (input.complication) {
        responseItems.push({
          linkId: "2363675249271",
          text: "Complication",
          answer: [
            {
              valueCoding: {
                code: input.complication.value,
                display: input.complication.label,
                system: "http://snomed.info/sct",
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

      if (outcome) {
        responseItems.push({
          linkId: "5066125365989",
          text: "Outcome",
          answer: [
            {
              valueCoding: {
                code: outcome.value,
                display: outcome.label,
                system: outcome.system,
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
          "http://localhost:8081/questionnaire/local/Surgical-History.R4.json",
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
        {updateId ? "Update Surgical History" : "Add Surgical History"}
      </p>

      <div className="mt-4">
        <Controller
          name="code"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CodedInput
              title="Surgical Procedure"
              conceptId="71388002"
              selectedItem={value}
              setSelectedItem={(item) => onChange(item)}
              searchOptions={searchSurgicalProcedureLoad}
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
          {eventStatuses.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <Controller
          name="reason"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CodedInput
              title="Reason"
              conceptId="404684003"
              selectedItem={value}
              setSelectedItem={(item) => onChange(item)}
              searchOptions={searchReasonLoad}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="performedString"
          className="block font-medium text-gray-700"
        >
          Performed On
        </label>
        <input
          type="text"
          name="performedString"
          id="performedString"
          {...register("performedString")}
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
              searchOptions={searchBodySiteLoad}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="outcome"
          className="block text-sm font-medium text-gray-700"
        >
          Outcome
        </label>
        <select
          required
          {...register("outcome", { required: true })}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option></option>
          {procedureOutcomes.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <Controller
          name="complication"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CodedInput
              title="Complication"
              conceptId="404684003"
              selectedItem={value}
              setSelectedItem={(item) => onChange(item)}
              searchOptions={searchComplicationLoad}
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

export default SurgicalHistoryForm;
