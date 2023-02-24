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
  Control,
  useForm,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { ReactElement, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  createQuestionnaireResponse,
  getEncounter,
  getQuestionnaireResponses,
  getServerTime,
  getVitalSignsQuestionnaire,
  updateQuestionnaireResponse,
} from "../../../../api";
import {
  Encounter,
  Questionnaire,
  QuestionnaireItem,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
} from "fhir/r4";
import useSWRMutation from "swr/mutation";
import { EncounterLayout } from "..";
import Button from "../../../../components/button";
import { getQuestionnairResponses } from "../../../../util/fhir";
import { format, parseISO } from "date-fns";

const VitalSigns: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const notifDispatch = useNotificationDispatch();
  const { handleSubmit, setValue, register, control, watch, reset } =
    useForm<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { data: session } = useSession();

  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;

  const questionnaireQuery = useSWR(`reviewOfSystemsQuestionnaire`, () =>
    getVitalSignsQuestionnaire()
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

  const vitalSignsResponseQuery = useSWR(
    encounter?.id ? "vitalSigns" : null,
    () =>
      getQuestionnaireResponses(
        { page: 1, size: 1 },
        `encounter=${encounter.id}&questionnaire=http://loinc.org/34566-0`
      )
  );

  const vitalSigns: QuestionnaireResponse | undefined =
    vitalSignsResponseQuery?.data?.data?.entry?.map(
      (e) => e.resource as QuestionnaireResponse
    )[0];

  useEffect(() => {
    if (vitalSigns?.item) {
      console.log("Vital signs", vitalSigns);

      const items = Object.assign({}, ...flatTest(vitalSigns.item));
      reset(items);
    }
  }, [vitalSigns]);

  const flatTest = (items: QuestionnaireResponseItem[]) => {
    const formItems = [];

    items.forEach((item) => {
      if (item.item) {
        formItems.push(...flatTest(item.item));
      } else {
        let answer: any;

        item.answer?.forEach((a) => {
          if (a.valueCoding) {
            answer = a.valueCoding.code;
          }

          if (a.valueString) {
            answer = a.valueString;
          }

          if (a.valueQuantity) {
            answer = a.valueQuantity;
          }

          if (a.valueDecimal) {
            answer = { value: a.valueDecimal };
          }
        });

        formItems.push({
          [item.linkId]: answer,
        });
      }
    });

    return formItems;
  };

  const questionnaire: Questionnaire = questionnaireQuery?.data?.data;

  const onSubmit = async (input: any) => {
    setIsLoading(true);
    try {
      const time = (await getServerTime()).data;
      const responseItems = getQuestionnairResponses(questionnaire.item, input);

      const questionnaireResponse: QuestionnaireResponse = {
        resourceType: "QuestionnaireResponse",
        id: vitalSigns?.id ? vitalSigns.id : undefined,
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
        item: responseItems,
        subject: encounter.subject,
        questionnaire: "http://loinc.org/34566-0",
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

      if (vitalSigns?.id) {
        await updateQuestionnaireResponseMu.trigger({
          id: vitalSigns.id,
          questionnaireResponse: questionnaireResponse,
        });
      } else {
        await createQuestionnaireResponseMu.trigger(questionnaireResponse);
      }

      notifDispatch({
        type: "showNotification",
        notifTitle: "Success",
        notifSubTitle: "Vital signs saved successfully",
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

  // console.log("Question", questionnaireQuery?.data?.data);

  console.log("Values", watch());

  return (
    <div className="bg-slate-50 p-5">
      <p className="text-2xl text-gray-800 font-bold font-mono">Vital Signs</p>

      <hr className="my-4" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          {questionnaire?.item?.map((e) => (
            <QuestionnaireInput
              item={e}
              key={e?.linkId}
              control={control}
              setValue={setValue}
              register={register}
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

interface QuestionnaireInputProps {
  item: QuestionnaireItem;
  control: Control<any, any>;
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  onError: (message: any) => void;
}

function QuestionnaireInput({
  item,
  control,
  setValue,
  onError,
  register,
}: QuestionnaireInputProps) {
  return (
    <div className="rounded-sm pt-1">
      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <p className="text-sm text-gray-800">{item?.text}</p>
        </div>
        <div className="col-span-9">
          {item?.type === "quantity" && (
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Type a number"
                  {...register(`${item?.linkId}.value`)}
                  className="pl-4 py-[6px] block w-full border-gray-300 border rounded-md shadow-sm text-sm"
                />
              </div>
              <div className="flex-1">
                <select
                  {...register(`${item?.linkId}.unit`)}
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  {item.extension?.map((e, i) => (
                    <option key={i} value={e?.valueCoding?.code}>
                      {e?.valueCoding?.display}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {item?.type === "decimal" && (
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <input
                  type="number"
                  placeholder="Type a number"
                  {...register(`${item?.linkId}.value`)}
                  className="pl-4 py-[6px] block w-full border-gray-300 border rounded-md shadow-sm text-sm"
                />
              </div>
              <div className="flex-1">
                <select
                  {...register(`${item?.linkId}.unit`)}
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  {item.extension?.map((e, i) => (
                    <option key={i} value={e?.valueCoding?.code}>
                      {e?.valueCoding?.display}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {item?.type === "choice" && (
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <select
                  {...register(`${item?.linkId}`)}
                  className="w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                >
                  <option></option>
                  {item?.answerOption?.map((e) => (
                    <option
                      key={e?.valueCoding?.code}
                      value={e?.valueCoding?.code}
                    >
                      {e?.valueCoding?.display}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {item?.type === "string" && (
            <input
              type="text"
              placeholder="Type a value"
              {...register(`${item?.linkId}`)}
              className="pl-4 py-[6px] block w-full sm:text-md border-gray-300 border rounded-md shadow-sm text-sm"
            />
          )}
        </div>
      </div>
      {item?.type === "group" && (
        <div className="ml-5 mt-2 mb-2">
          {item.item?.map((e, i) => (
            <div key={i}>
              <QuestionnaireInput
                item={e}
                control={control}
                setValue={setValue}
                register={register}
                onError={(message) => onError(message)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

VitalSigns.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default VitalSigns;
