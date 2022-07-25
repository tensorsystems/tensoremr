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

import React from 'react';
import { AppointmentStatusTable } from './AppointmentStatusAdminTable';
import { ChiefComplaintTypesTable } from './ChiefComplaintTypesAdminTable';
import { DiagnosisTable } from './DiagnosisAdminTable';
import { ExamCategoryAdminTable } from './ExamCategoryAdminTable';
import { ExamFindingAdminTable } from './ExamFindingAdminTable';
import { LifestyleTypesTable } from './LifestyleTypeAdminTable';
import { PastIllnessTypesTable } from './PastIllnessTypeAdminTable';
import { RoomsTable } from './RoomsAdminTable';
import { SystemAdminTable } from './SystemAdminTable';
import { SystemSymptomAdminTable } from './SystemSymptomAdminTable';
import { UserTypesTable } from './UserTypeAdminTable';
import { VisitTypesTable } from './VisitTypesAdminTable';

export const LookupsAdminPage: React.FC = () => {
  return (
    <div className="flex-grow h-full">
      <div className="grid grid-cols-2 gap-4">
        <div className="w-full">
          <RoomsTable />
        </div>
        <div>
          <VisitTypesTable />
        </div>
        <div>
          <ChiefComplaintTypesTable />
        </div>
        <div>
          <DiagnosisTable />
        </div>
        <div>
          <AppointmentStatusTable />
        </div>
        <div>
          <UserTypesTable />
        </div>
        <div>
          <PastIllnessTypesTable />
        </div>
        <div>
          <LifestyleTypesTable />
        </div>
        <div>
          <SystemAdminTable />
        </div>
        <div>
          <SystemSymptomAdminTable />
        </div>
        <div>
          <ExamCategoryAdminTable />
        </div>
        <div>
          <ExamFindingAdminTable />
        </div>
      </div>
    </div>
  );
};
