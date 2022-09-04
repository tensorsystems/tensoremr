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

import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  PastIllnessInput,
  MutationSavePastIllnessArgs,
  Query,
  QueryHistoryOfDisordersArgs,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';
import AsyncSelect, { Async } from 'react-select/async';
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/outline';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import classNames from 'classnames';

const GET_PAST_ILLNESS_TYPES = gql`
  query PastIllnessTypes($page: PaginationInput!) {
    pastIllnessTypes(page: $page) {
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

const GET_DISORDERS = gql`
  query GetDisorders($size: Int!, $searchTerm: String!) {
    historyOfDisorders(size: $size, searchTerm: $searchTerm) {
      term
      sctid
    }
  }
`;

const SAVE_PAST_ILLNESS = gql`
  mutation SavePastIllness($input: PastIllnessInput!) {
    savePastIllness(input: $input) {
      id
    }
  }
`;

export const SavePastIllnessForm: React.FC<{
  patientHistoryId: string | undefined;
  onSuccess: () => void;
  onCancel: () => void;
  onSaveChange?: (saving: boolean) => void;
}> = ({ patientHistoryId, onSuccess, onCancel, onSaveChange }) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit } = useForm<PastIllnessInput>();

  const [save, { error }] = useMutation<any, MutationSavePastIllnessArgs>(
    SAVE_PAST_ILLNESS,
    {
      onCompleted(data) {
        onSaveChange && onSaveChange(false);
        onSuccess();
      },
      onError(error) {
        onSaveChange && onSaveChange(false);
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  const disordersQuery = useLazyQuery<Query, QueryHistoryOfDisordersArgs>(
    GET_DISORDERS
  );

  const loadDisorderOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    if (inputValue.length > 0) {
      disordersQuery[0]({
        variables: {
          size: 100,
          searchTerm: inputValue,
        },
      }).then((resp) => {
        const values = resp.data?.historyOfDisorders.map((e) => ({
          value: e?.sctid,
          label: e?.term,
        }));

        if (values) {
          callback(values);
        }
      });
    }
  };

  const onSubmit = (data: PastIllnessInput) => {
    if (patientHistoryId !== undefined) {
      data.patientHistoryId = patientHistoryId;

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
          <p className="text-2xl font-extrabold tracking-wide">
            Add Past Disorder
          </p>

          <div className="mt-4">
            <div className="flex items-center">
              <div className="">
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="inline-flex w-full justify-center rounded-md rounded-r-none border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 ">
                      <div
                        className={classNames(
                          'text-sm flex space-x-3 text-yellow-600'
                        )}
                      >
                        <PlusCircleIcon className="w-5 h-5 " />
                        <p className="">Positive</p>
                      </div>
                      <ChevronDownIcon
                        className="-mr-1 ml-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                ' px-4 py-2 text-sm flex space-x-3 text-yellow-600'
                              )}
                            >
                              <PlusCircleIcon className="w-5 h-5 " />
                              <p>Positive</p>
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <div
                              className={classNames(
                                active
                                  ? 'bg-gray-100 text-gray-900'
                                  : 'text-gray-700',
                                ' px-4 py-2 text-sm flex space-x-3 text-green-600'
                              )}
                            >
                              <MinusCircleIcon className="w-5 h-5 " />
                              <p>Negative</p>
                            </div>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              <div className="flex-1">
                <AsyncSelect
                  placeholder="History of "
                  cacheOptions={true}
                  defaultOptions
                  loadOptions={loadDisorderOptions}
                  onChange={(selected) => {
                    console.log('Values', selected);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              ref={register}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            {error && <p className="text-red-600">Error: {error.message}</p>}
          </div>
          <button
            type="submit"
            className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none"
          >
            <span className="ml-2">Save</span>
          </button>
        </form>
      </div>
    </div>
  );
};
