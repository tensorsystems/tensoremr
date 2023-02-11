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
import MyBreadcrumb, { IBreadcrumb } from "../../../components/breadcrumb";
import NavItem from "../../../components/nav-item";
import { NextPageWithLayout } from "../../_app";

const Page: NextPageWithLayout = () => {
  return <div>This is index</div>;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export function EncounterLayout({ children }) {
  const [crumbs] = useState<IBreadcrumb[]>([
    { href: "/", title: "Home", icon: "home" },
    { href: "/encounters", title: "Encounter", icon: "folder" },
  ]);

  return (
    <div>
      <MyBreadcrumb crumbs={crumbs} />
      <div className="flex space-x-3 h-full mb-10">
        <div className="flex-initial">
          <div className="bg-white rounded-lg py-2 px-4 shadow-lg">
            <NavItem
              route="/encounter/dashboard"
              label="Patient Dashboard"
              icon="dashboard"
              subItem={false}
            />

            <hr className="my-1 col-span-2 border-slate-300" />

            <div className="flex">
              <div>
                <SoapText>S</SoapText>
              </div>

              <div>
                <NavItem
                  route="/encounter/history"
                  label="Past Medical History"
                  icon="history"
                  subItem={true}
                  status={"locked"}
                />

                <NavItem
                  route="/encounter/medications"
                  label="Medications"
                  icon="local_pharmacy"
                  subItem={true}
                  status={"locked"}
                />

                <NavItem
                  route="/encounter/social-history"
                  label="Social History"
                  icon="groups"
                  subItem={true}
                  status={"locked"}
                />

                <NavItem
                  route="/encounter/family-history"
                  label="Family History"
                  icon="family_restroom"
                  subItem={true}
                  status={"locked"}
                />

                <NavItem
                  route="/encounter/chief-complaints"
                  label="Chief Complaints"
                  icon="format_list_bulleted"
                  subItem={true}
                  status={"locked"}
                />

                <NavItem
                  route="/encounter/review-of-systems"
                  label="Review of Systems"
                  icon="accessibility"
                  subItem={true}
                  status={"locked"}
                />
              </div>
            </div>

            <div className="flex">
              <div>
                <SoapText>O</SoapText>
              </div>
              <div>
                <NavItem
                  route="/encounter/vital-signs"
                  label="Vital Signs"
                  icon="show_chart"
                  subItem={true}
                  status={"locked"}
                />

                <NavItem
                  route="/encounter/examination"
                  label="Physical Examination"
                  icon="find_in_page"
                  subItem={true}
                  status={"locked"}
                />

                <NavItem
                  route="/encounter/diagnostics"
                  label="Diagnostic Procedure"
                  icon="airline_seat_recline_normal"
                  subItem={true}
                  status={"locked"}
                />

                <NavItem
                  route="/encounter/labratory"
                  label="Labratory"
                  icon="biotech"
                  subItem={true}
                  status={"locked"}
                />
              </div>
            </div>

            <div className="flex">
              <div>
                <SoapText>A</SoapText>
              </div>
              <div>
                <NavItem
                  route="/encounter/diagnosis"
                  label="Diagnosis"
                  icon="fact_check"
                  subItem={true}
                  status={"locked"}
                />

                <NavItem
                  route="/encounter/differential-diagnosis"
                  label="Differential Diagnosis"
                  icon="live_help"
                  subItem={true}
                  status={"locked"}
                />
              </div>
            </div>

            <div className="flex">
              <div>
                <SoapText>P</SoapText>
              </div>
              <div>
                <NavItem
                  route="/encounter/rx"
                  label="eRx"
                  icon="local_pharmacy"
                  subItem={true}
                  status={"locked"}
                />

                <NavItem
                  route="/encounter/follow-up"
                  label="Follow-Ups"
                  icon="next_plan"
                  subItem={true}
                  status={"locked"}
                />

                <NavItem
                  route="/encounter/referral"
                  label="Referral"
                  icon="send"
                  subItem={true}
                  status={"locked"}
                />
              </div>
            </div>

            <hr className="my-1 col-span-2 border-slate-300" />

            <NavItem
              route="/encounter/medical-certificate"
              label="Medical Certificate"
              icon="receipt_long"
              subItem={true}
              status={"locked"}
            />

            <NavItem
              route="/encounter/summary"
              label="Summary"
              icon="card_membership"
              subItem={true}
              status={"locked"}
            />
          </div>
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

function SoapText({ children }: { children: any }) {
  return (
    <div className="flex pt-1 space-x-1">
      <p className="font-bold">{children} </p>
      <p className="material-icons md-double_arrow text-teal-600"></p>
    </div>
  );
}

export default Page;