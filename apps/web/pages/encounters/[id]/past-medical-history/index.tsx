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
import { NextPageWithLayout } from "../../../_app";
import { EncounterLayout } from "..";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import {
  getEncounter,
  getQuestionnaireResponses,
} from "../../../../api";
import {
  Encounter,
  QuestionnaireResponse,
} from "fhir/r4";
import SurgicalHistoryForm from "./surgical-history-form";
import MedicalHistoryItem from "../../../../components/medical-history-item";
import DisorderForm from "./disorder-form";
import useSWR from "swr";
import MentalStateForm from "./mental-state-form";
import ImmunizationForm from "./immunization-form";
import AllergyIntoleranceForm from "./allergy-intolerance-form";

const PastMedicalHistory: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;
  const patientId = encounter?.subject?.reference?.split("/")[1];

  const disordersQuery = useSWR(patientId ? "disorders" : null, () =>
    getQuestionnaireResponses(
      { page: 1, size: 200 },
      `patient=${patientId}&questionnaire=http://localhost:8081/questionnaire/local/Past-Disorder.R4.json`
    )
  );

  const surgicalProceduresQuery = useSWR(
    patientId ? "surgicalProcedures" : null,
    () =>
      getQuestionnaireResponses(
        { page: 1, size: 200 },
        `patient=${patientId}&questionnaire=http://localhost:8081/questionnaire/local/Surgical-History.R4.json`
      )
  );

  const mentalStatesQuery = useSWR(patientId ? "mentalState" : null, () =>
    getQuestionnaireResponses(
      { page: 1, size: 200 },
      `patient=${patientId}&questionnaire=http://localhost:8081/questionnaire/local/Mental-State.R4.json`
    )
  );

  const immunizationQuery = useSWR(patientId ? "immunization" : null, () =>
    getQuestionnaireResponses(
      { page: 1, size: 200 },
      `patient=${patientId}&questionnaire=http://localhost:8081/questionnaire/local/Immunization-History.R4.json`
    )
  );

  const allergyIntoleranceQuery = useSWR(
    patientId ? "allergyIntolerance" : null,
    () =>
      getQuestionnaireResponses(
        { page: 1, size: 200 },
        `patient=${patientId}&questionnaire=http://localhost:8081/questionnaire/local/Allergy_Intolerance-History.R4.json`
      )
  );

  const disorders: QuestionnaireResponse[] =
    disordersQuery?.data?.data?.entry?.map(
      (e) => e.resource as QuestionnaireResponse
    ) ?? [];

  const surgicalProcedures: QuestionnaireResponse[] =
    surgicalProceduresQuery?.data?.data?.entry?.map(
      (e) => e.resource as QuestionnaireResponse
    ) ?? [];
  const mentalStates: QuestionnaireResponse[] =
    mentalStatesQuery?.data?.data?.entry?.map(
      (e) => e.resource as QuestionnaireResponse
    ) ?? [];

  const immunizations: QuestionnaireResponse[] =
    immunizationQuery?.data?.data?.entry?.map(
      (e) => e.resource as QuestionnaireResponse
    );

  const allergyIntolerances: QuestionnaireResponse[] =
    allergyIntoleranceQuery?.data?.data?.entry?.map(
      (e) => e.resource as QuestionnaireResponse
    );

  return (
    <div className="bg-slate-50 p-5">
      <p className="text-2xl text-gray-800 font-bold font-mono">
        Medical History
      </p>

      <hr className="mt-3" />

      <div className="grid grid-cols-2 gap-3 auto-rows-fr mt-5">
        <MedicalHistoryItem
          title="Past Disorders"
          items={disorders.map((e) => {
            const details = [];

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

            const verification = e?.item?.find(
              (item) => item.linkId === "877540205676"
            );
            if (verification) {
              details.push({
                label: "Verification",
                value: verification?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const bodySite = e?.item?.find(
              (item) => item.linkId === "4235783381591"
            );
            if (bodySite) {
              details.push({
                label: "Body Site",
                value: bodySite?.answer
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

            const condition = e?.item?.find(
              (item) => item.linkId === "7369230702555"
            );

            return {
              id: e.id,
              title: condition.answer
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
                    <DisorderForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Condition saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        disordersQuery.mutate();
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
                    <DisorderForm
                      updateId={id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Condition saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        disordersQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
        />

        <MedicalHistoryItem
          title="Surgical History"
          items={surgicalProcedures.map((e) => {
            const details = [];

            const status = e?.item?.find(
              (item) => item.linkId === "2094373707873"
            );

            if (status) {
              details.push({
                label: "Status",
                value: status?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const reason = e?.item?.find(
              (item) => item.linkId === "5994139999323"
            );
            if (reason) {
              details.push({
                label: "Reason",
                value: reason?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const performedOn = e?.item?.find(
              (item) => item.linkId === "877540205676"
            );
            if (performedOn) {
              details.push({
                label: "Performed On",
                value: performedOn?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const bodySite = e?.item?.find(
              (item) => item.linkId === "4235783381591"
            );
            if (bodySite) {
              details.push({
                label: "Body Site",
                value: bodySite?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const outcome = e?.item?.find(
              (item) => item.linkId === "5066125365989"
            );
            if (outcome) {
              details.push({
                label: "Outcome",
                value: outcome?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const complication = e?.item?.find(
              (item) => item.linkId === "2363675249271"
            );
            if (complication) {
              details.push({
                label: "Complication",
                value: complication?.answer
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

            const procedure = e?.item?.find(
              (item) => item.linkId === "7369230702555"
            );

            return {
              id: e.id,
              title: procedure.answer
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
                    <SurgicalHistoryForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Surgical history saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        surgicalProceduresQuery.mutate();
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
                    <SurgicalHistoryForm
                      updateId={id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Surgical history saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        surgicalProceduresQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
        />

        <MedicalHistoryItem
          title="Mental States"
          items={mentalStates.map((e) => {
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

            const mentalState = e?.item?.find(
              (item) => item.linkId === "7369230702555"
            );

            return {
              id: e.id,
              title: mentalState.answer
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
                    <MentalStateForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Mental State saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        mentalStatesQuery.mutate();
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
                    <MentalStateForm
                      updateId={id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Mental state saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        mentalStatesQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
        />

        <MedicalHistoryItem
          title="Immunization"
          items={immunizations?.map((e, i) => {
            const details = [];

            const status = e?.item?.find(
              (item) => item.linkId === "742766117678"
            );

            if (status) {
              details.push({
                label: "Status",
                value: status?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const occurrence = e?.item?.find(
              (item) => item.linkId === "3851066911705"
            );
            if (occurrence) {
              details.push({
                label: "Occurrence",
                value: occurrence?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const origin = e?.item?.find(
              (item) => item.linkId === "7952841940569"
            );
            if (origin) {
              details.push({
                label: "Origin",
                value: origin?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const bodySite = e?.item?.find(
              (item) => item.linkId === "3982801480270"
            );
            if (bodySite) {
              details.push({
                label: "Body Site",
                value: bodySite?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const route = e?.item?.find(
              (item) => item.linkId === "8954535617335"
            );
            if (route) {
              details.push({
                label: "Route",
                value: route?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const dose = e?.item?.find(
              (item) => item.linkId === "1028143165672"
            );
            if (dose) {
              details.push({
                label: "Dose",
                value: dose?.answer
                  ?.map((answer) => answer?.valueInteger)
                  ?.join(", "),
              });
            }

            const reason = e?.item?.find(
              (item) => item.linkId === "9624238555934"
            );
            if (reason) {
              details.push({
                label: "Reason",
                value: reason?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const isSubpotent = e?.item?.find(
              (item) => item.linkId === "3310932418292"
            );
            if (isSubpotent) {
              details.push({
                label: "Is Subpotent",
                value: isSubpotent?.answer
                  ?.map((answer) => answer?.valueBoolean)
                  ?.join(", "),
              });
            }

            const subpotentReason = e?.item?.find(
              (item) => item.linkId === "1079540643412"
            );
            if (subpotentReason) {
              details.push({
                label: "Subpotent Reason",
                value: subpotentReason?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const fundingSource = e?.item?.find(
              (item) => item.linkId === "2050374944906"
            );
            if (fundingSource) {
              details.push({
                label: "Funding source",
                value: fundingSource?.answer
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

            const vaccine = e?.item?.find(
              (item) => item.linkId === "6369436053719"
            );

            return {
              id: e.id,
              title: vaccine?.answer
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
                    <ImmunizationForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Immunization saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        immunizationQuery.mutate();
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
                    <ImmunizationForm
                      updateId={id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Immunization saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        immunizationQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
        />

        <MedicalHistoryItem
          title="Allergy/Intolerance"
          items={allergyIntolerances?.map((e, i) => {
            const details = [];

            const type = e?.item?.find(
              (item) => item.linkId === "6369436053719"
            );

            if (type) {
              details.push({
                label: "Type",
                value: type?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const status = e?.item?.find(
              (item) => item.linkId === "3851066911705"
            );
            if (status) {
              details.push({
                label: "Status",
                value: status?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const verification = e?.item?.find(
              (item) => item.linkId === "7952841940569"
            );
            if (verification) {
              details.push({
                label: "Verification",
                value: verification?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const category = e?.item?.find(
              (item) => item.linkId === "3982801480270"
            );
            if (category) {
              details.push({
                label: "Category",
                value: category?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const criticality = e?.item?.find(
              (item) => item.linkId === "8954535617335"
            );
            if (criticality) {
              details.push({
                label: "Criticality",
                value: criticality?.answer
                  ?.map((answer) => answer?.valueCoding?.display)
                  ?.join(", "),
              });
            }

            const note = e?.item?.find(
              (item) => item.linkId === "4155700406320"
            );
            if (note) {
              details.push({
                label: "Note",
                value: note?.answer
                  ?.map((answer) => answer?.valueString)
                  ?.join(", "),
              });
            }

            const allergy = e?.item?.find(
              (item) => item.linkId === "742766117678"
            );

            return {
              id: e.id,
              title: allergy?.answer
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
                    <AllergyIntoleranceForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle:
                            "Allergy/Intolerance saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        allergyIntoleranceQuery.mutate();
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
                    <AllergyIntoleranceForm
                      updateId={id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle:
                            "Allergy/Intolerance saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        allergyIntoleranceQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
        />

        <MedicalHistoryItem
          title="Other"
          items={[]}
          locked={false}
          loading={false}
        />
      </div>
    </div>
  );
};

PastMedicalHistory.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default PastMedicalHistory;
