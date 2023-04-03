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

const FollowUp: NextPageWithLayout = () => {
  return (
    <div className="flex items-center justify-center h-full bg-white rounded-md shadow-md">
      <div className="flex items-center space-x-2 text-yellow-600 animate-pulse"> 
        <span className="material-symbols-outlined">construction</span>
        <span>Work in progress</span>
      </div>
    </div>
  );
};

FollowUp.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default FollowUp;
