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

import { useRouter } from "next/router";
import { ReactElement } from "react";
import { EncounterLayout } from "..";
import MedicalHistoryItem from "../../../../components/medical-history-item";
import { NextPageWithLayout } from "../../../_app";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import {
  getEncounter,
  getQuestionnaireResponses,
} from "../../../../api";
import useSWR from "swr";
import { Encounter, QuestionnaireResponse } from "fhir/r4";
import ExerciseForm from "./exercise-form";
import TobaccoForm from "./tobacco-form";
import SubstanceUseForm from "./substance-use-form";
import EatingPatternForm from "./eating-pattern-form";
import DrugMisuseForm from "./drug-misuse-form";
import AlcoholHistoryForm from "./alcohol-history-form";
import BehavioralFindingForm from "./behavioral-finding-form";
import AdministrativeHistoryForm from "./administrative-history-form";

const SocialHistory: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;
  const patientId = encounter?.subject?.reference?.split("/")[1];

  const exerciseHistoryQuery = useSWR(
    patientId ? "exerciseHistories" : null,
    () =>
      getQuestionnaireResponses(
        { page: 1, size: 200 },
        `patient=${patientId}&questionnaire=http://localhost:8081/questionnaire/local/Exercise-History.R4.json`
      )
  );

  const tobaccoHistoryQuery = useSWR(
    patientId ? "tobaccoHistories" : null,
    () =>
    getQuestionnaireResponses(
        { page: 1, size: 200 },
        `patient=${patientId}&questionnaire=http://localhost:8081/questionnaire/local/Tobacco-History.R4.json`
      )
  );

  const substanceUseQuery = useSWR(
    patientId ? "substanceUseHistories" : null,
    () =>
    getQuestionnaireResponses(
        { page: 1, size: 200 },
        `patient=${patientId}&questionnaire=http://localhost:8081/questionnaire/local/Substance-use-history.R4.json`
      )
  );

  const eatingPatternQuery = useSWR(patientId ? "eatingPatterns" : null, () =>
  getQuestionnaireResponses(
      { page: 1, size: 200 },
      `patient=${patientId}&questionnaire=http://localhost:8081/questionnaire/local/Eating-pattern-history.R4.json`
    )
  );

  const drugMisuseQuery = useSWR(patientId ? "drugMisuses" : null, () =>
  getQuestionnaireResponses(
      { page: 1, size: 200 },
      `patient=${patientId}&questionnaire=http://localhost:8081/questionnaire/local/Drug-misuse.R4.json`
    )
  );

  const alcoholHistoryQuery = useSWR(
    patientId ? "alcoholHistories" : null,
    () =>
    getQuestionnaireResponses(
        { page: 1, size: 200 },
        `patient=${patientId}&questionnaire=http://localhost:8081/questionnaire/local/Alcohol-History.R4.json`
      )
  );

  const behavioralHistoryQuery = useSWR(
    patientId ? "behavioralHistories" : null,
    () =>
    getQuestionnaireResponses(
        { page: 1, size: 200 },
        `patient=${patientId}&questionnaire=http://localhost:8081/questionnaire/local/Behavioral-findings.R4.json`
      )
  );

  const administrativeHistoryQuery = useSWR(
    patientId ? "administrativeHistories" : null,
    () =>
    getQuestionnaireResponses(
        { page: 1, size: 200 },
        `patient=${patientId}&questionnaire=http://localhost:8081/questionnaire/local/Administrative-History.R4.json`
      )
  );

  const exerciseHistories: QuestionnaireResponse[] =
    exerciseHistoryQuery?.data?.data?.entry?.map(
      (e) => e.resource as QuestionnaireResponse
    ) ?? [];

  const tobaccoHistories: QuestionnaireResponse[] =
    tobaccoHistoryQuery?.data?.data?.entry?.map(
      (e) => e.resource as QuestionnaireResponse
    ) ?? [];

  const substanceUseHistories: QuestionnaireResponse[] =
    substanceUseQuery?.data?.data?.entry?.map((e) => e.resource as QuestionnaireResponse) ??
    [];

  const eatingPatterns: QuestionnaireResponse[] =
    eatingPatternQuery?.data?.data?.entry?.map(
      (e) => e.resource as QuestionnaireResponse
    ) ?? [];

  const drugMisuses: QuestionnaireResponse[] =
    drugMisuseQuery?.data?.data?.entry?.map((e) => e.resource as QuestionnaireResponse) ??
    [];

  const alcoholHistories: QuestionnaireResponse[] =
    alcoholHistoryQuery?.data?.data?.entry?.map(
      (e) => e.resource as QuestionnaireResponse
    ) ?? [];

  const behavioralHistories: QuestionnaireResponse[] =
    behavioralHistoryQuery?.data?.data?.entry?.map(
      (e) => e.resource as QuestionnaireResponse
    ) ?? [];

  const administrativeHistories: QuestionnaireResponse[] =
    administrativeHistoryQuery?.data?.data?.entry?.map(
      (e) => e.resource as QuestionnaireResponse
    ) ?? [];

  return (
    <div className="bg-slate-50 p-5">
      <p className="text-2xl text-gray-800 font-bold font-mono">
        Social History
      </p>

      <hr className="mt-3" />

      <div className="grid grid-cols-2 gap-3 auto-rows-fr mt-5">
        <MedicalHistoryItem
          title="Exercise"
          items={exerciseHistories.map((e) => {
            const details = [];

            const severity = e?.item?.find(
              (item) => item.linkId === "2094373707873"
            );

            if (severity) {
              details.push({
                label: "Severity",
                value: severity?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const status = e?.item?.find(
              (item) => item.linkId === "5994139999323"
            );
            if (status) {
              details.push({
                label: "Status",
                value: status?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const verificationStatus = e?.item?.find(
              (item) => item.linkId === "877540205676"
            );
            if (verificationStatus) {
              details.push({
                label: "Verification Status",
                value: verificationStatus?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const note = e?.item?.find(
              (item) => item.linkId === "4740848440352"
            );
            if (note) {
              details.push({
                label: "Note",
                value: note?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const exercise = e?.item?.find(
              (item) => item.linkId === "7369230702555"
            );

            return {
              id: e.id,
              title: exercise.answer
                ?.map((answer) => answer?.valueCoding?.display)
                ?.join(", "),
              details: details,
              versionId: e.meta?.versionId,
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
                    <ExerciseForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Exercise history saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        exerciseHistoryQuery.mutate();
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
                    <ExerciseForm
                      updateId={id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Exercise history saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        exerciseHistoryQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
        />

        <MedicalHistoryItem
          title="Tobacco"
          items={tobaccoHistories.map((e) => {
            const details = [];

            const severity = e?.item?.find(
              (item) => item.linkId === "2094373707873"
            );

            if (severity) {
              details.push({
                label: "Severity",
                value: severity?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const status = e?.item?.find(
              (item) => item.linkId === "5994139999323"
            );
            if (status) {
              details.push({
                label: "Status",
                value: status?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const verificationStatus = e?.item?.find(
              (item) => item.linkId === "877540205676"
            );
            if (verificationStatus) {
              details.push({
                label: "Verification Status",
                value: verificationStatus?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const note = e?.item?.find(
              (item) => item.linkId === "4740848440352"
            );
            if (note) {
              details.push({
                label: "Note",
                value: note?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const tobacco = e?.item?.find(
              (item) => item.linkId === "7369230702555"
            );

            return {
              id: e.id,
              title: tobacco.answer
                ?.map((answer) => answer?.valueCoding?.display)
                ?.join(", "),
              details: details,
              versionId: e.meta?.versionId,
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
                    <TobaccoForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Tobacco history saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        tobaccoHistoryQuery.mutate();
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
                    <TobaccoForm
                      updateId={id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Tobacco history saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        tobaccoHistoryQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
        />

        <MedicalHistoryItem
          title="Substance use"
          items={substanceUseHistories.map((e) => {
            const details = [];

            const severity = e?.item?.find(
              (item) => item.linkId === "2094373707873"
            );

            if (severity) {
              details.push({
                label: "Severity",
                value: severity?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const status = e?.item?.find(
              (item) => item.linkId === "5994139999323"
            );
            if (status) {
              details.push({
                label: "Status",
                value: status?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const verificationStatus = e?.item?.find(
              (item) => item.linkId === "877540205676"
            );
            if (verificationStatus) {
              details.push({
                label: "Verification Status",
                value: verificationStatus?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const note = e?.item?.find(
              (item) => item.linkId === "4740848440352"
            );
            if (note) {
              details.push({
                label: "Note",
                value: note?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const substanceUse = e?.item?.find(
              (item) => item.linkId === "7369230702555"
            );

            return {
              id: e.id,
              title: substanceUse.answer
                ?.map((answer) => answer?.valueCoding?.display)
                ?.join(", "),
              details: details,
              versionId: e.meta?.versionId,
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
                    <SubstanceUseForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Substance use saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        substanceUseQuery.mutate();
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
                    <SubstanceUseForm
                      updateId={id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Substance use saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        substanceUseQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
        />

        <MedicalHistoryItem
          title="Eating Patterns"
          items={eatingPatterns.map((e) => {
            const details = [];

            const severity = e?.item?.find(
              (item) => item.linkId === "2094373707873"
            );

            if (severity) {
              details.push({
                label: "Severity",
                value: severity?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const status = e?.item?.find(
              (item) => item.linkId === "5994139999323"
            );
            if (status) {
              details.push({
                label: "Status",
                value: status?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const verificationStatus = e?.item?.find(
              (item) => item.linkId === "877540205676"
            );
            if (verificationStatus) {
              details.push({
                label: "Verification Status",
                value: verificationStatus?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const note = e?.item?.find(
              (item) => item.linkId === "4740848440352"
            );
            if (note) {
              details.push({
                label: "Note",
                value: note?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const eatingPattern = e?.item?.find(
              (item) => item.linkId === "7369230702555"
            );

            return {
              id: e.id,
              title: eatingPattern.answer
                ?.map((answer) => answer?.valueCoding?.display)
                ?.join(", "),
              details: details,
              versionId: e.meta?.versionId,
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
                    <EatingPatternForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Eating pattern saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        eatingPatternQuery.mutate();
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
                    <EatingPatternForm
                      updateId={id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Eating pattern saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        eatingPatternQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
        />

        <MedicalHistoryItem
          title="Drug Misuse"
          items={drugMisuses.map((e) => {
            const details = [];

            const severity = e?.item?.find(
              (item) => item.linkId === "2094373707873"
            );

            if (severity) {
              details.push({
                label: "Severity",
                value: severity?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const status = e?.item?.find(
              (item) => item.linkId === "5994139999323"
            );
            if (status) {
              details.push({
                label: "Status",
                value: status?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const verificationStatus = e?.item?.find(
              (item) => item.linkId === "877540205676"
            );
            if (verificationStatus) {
              details.push({
                label: "Verification Status",
                value: verificationStatus?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const note = e?.item?.find(
              (item) => item.linkId === "4740848440352"
            );
            if (note) {
              details.push({
                label: "Note",
                value: note?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const drugMisuses = e?.item?.find(
              (item) => item.linkId === "7369230702555"
            );

            return {
              id: e.id,
              title: drugMisuses.answer
                ?.map((answer) => answer?.valueCoding?.display)
                ?.join(", "),
              details: details,
              versionId: e.meta?.versionId,
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
                    <DrugMisuseForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Drug misuse saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        drugMisuseQuery.mutate();
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
                    <DrugMisuseForm
                      updateId={id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Drug misuse saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        drugMisuseQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
        />

        <MedicalHistoryItem
          title="Alcohol History"
          items={alcoholHistories.map((e) => {
            const details = [];

            const severity = e?.item?.find(
              (item) => item.linkId === "2094373707873"
            );

            if (severity) {
              details.push({
                label: "Severity",
                value: severity?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const status = e?.item?.find(
              (item) => item.linkId === "5994139999323"
            );
            if (status) {
              details.push({
                label: "Status",
                value: status?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const verificationStatus = e?.item?.find(
              (item) => item.linkId === "877540205676"
            );
            if (verificationStatus) {
              details.push({
                label: "Verification Status",
                value: verificationStatus?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const note = e?.item?.find(
              (item) => item.linkId === "4740848440352"
            );
            if (note) {
              details.push({
                label: "Note",
                value: note?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const alcoholHistory = e?.item?.find(
              (item) => item.linkId === "7369230702555"
            );

            return {
              id: e.id,
              title: alcoholHistory.answer
                ?.map((answer) => answer?.valueCoding?.display)
                ?.join(", "),
              details: details,
              versionId: e.meta?.versionId,
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
                    <AlcoholHistoryForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Alcohol history saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        alcoholHistoryQuery.mutate();
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
                    <AlcoholHistoryForm
                      updateId={id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Alcohol history saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        alcoholHistoryQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
        />

        <MedicalHistoryItem
          title="Other behavioral findings"
          items={behavioralHistories.map((e) => {
            const details = [];

            const severity = e?.item?.find(
              (item) => item.linkId === "2094373707873"
            );

            if (severity) {
              details.push({
                label: "Severity",
                value: severity?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const status = e?.item?.find(
              (item) => item.linkId === "5994139999323"
            );
            if (status) {
              details.push({
                label: "Status",
                value: status?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const verificationStatus = e?.item?.find(
              (item) => item.linkId === "877540205676"
            );
            if (verificationStatus) {
              details.push({
                label: "Verification Status",
                value: verificationStatus?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const note = e?.item?.find(
              (item) => item.linkId === "4740848440352"
            );
            if (note) {
              details.push({
                label: "Note",
                value: note?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const behavioralFindings = e?.item?.find(
              (item) => item.linkId === "7369230702555"
            );

            return {
              id: e.id,
              title: behavioralFindings.answer
                ?.map((answer) => answer?.valueCoding?.display)
                ?.join(", "),
              details: details,
              versionId: e.meta?.versionId,
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
                    <BehavioralFindingForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle:
                            "Behavioral finding saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        behavioralHistoryQuery.mutate();
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
                    <BehavioralFindingForm
                      updateId={id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle:
                            "Behavioral finding saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        behavioralHistoryQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
        />

        <MedicalHistoryItem
          title="Administrative History"
          items={administrativeHistories.map((e) => {
            const details = [];

            const severity = e?.item?.find(
              (item) => item.linkId === "2094373707873"
            );

            if (severity) {
              details.push({
                label: "Severity",
                value: severity?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const status = e?.item?.find(
              (item) => item.linkId === "5994139999323"
            );
            if (status) {
              details.push({
                label: "Status",
                value: status?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const verificationStatus = e?.item?.find(
              (item) => item.linkId === "877540205676"
            );
            if (verificationStatus) {
              details.push({
                label: "Verification Status",
                value: verificationStatus?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const note = e?.item?.find(
              (item) => item.linkId === "4740848440352"
            );
            if (note) {
              details.push({
                label: "Note",
                value: note?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const administrativeFindings = e?.item?.find(
              (item) => item.linkId === "7369230702555"
            );

            return {
              id: e.id,
              title: administrativeFindings.answer
                ?.map((answer) => answer?.valueCoding?.display)
                ?.join(", "),
              details: details,
              versionId: e.meta?.versionId,
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
                    <AdministrativeHistoryForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle:
                            "Administrative history saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        administrativeHistoryQuery.mutate();
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
                    <AdministrativeHistoryForm
                      updateId={id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle:
                            "Administrative history saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        administrativeHistoryQuery.mutate();
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

SocialHistory.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default SocialHistory;
