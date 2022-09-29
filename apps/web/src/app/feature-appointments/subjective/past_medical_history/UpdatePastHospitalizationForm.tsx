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
import { format, parseISO } from 'date-fns';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  PastHospitalization,
  PastHospitalizationUpdateInput,
  MutationUpdatePastHospitalizationArgs,
  Maybe,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';
import { formatDate } from '@tensoremr/util';

const UPDATE_PAST_HOSPITALIZATION = gql`
  mutation UpdatePastHospitalization($input: PastHospitalizationUpdateInput!) {
    updatePastHospitalization(input: $input) {
      id
    }
  }
`;

interface UpdatePastHospitalizationProps {
  values: Maybe<PastHospitalization>;
  onSuccess: () => void;
  onCancel: () => void;
  onSaveChange: (saving: boolean) => void;
}

export const UpdatePastHospitalizationForm: React.FC<
  UpdatePastHospitalizationProps
> = ({ values, onSuccess, onCancel, onSaveChange }) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit } = useForm<PastHospitalizationUpdateInput>({
    defaultValues: {
      id: values?.id,
      reason: values?.reason,
      provider: values?.provider,
      from: format(parseISO(values?.from), 'yyyy-MM-dd'),
      to: format(parseISO(values?.to), 'yyyy-MM-dd'),
    },
  });

  const [save, { error }] = useMutation<
    any,
    MutationUpdatePastHospitalizationArgs
  >(UPDATE_PAST_HOSPITALIZATION, {
    onCompleted(data) {
      onSaveChange(false);
      onSuccess();
    },
    onError(error) {
      onSaveChange(false);
      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  const onSubmit = (data: PastHospitalizationUpdateInput) => {
    if (values?.id !== undefined) {
      data.id = values?.id;
      data.to = formatDate(data.to);
      data.from = formatDate(data.from);

      onSaveChange(true);
      save({ variables: { input: data } });
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
            Update Past Hospitalization
          </p>
          <div className="mt-4">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700"
            >
              Reason
            </label>
            <input
              type="text"
              name="reason"
              id="reason"
              required
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="provider"
              className="block text-sm font-medium text-gray-700"
            >
              Provider
            </label>
            <input
              type="text"
              name="provider"
              id="provider"
              required
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="from"
              className="block text-sm font-medium text-gray-700"
            >
              From date
            </label>
            <input
              type="date"
              name="from"
              id="from"
              required
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="to"
              className="block text-sm font-medium text-gray-700"
            >
              To date
            </label>
            <input
              type="date"
              name="to"
              id="to"
              required
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            {error && <p className="text-red-600">Error: {error.message}</p>}
          </div>
          <button
            type="submit"
            className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 focus:outline-none"
          >
            <span className="ml-2">Save</span>
          </button>
        </form>
      </div>
    </div>
  );
};
