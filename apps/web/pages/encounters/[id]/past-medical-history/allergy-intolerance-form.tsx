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
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import {
  createQuestionnaireResponse,
  getAllergyIntoleranceCategories,
  getAllergyIntoleranceCriticalities,
  getAllergyIntoleranceStatuses,
  getAllergyIntoleranceTypes,
  getAllergyIntoleranceVerStatuses,
  getQuestionnaireResponse,
  getServerTime,
  searchConceptChildren,
  updateQuestionnaireResponse,
} from "../../../../api";
import Select from "react-select";
import CodedInput from "../../../../components/coded-input";
import { debounce } from "lodash";
import Button from "../../../../components/button";
import { format, parseISO } from "date-fns";
import { Tooltip } from "flowbite-react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { getUserIdFromSession } from "../../../../util/ory";
import { useSession } from "../../../../context/SessionProvider";

interface Props {
  updateId?: string;
  encounter: Encounter;
  onSuccess: () => void;
}

const AllergyIntoleranceForm: React.FC<Props> = ({
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

    const type = questionnaireResponse?.item?.find(
      (e) => e.linkId === "6369436053719"
    );

    if (type) {
      setValue("type", {
        value: type?.answer?.at(0)?.valueCoding?.code,
        label: type?.answer?.at(0)?.valueCoding?.display,
      });
    }

    const allergy = questionnaireResponse?.item?.find(
      (e) => e.linkId === "742766117678"
    );

    if (allergy) {
      setValue("code", {
        value: allergy?.answer?.at(0)?.valueCoding?.code,
        label: allergy?.answer?.at(0)?.valueCoding?.display,
      });
    }

    const status = questionnaireResponse?.item?.find(
      (e) => e.linkId === "3851066911705"
    );

    if (status) {
      setValue("clinicalStatus", {
        value: status?.answer?.at(0)?.valueCoding?.code,
        label: status?.answer?.at(0)?.valueCoding?.display,
      });
    }

    const verification = questionnaireResponse?.item?.find(
      (e) => e.linkId === "7952841940569"
    );

    if (verification) {
      setValue("verificationStatus", {
        value: verification?.answer?.at(0)?.valueCoding?.code,
        label: verification?.answer?.at(0)?.valueCoding?.display,
      });
    }

    const category = questionnaireResponse?.item?.find(
      (e) => e.linkId === "3982801480270"
    );

    if (category) {
      setValue("category", {
        value: category?.answer?.at(0)?.valueCoding?.code,
        label: category?.answer?.at(0)?.valueCoding?.display,
      });
    }

    const criticality = questionnaireResponse?.item?.find(
      (e) => e.linkId === "8954535617335"
    );

    if (criticality) {
      setValue("criticality", {
        value: criticality?.answer?.at(0)?.valueCoding?.code,
        label: criticality?.answer?.at(0)?.valueCoding?.display,
      });
    }

    const note = questionnaireResponse?.item?.find(
      (e) => e.linkId === "4155700406320"
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
  const types =
    useSWR("types", () =>
      getAllergyIntoleranceTypes()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const statuses =
    useSWR("statuses", () =>
      getAllergyIntoleranceStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const verStatuses =
    useSWR("verificationStatuses", () =>
      getAllergyIntoleranceVerStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const categories =
    useSWR("categories", () =>
      getAllergyIntoleranceCategories()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const criticalities =
    useSWR("criticalities", () =>
      getAllergyIntoleranceCriticalities()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const searchAllergyIntoleranceLoad = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: "<< 420134006 AND << 473010000",
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

      if (input.type) {
        responseItems.push({
          linkId: "6369436053719",
          text: "Type",
          answer: [
            {
              valueCoding: {
                code: input.type.value,
                system: input.type.system,
                display: input.type.label,
              },
            },
          ],
        });
      }

      if (input.code) {
        responseItems.push({
          linkId: "742766117678",
          text: "Allergy",
          answer: [
            {
              valueCoding: {
                code: input.code.value,
                system: input.code.system,
                display: input.code.label,
              },
            },
          ],
        });
      }

      if (input.clinicalStatus) {
        responseItems.push({
          linkId: "3851066911705",
          text: "Status",
          answer: [
            {
              valueCoding: {
                code: input.clinicalStatus.value,
                system: input.clinicalStatus.system,
                display: input.clinicalStatus.label,
              },
            },
          ],
        });
      }

      if (input.verificationStatus) {
        responseItems.push({
          linkId: "7952841940569",
          text: "Verification",
          answer: [
            {
              valueCoding: {
                code: input.verificationStatus.value,
                system: input.verificationStatus.system,
                display: input.verificationStatus.label,
              },
            },
          ],
        });
      }

      if (input.category) {
        responseItems.push({
          linkId: "3982801480270",
          text: "Category",
          answer: [
            {
              valueCoding: {
                code: input.category.value,
                system: input.category.system,
                display: input.category.label,
              },
            },
          ],
        });
      }

      if (input.criticality) {
        responseItems.push({
          linkId: "8954535617335",
          text: "Criticality",
          answer: [
            {
              valueCoding: {
                code: input.criticality.value,
                system: input.criticality.system,
                display: input.criticality.label,
              },
            },
          ],
        });
      }

      if (input.note.length > 0) {
        responseItems.push({
          linkId: "4155700406320",
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
          "http://localhost:8081/questionnaire/local/Allergy_Intolerance-History.R4.json",
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
        {updateId ? "Update Allergy/Intolerance" : "Add Allergy/Intolerance"}
      </p>

      <div className="mt-4">
        <label className="block text-gray-700">Type</label>

        <Controller
          name="type"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={types}
              placeholder="Type"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <Controller
          name="code"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <CodedInput
              title="Allergy/Intolerance"
              conceptId="420134006"
              selectedItem={value}
              setSelectedItem={(item) => onChange(item)}
              searchOptions={searchAllergyIntoleranceLoad}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Status</label>

        <Controller
          name="clinicalStatus"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={statuses}
              placeholder="Status"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Verification</label>

        <Controller
          name="verificationStatus"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={verStatuses}
              placeholder="Verification"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Category</label>

        <Controller
          name="category"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={categories}
              placeholder="Category"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Criticality</label>

        <Controller
          name="criticality"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={criticalities}
              placeholder="Criticality"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />

        <div className="mt-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="note" className="block text-gray-700">
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
      </div>
    </form>
  );
};

export default AllergyIntoleranceForm;
