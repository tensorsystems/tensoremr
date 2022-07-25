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
import { gql, useQuery } from '@apollo/client';
import { TablePagination } from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import classnames from 'classnames';
import {
  DiagnosticProcedureTypeEdge,
  Maybe,
  PaginationInput,
  Query,
  QueryDiagnosticProcedureTypesArgs,
} from '@tensoremr/models';
import { UpdateDiagnosticProcedureTypeForm } from './UpdateDiagnosticProcedureTypeForm';
import { AddDiagnosticProcedureTypeForm } from './AddDiagnosticProcedureTypeForm';

const DIAGNOSTIC_PROCEDURE_TYPES = gql`
  query DiagnosticProcedureTypes($page: PaginationInput!, $searchTerm: String) {
    diagnosticProcedureTypes(page: $page, searchTerm: $searchTerm) {
      totalCount
      edges {
        node {
          id
          title
          active
          billings {
            id
            item
            code
          }
        }
      }
      pageInfo {
        totalPages
      }
    }
  }
`;

const ROWS_PER_PAGE = 20;

export const DiagnosticProcedureTypePage: React.FC = () => {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: ROWS_PER_PAGE,
  });

  const { data, refetch } = useQuery<Query, QueryDiagnosticProcedureTypesArgs>(
    DIAGNOSTIC_PROCEDURE_TYPES,
    {
      variables: {
        page: paginationInput,
        searchTerm: searchTerm.length === 0 ? undefined : searchTerm,
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [paginationInput, searchTerm]);

  const handleNextClick = () => {
    const totalPages = data?.diagnosticProcedureTypes.pageInfo.totalPages ?? 0;

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
                  Diagnostic Procedures
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
                          <AddDiagnosticProcedureTypeForm
                            onSuccess={() => {
                              bottomSheetDispatch({ type: 'hide' });

                              notifDispatch({
                                type: 'show',
                                notifTitle: 'Success',
                                notifSubTitle:
                                  'Diagnostic Procedure has been saved successfully',
                                variant: 'success',
                              });

                              refetch();
                            }}
                            onError={(message) => {
                              notifDispatch({
                                type: 'show',
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
              {data?.diagnosticProcedureTypes.edges.map(
                (value: Maybe<DiagnosticProcedureTypeEdge>) => (
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
                      {value?.node.active ? 'Active' : 'Inactive'}
                    </td>

                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          bottomSheetDispatch({
                            type: 'show',
                            snapPoint: 500,
                            children: (
                              <UpdateDiagnosticProcedureTypeForm
                                onUpdateSuccess={() => {
                                  bottomSheetDispatch({ type: 'hide' });

                                  notifDispatch({
                                    type: 'show',
                                    notifTitle: 'Success',
                                    notifSubTitle:
                                      'Diagnostic procedure has been updated successfully',
                                    variant: 'success',
                                  });

                                  refetch();
                                }}
                                onDeleteSuccess={() => {
                                  bottomSheetDispatch({ type: 'hide' });

                                  notifDispatch({
                                    type: 'show',
                                    notifTitle: 'Success',
                                    notifSubTitle:
                                      'Diagnostic procedure has been deleted successfully',
                                    variant: 'success',
                                  });

                                  refetch();
                                }}
                                onCancel={() =>
                                  bottomSheetDispatch({ type: 'hide' })
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
                )
              )}
            </tbody>
          </table>
          <TablePagination
            totalCount={data?.diagnosticProcedureTypes.totalCount ?? 0}
            onNext={handleNextClick}
            onPrevious={handlePreviousClick}
          />
        </div>
      </div>
    </div>
  );
};
