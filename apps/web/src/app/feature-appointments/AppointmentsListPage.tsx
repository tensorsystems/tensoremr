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

import { gql, QueryResult, useQuery } from '@apollo/client';
import classNames from 'classnames';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
  Appointment,
  AppointmentConnection,
  AppointmentSearchInput,
  PaginationInput,
  Query,
  QuerySearchAppointmentsArgs,
  Page,
} from '@tensoremr/models';
import { useHistory, useLocation } from 'react-router-dom';
import { parseJwt } from '@tensoremr/util';
import {
  TablePagination,
  AppointmentFormContainer,
} from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';

const TOOLBAR_LOOKUPS = gql`
  query ToolbarLookups($userTypeTitle: String!) {
    appointmentStatuses(page: { page: 0, size: 20 }) {
      edges {
        node {
          id
          title
        }
      }
    }
    visitTypes(page: { page: 0, size: 20 }) {
      edges {
        node {
          id
          title
        }
      }
    }
    getByUserTypeTitle(input: $userTypeTitle) {
      id
      firstName
      lastName
    }
  }
`;

const APPOINTMENT_SEARCH = gql`
  query SearchAppointments(
    $input: AppointmentSearchInput!
    $page: PaginationInput!
  ) {
    searchAppointments(input: $input, page: $page) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          providerName
          checkInTime
          checkedInTime
          checkedOutTime
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
          room {
            id
            title
          }
          visitType {
            id
            title
          }
          appointmentStatus {
            id
            title
          }
        }
      }
    }
  }
`;

function useRouterQuery() {
  return new URLSearchParams(useLocation().search);
}

export const AppointmentsListPage: React.FC<{
  onAddPage: (page: Page) => void;
}> = ({ onAddPage }) => {
  const query = useRouterQuery();
  const queryUserId = query.get('userId');
  const queryStatusId = query.get('statusId');
  const queryStatus = query.get('status');
  const queryVisitTypeId = query.get('visitTypeId');
  const history = useHistory();

  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const [filter, setFilter] = useState<AppointmentSearchInput>({
    checkInTime: new Date(),
    userId: queryUserId === null ? 'all' : queryUserId,
    appointmentStatusId: queryStatusId === null ? 'all' : queryStatusId,
    visitTypeId: queryVisitTypeId === null ? 'all' : queryVisitTypeId,
  });

  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: 20,
  });

  const { data, refetch } = useQuery<Query, QuerySearchAppointmentsArgs>(
    APPOINTMENT_SEARCH,
    {
      variables: {
        input: {
          checkInTime: filter.checkInTime,
          userId: filter.userId === 'all' ? undefined : filter.userId,
          appointmentStatusId:
            filter.appointmentStatusId === 'all'
              ? undefined
              : filter.appointmentStatusId,
          visitTypeId:
            filter.visitTypeId === 'all' ? undefined : filter.visitTypeId,
          searchTerm:
            filter.searchTerm?.length === 0 ? undefined : filter.searchTerm,
        },
        page: paginationInput,
      },
    }
  );

  const queryToolbarLookup = useQuery<Query, any>(TOOLBAR_LOOKUPS, {
    variables: {
      userTypeTitle: 'Physician',
    },
  });

  useEffect(() => {
    if (queryToolbarLookup.data?.appointmentStatuses && queryStatus !== null) {
      const status = queryToolbarLookup.data.appointmentStatuses.edges.find(
        (e) => e?.node.title === queryStatus
      );
      if (status) {
        setFilter({
          ...filter,
          appointmentStatusId: status.node.id.toString(),
        });
      }
    }
  }, [queryStatus]);

  useEffect(() => {
    refetch();
  }, [filter, paginationInput]);

  const handleNextClick = () => {
    const totalPages = data?.searchAppointments.pageInfo.totalPages ?? 0;

    if (totalPages > paginationInput.page) {
      setPaginationInput({
        ...paginationInput,
        page: paginationInput.page + 1,
      });
    }
  };

  const handlePrevClick = () => {
    if (paginationInput.page > 1) {
      setPaginationInput({
        ...paginationInput,
        page: paginationInput.page - 1,
      });
    }
  };

  const handleClear = () => {
    setFilter({
      checkInTime: new Date(),
      userId: 'all',
      appointmentStatusId: 'all',
      visitTypeId: 'all',
      searchTerm: undefined,
    });
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    const token = sessionStorage.getItem('accessToken');

    if (token !== null) {
      const claim = parseJwt(token);
      const userType = claim.UserType;

      if (userType.includes('Receptionist')) {
        if (appointment.patient.id) {
          bottomSheetDispatch({
            type: 'show',
            snapPoint: 1000,
            children: (
              <AppointmentFormContainer
                patientId={appointment?.patient.id}
                updateId={appointment.id}
                onSuccess={() => refetch()}
                onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                onFailure={(message) =>
                  notifDispatch({
                    type: 'showNotification',
                    notifTitle: 'Error',
                    notifSubTitle: message,
                    variant: 'failure',
                  })
                }
              />
            ),
          });
        }
      } else {
        const page: Page = {
          title: `Appointment - ${appointment.patient.firstName} ${appointment.patient.lastName}`,
          cancellable: true,
          route: `/appointments/${appointment.id}/patient-dashboard`,
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
        history.replace(`/appointments/${appointment.id}/patient-dashboard`);
      }
    }
  };
  return (
    <div className="h-full">
      <Toolbar
        filter={filter}
        lookup={queryToolbarLookup}
        onClear={handleClear}
        onChange={(input) => {
          setFilter(input);
        }}
      />

      <AppointmentsTable
        filter={filter}
        data={data?.searchAppointments}
        onSelect={handleAppointmentClick}
        onNext={handleNextClick}
        onPrev={handlePrevClick}
      />
    </div>
  );
};

