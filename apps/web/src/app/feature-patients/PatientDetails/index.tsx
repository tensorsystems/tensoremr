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
import { PatientBasicInfo } from './PatientBasicInfo';
import PatientTelecoms from './PatientTelecoms';
import { useHistory, useParams } from 'react-router-dom';
import { PatientDocuments } from './PatientDocuments';
import PatientOrders from '../PatientOrders';
import PocketBaseClient from '../../pocketbase-client';
import { useQuery } from '@tanstack/react-query';
import { Tabs } from 'flowbite-react';
import {
  ClockIcon,
  PaperAirplaneIcon,
  PhoneIcon,
  UserIcon,
  PaperClipIcon,
  MapIcon,
} from '@heroicons/react/solid';
import PatientContacts from './PatientContacts';
import PatientAddress from './PatientAddress';
import PatientAppointments from './PatientAppointments';

export const PatientDetails: React.FC<{
  onAddPage?: (page: any) => void;
  onUpdateTab?: (page: any) => void;
}> = ({ onUpdateTab, onAddPage }) => {
  const history = useHistory();
  const { patientId } = useParams<{ patientId: string }>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Query
  const patientQuery = useQuery(['patient'], () =>
    PocketBaseClient.records.getOne('patients', patientId, {
      expand:
        'telecom,gender,address,contact,contact.relationship,contact.name,contact.telecom,contact.address,martialStatus',
    })
  );

  useEffect(() => {
    if (patientQuery.data && onUpdateTab) {
      const patient = patientQuery.data;

      const page: any = {
        title: `Patient - ${patient.firstName} ${patient.lastName}`,
        route: `/patients/${patient.id}`,
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        ),
      };

      onUpdateTab(page);
    }
  }, [onUpdateTab, patientQuery.data]);

  const handleEditClick = () => {
    history.push(`/new-patient?mrn=${patientQuery.data?.mrn}`);
  };

  return (
    <div>
      <PatientBasicInfo
        data={patientQuery.data}
        loading={isLoading}
        onEditClick={handleEditClick}
      />

      <div className="mt-4">
        <div className="bg-white">
          <Tabs.Group aria-label="Default tabs" style="underline">
            <Tabs.Item active={true} title="Appointments" icon={ClockIcon}>
              <PatientAppointments patientId={patientQuery.data?.id} />
            </Tabs.Item>
            <Tabs.Item title="Orders" icon={PaperAirplaneIcon}>
              {patientQuery.data?.id && (
                <PatientOrders patientId={patientQuery.data.id} />
              )}
            </Tabs.Item>
            <Tabs.Item title="Telecom" icon={PhoneIcon}>
              <PatientTelecoms
                data={patientQuery.data?.['@expand'].telecom}
                loading={patientQuery.isLoading}
              />
            </Tabs.Item>
            <Tabs.Item title="Address" icon={MapIcon}>
              <PatientAddress
                data={patientQuery.data?.['@expand'].address}
                loading={patientQuery.isLoading}
              />
            </Tabs.Item>
            <Tabs.Item title="Contacts" icon={UserIcon}>
              <PatientContacts
                data={patientQuery.data?.['@expand'].contact}
                loading={patientQuery.isLoading}
              />
            </Tabs.Item>

            <Tabs.Item title="Documents" icon={PaperClipIcon}>
              <div className="bg-white p-4">
                <PatientDocuments
                  data={patientQuery.data}
                  loading={isLoading}
                />
              </div>
            </Tabs.Item>
          </Tabs.Group>
        </div>
      </div>
    </div>
  );
};
