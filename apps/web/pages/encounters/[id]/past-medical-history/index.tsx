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
import { format, parseISO } from "date-fns";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import { getConditions, getEncounter, getProcedures } from "../../../../api";
import { Condition, Encounter, Procedure } from "fhir/r4";
import SurgicalHistoryForm from "./surgical-history-form";
import MedicalHistoryItem from "../../../../components/medical-history-item";
import DisorderForm from "./disorder-form";
import useSWR from "swr";
import MentalStateForm from "./mental-state-form";

const PastMedicalHistory: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const disordersQuery = useSWR("disorders", () =>
    getConditions(
      { page: 1, size: 200 },
      `encounter=${id}&category=problem-list-item&type=disorder-history`
    )
  );

  const surgicalProceduresQuery = useSWR("surgicalProcedures", () =>
    getProcedures(
      { page: 1, size: 200 },
      `encounter=${id}&type=surgical-history`
    )
  );

  const mentalStatesQuery = useSWR("mentalState", () =>
    getConditions(
      { page: 1, size: 200 },
      `encounter=${id}&category=problem-list-item&type=mental-state-history`
    )
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;

  const disorders: Condition[] =
    disordersQuery?.data?.data?.entry?.map((e) => e.resource as Condition) ??
    [];
  const surgicalProcedures: Procedure[] =
    surgicalProceduresQuery?.data?.data?.entry?.map(
      (e) => e.resource as Procedure
    ) ?? [];
  const mentalStates: Condition[] =
    mentalStatesQuery?.data?.data?.entry?.map((e) => e.resource as Condition) ??
    [];

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

            if (e.note) {
              details.push({
                label: "Note",
                value: e.note?.map((n) => n.text).join(", "),
              });
            }

            if (e.severity) {
              details.push({
                label: "Severity",
                value: e.severity?.text,
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

            if (e.bodySite) {
              details.push({
                label: "Body Site",
                value: e.bodySite?.map((b) => b.text).join(", "),
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

            if (e.status) {
              details.push({
                label: "Status",
                value: e.status,
              });
            }

            if (e.reasonCode?.length > 0) {
              details.push({
                label: "Reason",
                value: e.reasonCode?.map((e) => e.text).join(", "),
              });
            }

            if (e.performedString) {
              details.push({
                label: "Performed On",
                value: e.performedString,
              });
            }

            if (e.bodySite) {
              details.push({
                label: "Body Site",
                value: e.bodySite?.map((b) => b.text).join(", "),
              });
            }

            if (e.outcome) {
              details.push({
                label: "Outcome",
                value: e.outcome?.text,
              });
            }

            if (e.complication) {
              details.push({
                label: "Complication",
                value: e.complication.map((e) => e.text).join(", "),
              });
            }

            if (e.note) {
              details.push({
                label: "Note",
                value: e.note?.map((n) => n.text).join(", "),
              });
            }

            return {
              id: e.id,
              title: e.code?.text,
              details: details,
              createdAt: e.performedString,
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

            if (e.note) {
              details.push({
                label: "Note",
                value: e.note?.map((n) => n.text).join(", "),
              });
            }

            if (e.severity) {
              details.push({
                label: "Severity",
                value: e.severity?.text,
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

            if (e.bodySite) {
              details.push({
                label: "Body Site",
                value: e.bodySite?.map((b) => b.text).join(", "),
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
          items={[]}
          locked={false}
          loading={false}
        />

        <MedicalHistoryItem
          title="Allergy"
          items={[]}
          locked={false}
          loading={false}
        />

        <MedicalHistoryItem
          title="Intolerance"
          items={[]}
          locked={false}
          loading={false}
        />

        <MedicalHistoryItem
          title="Hospitalizations"
          items={[]}
          locked={false}
          loading={false}
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
