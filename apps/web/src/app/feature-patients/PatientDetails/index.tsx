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

import { gql } from '@apollo/client';

import React, { useEffect, useState } from 'react';
import {
  TablePagination,
  Tabs,
  AppointmentFormContainer,
} from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import { PatientTabs } from '../PatientTabs';
import { Appointment, PaginationInput, Page } from '@tensoremr/models';
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
import { CalendarIcon } from '@heroicons/react/outline';
import PatientOrders from '../PatientOrders';
import _ from 'lodash';
import PocketBaseClient from '../../pocketbase-client';
import { Record } from 'pocketbase';

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

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });

  const [patient, setPatient] = useState<Record>();

  useEffect(() => {
    fetchPatient(patientId);
  }, [patientId]);

  const fetchPatient = async (patientId: string) => {
    setIsLoading(true);

    try {
      const result = await PocketBaseClient.records.getOne(
        'patients',
        patientId
      );
      setPatient(result);
    } catch (error: any) {
      const errorData = error?.data.data;

      if (!_.isEmpty(errorData)) {
        for (const key in error) {
          if (key) {
            notifDispatch({
              type: 'showNotification',
              notifTitle: 'Error',
              notifSubTitle: key + ' ' + error[key].message.toLowerCase(),
              variant: 'failure',
            });
          }
        }
      } else {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error?.message,
          variant: 'failure',
        });
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (patient && onUpdateTab) {
      const page: any = {
        title: `Patient - ${patient.firstName} ${patient.lastName}`,
        route: `/patients/${patient.id}`,
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
  }, [patient]);


  const handleEditClick = () => {
    history.push(`/new-patient?mrn=${patient?.mrn}`);
  };

  const handleNextClick = () => {
    // const totalPages = data?.searchAppointments.pageInfo.totalPages ?? 0;
    // if (totalPages > paginationInput.page) {
    //   setPaginationInput({
    //     ...paginationInput,
    //     page: paginationInput.page + 1,
    //   });
    // }
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
        data={patient}
        loading={isLoading}
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
                      if (patient) {
                        bottomSheetDispatch({
                          type: 'show',
                          snapPoint: 1000,
                          children: (
                            <AppointmentFormContainer
                              patientId={patient.id}
                              onSuccess={() => null}
                              onCancel={() =>
                                bottomSheetDispatch({
                                  type: 'hide',
                                })
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
                  >
                    <div className="flex items-center space-x-2 tracking-wide">
                      <CalendarIcon className="h-4 w-4" />

                      <div>New appointment</div>
                    </div>
                  </button>

                  {/*data?.patientsAppointmentToday?.id.toString() !== '0' && (
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
                                  bottomSheetDispatch({
                                    type: 'hide',
                                  });
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
                                  bottomSheetDispatch({
                                    type: 'hide',
                                  })
                                }
                                onReschedule={(appointmentId, patientId) => {
                                  bottomSheetDispatch({
                                    type: 'hide',
                                  });

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
                  )*/}
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
                      {/*data?.searchAppointments.edges.map((e) => (
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
                              ))*/}
                    </tbody>
                  </table>
                  <TablePagination
                    totalCount={0}
                    onNext={handleNextClick}
                    onPrevious={handlePreviousClick}
                  />
                </div>
              </div>
            </Route>
            <Route path={`${match.path}/orders`}>
              {patient?.id && <PatientOrders patientId={patient.id} />}
            </Route>
            <Route path={`${match.path}/contact-information`}>
              <div className="bg-white p-4">
                <PatientContactInfo data={patient} loading={isLoading} />
              </div>
            </Route>
            <Route path={`${match.path}/emergency-contact`}>
              <div className="bg-white p-4">
                <PatientEmergencyContactInfo
                  data={patient}
                  loading={isLoading}
                />
              </div>
            </Route>
            <Route path={`${match.path}/documents`}>
              <div className="bg-white p-4">
                <PatientDocuments data={patient} loading={isLoading} />
              </div>
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  );
};
