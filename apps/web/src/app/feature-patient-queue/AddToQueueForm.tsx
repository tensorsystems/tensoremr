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

import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import {
  Appointment,
  Query,
  QueryFindTodaysCheckedInAppointmentsArgs,
} from '@tensoremr/models';
import cn from 'classnames';
import { FIND_TODAYS_CHECKED_IN_APPOINTMENTS } from '@tensoremr/util';

interface Props {
  onSuccess: (appointment: Appointment) => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

const AddToQueueForm: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [searchTerm] = useState<string>('');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();
  const { data, refetch } = useQuery<
    Query,
    QueryFindTodaysCheckedInAppointmentsArgs
  >(FIND_TODAYS_CHECKED_IN_APPOINTMENTS, {
    variables: {
      page: { page: 0, size: 1000 },
      searchTerm: searchTerm.length > 0 ? searchTerm : undefined,
    },
  });

  useEffect(() => {
    refetch();
  }, [searchTerm]);

  const handleSelectedAppointmnetChange = (values: any) => {
    const appointmentEdge = data?.findTodaysCheckedInAppointments.edges.find(
      (e) => e.node.id === values.value
    );

    if (appointmentEdge) {
      const appointment = appointmentEdge.node;
      setSelectedAppointment(appointment);
    }
  };

  const handleSubmit = () => {
    if (selectedAppointment) {
      onSuccess(selectedAppointment);
    }
  };

  const appointments = data?.findTodaysCheckedInAppointments.edges.map((e) => ({
    value: e?.node.id,
    label: `${e?.node.firstName} ${e?.node.lastName}`,
  }));

  return (
    <div className="container mx-auto flex justify-center pt-4 pb-6">
      <div className="w-1/2">
        <div className="float-right">
          <button onClick={onCancel}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-8 w-8 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div>
          <p className="text-2xl font-extrabold tracking-wider">Add To Queue</p>

          <div className="mt-4">
            <Select
              placeholder="Search Appointments"
              options={appointments}
              onChange={handleSelectedAppointmnetChange}
            />
          </div>
          <div className="mt-10">
            <button
              type="button"
              disabled={selectedAppointment === undefined}
              className={cn('w-full p-2 rounded-lg shadow-lg text-white', {
                'bg-indigo-600 hover:bg-indigo-700':
                  selectedAppointment !== undefined,
                'bg-gray-600': selectedAppointment === undefined,
              })}
              onClick={handleSubmit}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToQueueForm;