interface ToolbarProps {
  filter: AppointmentSearchInput | undefined;
  lookup: QueryResult<Query, any> | undefined;
  onChange: (searchInput: AppointmentSearchInput) => void;
  onClear: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  filter,
  lookup,
  onChange,
  onClear,
}) => {
  const handleChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const value = evt.target.value;

    const newValue = {
      ...filter,
      [evt.target.name]: value === 'all' ? undefined : value,
    };

    onChange(newValue);
  };

  return (
    <div className="flex bg-white w-full h-16 p-4 mt-4 rounded-md shadow-md justify-between items-center">
      <div className="flex items-center text-gray-700">
        <input
          type="date"
          id="checkInTime"
          name="checkInTime"
          value={format(filter?.checkInTime, 'yyyy-MM-dd')}
          className="border-l-2 border-gray-200 rounded-md"
          onChange={(evt) => {
            if (filter !== undefined) {
              const value = evt.target.value;
              const newValue: AppointmentSearchInput = {
                ...filter,
                checkInTime: new Date(value),
              };

              onChange(newValue);
            }
          }}
        />

        <select
          name="userId"
          className="ml-6 border-l-2 border-gray-200 rounded-md"
          value={filter?.userId ?? 'all'}
          onChange={handleChange}
        >
          <option value={'all'}>All Doctors</option>
          {lookup?.data?.getByUserTypeTitle.map((e) => (
            <option
              key={e?.id}
              value={e?.id}
            >{`Dr. ${e?.firstName} ${e?.lastName}`}</option>
          ))}
        </select>
        <select
          className="ml-6 border-l-2 border-gray-200 rounded-md"
          name="appointmentStatusId"
          value={filter?.appointmentStatusId ?? 'all'}
          onChange={handleChange}
        >
          <option value={'all'}>All Statuses</option>
          {lookup?.data?.appointmentStatuses.edges.map((e) => (
            <option key={e?.node.id} value={e?.node.id}>
              {e?.node.title}
            </option>
          ))}
        </select>
        <select
          className="ml-6 border-l-2 border-gray-200 rounded-md"
          name="visitTypeId"
          value={filter?.visitTypeId ?? 'all'}
          onChange={handleChange}
        >
          <option value={'all'}>All visit types</option>
          {lookup?.data?.visitTypes.edges.map((e) => (
            <option key={e?.node.id} value={e?.node.id}>
              {e?.node.title}
            </option>
          ))}
        </select>
        <div className="ml-6 border-l-2 p-1 pl-6">
          <button
            onClick={onClear}
            className="uppercase text-white tracking-wider text-sm rounded-md bg-teal-600 hover:bg-teal-700 px-6 py-2"
          >
            Clear
          </button>
        </div>
      </div>
      <div>
        <div className="relative mx-auto text-gray-600">
          <input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="search"
            name="searchTerm"
            placeholder="Search"
            value={filter?.searchTerm ?? ''}
            onChange={(evt) => {
              const value = evt.target.value;

              const newValue = {
                ...filter,
                [evt.target.name]: value.length === 0 ? null : value,
              };

              onChange(newValue);
            }}
          />
          <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

interface TableProps {
  data: AppointmentConnection | undefined;
  filter: AppointmentSearchInput | undefined;
  onSelect: (appointment: Appointment) => void;
  onNext: () => void;
  onPrev: () => void;
}

const AppointmentsTable: React.FC<TableProps> = ({
  data,
  onNext,
  onPrev,
  onSelect,
}) => {
  return (
    <div className="flex flex-col mt-4">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Patient
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phone Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Room
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Visit Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Payment
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.edges.map((e) => (
                  <tr
                    key={e?.node.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => e?.node && onSelect(e?.node)}
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
                        {e?.node.userId}
                      </div>
                      <div className="text-sm text-gray-900">
                        {e?.node.room?.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {e?.node.visitType?.title}
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
                              e?.node.appointmentStatus?.title === 'Checked In',
                          },
                          {
                            'bg-red-100 text-red-800':
                              e?.node.appointmentStatus?.title ===
                              'Checked Out',
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
              totalCount={data?.totalCount ?? 0}
              onNext={onNext}
              onPrevious={onPrev}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
