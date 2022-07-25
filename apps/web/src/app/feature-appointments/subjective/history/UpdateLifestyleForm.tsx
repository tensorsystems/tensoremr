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

import { gql, useQuery, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Lifestyle,
  LifestyleUpdateInput,
  Maybe,
  MutationUpdateLifestyleArgs,
  Query,
  QueryLifestyleTypesArgs,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';

const UPDATE_LIFESTYLE = gql`
  mutation UpdateLifestyle($input: LifestyleUpdateInput!) {
    updateLifestyle(input: $input) {
      id
    }
  }
`;

const GET_LIFESTYLE_TYPES = gql`
  query LifestyleTypes($page: PaginationInput!) {
    lifestyleTypes(page: $page) {
      totalCount
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        totalPages
      }
    }
  }
`;

interface UpdateLifestyleProps {
  values: Maybe<Lifestyle>;
  onSuccess: () => void;
  onCancel: () => void;
  onSaveChange?: (saving: boolean) => void;
}

export const UpdateLifestyleForm: React.FC<UpdateLifestyleProps> = ({
  values,
  onSuccess,
  onCancel,
  onSaveChange,
}) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit } = useForm<LifestyleUpdateInput>({
    defaultValues: {
      id: values?.id,
      title: values?.title,
      description: values?.description,
      note: values?.note,
    },
  });

  const { data } = useQuery<Query, QueryLifestyleTypesArgs>(
    GET_LIFESTYLE_TYPES,
    {
      variables: { page: { page: 0, size: 20 } },
    }
  );

  const [save, { error }] = useMutation<any, MutationUpdateLifestyleArgs>(
    UPDATE_LIFESTYLE,
    {
      onCompleted(data) {
        onSaveChange && onSaveChange(false);
        onSuccess();
      },
      onError(error) {
        onSaveChange && onSaveChange(false);
        notifDispatch({
          type: 'show',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  const onSubmit = (data: LifestyleUpdateInput) => {
    if (values?.id !== undefined) {
      data.id = values?.id;

      onSaveChange && onSaveChange(true);
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
            Update Lifestyle
          </p>
          <div className="mt-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Lifestyle
            </label>
            <select
              id="title"
              name="title"
              required
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {data?.lifestyleTypes.edges.map((e) => (
                <option key={e?.node.id} value={e?.node.title}>
                  {e?.node.title}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="description"
              name="description"
              required
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={'Current'}>Current</option>
              <option value={'Quit'}>Quit</option>
              <option value={'Never'}>Never</option>
              <option value={'NA'}>N/A</option>
            </select>
          </div>
          <div className="mt-4">
            <label
              htmlFor="note"
              className="block text-sm font-medium text-gray-700"
            >
              Note
            </label>
            <input
              type="text"
              name="note"
              id="note"
              ref={register}
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
