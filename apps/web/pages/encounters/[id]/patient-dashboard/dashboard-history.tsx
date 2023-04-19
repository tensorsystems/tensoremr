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
  patientId: string;
}

export default function DashboardHistory({ patientId }: Props) {
  const historyQuery = useSWR(patientId ? "dashboard-history" : null, () =>
    getBatch({
      resourceType: "Bundle",
      id: "dashboard-history",
      type: "batch",
      entry: [
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Past-Disorder.R4.json&subject=${patientId}`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Surgical-History.R4.json&subject=${patientId}`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Mental-State.R4.json&subject=${patientId}`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Immunization-History.R4.json&subject=${patientId}`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Allergy_Intolerance-History.R4.json&subject=${patientId}`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Exercise-History.R4.json&subject=${patientId}`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Tobacco-History.R4.json&subject=${patientId}`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Substance-use-history.R4.json&subject=${patientId}`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Eating-pattern-history.R4.json&subject=${patientId}`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Drug-misuse.R4.json&subject=${patientId}`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Alcohol-History.R4.json&subject=${patientId}`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Behavioral-findings.R4.json&subject=${patientId}`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Administrative-History.R4.json&subject=${patientId}`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Family-history.R4.json&subject=${patientId}`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Family-social-history.R4.json&subject=${patientId}`,
          },
        },
      ],
    })
  );

  const pastDisorders: QuestionnaireResponseItem[] =
    historyQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(0)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem)
      ?.map((e) => e?.item?.find((i) => i.linkId === "7369230702555")) ?? [];

  const surgicalHistory: QuestionnaireResponseItem[] =
    historyQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(1)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem)
      ?.map((e) => e?.item?.find((i) => i.linkId === "7369230702555")) ?? [];

  const mentalStates: QuestionnaireResponseItem[] =
    historyQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(2)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem)
      ?.map((e) => e?.item?.find((i) => i.linkId === "7369230702555")) ?? [];

  const immunizations: QuestionnaireResponseItem[] =
    historyQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(3)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem)
      ?.map((e) => e?.item?.find((i) => i.linkId === "6369436053719")) ?? [];

  const allergyIntolerances: QuestionnaireResponseItem[] =
    historyQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(4)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem)
      ?.map((e) => e?.item?.find((i) => i.linkId === "742766117678")) ?? [];

  const exerciseHistories: QuestionnaireResponseItem[] =
    historyQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(5)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem)
      ?.map((e) => e?.item?.find((i) => i.linkId === "7369230702555")) ?? [];

  const tobaccoHistories: QuestionnaireResponseItem[] =
    historyQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(6)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem)
      ?.map((e) => e?.item?.find((i) => i.linkId === "7369230702555")) ?? [];

  const substanceUseHistories: QuestionnaireResponseItem[] =
    historyQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(7)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem)
      ?.map((e) => e?.item?.find((i) => i.linkId === "7369230702555")) ?? [];

  const eatingPatterns: QuestionnaireResponseItem[] =
    historyQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(8)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem)
      ?.map((e) => e?.item?.find((i) => i.linkId === "7369230702555")) ?? [];

  const drugMisuses: QuestionnaireResponseItem[] =
    historyQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(9)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem)
      ?.map((e) => e?.item?.find((i) => i.linkId === "7369230702555")) ?? [];

  const alcoholHistories: QuestionnaireResponseItem[] =
    historyQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(10)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem)
      ?.map((e) => e?.item?.find((i) => i.linkId === "7369230702555")) ?? [];

  const behavioralHistories: QuestionnaireResponseItem[] =
    historyQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(11)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem)
      ?.map((e) => e?.item?.find((i) => i.linkId === "7369230702555")) ?? [];

  const administrativeHistories: QuestionnaireResponseItem[] =
    historyQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(12)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem)
      ?.map((e) => e?.item?.find((i) => i.linkId === "7369230702555")) ?? [];

  const familyHistory: QuestionnaireResponseItem[] =
    historyQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(13)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem)
      ?.map((e) => e?.item?.find((i) => i.linkId === "7369230702555")) ?? [];

  const familySocialHistory: QuestionnaireResponseItem[] =
    historyQuery?.data?.data?.entry
      ?.map((e) => e.resource)
      ?.at(14)
      ?.entry?.map((e) => e.resource as QuestionnaireResponseItem)
      ?.map((e) => e?.item?.find((i) => i.linkId === "7369230702555")) ?? [];

  return (
    <div>
      <div>
        <div className="flex space-x-6 items-center">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-teal-600">
              history
            </span>
            <p className="tracking-wider text-gray-800 font-light">
              Past Medical History
            </p>
          </div>
          <div style={{ height: "1px" }} className="bg-gray-300 flex-1" />
        </div>

        <div className="ml-1 font-light">
          <div className="border-indigo-600 mt-3">
            <p>Past Disorders</p>
            <ul className="list-inside list-disc pl-3">
              {pastDisorders?.map((e, i) => (
                <li key={i}>
                  {e?.answer?.map((a) => `${a.valueCoding?.display} (s)`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-indigo-600 mt-2">
            <p>Surgical History</p>
            <ul className="list-inside list-disc pl-3">
              {surgicalHistory?.map((e, i) => (
                <li key={i}>
                  {e?.answer?.map((a) => `${a.valueCoding?.display} (s)`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-indigo-600 mt-2">
            <p>Mental State</p>
            <ul className="list-inside list-disc pl-3">
              {mentalStates?.map((e, i) => (
                <li key={i}>
                  {e?.answer?.map((a) => `${a.valueCoding?.display} (s)`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-indigo-600 mt-2">
            <p>Immunization</p>
            <ul className="list-inside list-disc pl-3">
              {immunizations?.map((e, i) => (
                <li key={i}>
                  {e?.answer?.map((a) => `${a.valueCoding?.display} (s)`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-indigo-600 mt-2">
            <p>Allergy/Intolerance</p>
            <ul className="list-inside list-disc pl-3">
              {allergyIntolerances?.map((e, i) => (
                <li key={i}>
                  {e?.answer?.map((a) => `${a.valueCoding?.display} (s)`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div>
        <div className="mt-5 flex space-x-6 items-center">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-teal-600">
              groups
            </span>
            <p className="tracking-wider text-gray-800 font-light">
              Social History
            </p>
          </div>
          <div style={{ height: "1px" }} className="bg-gray-300 flex-1" />
        </div>
        <div className="ml-1 font-light">
          <div className="border-indigo-600 mt-2">
            <p>Exercise History</p>
            <ul className="list-inside list-disc pl-3">
              {exerciseHistories?.map((e, i) => (
                <li key={i}>
                  {e?.answer?.map((a) => `${a.valueCoding?.display} (s)`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-indigo-600 mt-2">
            <p>Tobacco History</p>
            <ul className="list-inside list-disc pl-3">
              {tobaccoHistories?.map((e, i) => (
                <li key={i}>
                  {e?.answer?.map((a) => `${a.valueCoding?.display} (s)`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-indigo-600 mt-2">
            <p>Substance Use</p>
            <ul className="list-inside list-disc pl-3">
              {substanceUseHistories?.map((e, i) => (
                <li key={i}>
                  {e?.answer?.map((a) => `${a.valueCoding?.display} (s)`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-indigo-600 mt-2">
            <p>Eating Pattern</p>
            <ul className="list-inside list-disc pl-3">
              {eatingPatterns?.map((e, i) => (
                <li key={i}>
                  {e?.answer?.map((a) => `${a.valueCoding?.display} (s)`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-indigo-600 mt-2">
            <p>Drug Misuse</p>
            <ul className="list-inside list-disc pl-3">
              {drugMisuses?.map((e, i) => (
                <li key={i}>
                  {e?.answer?.map((a) => `${a.valueCoding?.display} (s)`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-indigo-600 mt-2">
            <p>Alcohol History</p>
            <ul className="list-inside list-disc pl-3">
              {alcoholHistories?.map((e, i) => (
                <li key={i}>
                  {e?.answer?.map((a) => `${a.valueCoding?.display} (s)`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-indigo-600 mt-2">
            <p>Behavioral Findings</p>
            <ul className="list-inside list-disc pl-3">
              {behavioralHistories?.map((e, i) => (
                <li key={i}>
                  {e?.answer?.map((a) => `${a.valueCoding?.display} (s)`)}
                </li>
              ))}
            </ul>
          </div>
          <div className="border-indigo-600 mt-2">
            <p>Administrative History</p>
            <ul className="list-inside list-disc pl-3">
              {administrativeHistories?.map((e, i) => (
                <li key={i}>
                  {e?.answer?.map((a) => `${a.valueCoding?.display} (s)`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div>
        <div className="mt-5 flex space-x-6 items-center">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-teal-600">
              family_restroom
            </span>
            <p className="tracking-wider text-gray-800 font-light">
              Family History
            </p>
          </div>
          <div style={{ height: "1px" }} className="bg-gray-300 flex-1" />
        </div>

        <div className="ml-1 font-light">
          <div className="border-indigo-600 mt-2">
            <p>Family History</p>
            <ul className="list-inside list-disc pl-3">
              {familyHistory?.map((e, i) => (
                <li key={i}>
                  {e?.answer?.map((a) => `${a.valueCoding?.display} (s)`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-indigo-600 mt-2">
            <p>Family Social History</p>
            <ul className="list-inside list-disc pl-3">
              {familySocialHistory?.map((e, i) => (
                <li key={i}>
                  {e?.answer?.map((a) => `${a.valueCoding?.display} (s)`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
