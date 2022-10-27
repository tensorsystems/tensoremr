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

import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNotificationDispatch } from '@tensoremr/notification';
import PocketBaseClient from '../../pocketbase-client';
import OrganizationDetailsForm from '../../feature-get-started/OrganizationDetailsForm';
import { useQuery } from '@tanstack/react-query';
import { ClientResponseError, Record } from 'pocketbase';
import { pocketbaseErrorMessage } from '../../util';
import {
  AddressRecord,
  ContactPointsRecord,
  OrganizationRecord,
} from '@tensoremr/models';

export const OrganizationDetails: React.FC = () => {
  const notifDispatch = useNotificationDispatch();

  // State
  const [organizationDefaultValues, setOrganizationDefaultValues] =
    useState<Record>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Query
  const queryOrganizationDetails = useQuery(['organization'], () =>
    PocketBaseClient.records.getList('organization', 1, 1)
  );

  const codingsQuery = useQuery(['organizationTypes'], () =>
    PocketBaseClient.records.getList('codings', 1, 50, {
      filter: `system='http://terminology.hl7.org/CodeSystem/organization-type'`,
    })
  );

  useEffect(() => {
    const organization = queryOrganizationDetails.data?.items[0];
    if (organization) {
      getDefaultValues(organization);
    }
  }, [queryOrganizationDetails.data]);

  const getDefaultValues = async (organization: any) => {
    try {
      const defaultValues = { ...organization };

      if (organization.telecom) {
        const contactNumber = await PocketBaseClient.records.getOne(
          'contact_points',
          organization.telecom
        );

        defaultValues.telecom = contactNumber;
      }

      if (organization.email) {
        const email = await PocketBaseClient.records.getOne(
          'contact_points',
          organization.email
        );

        defaultValues.email = email;
      }

      if (organization.address) {
        const address = await PocketBaseClient.records.getOne(
          'address',
          organization.address
        );

        defaultValues.address = address;
      }

      setOrganizationDefaultValues(defaultValues);
    } catch (error) {
      setIsLoading(false);

      console.error(error);
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const values: OrganizationRecord = {
        name: data.name,
        type: data.type,
        primary: true,
      };

      if (organizationDefaultValues?.id) {
        await PocketBaseClient.records.update(
          'organization',
          organizationDefaultValues.id,
          values
        );

        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Success',
          notifSubTitle: 'Organization updated successfully',
          variant: 'success',
        });
      }

      if (organizationDefaultValues?.telecom.value) {
        await PocketBaseClient.records.update(
          'contact_points',
          organizationDefaultValues?.telecom.id,
          {
            value: data.contactNumber,
          }
        );
      }

      if (organizationDefaultValues?.email.id) {
        await PocketBaseClient.records.update(
          'contact_points',
          organizationDefaultValues?.email.id,
          {
            value: data.email,
          }
        );
      }

      if (organizationDefaultValues?.address.id) {
        const address: AddressRecord = {
          country: data.country,
          state: data.state,
          district: data.district,
          city: data.city,
          line: data.streetAddress,
          line2: data.streetAddress2,
        };

        await PocketBaseClient.records.update(
          'address',
          organizationDefaultValues.address.id,
          address
        );
      }
    } catch (error) {
      if (error instanceof ClientResponseError) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: pocketbaseErrorMessage(error) ?? '',
          variant: 'failure',
        });
      } else if (error instanceof Error) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      }

      console.error(error);
    }

    setIsLoading(false);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <p className="font-semibold text-lg text-gray-800">
        Organization details
      </p>
      <hr className="my-4" />
      <OrganizationDetailsForm
        isLoading={isLoading}
        defaultValues={organizationDefaultValues}
        organizationTypes={codingsQuery.data?.items}
        onSubmit={onSubmit}
      />
    </div>
  );
};
