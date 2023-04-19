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

import { QuestionnaireResponseItem } from "fhir/r4";
import { getBatch } from "../../../../api";
import useSWR from "swr";

interface Props {
  encounterId: string;
  patientId: string;
}

export default function DashboardFindings({ encounterId, patientId }: Props) {
  const findingsQuery = useSWR(encounterId ? "dashboard-findings" : null, () =>
    getBatch({
      resourceType: "Bundle",
      id: "dashboard-history",
      type: "batch",
      entry: [
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Chief-complaint.R4.json&encounter=${encounterId}`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://loinc.org/71406-3&patient=${patientId}`,
          },
        },
      ],
    })
  );

  const chiefComplaints: QuestionnaireResponseItem[] =
    findingsQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(0)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem) ?? [];

  const reviewOfSystems: QuestionnaireResponseItem =
    findingsQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(1)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem)
      ?.at(0);

  return (
    <div className="ml-1 font-light">
      <div>
        <div className="flex space-x-6 items-center">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-teal-600">
              format_list_bulleted
            </span>
            <p className="tracking-wider text-gray-800 font-light">
              Chief Complaints
            </p>
          </div>
          <div style={{ height: "1px" }} className="bg-gray-300 flex-1" />
        </div>

        <div>
          {chiefComplaints?.map((e) => {
            const chiefComplaint = e?.item
              ?.find((item) => item.linkId === "9253877226859")
              ?.answer?.at(0)?.valueCoding?.display;

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

            return (
              <div key={e?.id} className="border-indigo-600 mt-3">
                <p>{chiefComplaint}</p>
                <ul className="list-inside list-disc pl-3">
                  {details?.map((d, i) => (
                    <li key={i}>
                      <span className="text-gray-500">{d?.label}: </span>
                      <span>{d?.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mt-5 flex space-x-6 items-center">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-teal-600">
              groups
            </span>
            <p className="tracking-wider text-gray-800 font-light">
              Review of Systems
            </p>
          </div>
          <div style={{ height: "1px" }} className="bg-gray-300 flex-1" />
        </div>

        <div>
          <ul>
            {reviewOfSystems?.item?.map((e) => {
              const details: string[] = [];

              const codes = e?.answer?.map((v) => v.valueCoding?.display);
              if (codes) {
                details.push(...codes);
              }

              const freeTexts = e?.answer?.map((v) => v.valueString);
              if (freeTexts) {
                details.push(...freeTexts);
              }

              return (
                <li key={e?.linkId}>
                  <span className="text-gray-500">{e?.text}: </span>
                  <span>
                    {details?.filter((v) => v !== undefined).join(", ")}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

  

 
     
    </div>
  );
}
