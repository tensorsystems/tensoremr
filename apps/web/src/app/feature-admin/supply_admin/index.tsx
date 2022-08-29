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
import { gql, useMutation, useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { TablePagination } from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import classnames from 'classnames';
import {
  Maybe,
  MutationDeleteSupplyArgs,
  MutationSaveSupplyArgs,
  MutationUpdateSupplyArgs,
  PaginationInput,
  Query,
  QueryBillingsArgs,
  QuerySuppliesArgs,
  Supply,
  SupplyEdge,
  SupplyInput,
  SupplyUpdateInput,
} from '@tensoremr/models';
import { BILLINGS, SUPPLIES } from '@tensoremr/util';

const ROWS_PER_PAGE = 20;

export const SupplyPage: React.FC = () => {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: ROWS_PER_PAGE,
  });

  const { data, refetch } = useQuery<Query, QuerySuppliesArgs>(SUPPLIES, {
    variables: {
      page: paginationInput,
      searchTerm: searchTerm.length === 0 ? undefined : searchTerm,
    },
  });

  useEffect(() => {
    refetch();
  }, [paginationInput, searchTerm]);

  const handleNextClick = () => {
    const totalPages = data?.supplies.pageInfo.totalPages ?? 0;

    if (totalPages > paginationInput.page) {
      setPaginationInput({
        ...paginationInput,
        page: paginationInput.page + 1,
      });
    }
  };

  const handlePreviousClick = () => {
    if (paginationInput.page > 1) {
      setPaginationInput({
        ...paginationInput,
        page: paginationInput.page - 1,
      });
    }
  };

  const handleSearchTermChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setSearchTerm(value);
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  scope="col"
                  colSpan={3}
                  className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                >
                  Supplies
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-700 text-gray-100 text-right"
                >
                  <button
                    onClick={() =>
                      bottomSheetDispatch({
                        type: 'show',
                        snapPoint: 0,
                        children: (
                          <AddSupplyForm
                            onSuccess={() => {
                              bottomSheetDispatch({ type: 'hide' });

                              notifDispatch({
                                type: 'showNotification',
                                notifTitle: 'Success',
                                notifSubTitle:
                                  'Supply has been saved successfully',
                                variant: 'success',
                              });

                              refetch();
                            }}
                            onCancel={() =>
                              bottomSheetDispatch({ type: 'hide' })
                            }
                          />
                        ),
                      })
                    }
                    className="uppercase bg-gray-800 hover:bg-gray-900 py-1 px-2 rounded-md text-sm"
                  >
                    <div className="flex items-center">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="font-semibold">Add</div>
                    </div>
                  </button>
                </th>
              </tr>
              <tr className="bg-gray-100">
                <th colSpan={4}>
                  <input
                    type="text"
                    name="search"
                    placeholder="Search"
                    className="p-3 pl-4 block w-full sm:text-md border-gray-300"
                    onChange={handleSearchTermChange}
                  />
                </th>
              </tr>
              <tr className="bg-gray-100">
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Billings
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Status
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.supplies.edges.map((value: Maybe<SupplyEdge>) => (
                <tr key={value?.node.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {value?.node.title}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {value?.node.billings.map((e, i) => (
                      <span
                        key={e?.id}
                        className={classnames(
                          'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800',
                          {
                            'ml-2': i !== 0,
                          }
                        )}
                      >
                        {e?.item}
                      </span>
                    ))}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span
                      className={classnames(
                        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                        {
                          'bg-yellow-100 text-yellow-800':
                            value?.node.active === false,
                        },
                        {
                          'bg-green-100 text-green-800':
                            value?.node.active === true,
                        }
                      )}
                    >
                      {value?.node.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        bottomSheetDispatch({
                          type: 'show',
                          snapPoint: 500,
                          children: (
                            <UpdateSupplyForm
                              onUpdateSuccess={() => {
                                bottomSheetDispatch({
                                  type: 'hide',
                                });

                                notifDispatch({
                                  type: 'showNotification',
                                  notifTitle: 'Success',
                                  notifSubTitle:
                                    'Supply has been updated successfully',
                                  variant: 'success',
                                });

                                refetch();
                              }}
                              onDeleteSuccess={() => {
                                bottomSheetDispatch({
                                  type: 'hide',
                                });

                                notifDispatch({
                                  type: 'showNotification',
                                  notifTitle: 'Success',
                                  notifSubTitle:
                                    'Supply has been deleted successfully',
                                  variant: 'success',
                                });

                                refetch();
                              }}
                              onCancel={() =>
                                bottomSheetDispatch({
                                  type: 'hide',
                                })
                              }
                              values={value?.node}
                            />
                          ),
                        });
                      }}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <TablePagination
            totalCount={data?.supplies.totalCount ?? 0}
            onNext={handleNextClick}
            onPrevious={handlePreviousClick}
          />
        </div>
      </div>
    </div>
  );
};

