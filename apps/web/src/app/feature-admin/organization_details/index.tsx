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

import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IFileUploader, FileUploader, Spinner } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import {
  MutationSaveOrganizationDetailsArgs,
  OrganizationDetailsInput,
  Query,
} from '@tensoremr/models';
import { getFileUrl } from '@tensoremr/util';

const GET_ORGANIZATION_DETAILS = gql`
  query GetOrganizationDetails {
    organizationDetails {
      id
      name
      phoneNo
      phoneNo2
      address
      address2
      website
      email
      lanIpAddress
      logoId
      defaultMedicalDepartment
      logo {
        id
        size
        hash
        fileName
        extension
        contentType
        createdAt
      }
    }
  }
`;

const SAVE_ORGANIZATION_DETAILS = gql`
  mutation SaveOrgainzationDetails($input: OrganizationDetailsInput!) {
    saveOrganizationDetails(input: $input) {
      id
    }
  }
`;

export const OrganizationDetails: React.FC = () => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue } =
    useForm<OrganizationDetailsInput>();

  const { data, refetch } = useQuery<Query, any>(GET_ORGANIZATION_DETAILS);

  const [logos, setLogos] = useState<Array<IFileUploader>>();

  const [save, { loading }] = useMutation<
    any,
    MutationSaveOrganizationDetailsArgs
  >(SAVE_ORGANIZATION_DETAILS, {
    onCompleted(data) {
      refetch();

      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Success',
        notifSubTitle: `Organization details saved`,
        variant: 'success',
      });
    },
    onError(error) {
      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  useEffect(() => {
    const organizationDetails = data?.organizationDetails;

    if (organizationDetails) {
      setValue('name', organizationDetails.name);
      setValue('phoneNo', organizationDetails.phoneNo);
      setValue('phoneNo2', organizationDetails.phoneNo2);
      setValue('address', organizationDetails.address);
      setValue('address2', organizationDetails.address2);
      setValue('website', organizationDetails.website);
      setValue('email', organizationDetails.email);
      setValue(
        'defaultMedicalDepartment',
        organizationDetails.defaultMedicalDepartment
      );

      if (organizationDetails?.logo) {
        const od = {
          id: organizationDetails?.logo.id,
          fileUrl: getFileUrl({
            baseUrl: import.meta.env.APP_SERVER_URL,
            fileName: organizationDetails?.logo.fileName,
            hash: organizationDetails?.logo.hash,
            extension: organizationDetails?.logo.extension,
          }),
          name: organizationDetails?.logo.fileName ?? '',
          size: organizationDetails?.logo.size,
          createdAt: organizationDetails?.logo.createdAt,
          contentType: organizationDetails?.logo.contentType ?? '',
        };

        setLogos([od]);
      }
    }
  }, [data?.organizationDetails]);

  const onSubmit = (data: OrganizationDetailsInput) => {
    if (logos && logos.length > 0 && logos[0].fileObject) {
      const file = {
        file: logos[0].fileObject,
        name: logos[0].name,
      };

      data.logo = file;
    }

    save({
      variables: {
        input: data,
      },
    });
  };

  const handleLogoChange = (change: Array<IFileUploader>) => {
    setLogos(change);
  };

  return (
    <div className="bg-white shadow-md rounded-md p-4">
      <p className="font-semibold text-lg text-gray-800">
        Organization details
      </p>
      <hr className="my-4" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              ref={register}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md capitalize"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNo"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="text"
              name="phoneNo"
              id="phoneNo"
              ref={register}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="phoneNo"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number 2
            </label>
            <input
              type="text"
              name="phoneNo2"
              id="phoneNo2"
              ref={register}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              type="text"
              name="address"
              id="address"
              ref={register}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="address2"
              className="block text-sm font-medium text-gray-700"
            >
              Address 2
            </label>
            <input
              type="text"
              name="address2"
              id="address2"
              ref={register}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md capitalize"
            />
          </div>

          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700"
            >
              Website
            </label>
            <input
              type="text"
              name="website"
              id="website"
              ref={register}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="text"
              name="email"
              id="email"
              ref={register}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="defaultMedicalDepartment"
              className="block text-sm font-medium text-gray-700"
            >
              Default Medical Department
            </label>
            <select
              required
              id="defaultMedicalDepartment"
              name="defaultMedicalDepartment"
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="General Medicine">General Medicine</option>
              <option value="Ophthalmology">Ophthalmology</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Logo
            </label>
            <FileUploader
              multiSelect={false}
              accept={'image'}
              values={logos}
              onAdd={handleLogoChange}
              onDelete={() => setLogos([])}
              onError={(message) => {
                notifDispatch({
                  type: 'showNotification',
                  notifTitle: 'Error',
                  notifSubTitle: message,
                  variant: 'failure',
                });
              }}
            />
          </div>

          <div className="py-3 bg-gray-50 w-full col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading && <Spinner />}
              <span className="ml-2">Save</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
