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

import { ReactElement } from "react";
import { EncounterLayout } from "..";
import { NextPageWithLayout } from "../../../_app";
import AccordionItem from "../../../../components/accordion-item";
import Stickie from "../../../../components/stickie";

const Dashboard: NextPageWithLayout = () => {
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
              <DetailLabel label="Visit Type" />
              <DetailText text="Stick Visit" />
            </div>
            <div>
              <DetailLabel label="Electronic ID" />
              <DetailText text="123" />
            </div>

            <div>
              <DetailLabel label="Age" />
              <DetailText text="28" />
            </div>

            <div>
              <DetailLabel label="Gender" />
              <DetailText text="Male" />
            </div>

            <div>
              <DetailLabel label="Region" />
              <DetailText text="Addis Ababa" />
            </div>

            <div>
              <DetailLabel label="Woreda" />
              <DetailText text="08" />
            </div>

            <div>
              <DetailLabel label="Zone" />
              <DetailText text="Z" />
            </div>

            <div>
              <DetailLabel label="Memo" />
              <DetailText text="" />
            </div>

            <div>
              <DetailLabel label="Provider" />
              <DetailText text="Dr. Zelalem Eshetu" />
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
            Illness
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
