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

import { Page } from "@tensoremr/models";
import { ReactElement } from "react";
import NavItem from "../../components/nav-item";
import { NextPageWithLayout } from "../_app";

const Page: NextPageWithLayout = () => {
  return <div>This is index</div>;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export function AdminLayout({ children }) {
  const handlePageSelect = (route: string) => {
    console.log("Route", route);
  };

  const handlePageAdd = (page: Page) => {
    console.log("PAge", page);
  };

  return (
    <div className="flex space-x-3">
      <div className="flex-initial">
        <div className="bg-white rounded-lg py-2 px-4 shadow-lg">
          <NavItem
            route="/admin/organization-details"
            label="Organization Details"
            icon="business"
            subItem={false}
          />

          <NavItem
            route="/admin/users"
            label="Users"
            icon="people"
            subItem={false}
          />

          <NavItem
            route="/admin/schedules"
            label="Schedules"
            icon="schedule"
            subItem={false}
          />

          <NavItem
            route="/admin/modalities"
            label="Modality"
            icon="point_of_sale"
            subItem={false}
          />

          <NavItem
            route="/admin/lookups"
            label="Lookups"
            icon="list_alt"
            subItem={false}
          />

          <NavItem
            route="/admin/payment-waiver"
            label="Payment waivers"
            icon="money_off"
            subItem={false}
            notifs={0}
          />

          <NavItem
            route="/admin/patient-encounter-limit"
            label="Patient Encounter Limit"
            icon="money"
            subItem={false}
          />

          <NavItem
            route="/admin/billings"
            label="Billings"
            icon="credit_card"
            subItem={false}
          />

          <NavItem
            route="/admin/hpi"
            label="HPI"
            icon="format_list_numbered"
            subItem={false}
          />
          <NavItem
            route="/admin/diagnostic-procedures"
            label="Diagnostic Procedures"
            icon="airline_seat_recline_normal"
            subItem={false}
          />
          <NavItem
            route="/admin/surgical-procedures"
            label="Surgical Procedures"
            icon="airline_seat_flat"
            subItem={false}
          />
          <NavItem
            route="/admin/treatment-types"
            label="Treatments"
            icon="healing"
            subItem={false}
          />
          <NavItem
            route="/admin/labratory-types"
            label="Labratory"
            icon="biotech"
            subItem={false}
          />
          <NavItem
            route="/admin/supplies"
            label="Supplies"
            icon="inventory"
            subItem={false}
          />

          <NavItem
            route="/admin/pharmacies"
            label="Pharmacies"
            icon="local_pharmacy"
            subItem={false}
          />
          <NavItem
            route="/admin/eyewear-shops"
            label="Eyewear Shops"
            icon="visibility"
            subItem={false}
          />
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export default Page;
