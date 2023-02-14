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
import { Condition, Encounter, EncounterDiagnosis } from "fhir/r4";
import { getCondition, getEncounter, getExtensions } from "../../../../api";
import { ReactElement, useEffect, useState } from "react";
import { EncounterLayout } from "..";
import MedicalHistoryItem from "../../../../components/medical-history-item";
import ChiefComplaintForm from "./chief-complaint-form";
import { format, parseISO } from "date-fns";

const ChiefComplaints: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;
  const patientId = encounter?.subject?.reference?.split("/")[1];

  const [diagnosis, setDiagnosis] = useState<
    { condition: Condition; details: any[] }[]
  >([]);

  useEffect(() => {
    if (encounter?.diagnosis?.length > 0) {
      fetchDiagnosisDetails(
        encounter.diagnosis.filter((e) => e.use?.text === "Chief complaint")
      );
    }
  }, [encounter?.diagnosis]);

  const fetchDiagnosisDetails = async (items: EncounterDiagnosis[]) => {
    try {
      const extensions = (await getExtensions()).data;

      const diagnosisDetails: { condition: Condition; details: any[] }[] = [];

      for (const e of items) {
        const condition = (
          await getCondition(e.condition.reference.split("/")[1])
        ).data;

        const details = [];

        const location = e.extension?.find(
          (ext) => ext.url === extensions.EXT_HPI_LOCATION
        );
        if (location) {
          details.push({
            label: "Location",
            value: location.valueString,
          });
        }

        const severity = e.extension?.find(
          (ext) => ext.url === extensions.EXT_HPI_SEVERITY
        );
        if (severity) {
          details.push({
            label: "Severity",
            value: severity.valueString,
          });
        }

        const duration = e.extension?.find(
          (ext) => ext.url === extensions.EXT_HPI_DURATION
        );
        if (duration) {
          details.push({
            label: "Duration",
            value: duration.valueString,
          });
        }

        const timing = e.extension?.find(
          (ext) => ext.url === extensions.EXT_HPI_TIMING
        );
        if (timing) {
          details.push({
            label: "Timing",
            value: timing.valueString,
          });
        }

        const context = e.extension?.find(
          (ext) => ext.url === extensions.EXT_HPI_CONTEXT
        );
        if (context) {
          details.push({
            label: "Context",
            value: context.valueString,
          });
        }

        const modifyingFactors = e.extension?.find(
          (ext) => ext.url === extensions.EXT_HPI_MODIFYING_FACTORS
        );
        if (modifyingFactors) {
          details.push({
            label: "Modifying Factors",
            value: modifyingFactors.valueString,
          });
        }

        const signsSymptoms = e.extension?.find(
          (ext) => ext.url === extensions.EXT_HPI_SIGNS_SYMPTOMS
        );
        if (signsSymptoms) {
          details.push({
            label: "Signs & Symptoms",
            value: signsSymptoms.valueString,
          });
        }

        diagnosisDetails.push({ condition: condition, details: details });
      }

      setDiagnosis(diagnosisDetails);
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
  };

  return (
    <div className="bg-slate-50 p-5">
      <p className="text-2xl text-gray-800 font-bold font-mono">
        Chief Complaints
      </p>

      <hr className="mt-3" />

      <div className=" mt-5">
        <MedicalHistoryItem
          title="Chief complaints"
          items={diagnosis.map((e, i) => ({
            id: e.condition.id,
            title: e.condition?.code?.text,
            details: e.details,
            createdAt: format(parseISO(e.condition.recordedDate), "MMM d, y"),
          }))}
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
