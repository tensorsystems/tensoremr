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
import { getEncounter, getPatient } from "../../../../api";
import { Encounter, Patient } from "fhir/r4";
import { parsePatientMrn } from "../../../../util/fhir";
import { getAgeFromString } from "../../../../util";
import Link from "next/link";
import DashboardHistory from "./dashboard-history";
import DashboardFindings from "./dasbhoard-findings";

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
            {patient?.id && <DashboardHistory patientId={patient.id} />}
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
            <div>
              {encounter?.id && patientId && (
                <DashboardFindings
                  encounterId={encounter.id}
                  patientId={patientId}
                />
              )}
            </div>
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