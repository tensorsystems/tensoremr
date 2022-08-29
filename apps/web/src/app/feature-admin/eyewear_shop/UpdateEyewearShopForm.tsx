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

import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import {
  EyewearShop,
  EyewearShopUpdateInput,
  MutationUpdateEyewearShopArgs,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';

const UPDATE_EYEWEAR_SHOP = gql`
  mutation UpdateEyewearShop($input: EyewearShopUpdateInput!) {
    updateEyewearShop(input: $input) {
      id
    }
  }
`;

interface Props {
  values: EyewearShop | undefined;
  onUpdateSuccess: () => void;
  onCancel: () => void;
}

export const UpdateEyewearShopForm = ({
  values,
  onUpdateSuccess,
  onCancel,
}: Props) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit } = useForm<EyewearShopUpdateInput>({
    defaultValues: values,
  });

  const [update, { error }] = useMutation<any, MutationUpdateEyewearShopArgs>(
    UPDATE_EYEWEAR_SHOP,
    {
      onCompleted(data) {
        onUpdateSuccess();
      },
      onError(error) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  const onSubmit = (data: any) => {
    if (values?.id) {
      update({
        variables: {
          input: {
            id: values?.id,
            title: data.title,
            address: data.address,
            region: data.region,
            country: data.country,
            phone: data.phone,
            inHouse: data.inHouse === 'true',
            active: data.active === 'true',
          },
        },
      });
    }
  };

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
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="text-2xl font-extrabold tracking-wider">
            Update eyewear shop details
          </p>
          <div className="mt-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              required
              type="text"
              name="title"
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Address
            </label>
            <input
              required
              type="text"
              name="address"
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-700"
            >
              Region
            </label>
            <input
              required
              type="text"
              name="region"
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <input
              required
              type="text"
              name="country"
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <input
              required
              type="text"
              name="phone"
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="inHouse"
              className="block text-sm font-medium text-gray-700"
            >
              In-House
            </label>
            <select
              required
              name="inHouse"
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={'true'}>Yes</option>
              <option value={'false'}>No</option>
            </select>
          </div>
          <div className="mt-4">
            <label
              htmlFor="active"
              className="block text-sm font-medium text-gray-700"
            >
              Active
            </label>
            <select
              required
              name="active"
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={'true'}>Yes</option>
              <option value={'false'}>No</option>
            </select>
          </div>
          <div className="mt-4">
            {error && <p className="text-red-600">Error: {error.message}</p>}
          </div>
          <button
            type="submit"
            className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 focus:outline-none"
          >
            <span className="ml-2">Update</span>
          </button>
        </form>
      </div>
    </div>
  );
};
