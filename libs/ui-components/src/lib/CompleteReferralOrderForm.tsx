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
import classnames from 'classnames';
import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useForm } from 'react-hook-form';
import cn from 'classnames';
import { AccordionItem } from './AccordionItem';
import {
  ConfirmReferralOrderInput,
  MutationConfirmReferralOrderArgs,
  PaginationInput,
  Query,
  QueryPatientEncounterLimitByUserArgs,
  QueryPayForConsultationArgs,
  QuerySearchAppointmentsArgs,
  ReferralOrder,
  ReferralStatus,
} from '@tensoremr/models';
import { getDay, parseISO } from 'date-fns';
import { SHOULD_PAY_FOR_CONSULTATION } from '@tensoremr/util';

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

const CONFIRM_REFERRAL_ORDER = gql`
  mutation ConfirmReferralOrder($input: ConfirmReferralOrderInput!) {
    confirmReferralOrder(input: $input) {
      referralOrder {
        id
      }
      referralId
      invoiceNo
      billingId
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
  selectedOrder: ReferralOrder;
  onSuccess: () => void;
  onFailure: (message: string) => void;
  onCancel: () => void;
  onRefresh: () => void;
}

export const CompleteReferralOrderForm: React.FC<Props> = ({
  selectedOrder,
  onSuccess,
  onFailure,
  onCancel,
}) => {
  const { register, handleSubmit, watch } =
    useForm<ConfirmReferralOrderInput>();
  const orderValues = watch();

  const [order, setOrder] = useState<ReferralOrder>(selectedOrder);
  const [openedOrderIndex, setOpenedOrderIndex] = useState<number>(0);
  const [errors, setErrors] = useState<Array<any>>([]);

  const [dailyLimit, setDailyLimit] = useState<number>(-1);

  const [paginationInput] = useState<PaginationInput>({
    page: 1,
    size: 20,
  });

  const [shouldPayForConsultation, setShouldPayForConsultation] =
    useState<boolean>(true);

  const lookupQuery = useQuery<Query, any>(APPOINTMENT_LOOKUPS, {
    variables: {
      page: paginationInput,
      userTypeTitle: 'Physician',
    },
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

  const [confirmReferralOrder] = useMutation<
    any,
    MutationConfirmReferralOrderArgs
  >(CONFIRM_REFERRAL_ORDER, {
    onCompleted(data) {
      onSuccess();

      const referralId = data.confirmReferralOrder.referralId;
      const referralIdx = order.referrals.findIndex((e) => e.id === referralId);

      setOrder({
        ...order,
        referrals: [
          ...order.referrals.slice(0, referralIdx),
          {
            ...order.referrals[referralIdx],
            status: ReferralStatus.Completed,
          },
          ...order.referrals.slice(referralIdx + 1),
        ],
      });
    },
    onError(error) {
      setErrors([error]);
      onFailure(error.message);
    },
  });

  useEffect(() => {
    if (
      selectedOrder.orderedBy?.id &&
      orderValues.checkInTime &&
      selectedOrder.referrals.length > 0
    ) {
      providerAppointmentsQuery[0]({
        variables: {
          page: { page: 0, size: 100 },
          input: {
            userId: selectedOrder.referrals[0].referredToId,
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

  const shouldPayForConsultationQuery = useLazyQuery<
    Query,
    QueryPayForConsultationArgs
  >(SHOULD_PAY_FOR_CONSULTATION, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (orderValues.checkInTime) {
      shouldPayForConsultationQuery[0]({
        variables: {
          patientId: selectedOrder.patientId,
          date: new Date(orderValues.checkInTime),
        },
      });
    }
  }, [orderValues.checkInTime]);

  useEffect(() => {
    lookupQuery.refetch();
  }, [orderValues.checkInTime]);

  useEffect(() => {
    if (shouldPayForConsultationQuery[1].called) {
      if (shouldPayForConsultationQuery[1].data?.payForConsultation) {
        setShouldPayForConsultation(true);
      } else {
        setShouldPayForConsultation(false);
      }
    }
  }, [shouldPayForConsultationQuery[1].data?.payForConsultation]);

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
    values: ConfirmReferralOrderInput,
    referralId: string
  ) => {
    values.referralOrderId = selectedOrder.id;
    values.referralId = referralId;

    confirmReferralOrder({
      variables: {
        input: {
          ...values,
          checkInTime: new Date(values.checkInTime),
        },
      },
    });
  };

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
            <p className="text-2xl text-teal-700 font-semibold tracking-wider">{`Referral Order for ${order.firstName} ${order.lastName}`}</p>

            {order.referrals.map((procedure, index) => {
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
                        Referral
                      </p>
                    }
                    open={openedOrderIndex === index}
                    onHeadingClick={(isOpen) => {
                      setOpenedOrderIndex(index);
                    }}
                    className="mt-4 flex-1 flex flex-col"
                    headerColor={cn({
                      'bg-yellow-600 hover:bg-yellow-800 text-white':
                        procedure.status === ReferralStatus.Ordered,
                      'bg-teal-700 hover:bg-teal-800 text-white':
                        procedure.status === ReferralStatus.Completed,
                    })}
                  >
                    <div className="mt-5">
                      {procedure.status === ReferralStatus.Ordered ? (
                        <div>
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

                          <div className="mt-4">
                            <label
                              htmlFor="referredToName"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Referred To
                            </label>
                            <input
                              disabled
                              readOnly
                              type="text"
                              name="referredToName"
                              id="referredToName"
                              value={selectedOrder.referrals[0].referredToName}
                              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md bg-gray-100"
                            />
                          </div>

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
                              ref={register({
                                required: shouldPayForConsultation,
                              })}
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
                              ref={register({
                                required: shouldPayForConsultation,
                              })}
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              {lookupQuery.data?.rooms.edges.map((e) => (
                                <option key={e?.node.id} value={e?.node.id}>
                                  {e?.node.title}
                                </option>
                              ))}
                            </select>
                          </div>

                          {shouldPayForConsultation && (
                            <div className="mt-4">
                              <div>
                                <label
                                  htmlFor="billingId"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Billing
                                </label>
                                <select
                                  id="billingId"
                                  name="billingId"
                                  ref={register({ required: true })}
                                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                >
                                  {lookupQuery.data?.consultationBillings.map(
                                    (e) => (
                                      <option key={e?.id} value={e?.id}>
                                        {`${e?.item} (${e?.code}) - ETB ${e?.price}`}
                                      </option>
                                    )
                                  )}
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
                            </div>
                          )}

                          <div className="py-3 mt-2 bg-gray-50 text-right">
                            <button
                              type="submit"
                              className={classnames(
                                'inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none bg-teal-700 hover:bg-teal-800 text-white'
                              )}
                            >
                              <span className="ml-2">Confirm</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-green-700 uppercase font-semibold">
                            {`Order Confirmed`}
                          </p>
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
