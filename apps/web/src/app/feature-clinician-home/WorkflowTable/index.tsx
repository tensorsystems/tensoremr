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

import { gql, useMutation, useQuery } from '@apollo/client';
import { formatDistance, parseISO } from 'date-fns';
import debounce from 'lodash-es/debounce';
import React, { useCallback, useEffect, useState } from 'react';
import { RssIcon } from '@heroicons/react/outline';
import {
  Appointment,
  MutationDeleteFromQueueArgs,
  PaginationInput,
  Query,
  QueryGetUserAppointmentsArgs,
} from '@tensoremr/models';
import { Modal, TablePagination } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import './index.css';
import cn from 'classnames';
import { Menu, Transition } from '@headlessui/react';

const GET_APPOINTMENTS = gql`
  query GetUserAppointments(
    $page: PaginationInput!
    $searchTerm: String
    $visitType: String
    $subscriptions: Boolean
  ) {
    getUserAppointments(
      page: $page
      searchTerm: $searchTerm
      visitType: $visitType
      subscriptions: $subscriptions
    ) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          queueId
          queueName
          visitType {
            title
          }
          patient {
            id
            firstName
            lastName
          }
          patientChart {
            id
          }
          checkInTime
          checkedInTime
        }
      }
    }
  }
`;

const DELETE_FROM_QUEUE = gql`
  mutation DeleteFromQueue($patientQueueId: ID!, $appointmentId: ID!) {
    deleteFromQueue(
      patientQueueId: $patientQueueId
      appointmentId: $appointmentId
    ) {
      id
    }
  }
`;

interface WorkflowProps {
  onAppointmentClick: (appointment: Appointment) => void;
}

