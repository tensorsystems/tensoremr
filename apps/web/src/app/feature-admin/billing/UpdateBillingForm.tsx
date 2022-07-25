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
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Billing,
  BillingInput,
  MutationUpdateBillingArgs,
  MutationDeleteBillingArgs,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';

const UPDATE_BILLING = gql`
  mutation UpdateBilling($input: BillingInput!, $id: ID!) {
    updateBilling(input: $input, id: $id) {
      id
    }
  }
`;

const DELETE_BILLING = gql`
  mutation DeleteBilling($id: ID!) {
    deleteBilling(id: $id)
  }
`;

interface UpdateBillingProps {
  values: Billing | undefined;
  onUpdateSuccess: () => void;
  onDeleteSuccess: () => void;
  onCancel: () => void;
}

export const UpdateBillingForm: React.FC<UpdateBillingProps> = ({
  values,
  onUpdateSuccess,
  onDeleteSuccess,
  onCancel,
}) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit } = useForm<BillingInput>({
    defaultValues: values,
  });

  const [save, { error }] = useMutation<any, MutationUpdateBillingArgs>(
    UPDATE_BILLING,
    {
      onCompleted(data) {
        onUpdateSuccess();
      },
      onError(error) {
        notifDispatch({
          type: 'show',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  const [deleteBilling] = useMutation<any, MutationDeleteBillingArgs>(
    DELETE_BILLING,
    {
      onCompleted(data) {
        onDeleteSuccess();
      },
      onError(error) {
        notifDispatch({
          type: 'show',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  const onUpdateSubmit = (data: BillingInput) => {
    const id: string = values?.id.toString() ?? '';
    save({
      variables: {
        id: id,
        input: {
          item: data.item,
          code: data.code,
          price: data.price,
          remark: data.remark,
          credit: data.credit === true,
        },
      },
    });
  };

  const onDeleteSubmit = (data: BillingInput) => {
    const id: string = values?.id.toString() ?? '';
    deleteBilling({ variables: { id: id } });
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
        <form>
          <p className="text-2xl font-extrabold tracking-wider">
            Update billing
          </p>
          <div className="mt-4">
            <label
              htmlFor="item"
              className="block text-sm font-medium text-gray-700"
            >
              Item
            </label>
            <input
              type="text"
              name="item"
              id="item"
              required
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="code"
              className="block text-sm font-medium text-gray-700"
            >
              Code
            </label>
            <input
              type="text"
              name="code"
              id="code"
              required
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="number"
              name="price"
              id="price"
              required
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="remark"
              className="block text-sm font-medium text-gray-700"
            >
              Remark
            </label>
            <input
              type="text"
              name="remark"
              id="remark"
              ref={register}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="credit"
              className="block text-sm font-medium text-gray-700"
            >
              Credit
            </label>
            <select
              id="credit"
              name="credit"
              required
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={'false'}>No</option>
              <option value={'true'}>Yes</option>
            </select>
          </div>
          <div className="mt-4">
            {error && <p className="text-red-600">Error: {error.message}</p>}
          </div>
          <div className="flex space-x-5">
            <button
              type="button"
              onClick={handleSubmit(onUpdateSubmit)}
              className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 focus:outline-none"
            >
              <span className="ml-2">Update</span>
            </button>

            <button
              type="submit"
              onClick={handleSubmit(onDeleteSubmit)}
              className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 focus:outline-none"
            >
              <span className="ml-2">Delete</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
