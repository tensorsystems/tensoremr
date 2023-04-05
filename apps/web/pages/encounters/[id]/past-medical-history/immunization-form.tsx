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
  Immunization,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
} from "fhir/r4";
import { useNotificationDispatch } from "@tensoremr/notification";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import useSWR from "swr";
import {
  createQuestionnaireResponse,
  getImmunization,
  getImmunizationFundingSources,
  getImmunizationOrigins,
  getImmunizationReasons,
  getImmunizationRoutes,
  getImmunizationSites,
  getImmunizationStatuses,
  getImmunizationSubpotentReason,
  getQuestionnaireResponse,
  getServerTime,
  getVaccineCodes,
  updateQuestionnaireResponse,
} from "../../../../api";
import Select from "react-select";
import { Label } from "flowbite-react";
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

const ImmunizationForm: React.FC<Props> = ({
  updateId,
  encounter,
  onSuccess,
}) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue, control, watch } = useForm<any>();

  const isSubpotent = watch().isSubpotent;

  const { session } = useSession();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const createQuestionnaireResponseMu = useSWRMutation(
    "questionnaireResponse",
    (key, { arg }) => createQuestionnaireResponse(arg)
  );

  const updateQuestionnaireResponseMu = useSWRMutation(
    "questionnaireResponse",
    (key, { arg }) =>
      updateQuestionnaireResponse(arg.id, arg.questionnaireResponse)
  );

  const vaccineCodes =
    useSWR("vaccineCodes", () =>
      getVaccineCodes()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const immunizationStatuses =
    useSWR("immunizationStatuses", () =>
      getImmunizationStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const immunizationOrigins =
    useSWR("immunizationOrigins", () =>
      getImmunizationOrigins()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const immunizationSites =
    useSWR("immunizationSites", () =>
      getImmunizationSites()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const immunizationRoutes =
    useSWR("immunizationRoutes", () =>
      getImmunizationRoutes()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const immunizationReasons =
    useSWR("immunizationReasons", () =>
      getImmunizationReasons()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const immunizationSubpotentReasons =
    useSWR("immunizationSubpotentReasons", () =>
      getImmunizationSubpotentReason()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const immunizationFundingSources =
    useSWR("immunizationFundingSources", () =>
      getImmunizationFundingSources()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  // Effects
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

    const vaccine = questionnaireResponse?.item?.find(
      (e) => e.linkId === "6369436053719"
    );

    if (vaccine) {
      setValue("vaccineCode", {
        value: vaccine?.answer?.at(0)?.valueCoding?.code,
        label: vaccine?.answer?.at(0)?.valueCoding?.display,
      });
    }

    const status = questionnaireResponse?.item?.find(
      (e) => e.linkId === "742766117678"
    );

    if (status) {
      setValue("status", {
        value: status?.answer?.at(0)?.valueCoding?.code,
        label: status?.answer?.at(0)?.valueCoding?.display,
      });
    }

    const occurrenceString = questionnaireResponse?.item?.find(
      (e) => e.linkId === "3851066911705"
    );

    if (occurrenceString) {
      setValue(
        "occurrenceString",
        occurrenceString?.answer?.map((e) => e.valueString).join(", ")
      );
    }

    const origin = questionnaireResponse?.item?.find(
      (e) => e.linkId === "7952841940569"
    );

    if (origin) {
      setValue("reportOrigin", {
        value: origin?.answer?.at(0)?.valueCoding?.code,
        label: origin?.answer?.at(0)?.valueCoding?.display,
      });
    }

    const bodySite = questionnaireResponse?.item?.find(
      (e) => e.linkId === "3982801480270"
    );

    if (bodySite) {
      setValue("site", {
        value: bodySite?.answer?.at(0)?.valueCoding?.code,
        label: bodySite?.answer?.at(0)?.valueCoding?.display,
      });
    }

    const route = questionnaireResponse?.item?.find(
      (e) => e.linkId === "8954535617335"
    );

    if (route) {
      setValue("route", {
        value: route?.answer?.at(0)?.valueCoding?.code,
        label: route?.answer?.at(0)?.valueCoding?.display,
      });
    }

    const dosage = questionnaireResponse?.item?.find(
      (e) => e.linkId === "1028143165672"
    );

    if (dosage) {
      setValue(
        "doseQuantity",
        dosage?.answer?.map((e) => e.valueInteger).join(", ")
      );
    }

    const reason = questionnaireResponse?.item?.find(
      (e) => e.linkId === "9624238555934"
    );

    if (reason) {
      setValue("reason", {
        value: reason?.answer?.at(0)?.valueCoding?.code,
        label: reason?.answer?.at(0)?.valueCoding?.display,
      });
    }

    const isSubpotent = questionnaireResponse?.item?.find(
      (e) => e.linkId === "3310932418292"
    );

    if (isSubpotent) {
      setValue(
        "isSubpotent",
        isSubpotent?.answer?.at(0)?.valueBoolean
      );
    }

    const subPotentReason = questionnaireResponse?.item?.find(
      (e) => e.linkId === "1079540643412"
    );

    if (subPotentReason) {
      setValue(
        "subpotentReason",
        {
          value: subPotentReason?.answer?.at(0)?.valueCoding?.code,
          label: subPotentReason?.answer?.at(0)?.valueCoding?.display,
        }
      );
    }


    const fundingSource = questionnaireResponse?.item?.find(
      (e) => e.linkId === "2050374944906"
    );

    if (fundingSource) {
      setValue("fundingSource", {
        value: fundingSource?.answer?.at(0)?.valueCoding?.code,
        label: fundingSource?.answer?.at(0)?.valueCoding?.display,
      });
    }

    setIsLoading(false);
  };

  const onSubmit = async (input: any) => {
    setIsLoading(true);

    try {
      const time = (await getServerTime()).data;
      const userId = session ? getUserIdFromSession(session) : "";

      const responseItems: QuestionnaireResponseItem[] = [];

      const vaccineCode = vaccineCodes?.find(
        (e) => e.value === input.vaccineCode.value
      );

      if (vaccineCode) {
        responseItems.push({
          linkId: "6369436053719",
          text: "Vaccine",
          answer: [
            {
              valueCoding: {
                code: vaccineCode.value,
                system: vaccineCode.system,
                display: vaccineCode.label,
              },
            },
          ],
        });
      }

      if (input.status) {
        responseItems.push({
          linkId: "742766117678",
          text: "Status",
          answer: [
            {
              valueCoding: {
                code: input.status.value,
                system: input.status.system,
                display: input.status.label,
              },
            },
          ],
        });
      }

      if (input.occurrenceString) {
        responseItems.push({
          linkId: "3851066911705",
          text: "Occurrence",
          answer: [
            {
              valueString: input.occurrenceString,
            },
          ],
        });
      }

      if (input.reportOrigin) {
        responseItems.push({
          linkId: "7952841940569",
          text: "Origin",
          answer: [
            {
              valueCoding: {
                code: input.reportOrigin.value,
                system: input.reportOrigin.system,
                display: input.reportOrigin.label,
              },
            },
          ],
        });
      }

      if (input.site) {
        responseItems.push({
          linkId: "3982801480270",
          text: "Site",
          answer: [
            {
              valueCoding: {
                code: input.site.value,
                system: input.site.system,
                display: input.site.label,
              },
            },
          ],
        });
      }

      if (input.route) {
        responseItems.push({
          linkId: "8954535617335",
          text: "Route",
          answer: [
            {
              valueCoding: {
                code: input.route.value,
                system: input.route.system,
                display: input.route.label,
              },
            },
          ],
        });
      }

      if (input.doseQuantity) {
        responseItems.push({
          linkId: "1028143165672",
          text: "Dose",
          answer: [
            {
              valueInteger: parseInt(input.doseQuantity),
            },
          ],
        });
      }

      if (input.reason) {
        responseItems.push({
          linkId: "9624238555934",
          text: "Reason",
          answer: [
            {
              valueCoding: {
                code: input.reason.value,
                system: input.reason.system,
                display: input.reason.label,
              },
            },
          ],
        });
      }

      responseItems.push({
        linkId: "3310932418292",
        text: "Is Subpotent",
        answer: [
          {
            valueBoolean: isSubpotent,
          },
        ],
      });

      if (input.subpotentReason) {
        responseItems.push({
          linkId: "1079540643412",
          text: "Subpotent reason",
          answer: [
            {
              valueCoding: {
                code: input.subpotentReason.value,
                system: input.subpotentReason.system,
                display: input.subpotentReason.label,
              },
            },
          ],
        });
      }

      if (input.subpotentReason) {
        responseItems.push({
          linkId: "2050374944906",
          text: "Funding source",
          answer: [
            {
              valueCoding: {
                code: input.fundingSource.value,
                system: input.fundingSource.system,
                display: input.fundingSource.label,
              },
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
          "http://localhost:8081/questionnaire/local/Immunization-History.R4.json",
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
        {updateId ? "Update Immunization" : "Add Immunization"}
      </p>

      <div className="mt-4">
        <label
          htmlFor="vaccineCode"
          className="block font-medium text-gray-700"
        >
          Vaccine
        </label>

        <Controller
          name="vaccineCode"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={vaccineCodes}
              placeholder="Search"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
          rules={{ required: true }}
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Status</label>
        <Controller
          name="status"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={immunizationStatuses}
              placeholder="Status"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="w-full mt-4">
        <label htmlFor="occurrenceString" className="block text-gray-700">
          Occurance
        </label>
        <input
          id="occurrenceString"
          type="text"
          placeholder="Occurrence"
          {...register("occurrenceString")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Origin</label>

        <Controller
          name="reportOrigin"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={immunizationOrigins}
              placeholder="Origin"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Site</label>

        <Controller
          name="site"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={immunizationSites}
              placeholder="Site"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Route</label>

        <Controller
          name="route"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={immunizationRoutes}
              placeholder="Route"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="w-full mt-4">
        <label htmlFor="doseQuantity" className="block text-gray-700">
          Dosage
        </label>
        <input
          id="doseQuantity"
          type="number"
          placeholder="Dosage Quantity"
          {...register("doseQuantity")}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
        />
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Reason</label>

        <Controller
          name="reason"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={immunizationReasons}
              placeholder="Reason"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="mt-4 flex space-x-4 items-center">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isSubpotent"
            name="isSubpotent"
            {...register("isSubpotent")}
          />
          <Label htmlFor="isSubpotent">Subpotent</Label>
        </div>
        <div hidden={!isSubpotent} className="flex-1">
          <Controller
            name="subpotentReason"
            control={control}
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <Select
                isClearable
                ref={ref}
                value={value}
                options={immunizationSubpotentReasons}
                placeholder="Reason"
                onChange={(evt) => {
                  onChange(evt);
                }}
              />
            )}
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-gray-700">Funding Source</label>
        <Controller
          name="fundingSource"
          control={control}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <Select
              isClearable
              ref={ref}
              value={value}
              options={immunizationFundingSources}
              placeholder="Funding source"
              className="mt-1"
              onChange={(evt) => {
                onChange(evt);
              }}
            />
          )}
        />
      </div>

      <div className="mt-4">
        {false && <p className="text-red-600">Error: </p>}
      </div>
      <div className="mt-5">
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

export default ImmunizationForm;