export const WorkflowTable: React.FC<WorkflowProps> = ({
  onAppointmentClick,
}) => {
  const notifDispatch = useNotificationDispatch();

  const [showSubscriptions, setShowSubscriptions] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(searchTerm.length > 0);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [referralModel, setReferralModel] = useState({
    open: false,
    appointmentId: null,
  });

  const [visitType, setVisitType] = useState<
    'All' | 'Outpatient' | 'Surgeries' | 'Treatments' | 'Post-Ops'
  >('All');

  interface DeleteFromQueueState {
    openConfirmationDialog: boolean;
    confirmation: boolean;
    patientQueueId: undefined | string;
    appointmentId: undefined | string;
  }

  const [deleteFromQueue, setDeleteFromQueue] = useState<DeleteFromQueueState>({
    openConfirmationDialog: false,
    confirmation: false,
    patientQueueId: undefined,
    appointmentId: undefined,
  });

  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: 20,
  });

  const { data, refetch } = useQuery<Query, QueryGetUserAppointmentsArgs>(
    GET_APPOINTMENTS,
    {
      variables: {
        page: paginationInput,
        subscriptions: showSubscriptions,
        searchTerm:
          debouncedSearchTerm.length > 0 ? debouncedSearchTerm : undefined,
        visitType: visitType,
      },
      pollInterval: 10000,
    }
  );

  useEffect(() => {
    if (
      deleteFromQueue.confirmation &&
      deleteFromQueue.patientQueueId &&
      deleteFromQueue.appointmentId
    ) {
      removeFromQueue({
        variables: {
          patientQueueId: deleteFromQueue.patientQueueId,
          appointmentId: deleteFromQueue.appointmentId,
        },
      });
    }
  }, [deleteFromQueue]);

  useEffect(() => {
    refetch();
  }, [paginationInput, debouncedSearchTerm, showSubscriptions, visitType]);

  const [removeFromQueue] = useMutation<any, MutationDeleteFromQueueArgs>(
    DELETE_FROM_QUEUE,
    {
      onCompleted(data) {
        setDeleteFromQueue({
          openConfirmationDialog: false,
          confirmation: false,
          patientQueueId: undefined,
          appointmentId: undefined,
        });

        refetch();
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

  const handleNextClick = () => {
    const totalPages = data?.getUserAppointments.pageInfo.totalPages ?? 0;

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
  const debouncer = useCallback(
    debounce((_searchVal: string) => {
      setDebouncedSearchTerm(_searchVal);
    }, 1000),
    []
  );

  const handleDeletePatientQueue = (
    patientQueueId: string,
    appointmentId: string
  ) => {
    setDeleteFromQueue({
      openConfirmationDialog: true,
      confirmation: false,
      patientQueueId,
      appointmentId,
    });
  };

  return (
    <div className="shadow border-b border-gray-200 sm:rounded-lg">
      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        <p>Workflow</p>
        <div className="flex justify-end space-x-4 items-center">
          <div className="flex items-center justify-center z-10">
            <div className="relative inline-block text-left">
              <Menu>
                {({ open }) => (
                  <>
                    <span className="rounded-md shadow-sm">
                      <Menu.Button className="inline-flex justify-center w-full px-4 py-1 shadow-sm bg-white text-gray-700 text-sm font-medium leading-5  transition duration-150 ease-in-out border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-gray-500 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800">
                        <span>
                          {visitType === 'All' ? 'All Visit Types' : visitType}
                        </span>
                        <svg
                          className="w-5 h-5 ml-2 -mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Menu.Button>
                    </span>

                    <Transition
                      show={open}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items
                        static
                        className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none px-2"
                      >
                        <div className="py-1">
                          <Menu.Item>
                            <a
                              href="#"
                              className={`${
                                visitType === 'All'
                                  ? 'bg-teal-400 text-white'
                                  : 'text-gray-700'
                              } flex justify-between w-full px-3 py-2 text-sm leading-5 text-left hover:bg-teal-500 hover:text-white rounded-md`}
                              onClick={() => setVisitType('All')}
                            >
                              All
                            </a>
                          </Menu.Item>
                          <Menu.Item>
                            <a
                              href="#"
                              className={`${
                                visitType === 'Outpatient'
                                  ? 'bg-teal-400 text-white'
                                  : 'text-gray-700'
                              } flex justify-between w-full px-3 py-2 text-sm leading-5 text-left hover:bg-teal-500 hover:text-white rounded-md`}
                              onClick={() => setVisitType('Outpatient')}
                            >
                              Outpatient
                            </a>
                          </Menu.Item>
                          <Menu.Item>
                            <a
                              href="#"
                              className={`${
                                visitType === 'Surgeries'
                                  ? 'bg-teal-400 text-white'
                                  : 'text-gray-700'
                              } flex justify-between w-full px-3 py-2 text-sm leading-5 text-left hover:bg-teal-500 hover:text-white rounded-md`}
                              onClick={() => setVisitType('Surgeries')}
                            >
                              Surgeries
                            </a>
                          </Menu.Item>
                          <Menu.Item>
                            <a
                              href="#"
                              className={`${
                                visitType === 'Treatments'
                                  ? 'bg-teal-400 text-white'
                                  : 'text-gray-700'
                              } flex justify-between w-full px-3 py-2 text-sm leading-5 text-left hover:bg-teal-500 hover:text-white rounded-md`}
                              onClick={() => setVisitType('Treatments')}
                            >
                              Treatments
                            </a>
                          </Menu.Item>
                          <Menu.Item>
                            <a
                              href="#"
                              className={`${
                                visitType === 'Post-Ops'
                                  ? 'bg-teal-400 text-white'
                                  : 'text-gray-700'
                              } flex justify-between w-full px-3 py-2 text-sm leading-5 text-left hover:bg-teal-500 hover:text-white rounded-md`}
                              onClick={() => setVisitType('Post-Ops')}
                            >
                              Post-Ops
                            </a>
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            </div>
          </div>
          <button
            type="button"
            className={cn(
              'flex items-center space-x-1 px-1 py-1 rounded-md transform hover:scale-105 shadow-md',
              {
                'bg-teal-500 text-white ': showSubscriptions,
                'bg-gray-400 text-gray-100': !showSubscriptions,
              }
            )}
            onClick={() => setShowSubscriptions(!showSubscriptions)}
          >
            <RssIcon className={cn('h-5 w-auto', {})} />
            <span>
              {showSubscriptions ? 'Subscriptions' : 'All Appointments'}
            </span>
          </button>
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
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th></th>
            <th
              scope="col"
              className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              Patient
            </th>
            <th
              scope="col"
              className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              Visit Type
            </th>
            <th
              scope="col"
              className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            >
              Checked-In
            </th>
            <th
              scope="col"
              className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
            ></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data?.getUserAppointments.edges.map((e) => (
            <tr key={e?.node.id} className="hover:bg-gray-100 cursor-pointer">
              <td className="queue-container shadow-inner  bg-teal-700">
                <span className="queue-text text-white font-bold tracking-wide text-sm">
                  {e?.node.queueName}
                </span>
              </td>

              <td
                className="px-6 py-4"
                onClick={() => {
                  e?.node && onAppointmentClick(e.node);
                }}
              >
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
                      {`${e?.node.patient.firstName} ${e?.node.patient.lastName}`}
                    </div>
                  </div>
                </div>
              </td>
              <td
                className="px-6 py-4 text-sm text-gray-600"
                onClick={() => {
                  e?.node && onAppointmentClick(e.node);
                }}
              >
                <span className="px-1 inline-flex leading-5">
                  {e?.node.visitType?.title}
                </span>
              </td>

              <td
                onClick={() => {
                  e?.node && onAppointmentClick(e.node);
                }}
                className="px-6 py-4 text-sm text-gray-600"
              >
                <span className="text-green-700">
                  {e?.node.checkedInTime &&
                    formatDistance(
                      parseISO(e?.node.checkedInTime),
                      new Date(),
                      {
                        addSuffix: true,
                      }
                    )}
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                <button
                  type="button"
                  onClick={() =>
                    e.node.queueId &&
                    e.node.id &&
                    handleDeletePatientQueue(e.node.queueId, e.node.id)
                  }
                >
                  <span className="material-icons hover:text-red-600 transform hover:scale-125">
                    logout
                  </span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination
        totalCount={data?.getUserAppointments.totalCount ?? 0}
        onNext={handleNextClick}
        onPrevious={handlePrevClick}
      />

      <Modal
        open={false}
        title={'Referral'}
        description={
          <p className="text-sm text-gray-500">
            This patient was referred to you by a provider. Would you like a
            blank page or prefer the notes automatically copied from the
            previous provider?
          </p>
        }
        positive={'Blank Page'}
        negative={'Copy Notes'}
        onNegativeClick={() => null}
        onPositiveClick={() => null}
        onClose={() => null}
      />

      <Modal
        open={deleteFromQueue.openConfirmationDialog}
        title={'Confirmation'}
        description={
          <p className="text-sm text-gray-500">
            Remove this patient from your queue?
          </p>
        }
        positive={'Continue'}
        negative={'Cancel'}
        onNegativeClick={() => {
          setDeleteFromQueue({
            openConfirmationDialog: false,
            confirmation: false,
            patientQueueId: undefined,
            appointmentId: undefined,
          });
        }}
        onPositiveClick={() => {
          setDeleteFromQueue({
            ...deleteFromQueue,
            confirmation: true,
          });
        }}
        onClose={() => {
          setDeleteFromQueue({
            openConfirmationDialog: false,
            confirmation: false,
            patientQueueId: undefined,
            appointmentId: undefined,
          });
        }}
      />
    </div>
  );
};
