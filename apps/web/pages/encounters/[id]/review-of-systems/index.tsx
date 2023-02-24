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

import { NextPageWithLayout } from "../../../_app";
import { useNotificationDispatch } from "@tensoremr/notification";
import useSWR from "swr";
import { useRouter } from "next/router";
import {
  createQuestionnaireResponse,
  getEncounter,
  getQuestionnaireResponses,
  getReviewOfSystemsQuestionnaire,
  getServerTime,
  searchConceptChildren,
  updateQuestionnaireResponse,
} from "../../../../api";
import {
  Encounter,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
  QuestionnaireResponseItemAnswer,
} from "fhir/r4";
import { ReactElement, useCallback, useEffect, useState } from "react";
import { EncounterLayout } from "..";
import useSWRMutation from "swr/mutation";
import { Control, Controller, useForm, UseFormSetValue } from "react-hook-form";
import AsyncSelect from "react-select/async";
import Button from "../../../../components/button";
import { debounce, isEmpty } from "lodash";
import { format, parseISO } from "date-fns";
import { useSession } from "next-auth/react";
import QuestionnaireInput from "../../../../components/questionnaire-input";

const ReviewOfSystems: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const notifDispatch = useNotificationDispatch();
  const { handleSubmit, setValue, reset, control, watch } = useForm<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { data: session } = useSession();

  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;
  const patientId = encounter?.subject?.reference?.split("/")[1];

  const questionnaireQuery = useSWR(`reviewOfSystemsQuestionnaire`, () =>
    getReviewOfSystemsQuestionnaire()
  );

  const createQuestionnaireResponseMu = useSWRMutation(
    "questionnaireResponse",
    (key, { arg }) => createQuestionnaireResponse(arg)
  );

  const updateQuestionnaireResponseMu = useSWRMutation(
    "questionnaireResponse",
    (key, { arg }) =>
      updateQuestionnaireResponse(arg.id, arg.questionnaireResponse)
  );

  const reviewOfSystemsResponseQuery = useSWR(
    patientId ? "reviewOfSystems" : null,
    () =>
      getQuestionnaireResponses(
        { page: 1, size: 1 },
        `patient=${patientId}&questionnaire=http://loinc.org/71406-3`
      )
  );

  const reviewOfSystems: QuestionnaireResponse | undefined =
    reviewOfSystemsResponseQuery?.data?.data?.entry?.map(
      (e) => e.resource as QuestionnaireResponse
    )[0];

  useEffect(() => {
    if (reviewOfSystems?.item) {
      const items = {};

      reviewOfSystems.item.forEach((item) => {
        const answers: any[] = [];

        item.answer?.forEach((a) => {
          if (a.valueCoding) {
            answers.push({
              value: a.valueCoding?.code,
              label: a.valueCoding.display,
              type: "coded",
            });
          }

          if (a.valueString) {
            answers.push({
              value: a.valueString,
              label: a.valueString,
              type: "free_text",
            });
          }
        });

        items[item.linkId] = answers;
      });

      reset(items);
    }
  }, [reviewOfSystems]);

  const questionnaire: Questionnaire = questionnaireQuery?.data?.data;

  const onSubmit = async (input: any) => {
    setIsLoading(true);

    try {
      const time = (await getServerTime()).data;

      const items: QuestionnaireResponseItem[] = [];

      for (const key in input) {
        const questionnaireItem = questionnaire?.item?.find(
          (e) => e.linkId === key
        );
        const answers: QuestionnaireResponseItemAnswer[] = [];

        input[key].forEach((answer) => {
          if (answer) {
            if (answer.type === "coded") {
              answers.push({
                valueCoding: {
                  code: answer.value,
                  display: answer.label,
                },
              });
            } else if (answer.type === "free_text") {
              answers.push({
                valueString: answer.value,
              });
            }
          }
        });

        items.push({
          linkId: key,
          text: questionnaireItem?.text,
          answer: answers,
        });
      }

      const questionnaireResponse: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        id: reviewOfSystems?.id ? reviewOfSystems.id : undefined,
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
        item: items,
        subject: encounter.subject,
        questionnaire: "http://loinc.org/71406-3",
        encounter: {
          reference: `Encounter/${encounter.id}`,
          type: "Encounter",
        },
        author: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          reference: `Practitioner/${session.user?.id}`,
          type: "Practitioner",
        },
      };

      if (reviewOfSystems?.id) {
        await updateQuestionnaireResponseMu.trigger({
          id: reviewOfSystems.id,
          questionnaireResponse: questionnaireResponse,
        });
      } else {
        await createQuestionnaireResponseMu.trigger(questionnaireResponse);
      }

      notifDispatch({
        type: "showNotification",
        notifTitle: "Success",
        notifSubTitle: "Review of Systems saved successfully",
        variant: "success",
      });
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
    <div className="bg-slate-50 p-5">
      <p className="text-2xl text-gray-800 font-bold font-mono">
        Review of Systems
      </p>

      <hr className="my-4" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 gap-y-3 gap-x-4">
          {questionnaire?.item?.map((e) => (
            <QuestionnaireInput
              item={e}
              searchCode="404684003"
              values={values}
              key={e?.linkId}
              control={control}
              setValue={setValue}
              onError={(message) =>
                notifDispatch({
                  type: "showNotification",
                  notifTitle: "Error",
                  notifSubTitle: message,
                  variant: "failure",
                })
              }
            />
          ))}
        </div>
        <div className="mt-5">
          <Button
            loading={isLoading}
            loadingText={"Saving"}
            type="submit"
            text="Save"
            icon="save"
            variant="filled"
            disabled={isLoading}
            onClick={() => null}
          />
        </div>
      </form>
    </div>
  );
};

ReviewOfSystems.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default ReviewOfSystems;
