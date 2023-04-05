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

import {
  Encounter,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
} from "fhir/r4";
import { useNotificationDispatch } from "@tensoremr/notification";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import CodedInput from "../../../../components/coded-input";
import { debounce } from "lodash";
import {
  createQuestionnaireResponse,
  getQuestionnaireResponse,
  getServerTime,
  searchConceptChildren,
  updateQuestionnaireResponse,
} from "../../../../api";
import { Tooltip } from "flowbite-react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import Button from "../../../../components/button";
import { format, parseISO } from "date-fns";
import useSWRMutation from "swr/mutation";
import { useSession } from "../../../../context/SessionProvider";
import { getUserIdFromSession } from "../../../../util/ory";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

const ChiefComplaintForm: React.FC<Props> = ({
  updateId,
  encounter,
  onSuccess,
}) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue, control } = useForm<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { session } = useSession();

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
      (e) => e.linkId === "9253877226859"
    );

    if (code) {
      setValue("code", {
        value: code?.answer?.at(0)?.valueCoding?.code,
        label: code?.answer?.at(0)?.valueCoding?.display,
      });
    }

    const location = questionnaireResponse?.item?.find(
      (e) => e.linkId === "6457471749228"
    );

    if (location) {
      setValue(
        "location",
        location?.answer?.map((e) => e.valueString).join(", ")
      );
    }

    const severity = questionnaireResponse?.item?.find(
      (e) => e.linkId === "2148935664172"
    );

    if (severity) {
      setValue(
        "severity",
        severity?.answer?.map((e) => e.valueString).join(", ")
      );
    }

    const duration = questionnaireResponse?.item?.find(
      (e) => e.linkId === "2761778187966"
    );

    if (duration) {
      setValue(
        "duration",
        duration?.answer?.map((e) => e.valueString).join(", ")
      );
    }

    const timing = questionnaireResponse?.item?.find(
      (e) => e.linkId === "5394107920889"
    );

    if (timing) {
      setValue("timing", timing?.answer?.map((e) => e.valueString).join(", "));
    }

    const context = questionnaireResponse?.item?.find(
      (e) => e.linkId === "7269331181962"
    );

    if (context) {
      setValue(
        "context",
        context?.answer?.map((e) => e.valueString).join(", ")
      );
    }

    const modifyingFactors = questionnaireResponse?.item?.find(
      (e) => e.linkId === "8023965935340"
    );

    if (modifyingFactors) {
      setValue(
        "modifyingFactors",
        modifyingFactors?.answer?.map((e) => e.valueString).join(", ")
      );
    }

    const signsSymptoms = questionnaireResponse?.item?.find(
      (e) => e.linkId === "3571671322850"
    );

    if (signsSymptoms) {
      setValue(
        "signsSymptoms",
        signsSymptoms?.answer?.map((e) => e.valueString).join(", ")
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

  const searchComplaints = useCallback(
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

  const onSubmit = async (input: any) => {
    setIsLoading(true);

    try {
      const time = (await getServerTime()).data;

      const userId = session ? getUserIdFromSession(session) : "";
      const responseItems: QuestionnaireResponseItem[] = [];

      if (input.code) {
        responseItems.push({
          linkId: "9253877226859",
          text: "Chief complaint",
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

      if (input.location?.length > 0) {
        responseItems.push({
          linkId: "6457471749228",
          text: "Location",
          answer: [
            {
              valueString: input.location,
            },
          ],
        });
      }

      if (input.severity?.length > 0) {
        responseItems.push({
          linkId: "2148935664172",
          text: "Severity",
          answer: [
            {
              valueString: input.severity,
            },
          ],
        });
      }

      if (input.duration?.length > 0) {
        responseItems.push({
          linkId: "2761778187966",
          text: "Duration",
          answer: [
            {
              valueString: input.duration,
            },
          ],
        });
      }

      if (input.timing?.length > 0) {
        responseItems.push({
          linkId: "5394107920889",
          text: "Timing",
          answer: [
            {
              valueString: input.timing,
            },
          ],
        });
      }

      if (input.context?.length > 0) {
        responseItems.push({
          linkId: "7269331181962",
          text: "Context",
          answer: [
            {
              valueString: input.context,
            },
          ],
        });
      }

      if (input.modifyingFactors?.length > 0) {
        responseItems.push({
          linkId: "8023965935340",
          text: "Modifying Factors",
          answer: [
            {
              valueString: input.modifyingFactors,
            },
          ],
        });
      }

      if (input.signsSymptoms?.length > 0) {
        responseItems.push({
          linkId: "3571671322850",
          text: "Signs & Symptoms",
          answer: [
            {
              valueString: input.signsSymptoms,
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
          "http://localhost:8081/questionnaire/local/Chief-complaint.R4.json",
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
        {updateId ? "Update Chief Complaint" : "Add Chief Complaint"}
      </p>

      <div className="mt-4">
        <Controller
          name="code"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CodedInput
              title="Complaint"
              conceptId="404684003"
              selectedItem={value}
              setSelectedItem={(item) => onChange(item)}
              searchOptions={searchComplaints}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="location" className="block text-gray-700">
            Location
          </label>

          <Tooltip content="This field is not coded. Decision support and interactions will not be active">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          </Tooltip>
        </div>
        <input
          type="text"
          name="location"
          id="location"
          {...register("location")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="severity" className="block text-gray-700">
            Severity
          </label>

          <Tooltip content="This field is not coded. Decision support and interactions will not be active">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          </Tooltip>
        </div>
        <input
          type="text"
          name="severity"
          id="severity"
          {...register("severity")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="duration" className="block text-gray-700">
            Duration
          </label>

          <Tooltip content="This field is not coded. Decision support and interactions will not be active">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          </Tooltip>
        </div>
        <input
          type="text"
          name="duration"
          id="duration"
          {...register("duration")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="timing" className="block text-gray-700">
            Timing
          </label>

          <Tooltip content="This field is not coded. Decision support and interactions will not be active">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          </Tooltip>
        </div>
        <input
          type="text"
          name="timing"
          id="timing"
          {...register("timing")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="context" className="block text-gray-700">
            Context
          </label>

          <Tooltip content="This field is not coded. Decision support and interactions will not be active">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          </Tooltip>
        </div>
        <input
          type="text"
          name="context"
          id="context"
          {...register("context")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="modifyingFactors" className="block text-gray-700">
            Modifying Factors
          </label>

          <Tooltip content="This field is not coded. Decision support and interactions will not be active">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          </Tooltip>
        </div>
        <input
          type="text"
          name="modifyingFactors"
          id="modifyingFactors"
          {...register("modifyingFactors")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <div className="flex items-center space-x-2">
          <label htmlFor="signsSymptoms" className="block text-gray-700">
            Signs & Symptoms
          </label>

          <Tooltip content="This field is not coded. Decision support and interactions will not be active">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-300" />
          </Tooltip>
        </div>
        <input
          type="text"
          name="signsSymptoms"
          id="signsSymptoms"
          {...register("signsSymptoms")}
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

export default ChiefComplaintForm;
