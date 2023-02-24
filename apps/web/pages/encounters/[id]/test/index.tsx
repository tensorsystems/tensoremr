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
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import useSWR from "swr";
import { useRouter } from "next/router";
import {
  createQuestionnaireResponse,
  getEncounter,
  getQuestionnaireResponses,
  getReviewOfSystemsQuestionnaire,
  getVitalSignsQuestionnaire,
  updateQuestionnaireResponse,
} from "../../../../api";
import { Encounter, QuestionnaireResponse } from "fhir/r4";
import { ReactElement, useEffect, useRef, useState } from "react";
import { EncounterLayout } from "..";
import { useForm } from "react-hook-form";
import "lforms/dist/lforms/webcomponent/styles.css";
import Button from "../../../../components/button";
import { Spinner } from "flowbite-react";
import { useSession } from "next-auth/react";
import useSWRMutation from "swr/mutation";

const ReviewOfSystems: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const ref = useRef(null);

  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue, control, watch } = useForm<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;
  const patientId = encounter?.subject?.reference?.split("/")[1];

  const questionnaireQuery = useSWR(`reviewOfSystemsQuestionnaire`, () =>
    getVitalSignsQuestionnaire()
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

  const createQuestionnaireResponseMu = useSWRMutation(
    "questionnaireResponse",
    (key, { arg }) => createQuestionnaireResponse(arg)
  );

  const updateQuestionnaireResponseMu = useSWRMutation(
    "questionnaireResponse",
    (key, { arg }) =>
      updateQuestionnaireResponse(arg.id, arg.questionnaireResponse)
  );

  useEffect(() => {
    if (
      window.LForms &&
      !questionnaireQuery.isLoading &&
      !reviewOfSystemsResponseQuery.isLoading
    ) {
      const formExists = window.LForms.Util.getFormData();
      if (!formExists) {
        const reviewOfSystems: QuestionnaireResponse | undefined =
          reviewOfSystemsResponseQuery?.data?.data?.entry?.map(
            (e) => e.resource as QuestionnaireResponse
          )[0];

          window.LForms.Util.addFormToPage(
            questionnaireQuery?.data?.data,
            "myFormContainer",
            {}
          );
      }
    }
  }, [questionnaireQuery, reviewOfSystemsResponseQuery]);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { data: session } = useSession();

  const onSubmit = async () => {
    if (window.LForms) {
      // const test = window.LForms.Util.getFormData(ref.current, false, false);
      const questionnaireResponse: QuestionnaireResponse =
        window.LForms.Util.getFormFHIRData(
          "QuestionnaireResponse",
          "R4",
          ref.current,
          null
        );

      questionnaireResponse.subject = encounter.subject;
      questionnaireResponse.questionnaire = "http://loinc.org/71406-3";
      questionnaireResponse.encounter = {
        reference: `Encounter/${encounter.id}`,
        type: "Encounter",
      };
      questionnaireResponse.author = {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        reference: `Practitioner/${session.user?.id}`,
        type: "Practitioner",
      };

      // const response = await createQuestionnaireResponseMu.trigger(
      //   questionnaireResponse
      // );

      console.log("QuestionnaireResponse", questionnaireResponse);
      //   console.log("Response", response);
    }
  };

  return (
    <div className="bg-slate-50 p-5">
      {questionnaireQuery.isLoading && (
        <div className="flex items-center justify-center h-28">
          <Spinner color="warning" />
        </div>
      )}

      <div id="myFormContainer" ref={ref}></div>

      <div className="mt-5">
        <Button
          loading={false}
          loadingText={"Saving"}
          type="submit"
          text="Save"
          icon="save"
          variant="filled"
          disabled={false}
          onClick={onSubmit}
        />
      </div>
    </div>
  );
};

ReviewOfSystems.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default ReviewOfSystems;
