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
import { useRouter } from "next/router";
import useSWR from "swr";
import { Encounter, QuestionnaireResponse } from "fhir/r4";
import { getEncounter, getQuestionnaireResponses } from "../../../../api";
import { ReactElement } from "react";
import { EncounterLayout } from "..";
import MedicalHistoryItem from "../../../../components/medical-history-item";
import ChiefComplaintForm from "./chief-complaint-form";

const ChiefComplaints: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;

  const chiefComplaintsQuery = useSWR(
    encounter?.id ? "questionnaireResponse" : null,
    () =>
      getQuestionnaireResponses(
        { page: 1, size: 200 },
        `encounter=${encounter?.id}&questionnaire=http://localhost:8081/questionnaire/local/Chief-complaint.R4.json`
      )
  );

  const chiefComplaints: QuestionnaireResponse[] =
    chiefComplaintsQuery?.data?.data?.entry?.map(
      (e) => e.resource as QuestionnaireResponse
    ) ?? [];


  return (
    <div className="bg-slate-50 p-5">
      <p className="text-2xl text-gray-800 font-bold font-mono">
        Chief Complaints
      </p>

      <hr className="mt-3" />

      <div className=" mt-5">
        <MedicalHistoryItem
          title="Chief complaints"
          items={chiefComplaints.map((e, i) => {
            const details = [];

            const location = e?.item?.find(
              (item) => item.linkId === "6457471749228"
            );
            if (location) {
              details.push({
                label: "Location",
                value: location?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const severity = e?.item?.find(
              (item) => item.linkId === "2148935664172"
            );
            if (severity) {
              details.push({
                label: "Severity",
                value: severity?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const duration = e?.item?.find(
              (item) => item.linkId === "2761778187966"
            );
            if (duration) {
              details.push({
                label: "Duration",
                value: duration?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const timing = e?.item?.find(
              (item) => item.linkId === "5394107920889"
            );
            if (timing) {
              details.push({
                label: "Timing",
                value: timing?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const context = e?.item?.find(
              (item) => item.linkId === "7269331181962"
            );
            if (context) {
              details.push({
                label: "Context",
                value: context?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const modifyingFactor = e?.item?.find(
              (item) => item.linkId === "8023965935340"
            );
            if (modifyingFactor) {
              details.push({
                label: "Modifying Factors",
                value: modifyingFactor?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const signSymptoms = e?.item?.find(
              (item) => item.linkId === "3571671322850"
            );
            if (signSymptoms) {
              details.push({
                label: "Signs & Symptoms",
                value: signSymptoms?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const chiefComplaint = e?.item?.find(
              (item) => item.linkId === "9253877226859"
            );

            return {
              id: e.id,
              title: chiefComplaint?.answer
                ?.map((answer) => answer?.valueCoding?.display)
                ?.join(", "),
              details: details,
              createdAt: "",
            };
          })}
          locked={false}
          loading={false}
          onAddClick={() => {
            if (encounter) {
              bottomSheetDispatch({
                type: "show",
                width: "medium",
                children: (
                  <div className="px-8 py-6">
                    <div className="float-right">
                      <button
                        onClick={() => {
                          bottomSheetDispatch({
                            type: "hide",
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-8 w-8 text-gray-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <ChiefComplaintForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Chief complaint saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        // exerciseHistoryQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
          onUpdateClick={(id: string) => {
            if (encounter) {
              bottomSheetDispatch({
                type: "show",
                width: "medium",
                children: (
                  <div className="px-8 py-6">
                    <div className="float-right">
                      <button
                        onClick={() => {
                          bottomSheetDispatch({
                            type: "hide",
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="h-8 w-8 text-gray-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <ChiefComplaintForm
                      updateId={id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Chief complaint saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        //exerciseHistoryQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
        />
      </div>
    </div>
  );
};

ChiefComplaints.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default ChiefComplaints;
