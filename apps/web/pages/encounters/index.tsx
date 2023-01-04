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

import { useState } from "react";
import MyBreadcrumb, { IBreadcrumb } from "../../components/breadcrumb";
import Button from "../../components/button";

export default function Encounters() {
  const [crumbs] = useState<IBreadcrumb[]>([
    { href: "/", title: "Home", icon: "home" },
    { href: "/encounters", title: "Encounters", icon: "supervisor_account" },
  ]);

  return (
    <div className="h-full">
      <MyBreadcrumb crumbs={crumbs} />
      <div className="flex bg-white w-full h-16 p-4 mt-4 rounded-sm shadow-md justify-between items-center">
        <div className="flex items-center space-x-4">
          <select
            name="userId"
            className=" border-l-2 border-gray-200 rounded-md text-sm"
          >
            <option>Outpatient</option>
            <option>Emergency</option>
            <option>Field</option>
            <option>Home Health</option>
            <option>Inpatient</option>
            <option>Observation</option>
            <option>Pre-Admission</option>
            <option>Shory Stay</option>
            <option>Virtual</option>
          </select>
          <select
            name="userId"
            className=" border-l-2 border-gray-200 rounded-md text-sm"
          >
            <option>Planned</option>
            <option>Arrived</option>
            <option>Triaged</option>
            <option>In-Progress</option>
            <option>Onleave</option>
            <option>Finished</option>
            <option>Cancelled</option>
            <option>Entered-In-Error</option>
            <option>Unknown</option>
          </select>
          <input
              type="date"
              id="date"
              name="date"

              className="border-l-2 border-gray-200 rounded-md text-sm"
            
            />
        </div>
        <div>
          <Button
            type="submit"
            text="New Encounter"
            icon="add"
            variant="filled"
            onClick={() => null}
          />
        </div>
      </div>
    </div>
  );
}
