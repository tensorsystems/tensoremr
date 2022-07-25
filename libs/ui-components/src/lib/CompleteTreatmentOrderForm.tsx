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
import { MenuComponent } from './MenuComponent';
import classnames from 'classnames';
import { PrinterIcon, SortAscendingIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { Menu } from '@headlessui/react';
import { AccordionItem } from './AccordionItem';
import cn from 'classnames';
import {
  ConfirmTreatmentOrderInput,
  MutationConfirmTreatmentOrderArgs,
  PaginationInput,
  Query,
  QueryPatientEncounterLimitByUserArgs,
  QuerySearchAppointmentsArgs,
  TreatmentOrder,
} from '@tensoremr/models';
import { getDay, parseISO } from 'date-fns';

const APPOINTMENT_LOOKUPS = gql`
  query AppointmentLookups($page: PaginationInput!, $userTypeTitle: String!) {
    rooms(page: $page) {
      totalCount
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        totalPages
      }
    }

    visitTypes(page: $page) {
      totalCount
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        totalPages
      }
    }

    consultationBillings {
      id
      item
      code
      price
      credit
      remark
    }

    appointmentStatuses(page: $page) {
      totalCount
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        totalPages
      }
    }

    getByUserTypeTitle(input: $userTypeTitle) {
      id
      firstName
      lastName
    }
  }
`;

const CONFIRM_TREATMENT_ORDER = gql`
  mutation ConfirmTreatmentOrder($input: ConfirmTreatmentOrderInput!) {
    confirmTreatmentOrder(input: $input) {
      treatmentOrder {
        id
      }
      treatmentId
      invoiceNo
    }
  }
`;

const SEARCH_APPOINTMENTS = gql`
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

const GET_PATIENT_ENCOUNTER_LIMIT = gql`
  query PatientEncounterLimit($userId: ID!) {
    patientEncounterLimitByUser(userId: $userId) {
      id
      userId
      mondayLimit
      tuesdayLimit
      wednesdayLimit
      thursdayLimit
      fridayLimit
      saturdayLimit
      sundayLimit
      overbook
    }
  }
`;

interface Props {
  selectedOrder: TreatmentOrder;
  onSuccess: () => void;
  onFailure: (message: string) => void;
  onCancel: () => void;
  onRefresh: () => void;
}

export const CompleteTreatmentOrderForm: React.FC<Props> = ({
  selectedOrder,
  onSuccess,
  onFailure,
  onCancel,
  onRefresh,
}) => {
  const { register, handleSubmit, setValue, watch } =
    useForm<ConfirmTreatmentOrderInput>();
  const orderValues = watch();

  const [order, setOrder] = useState<TreatmentOrder>(selectedOrder);
  const [openedOrderIndex, setOpenedOrderIndex] = useState<number>(0);
  const [errors, setErrors] = useState<Array<any>>([]);

  const [paginationInput] = useState<PaginationInput>({
    page: 1,
    size: 20,
  });

  const [dailyLimit, setDailyLimit] = useState<number>(-1);

  const lookupQuery = useQuery<Query, any>(APPOINTMENT_LOOKUPS, {
    variables: { page: paginationInput, userTypeTitle: 'Physician' },
  });

  const providerAppointmentsQuery = useLazyQuery<
    Query,
    QuerySearchAppointmentsArgs
  >(SEARCH_APPOINTMENTS);

  const patientEncounterLimitQuery = useLazyQuery<
    Query,
    QueryPatientEncounterLimitByUserArgs
  >(GET_PATIENT_ENCOUNTER_LIMIT);

  const patientEncounterLimit =
    patientEncounterLimitQuery[1].data?.patientEncounterLimitByUser;

  const [confirmTreatmentOrder] = useMutation<
    any,
    MutationConfirmTreatmentOrderArgs
  >(CONFIRM_TREATMENT_ORDER, {
    onCompleted(data) {
      onSuccess();

      const treatmentId = data.confirmTreatmentOrder.treatmentId;
      const treatmentIdx = order.treatments.findIndex(
        (e) => e.id === treatmentId
      );

      setOrder({
        ...order,
        treatments: [
          ...order.treatments.slice(0, treatmentIdx),
          {
            ...order.treatments[treatmentIdx],
            payments: order.treatments[treatmentIdx].payments.map((e) => ({
              ...e,
              status: 'PAID',
              invoiceNo: data.confirmTreatmentOrder.invoiceNo,
            })),
          },
          ...order.treatments.slice(treatmentIdx + 1),
        ],
      });
    },
    onError(error) {
      setErrors([error]);
      onFailure(error.message);
    },
  });

  useEffect(() => {
    const treatment = lookupQuery.data?.visitTypes.edges.find(
      (e) => e?.node.title === 'Treatment'
    );

    if (treatment) {
      setValue('visitTypeId', treatment.node.id);
    }
  }, [lookupQuery.data?.visitTypes]);

  useEffect(() => {
    if (selectedOrder.orderedBy?.id && orderValues.checkInTime) {
      providerAppointmentsQuery[0]({
        variables: {
          page: { page: 0, size: 100 },
          input: {
            userId: selectedOrder.orderedBy?.id,
            checkInTime: new Date(orderValues.checkInTime),
          },
        },
      });

      patientEncounterLimitQuery[0]({
        variables: {
          userId: selectedOrder.orderedBy.id,
        },
      });
    }
  }, [selectedOrder.orderedBy?.id, orderValues.checkInTime]);

  useEffect(() => {
    if (orderValues.checkInTime && patientEncounterLimit) {
      const checkInTime = parseISO(orderValues.checkInTime);

      const day = getDay(checkInTime);
      switch (day) {
        case 0:
          setDailyLimit(patientEncounterLimit.sundayLimit);
          break;
        case 1:
          setDailyLimit(patientEncounterLimit.mondayLimit);
          break;
        case 2:
          setDailyLimit(patientEncounterLimit.tuesdayLimit);
          break;
        case 3:
          setDailyLimit(patientEncounterLimit.wednesdayLimit);
          break;
        case 4:
          setDailyLimit(patientEncounterLimit.thursdayLimit);
          break;
        case 5:
          setDailyLimit(patientEncounterLimit.fridayLimit);
          break;
        case 6:
          setDailyLimit(patientEncounterLimit.saturdayLimit);
          break;
      }
    }
  }, [orderValues.checkInTime, patientEncounterLimit]);

  const handleFormSubmit = (
    values: ConfirmTreatmentOrderInput,
    treatmentId: string
  ) => {
    values.treatmentOrderId = selectedOrder.id;
    values.treatmentId = treatmentId;

    confirmTreatmentOrder({
      variables: {
        input: {
          ...values,
          checkInTime: new Date(values.checkInTime),
        },
      },
    });
  };

  const hasPendingPayments = order.treatments
    .map((e) => e.payments)
    .flat()
    .some((e) => e.status === 'PAYMENT_WAIVER_REQUESTED');

  const providerAppointments =
    providerAppointmentsQuery[1].data?.searchAppointments;
  const scheduledToday = providerAppointments?.totalCount ?? 0;
  const overbook = patientEncounterLimit?.overbook ?? 0;

  const bookingLeft = dailyLimit - scheduledToday;
  const overbooked =
    dailyLimit < scheduledToday && scheduledToday < dailyLimit + overbook;
  const fullyBooked = scheduledToday >= dailyLimit + overbook;

  const showProviderStats =
    selectedOrder.orderedBy?.id !== undefined &&
    orderValues.checkInTime !== undefined &&
    orderValues.checkInTime.length > 0;

  return (
    <div className="justify-center pt-4 pb-6">
      <div className="container mx-auto">
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

        <div className="flex space-x-10 divide-x-2 divide-gray-300 h-full">
          <div className="flex-1">
            <p className="text-2xl text-teal-700 font-semibold tracking-wider">{`Treatment Order for ${order.firstName} ${order.lastName}`}</p>

            {order.treatments.map((procedure, index) => {
              const allPaid = procedure.payments.every(
                (e) => e.status === 'PAID'
              );

              return (
                <form
                  key={procedure.id}
                  onSubmit={handleSubmit((value) =>
                    handleFormSubmit(value, procedure.id)
                  )}
                >
                  <AccordionItem
                    title={
                      <p className="text-center font-semibold text-xl text-white">
                        {procedure.treatmentType.title}
                      </p>
                    }
                    open={openedOrderIndex === index}
                    onHeadingClick={(isOpen) => {
                      setOpenedOrderIndex(index);
                    }}
                    className="mt-4 flex-1 flex flex-col"
                    headerColor={cn({
                      'bg-yellow-600 hover:bg-yellow-800 text-white': !allPaid,
                      'bg-teal-700 hover:bg-teal-800 text-white': allPaid,
                    })}
                  >
                    <div className="mt-5">
                      <table className="table-fixed w-full mt-5">
                        <thead>
                          <tr className="bg-gray-50">
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Billing
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Code
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Price
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            ></th>
                          </tr>
                        </thead>
                        <tbody>
                          {procedure.payments.map((payment) => (
                            <tr key={payment.id} className="border-t">
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {payment.billing.item}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                {payment.billing.code}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900">
                                <span className="text-gray-600 tracking-wide">
                                  ETB{' '}
                                </span>
                                <span>
                                  {payment.billing.price.toLocaleString()}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {payment.status === 'PAID' && (
                                  <p className="text-green-700 uppercase font-semibold">
                                    {`Payment Confirmed | ${payment.invoiceNo}`}
                                  </p>
                                )}
                                {payment.status ===
                                  'PAYMENT_WAIVER_REQUESTED' && (
                                  <p className="text-yellow-700 uppercase font-semibold animate-pulse">
                                    Payment waiver requested
                                  </p>
                                )}
                                {payment.status === 'NOTPAID' && (
                                  <MenuComponent
                                    title={'Options'}
                                    menus={
                                      <div className="px-1 py-1">
                                        <Menu.Item>
                                          {({ active }) => (
                                            <button
                                              disabled
                                              className={`${
                                                active
                                                  ? 'bg-teal-500 text-white'
                                                  : 'text-gray-900'
                                              } group flex rounded-md items-center w-full px-2 py-2 text-sm opacity-20`}
                                              type="button"
                                            >
                                              <PrinterIcon
                                                className="w-5 h-5 mr-2 text-teal-700"
                                                aria-hidden="true"
                                              />
                                              Confirm Payment
                                            </button>
                                          )}
                                        </Menu.Item>
                                        <Menu.Item>
                                          {({ active }) => (
                                            <button
                                              className={`${
                                                active
                                                  ? 'bg-teal-500 text-white'
                                                  : 'text-gray-900'
                                              } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                              type="button"
                                            >
                                              <SortAscendingIcon
                                                className="w-5 h-5 mr-2 text-teal-700"
                                                aria-hidden="true"
                                              />
                                              Request Payment Waiver
                                            </button>
                                          )}
                                        </Menu.Item>
                                      </div>
                                    }
                                  />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {procedure.receptionNote && (
                        <div className="mt-4">
                          <label
                            htmlFor="receptionNote"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Order Note
                          </label>
                          <input
                            disabled
                            type="text"
                            name="receptionNote"
                            id="receptionNote"
                            value={procedure.receptionNote}
                            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md bg-gray-100"
                          />
                        </div>
                      )}

                      {!allPaid && (
                        <div>
                          <div className="mt-4">
                            <label
                              htmlFor="checkInTime"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Check-In time
                            </label>
                            <input
                              type="datetime-local"
                              name="checkInTime"
                              id="checkInTime"
                              required
                              ref={register({ required: true })}
                              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                            />
                          </div>

                          {showProviderStats && (
                            <div className="mt-2">
                              {!overbooked && !fullyBooked && (
                                <p className="text-green-600 font-semibold">
                                  {`${scheduledToday} scheduled on this day, ${bookingLeft} left`}
                                </p>
                              )}

                              {overbooked && !fullyBooked && (
                                <p className="text-yellow-500 font-semibold">
                                  {`Provider is overbooked with ${scheduledToday} patients`}
                                </p>
                              )}

                              {fullyBooked && (
                                <p className="text-red-500 font-semibold">
                                  {`Provider is fully booked with ${scheduledToday} patients`}
                                </p>
                              )}
                            </div>
                          )}

                          <div className="mt-4">
                            <label
                              htmlFor="roomId"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Room
                            </label>
                            <select
                              id="roomId"
                              name="roomId"
                              required
                              ref={register({ required: true })}
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              {lookupQuery.data?.rooms.edges.map((e) => (
                                <option key={e?.node.id} value={e?.node.id}>
                                  {e?.node.title}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="mt-4">
                            <div>
                              <label
                                htmlFor="invoiceNo"
                                className="block text-sm font-medium text-gray-700"
                              >
                                Invoice
                              </label>
                              <input
                                required
                                id="invoiceNo"
                                name="invoiceNo"
                                ref={register({ required: true })}
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div className="py-3 mt-2 bg-gray-50 text-right">
                            <button
                              type="submit"
                              disabled={hasPendingPayments}
                              className={classnames(
                                'inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none',
                                {
                                  'bg-teal-700 hover:bg-teal-800 text-white':
                                    !hasPendingPayments,
                                  'bg-yellow-500 text-yellow-800 animate-pulse':
                                    hasPendingPayments,
                                }
                              )}
                            >
                              <span className="ml-2">
                                {hasPendingPayments
                                  ? 'Pending waiver approval'
                                  : 'Confirm All Payments'}
                              </span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionItem>
                </form>
              );
            })}

            <div className="mt-4">
              {errors.length > 0 &&
                errors.map((e) => (
                  <p className="text-red-600">Error: {e?.message}</p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