const SAVE_SUPPLY = gql`
  mutation SaveSupply($input: SupplyInput!) {
    saveSupply(input: $input) {
      id
    }
  }
`;

interface AddSupplyProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddSupplyForm: React.FC<AddSupplyProps> = ({ onSuccess, onCancel }) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit } = useForm<SupplyInput>({
    defaultValues: {
      active: true,
    },
  });

  const { data } = useQuery<Query, QueryBillingsArgs>(BILLINGS, {
    variables: { page: { page: 0, size: 1000 } },
  });

  const [save, { error }] = useMutation<any, MutationSaveSupplyArgs>(
    SAVE_SUPPLY,
    {
      onCompleted(data) {
        onSuccess();
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

  const onSubmit = (data: SupplyInput) => {
    save({
      variables: {
        input: {
          title: data.title,
          active: data.active,
          billingIds: data.billingIds,
        },
      },
    });
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
          <p className="text-2xl font-extrabold tracking-wider">Add Supply</p>
          <div className="mt-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              required
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="billingIds"
              className="block text-sm font-medium text-gray-700"
            >
              Billings
            </label>
            <select
              id="billingIds"
              name="billingIds"
              required
              multiple
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {data?.billings.edges.map((e: any) => (
                <option key={e?.node.id} value={e?.node.id}>
                  {e?.node.item}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label
              htmlFor="active"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              required
              name="active"
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={'true'}>Active</option>
              <option value={'false'}>Inactive</option>
            </select>
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

const UPDATE_SUPPLY = gql`
  mutation UpdateSupply($input: SupplyUpdateInput!) {
    updateSupply(input: $input) {
      id
    }
  }
`;

const DELETE_SUPPLY = gql`
  mutation DeleteSupply($id: ID!) {
    deleteSupply(id: $id)
  }
`;

interface UpdateSupplyProps {
  values: Supply | undefined;
  onUpdateSuccess: () => void;
  onDeleteSuccess: () => void;
  onCancel: () => void;
}

const UpdateSupplyForm: React.FC<UpdateSupplyProps> = ({
  values,
  onUpdateSuccess,
  onDeleteSuccess,
  onCancel,
}) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue } = useForm<SupplyUpdateInput>();

  const { data } = useQuery<Query, QueryBillingsArgs>(BILLINGS, {
    variables: { page: { page: 0, size: 1000 } },
  });

  useEffect(() => {
    setValue('title', values?.title);
    setValue('active', values?.active);
    setValue(
      'billingIds',
      values?.billings.map((e) => e?.id.toString())
    );
  }, [values, data]);

  const [save, { error }] = useMutation<any, MutationUpdateSupplyArgs>(
    UPDATE_SUPPLY,
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

  const [deleteSupply] = useMutation<any, MutationDeleteSupplyArgs>(
    DELETE_SUPPLY,
    {
      onCompleted(data) {
        onDeleteSuccess();
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

  const onUpdateSubmit = (data: SupplyUpdateInput) => {
    const id: string = values?.id.toString() ?? '';
    save({
      variables: {
        input: {
          id: id,
          title: data.title,
          active: data.active,
          billingIds: data.billingIds,
        },
      },
    });
  };

  const onDeleteSubmit = (data: SupplyUpdateInput) => {
    const id: string = values?.id.toString() ?? '';
    deleteSupply({ variables: { id: id } });
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
            Update Supply
          </p>
          <div className="mt-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              required
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="billingIds"
              className="block text-sm font-medium text-gray-700"
            >
              Billings
            </label>
            <select
              id="billingIds"
              name="billingIds"
              required
              multiple
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {data?.billings.edges.map((e: any) => (
                <option key={e?.node.id} value={e?.node.id}>
                  {e?.node.item}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-4">
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              required
              name="status"
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={'true'}>Active</option>
              <option value={'false'}>Inactive</option>
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
