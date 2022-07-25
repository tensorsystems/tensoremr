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
import classnames from 'classnames';
import { TablePagination } from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import {
  Maybe,
  PaginationInput,
  Query,
  QueryUsersArgs,
  UserEdge,
} from '@tensoremr/models';
import { UserRegistrationForm } from './UserRegistrationForm';
import { UserUpdateForm } from './UserUpdateForm';

const USERS = gql`
  query Users(
    $page: PaginationInput!
    $filter: UserFilter
    $searchTerm: String
  ) {
    users(page: $page, filter: $filter, searchTerm: $searchTerm) {
      totalCount
      edges {
        node {
          id
          firstName
          lastName
          email
          confirmed
          locked
          active
          userTypes {
            id
            title
          }
          signature {
            id
            size
            hash
            fileName
            extension
            contentType
          }
          profilePic {
            id
            size
            hash
            fileName
            extension
            contentType
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

export const UserAdminPage: React.FC = () => {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const [searchTerm, setSearchTerm] = useState<string>('');

  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: ROWS_PER_PAGE,
  });

  const { data, refetch } = useQuery<Query, QueryUsersArgs>(USERS, {
    variables: {
      page: paginationInput,
      searchTerm: searchTerm.length === 0 ? undefined : searchTerm,
    },
  });

  useEffect(() => {
    refetch();
  }, [paginationInput, searchTerm]);

  const handleNextClick = () => {
    const totalPages = data?.users.pageInfo.totalPages ?? 0;

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
                  Users
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
                          <div className="px-10 py-4">
                            <div className="">
                              <div className="float-right">
                                <button
                                  onClick={() => {
                                    bottomSheetDispatch({ type: 'hide' });
                                  }}
                                >
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
                              <UserRegistrationForm
                                onSuccess={() => {
                                  bottomSheetDispatch({ type: 'hide' });

                                  notifDispatch({
                                    type: 'show',
                                    notifTitle: 'Success',
                                    notifSubTitle:
                                      'User has been saved successfully',
                                    variant: 'success',
                                  });

                                  refetch();
                                }}
                              />
                            </div>
                          </div>
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
              <tr className="bg-gray-50">
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  User Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.users.edges.map((value: Maybe<UserEdge>) => (
                <tr
                  key={value?.node.id}
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => {
                    bottomSheetDispatch({
                      type: 'show',
                      snapPoint: 0,
                      children: (
                        <div className="px-10 py-4">
                          <div className="">
                            <div className="float-right">
                              <button
                                onClick={() => {
                                  bottomSheetDispatch({ type: 'hide' });
                                }}
                              >
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
                            {value?.node && (
                              <UserUpdateForm
                                values={value?.node}
                                onSuccess={() => {
                                  bottomSheetDispatch({ type: 'hide' });

                                  notifDispatch({
                                    type: 'show',
                                    notifTitle: 'Success',
                                    notifSubTitle:
                                      'User has been updated successfully',
                                    variant: 'success',
                                  });

                                  refetch();
                                }}
                                onResetSuccess={() => {
                                  bottomSheetDispatch({ type: 'hide' });

                                  notifDispatch({
                                    type: 'show',
                                    notifTitle: 'Success',
                                    notifSubTitle:
                                      'Password successfully reset',
                                    variant: 'success',
                                  });

                                  refetch();
                                }}
                              />
                            )}
                          </div>
                        </div>
                      ),
                    });
                  }}
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {`${value?.node.firstName} ${value?.node.lastName}`}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {value?.node.email}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {value?.node.userTypes.map((e) => e?.title).join(', ')}
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
                </tr>
              ))}
            </tbody>
          </table>
          <TablePagination
            totalCount={data?.users.totalCount ?? 0}
            onNext={handleNextClick}
            onPrevious={handlePreviousClick}
          />
        </div>
      </div>
    </div>
  );
};
