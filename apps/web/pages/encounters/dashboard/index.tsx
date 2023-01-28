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
import { ReactElement, useState } from "react";
import MyBreadcrumb, { IBreadcrumb } from "../../../components/breadcrumb";
import { NextPageWithLayout } from "../../_app";
import { EncounterLayout } from "../[id]";

const Dashboard: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const [crumbs] = useState<IBreadcrumb[]>([
    { href: "/", title: "Home", icon: "home" },
    { href: "/encounters", title: "Encounter", icon: "folder" },
  ]);

  return (
    <div className="h-screen">
      <MyBreadcrumb crumbs={crumbs} />
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default Dashboard;
