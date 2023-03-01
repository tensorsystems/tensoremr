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
import { NextPageWithLayout } from "../../../_app";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import useSWR from "swr";
import { getConditions, getEncounter } from "../../../../api";
import { Condition, Encounter } from "fhir/r4";
import { ReactElement } from "react";
import { EncounterLayout } from "..";
import FamilyHistoryForm from "./family-history-form";
import MedicalHistoryItem from "../../../../components/medical-history-item";
import { format, parseISO } from "date-fns";
import FamilySocialHistoryForm from "./family-social-history-form";

const FamilyHistory: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;
  const patientId = encounter?.subject?.reference?.split("/")[1];

  const familyHistoryQuery = useSWR(patientId ? "familyHistories" : null, () =>
    getConditions(
      { page: 1, size: 200 },
      `patient=${patientId}&category=family-history`
    )
  );

  const familySocialHistoryQuery = useSWR(
    patientId ? "familySocialHistories" : null,
    () =>
      getConditions(
        { page: 1, size: 200 },
        `patient=${patientId}&category=family-social-history`
      )
  );

  const familyHistories: Condition[] =
    familyHistoryQuery?.data?.data?.entry?.map(
      (e) => e.resource as Condition
    ) ?? [];

  const familySocialHistories: Condition[] =
    familySocialHistoryQuery?.data?.data?.entry?.map(
      (e) => e.resource as Condition
    ) ?? [];

  return (
    <div className="bg-slate-50 p-5 h-full">
      <p className="text-2xl text-gray-800 font-bold font-mono">
        Family History
      </p>

      <hr className="mt-3" />

      <div className="grid grid-cols-2 gap-3 auto-rows-fr mt-5">
        <MedicalHistoryItem
          title="Family History"
          items={familyHistories.map((e) => {
            const details = [];

            if (e.note) {
              details.push({
                label: "Note",
                value: e.note?.map((n) => n.text).join(", "),
              });
            }

            if (e.clinicalStatus) {
              details.push({
                label: "Status",
                value: e.clinicalStatus?.text,
              });
            }

            if (e.verificationStatus) {
              details.push({
                label: "Verification",
                value: e.verificationStatus?.text,
              });
            }

            return {
              id: e.id,
              title: e.code?.text,
              details: details,
              versionId: e.meta?.versionId,
              createdAt: format(parseISO(e.recordedDate), "MMM d, y"),
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
                    <FamilyHistoryForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Family history saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        familyHistoryQuery.mutate();
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
                    <FamilyHistoryForm
                      updateId={id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Family history saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        familyHistoryQuery.mutate();
                      }}
                    />
                  </div>
                ),
              });
            }
          }}
        />

        <MedicalHistoryItem
          title="Family Social History"
          items={familySocialHistories.map((e) => {
            const details = [];

            if (e.note) {
              details.push({
                label: "Note",
                value: e.note?.map((n) => n.text).join(", "),
              });
            }

            if (e.clinicalStatus) {
              details.push({
                label: "Status",
                value: e.clinicalStatus?.text,
              });
            }

            if (e.verificationStatus) {
              details.push({
                label: "Verification",
                value: e.verificationStatus?.text,
              });
            }

            return {
              id: e.id,
              title: e.code?.text,
              details: details,
              versionId: e.meta?.versionId,
              createdAt: format(parseISO(e.recordedDate), "MMM d, y"),
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
                    <FamilySocialHistoryForm
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Family social history saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        familySocialHistoryQuery.mutate();
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
                    <FamilySocialHistoryForm
                      updateId={id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Family social history saved successfully",
                          variant: "success",
                        });
                        bottomSheetDispatch({ type: "hide" });
                        familySocialHistoryQuery.mutate();
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

FamilyHistory.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default FamilyHistory;