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

import { ReactElement, useState } from "react";
import { EncounterLayout } from "..";
import { NextPageWithLayout } from "../../../_app";
import AccordionItem from "../../../../components/accordion-item";
import Stickie from "../../../../components/stickie";
import { useRouter } from "next/router";
import { useSession } from "../../../../context/SessionProvider";
import useSWR from "swr";
import {
  getBatch,
  getEncounter,
  getPatient,
  getQuestionnaireResponses,
} from "../../../../api";
import {
  Encounter,
  Patient,
  QuestionnaireResponse,
  QuestionnaireResponseItem,
} from "fhir/r4";
import { parsePatientMrn } from "../../../../util/fhir";
import { getAgeFromString } from "../../../../util";
import Link from "next/link";

const Dashboard: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { session } = useSession();

  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;
  const patientId = encounter?.subject?.reference?.split("/")[1];

  const patientQuery = useSWR(patientId ? `patients/${patientId}` : null, () =>
    getPatient(patientId)
  );
  const patient: Patient | undefined = patientQuery?.data?.data;

  const providers = encounter?.participant
    ?.filter((e) => e.type?.at(0)?.text === "primary performer")
    ?.map((e) => e.individual?.display)
    ?.join(", ");

  const historyQuery = useSWR(encounter ? "medications" : null, () =>
    getBatch({
      resourceType: "Bundle",
      id: "medications",
      type: "batch",
      entry: [
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Past-Disorder.R4.json`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Surgical-History.R4.json`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Mental-State.R4.json`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Immunization-History.R4.json`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Allergy_Intolerance-History.R4.json`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Exercise-History.R4.json`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Tobacco-History.R4.json`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Substance-use-history.R4.json`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Eating-pattern-history.R4.json`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Drug-misuse.R4.json`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Alcohol-History.R4.json`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Behavioral-findings.R4.json`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Administrative-History.R4.json`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Family-history.R4.json`,
          },
        },
        {
          request: {
            method: "GET",
            url: `QuestionnaireResponse?_page=1&_count=200&questionnaire=http://localhost:8081/questionnaire/local/Family-social-history.R4.json`,
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
    <div className="flex space-x-4">
      <div className="flex-1">
        <AccordionItem
          title={
            <div className="flex items-center space-x-3">
              <span className="material-symbols-outlined text-gray-600">
                person_outline
              </span>
              <AccordionTitle>{`Kidus Tiliksew`}</AccordionTitle>
            </div>
          }
          open={true}
        >
          <div className="grid grid-cols-3 gap-2">
            <div>
              <DetailLabel label="MRN" />
              <Link href={`/patients/${patient?.id}`}>
                <DetailText
                  text={patient ? parsePatientMrn(patient) : ""}
                  className="underline text-teal-600 cursor-pointer"
                />
              </Link>
            </div>
            <div>
              <DetailLabel label="Encounter Type" />
              <DetailText text={encounter?.class?.display} />
            </div>
            <div>
              <DetailLabel label="Service" />
              <DetailText
                text={encounter?.type?.map((e) => e.text)?.join(",")}
              />
            </div>

            <div>
              <DetailLabel label="Age" />
              <DetailText
                text={
                  patient?.birthDate ? getAgeFromString(patient?.birthDate) : ""
                }
              />
            </div>

            <div>
              <DetailLabel label="Gender" />
              <DetailText text={patient?.gender} />
            </div>

            <div>
              <DetailLabel label="Country" />
              <DetailText
                text={patient?.address?.map((e) => e.country).join(", ")}
              />
            </div>

            <div>
              <DetailLabel label="State" />
              <DetailText
                text={patient?.address?.map((e) => e.state).join(", ")}
              />
            </div>

            <div>
              <DetailLabel label="Martial Status" />
              <DetailText text={patient?.maritalStatus?.text} />
            </div>

            <div>
              <DetailLabel label="Providers" />
              <DetailText text={providers} />
            </div>
          </div>
        </AccordionItem>

        <div className="mt-4">
          <AccordionItem
            title={
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-gray-600">
                  history
                </span>
                <AccordionTitle>History</AccordionTitle>
              </div>
            }
            open={true}
          >
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
                  <div
                    style={{ height: "1px" }}
                    className="bg-gray-300 flex-1"
                  />
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
                  <div
                    style={{ height: "1px" }}
                    className="bg-gray-300 flex-1"
                  />
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
                  <div
                    style={{ height: "1px" }}
                    className="bg-gray-300 flex-1"
                  />
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
          </AccordionItem>
        </div>
        <div className="mt-4">
          <AccordionItem
            title={
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-gray-600">
                  timeline
                </span>
                <AccordionTitle>Encounter Timeline</AccordionTitle>
              </div>
            }
            open={true}
          >
            Illness
          </AccordionItem>
        </div>
        <div className="mt-4">
          <AccordionItem
            title={
              <div className="flex items-center space-x-3">
                <span className="material-symbols-outlined text-gray-600">
                  find_in_page
                </span>
                <AccordionTitle>Current findings</AccordionTitle>
              </div>
            }
            open={true}
          >
            Illness
          </AccordionItem>
        </div>
      </div>
      <div className="w-44">
        <Stickie stickieNote={null} patientChartId={null} />
        <div className="mt-4">
          <SideInfo title="Problems" />
        </div>
        <div className="mt-4">
          <SideInfo title="Active Medications" />
        </div>
      </div>
    </div>
  );
};

const AccordionTitle: React.FC<{ children: any }> = ({ children }) => {
  return <p className="text-lg text-gray-700">{children}</p>;
};

const DetailLabel: React.FC<{ label: string }> = ({ label }) => {
  return <p className="text-sm text-gray-700">{label}</p>;
};

const DetailText: React.FC<{
  text: string | undefined;
  link?: string;
  className?: string;
}> = ({ text, className }) => {
  const cn = className ? className : "text-teal-600";
  return <p className={cn}>{text}</p>;
};

const SideInfo: React.FC<{
  title: string | undefined;
}> = ({ title }) => {
  return (
    <div className="shadow overflow-hidden rounded-lg text-xs">
      <table className="w-full">
        <thead>
          <tr>
            <th
              scope="col"
              colSpan={1}
              className="px-3 py-2 bg-teal-700 text-left text-gray-50 uppercase tracking-wider"
            >
              {title}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 p-2">
          <tr className="text-gray-800">
            <td className="p-2">Dexatemalol</td>
          </tr>
          <tr className="text-gray-800">
            <td className="p-2">Maxidex</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default Dashboard;
