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

import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import {
  TablePagination,
  CheckInForm,
  StatCard,
  AppointmentFormContainer,
} from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useHistory } from 'react-router-dom';
import { PaginationInput, Query, Page } from '@tensoremr/models';
import { gql, useQuery } from '@apollo/client';
import { debounce } from 'lodash';

const HOME_STATS = gql`
  query HomeStats {
    receptionHomeStats {
      scheduled
      checkedIn
      checkedOut
    }
  }
`;

export const HomeReception = ({
  onAddPage,
}: {
  onAddPage: (page: Page) => void;
}) => {
  const history = useHistory();
  const { data } = useQuery<Query>(HOME_STATS);

  const handleStatClick = (status: string) => {
    const page: Page = {
      title: `Appointments`,
      cancellable: true,
      route: `/appointments`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    };

    onAddPage(page);
    history.push(`/appointments?status=${status}`);
  };

  return (
    <div className="h-full mb-20">
      <div className="md:flex md:space-x-6">
        <StatCard
          title={'Scheduled'}
          figure={data?.receptionHomeStats.scheduled ?? 0}
          onClick={() => {
            handleStatClick('Scheduled');
          }}
        />
        <StatCard
          title={'Checked in'}
          figure={data?.receptionHomeStats.checkedIn ?? 0}
          onClick={() => {
            handleStatClick('Checked-In');
          }}
        />
        <StatCard
          title={'Checked out'}
          figure={data?.receptionHomeStats.scheduled ?? 0}
          onClick={() => {
            handleStatClick('Checked-Out');
          }}
        />
      </div>

      <PatientsTable />
    </div>
  );
};

const TODAYS_APPOINTMENTS = gql`
  query Appointments($page: PaginationInput!, $searchTerm: String) {
    findTodaysAppointments(page: $page, searchTerm: $searchTerm) {
      totalCount
      edges {
        node {
          id
          checkInTime
          credit
          userId
          providerName
          visitType {
            id
            title
          }
          room {
            id
            title
          }
          appointmentStatus {
            id
            title
          }
          patient {
            id
            firstName
            lastName
            phoneNo
          }
          payments {
            id
            invoiceNo
            status
            billing {
              id
              item
              code
              price
            }
          }
        }
      }
      pageInfo {
        totalPages
      }
    }
  }
`;

const PatientsTable: React.FC = () => {
  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });

  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(searchTerm.length > 0);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  const { data, refetch } = useQuery<Query, any>(TODAYS_APPOINTMENTS, {
    variables: {
      page: paginationInput,
      searchTerm:
        debouncedSearchTerm.length > 0 ? debouncedSearchTerm : undefined,
    },
    pollInterval: 10000,
  });

  useEffect(() => {
    refetch();
  }, [paginationInput, debouncedSearchTerm]);

  const handleNextClick = () => {
    const totalPages = data?.findTodaysAppointments.pageInfo.totalPages ?? 0;

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

  const debouncer = useCallback(
    debounce((_searchVal: string) => {
      setDebouncedSearchTerm(_searchVal);
    }, 1000),
    []
  );

  return (
    <div className="mt-4 h-screen">
      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-t">
        <p>Todays Appointments</p>
        <div className="flex justify-end space-x-4 items-center">
          {showSearch && (
            <input
              autoFocus
              type="search"
              placeholder="Search"
              value={searchTerm}
              onChange={(evt) => {
                setSearchTerm(evt.target.value);
                debouncer(evt.target.value);
              }}
              onBlur={() => setShowSearch(false)}
              className="px-2 py-1 border border-gray-200 rounded-md shadow-inner"
            />
          )}

          {!showSearch && (
            <button type="button" onClick={() => setShowSearch(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Patient
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Phone Number
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Provider
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Visit Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Payment
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.findTodaysAppointments.edges.map((e) => (
                    <tr
                      key={e?.node.id}
                      className="hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        let form;

                        if (e?.node.appointmentStatus.title === 'Scheduled') {
                          form = (
                            <CheckInForm
                              appointmentId={e.node.id}
                              onSuccess={() => {
                                bottomSheetDispatch({ type: 'hide' });
                                refetch();
                              }}
                              onFailure={(message) => {
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
                              onReschedule={(appointmentId, patientId) => {
                                bottomSheetDispatch({ type: 'hide' });

                                if (
                                  appointmentId !== undefined &&
                                  patientId !== undefined
                                ) {
                                  bottomSheetDispatch({
                                    type: 'show',
                                    snapPoint: 1000,
                                    children: (
                                      <AppointmentFormContainer
                                        patientId={patientId}
                                        updateId={appointmentId}
                                        onSuccess={() => {
                                          refetch();
                                        }}
                                        onCancel={() =>
                                          bottomSheetDispatch({ type: 'hide' })
                                        }
                                        onFailure={(message) => {
                                          notifDispatch({
                                            type: 'showNotification',
                                            notifTitle: 'Error',
                                            notifSubTitle: message,
                                            variant: 'failure',
                                          });
                                        }}
                                      />
                                    ),
                                  });
                                }
                              }}
                            />
                          );
                        } else {
                          return;
                        }

                        bottomSheetDispatch({
                          type: 'show',
                          snapPoint: 0,
                          children: form,
                        });
                      }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className="h-10 w-10 text-gray-600"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {`${e?.node.patient?.firstName} ${e?.node.patient?.lastName}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              {e?.node.patient?.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {e?.node.patient?.phoneNo}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {`Dr. ${e?.node.providerName}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          {e?.node.room.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {e?.node.visitType.title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {(e?.node.payments.length ?? 0) > 0
                          ? `${e?.node.payments
                              .map((p) => p?.billing.item)
                              .join(', ')} (${e?.node.payments
                              .map((p) => p?.invoiceNo)
                              .join(', ')})`
                          : ''}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={classNames(
                            'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                            {
                              'bg-yellow-100 text-yellow-800':
                                e?.node.appointmentStatus?.title ===
                                  'Scheduled online' || 'Scheduled',
                            },
                            {
                              'bg-green-100 text-green-800':
                                e?.node.appointmentStatus?.title ===
                                'Checked-In',
                            },
                            {
                              'bg-red-100 text-red-800':
                                e?.node.appointmentStatus?.title ===
                                'Checked-Out',
                            }
                          )}
                        >
                          {e?.node.appointmentStatus?.title}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <TablePagination
                totalCount={data?.findTodaysAppointments.totalCount ?? 0}
                onNext={handleNextClick}
                onPrevious={handlePreviousClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
