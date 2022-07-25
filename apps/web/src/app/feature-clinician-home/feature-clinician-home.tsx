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

import React, { useEffect, useState } from 'react';
import { StatCard } from '@tensoremr/ui-components';
import { WorkflowTable } from './WorkflowTable';
import { useHistory } from 'react-router-dom';
import { Page, Appointment, Query } from '@tensoremr/models';
import { gql, useQuery } from '@apollo/client';
import { parseJwt } from '@tensoremr/util';

const HOME_STATS = gql`
  query HomeStats {
    nurseHomeStats {
      scheduled
      checkedIn
      checkedOut
    }
    physicianHomeStats {
      scheduled
      checkedIn
      checkedOut
    }
  }
`;

export const HomeClinician: React.FC<{ onAddPage: (page: Page) => void }> = ({
  onAddPage,
}) => {
  const history = useHistory();
  const homeStats = useQuery<Query>(HOME_STATS);
  const [isPhysician, setIsPhysician] = useState<boolean>(true);

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');

    if (token !== null) {
      const claim = parseJwt(token);

      if (claim.UserType.includes('Physician')) {
        setIsPhysician(true);
      } else {
        setIsPhysician(false);
      }
    }
  }, []);

  const handleAppointmentClick = (appointment: Appointment) => {
    let route = `/appointments/${appointment.id}/patient-dashboard`;

    if (appointment.queueId !== null && appointment.queueId !== undefined) {
      route = route + `?queueId=${appointment.queueId}`;
    }

    const page: Page = {
      title: `Appointment - ${appointment.patient.firstName} ${appointment.patient.lastName}`,
      cancellable: true,
      route: route,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    };

    onAddPage(page);
    history.replace(route);
  };

  const handleStatClick = (status: string) => {
    const token = sessionStorage.getItem('accessToken');
    if (token != null) {
      const claim = parseJwt(token);

      const page: Page = {
        title: `Appointments`,
        cancellable: true,
        route: `/appointments`,
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        ),
      };

      onAddPage(page);
      history.push(`/appointments?status=${status}&userId=${claim.ID}`);
    }
  };

  const scheduled = isPhysician
    ? homeStats.data?.physicianHomeStats.scheduled ?? 0
    : homeStats.data?.nurseHomeStats.scheduled ?? 0;

  const checkedIn = isPhysician
    ? homeStats.data?.physicianHomeStats.checkedIn ?? 0
    : homeStats.data?.nurseHomeStats.checkedIn ?? 0;

  const checkedOut = isPhysician
    ? homeStats.data?.physicianHomeStats.checkedOut ?? 0
    : homeStats.data?.nurseHomeStats.checkedOut ?? 0;

  return (
    <div className="h-full mb-20">
      <div className="md:flex md:space-x-4">
        <StatCard
          title={'Scheduled'}
          figure={scheduled}
          onClick={() => {
            handleStatClick('Scheduled');
          }}
        />
        <StatCard
          title={'Checked in'}
          figure={checkedIn}
          onClick={() => {
            handleStatClick('Scheduled');
          }}
        />
        <StatCard
          title={'Checked out'}
          figure={checkedOut}
          onClick={() => {
            handleStatClick('Scheduled');
          }}
        />
      </div>

      <div className="mt-6">
        <WorkflowTable onAppointmentClick={handleAppointmentClick} />
      </div>
    </div>
  );
};
