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

import { gql, useQuery } from '@apollo/client';

import React, { useEffect, useState } from 'react';
import {
  TablePagination,
  CheckInForm,
  Tabs,
  AppointmentFormContainer,
} from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import { format, parseISO } from 'date-fns';
import classNames from 'classnames';
import { PatientTabs } from '../PatientTabs';
import { Appointment, PaginationInput, Query, Page } from '@tensoremr/models';
import { parseJwt } from '@tensoremr/util';
import { PatientBasicInfo } from './PatientBasicInfo';
import { PatientContactInfo } from './PatientContactInfo';
import { PatientEmergencyContactInfo } from './PatientEmergencyContactInfo';
import {
  Route,
  Switch,
  useHistory,
  useParams,
  useRouteMatch,
} from 'react-router-dom';
import { PatientDocuments } from './PatientDocuments';
import { CalendarIcon, LoginIcon } from '@heroicons/react/outline';
import PatientOrders from '../PatientOrders';
import _ from 'lodash';

export const GET_DATA = gql`
  query Data(
    $patientId: ID!
    $appointmentSearchInput: AppointmentSearchInput!
    $page: PaginationInput!
    $checkedIn: Boolean!
  ) {
    patient(id: $patientId) {
      id
      firstName
      lastName
      dateOfBirth
      gender
      idNo
      occupation
      martialStatus
      memo
      phoneNo
      phoneNo2
      homePhone
      region
      credit
      creditCompany
      city
      subCity
      kebele
      woreda
      email
      houseNo
      emergencyContactRel
      emergencyContactName
      emergencyContactMemo
      emergencyContactPhone
      emergencyContactPhone2
      paperRecord
      cardNo
      paperRecordDocument {
        id
        contentType
        fileName
        extension
        hash
        size
      }
      documents {
        id
        contentType
        fileName
        extension
        hash
        size
      }
    }

    patientsAppointmentToday(patientId: $patientId, checkedIn: $checkedIn) {
      id
    }

    searchAppointments(input: $appointmentSearchInput, page: $page) {
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
          firstName
          lastName
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

export const PatientDetails: React.FC<{
  onAddPage?: (page: any) => void;
  onUpdateTab?: (page: any) => void;
}> = ({ onUpdateTab, onAddPage }) => {
  const match = useRouteMatch();
  const [tabValue, setTabValue] = useState('Appointments');
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();
  const history = useHistory();
  const { patientId } = useParams<{ patientId: string }>();

  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });

  const { data, loading, refetch } = useQuery<Query, any>(GET_DATA, {
    variables: {
      patientId: patientId,
      appointmentSearchInput: {
        patientId,
      },
      page: paginationInput,
      checkedIn: false,
    },
  });

  useEffect(() => {
    if (data?.patient && onUpdateTab) {
      const page: any = {
        title: `Patient - ${data.patient.firstName} ${data.patient.lastName}`,
        route: `/patients/${data.patient.id}`,
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
              d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
            />
          </svg>
        ),
      };

      onUpdateTab(page);
    }
  }, [data]);

  const handleAppointmentClick = (appointment: Appointment) => {
    if (data?.patient) {
      const token = sessionStorage.getItem('accessToken');

      if (token !== null) {
        const claim = parseJwt(token);
        const userType = claim.UserType;

        if (userType.includes('Receptionist')) {
          bottomSheetDispatch({
            type: 'show',
            snapPoint: 1000,
            children: (
              <AppointmentFormContainer
                patientId={data?.patient.id}
                updateId={appointment.id}
                onSuccess={() => refetch()}
                onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                onFailure={(message) => {
                  notifDispatch({
                    type: 'show',
                    notifTitle: 'Error',
                    notifSubTitle: message,
                    variant: 'failure',
                  });
                }}
              />
            ),
          });
        } else {
          const page: Page = {
            title: `Appointment - ${appointment.firstName} ${appointment.lastName}`,
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

          if (onAddPage) {
            onAddPage(page);
            history.push(`/appointments/${appointment.id}/patient-dashboard`);
          }
        }
      }
    }
  };

  const handleEditClick = () => {
    history.push(`/update-patient?patientId=${data?.patient.id}`);
  };

  const handleNextClick = () => {
    const totalPages = data?.searchAppointments.pageInfo.totalPages ?? 0;

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

  return (
    <div>
      <PatientBasicInfo
        data={data?.patient}
        loading={loading}
        onEditClick={handleEditClick}
      />

      <div className="mt-4">
        <ul className="list-reset flex border-b">
          <Tabs
            value={tabValue}
            onChange={(value) => setTabValue(value)}
            tabs={PatientTabs}
          />
        </ul>
        <div>
          <Switch>
            <Route path={`${match.path}/appointments`}>
              <div className="bg-white p-4">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="bg-teal-700 hover:bg-teal-800 p-3 text-white rounded-md"
                    onClick={() => {
                      if (data?.patient) {
                        bottomSheetDispatch({
                          type: 'show',
                          snapPoint: 1000,
                          children: (
                            <AppointmentFormContainer
                              patientId={data?.patient.id}
                              onSuccess={() => refetch()}
                              onCancel={() =>
                                bottomSheetDispatch({ type: 'hide' })
                              }
                              onFailure={(message) => {
                                notifDispatch({
                                  type: 'show',
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
                  >
                    <div className="flex items-center space-x-2 tracking-wide">
                      <CalendarIcon className="h-4 w-4" />

                      <div>New appointment</div>
                    </div>
                  </button>

                  {data?.patientsAppointmentToday?.id.toString() !== '0' && (
                    <button
                      type="button"
                      className="bg-yellow-700 hover:bg-yellow-800 p-3 text-white rounded-md"
                      onClick={() => {
                        if (data?.patientsAppointmentToday) {
                          bottomSheetDispatch({
                            type: 'show',
                            snapPoint: 1000,
                            children: (
                              <CheckInForm
                                appointmentId={
                                  data?.patientsAppointmentToday.id
                                }
                                onSuccess={() => {
                                  bottomSheetDispatch({ type: 'hide' });
                                  refetch();
                                }}
                                onFailure={(message) => {
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
                                            bottomSheetDispatch({
                                              type: 'hide',
                                            })
                                          }
                                          onFailure={(message) => {
                                            notifDispatch({
                                              type: 'show',
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
                            ),
                          });
                        }
                      }}
                    >
                      <div className="flex items-center space-x-2 tracking-wide">
                        <LoginIcon className="h-4 w-4" />

                        <div>Check-In Now</div>
                      </div>
                    </button>
                  )}
                </div>

                <div className="mt-6">
                  <table className="min-w-full divide-y divide-gray-200 shadow-lg">
                    <thead>
                      <tr>
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
                          Check In Date
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
                      {data?.searchAppointments.edges.map((e) => (
                        <tr
                          key={e?.node.id}
                          className="hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            handleAppointmentClick(e?.node);
                          }}
                        >
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {`Dr. ${e?.node.providerName}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              {e?.node.room.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {format(
                              parseISO(e?.node.checkInTime.split('T')[0]),
                              'MMM d, y'
                            )}
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
                    totalCount={data?.searchAppointments.totalCount ?? 0}
                    onNext={handleNextClick}
                    onPrevious={handlePreviousClick}
                  />
                </div>
              </div>
            </Route>
            <Route path={`${match.path}/orders`}>
              {data?.patient.id && (
                <PatientOrders patientId={data?.patient.id} />
              )}
            </Route>
            <Route path={`${match.path}/contact-information`}>
              <div className="bg-white p-4">
                <PatientContactInfo data={data?.patient} loading={loading} />
              </div>
            </Route>
            <Route path={`${match.path}/emergency-contact`}>
              <div className="bg-white p-4">
                <PatientEmergencyContactInfo
                  data={data?.patient}
                  loading={loading}
                />
              </div>
            </Route>
            <Route path={`${match.path}/documents`}>
              <div className="bg-white p-4">
                <PatientDocuments data={data?.patient} loading={loading} />
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};
