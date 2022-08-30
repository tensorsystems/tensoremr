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
import { useQuery } from '@apollo/client';
import { TablePagination } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import {
  PaginationInput,
  QueryBillingsArgs,
  Maybe,
  BillingEdge,
  Query,
} from '@tensoremr/models';
import { UpdateBillingForm } from './UpdateBillingForm';
import { AddBillingForm } from './AddBillingForm';
import { BILLINGS } from '@tensoremr/util';

const ROWS_PER_PAGE = 20;

export const BillingsAdmin: React.FC = () => {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: ROWS_PER_PAGE,
  });

  const { data, refetch } = useQuery<Query, QueryBillingsArgs>(BILLINGS, {
    variables: {
      page: paginationInput,
      searchTerm: searchTerm.length === 0 ? undefined : searchTerm,
    },
  });

  useEffect(() => {
    refetch();
  }, [paginationInput, searchTerm]);

  const handleNextClick = () => {
    const totalPages = data?.billings.pageInfo.totalPages ?? 0;

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
                  colSpan={5}
                  className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                >
                  Billings
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
                          <AddBillingForm
                            onSuccess={() => {
                              bottomSheetDispatch({ type: 'hide' });

                              notifDispatch({
                                type: 'showNotification',
                                notifTitle: 'Success',
                                notifSubTitle:
                                  'Billing has been saved successfully',
                                variant: 'success',
                              });

                              refetch();
                            }}
                            onError={(message) => {
                              notifDispatch({
                                type: 'showNotification',
                                notifTitle: 'Error',
                                notifSubTitle: message,
                                variant: 'failure',
                              });
                            }}
                            onCancel={() =>
                              bottomSheetDispatch({ type: 'hide' })
                            }
                          />
                        ),
                      })
                    }
                    className="uppercase bg-gray-800 hover:bg-gray-600 py-1 px-2 rounded-md text-sm"
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
              <tr>
                <th colSpan={6}>
                  <input
                    type="text"
                    name="search"
                    id="billings-search"
                    placeholder="Search"
                    className="p-3 pl-4 block w-full sm:text-md border-gray-300"
                    onChange={handleSearchTermChange}
                  />
                </th>
              </tr>
              <tr className="bg-gray-50">
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Item
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Code
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Credit
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Remark
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.billings.edges.map((value: Maybe<BillingEdge>) => (
                <tr key={value?.node.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {value?.node.item}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {value?.node.code}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {value?.node.price}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {value?.node.credit === true ? 'Yes' : 'No'}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {value?.node.remark}
                  </td>

                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <button
                      onClick={() => {
                        bottomSheetDispatch({
                          type: 'show',
                          snapPoint: 500,
                          children: (
                            <UpdateBillingForm
                              onUpdateSuccess={() => {
                                bottomSheetDispatch({
                                  type: 'hide',
                                });

                                notifDispatch({
                                  type: 'showNotification',
                                  notifTitle: 'Success',
                                  notifSubTitle:
                                    'Billing has been updated successfully',
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
                                    'Billing has been deleted successfully',
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
            totalCount={data?.billings.totalCount ?? 0}
            onNext={handleNextClick}
            onPrevious={handlePreviousClick}
          />
        </div>
      </div>
    </div>
  );
};
