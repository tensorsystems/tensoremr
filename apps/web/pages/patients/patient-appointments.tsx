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

import React, { useState } from "react";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { PaginationInput } from "@tensoremr/models";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import AppointmentForm from "../../components/appointment-form";
import { TablePagination } from "../../components/table-pagination";

interface Props {
  patientId: string | undefined;
}

export default function PatientAppointments(props: Props) {
  const { patientId } = props;
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });

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
      <div className="flex space-x-4">
        <button
          type="button"
          className="bg-teal-700 hover:bg-teal-800 p-3 text-white rounded-md"
          onClick={() => {
            if (patientId) {
              bottomSheetDispatch({
                type: "show",
                width: "medium",
                children: (
                  <AppointmentForm
                    patientId={patientId}
                    onSuccess={() => {
                      bottomSheetDispatch({
                        type: "hide",
                      });
                      notifDispatch({
                        type: "showNotification",
                        notifTitle: "Success",
                        notifSubTitle: "Appointment created successfully",
                        variant: "success",
                      });
                    }}
                    onCancel={() =>
                      bottomSheetDispatch({
                        type: "hide",
                      })
                    }
                    onFailure={(message) => {
                      notifDispatch({
                        type: "showNotification",
                        notifTitle: "Error",
                        notifSubTitle: message,
                        variant: "failure",
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
  );
}
