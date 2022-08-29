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
import { format, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
  TablePagination,
  CompleteLabOrderForm,
} from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import {
  LabOrder,
  LabOrderStatus,
  MutationOrderAndConfirmLabArgs,
  OrderAndConfirmLabInput,
  PaginationInput,
  Query,
  QuerySearchLabOrdersArgs,
} from '@tensoremr/models';
import cn from 'classnames';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { useForm } from 'react-hook-form';
import Select from 'react-select';

const SEARCH_LAB_ORDERS = gql`
  query SearchLabOrders(
    $page: PaginationInput!
    $filter: LabOrderFilter
    $date: Time
    $searchTerm: String
  ) {
    searchLabOrders(
      page: $page
      filter: $filter
      date: $date
      searchTerm: $searchTerm
    ) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          firstName
          lastName
          phoneNo
          userName
          patientId
          orderedBy {
            id
            firstName
            lastName
            userTypes {
              title
            }
          }
          labs {
            id
            labType {
              id
              title
            }
            payments {
              id
              status
              invoiceNo
              billing {
                id
                item
                code
                price
                credit
              }
            }
            receptionNote
          }
          status
          createdAt
        }
      }
    }
  }
`;

export const PatientLabratoryOrders: React.FC<{ patientId: string }> = ({
  patientId,
}) => {
  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: 20,
  });

  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const { data, refetch } = useQuery<Query, QuerySearchLabOrdersArgs>(
    SEARCH_LAB_ORDERS,
    {
      variables: {
        page: paginationInput,
        filter: {
          patientId,
        },
      },
    }
  );

  const handleNextClick = () => {
    const totalPages = data?.searchLabOrders.pageInfo.totalPages ?? 0;

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

  const handleOrderClick = (order: LabOrder) => {
    bottomSheetDispatch({
      type: 'show',
      snapPoint: 0,
      children: (
        <CompleteLabOrderForm
          selectedOrder={order}
          onSuccess={() => {
            refetch();
            notifDispatch({
              type: 'showNotification',
              notifTitle: 'Success',
              notifSubTitle: 'Receipt printed successfully',
              variant: 'success',
            });
            bottomSheetDispatch({ type: 'hide' });
          }}
          onCancel={() => bottomSheetDispatch({ type: 'hide' })}
          onRefresh={() => {
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
        />
      ),
    });
  };

  return (
    <div>
      <div className="bg-gray-50 w-full shadow-md rounded-sm p-2 flex justify-end">
        <button
          type="button"
          className="bg-teal-500 hover:bg-teal-600 px-3 py-1 text-white rounded-md"
          onClick={() => {
            bottomSheetDispatch({
              type: 'show',
              snapPoint: 0,
              children: (
                <OrderForm
                  patientId={patientId}
                  onSuccess={() => {
                    bottomSheetDispatch({ type: 'hide' });
                    notifDispatch({
                      type: 'showNotification',
                      notifTitle: 'Success',
                      notifSubTitle: 'New lab order added',
                      variant: 'success',
                    });
                    refetch();
                  }}
                  onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                />
              ),
            });
          }}
        >
          <div className="flex items-center space-x-2 tracking-wide">
            <PlusCircleIcon className="h-4 w-4" />

            <div>New Order</div>
          </div>
        </button>
      </div>

      <table className="w-full divide-y divide-gray-200 shadow-md rounded-md mt-2">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Ordered By
            </th>
            <th
              scope="col"
              className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Payments
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
          {data?.searchLabOrders.edges.map((e) => {
            const payments = e.node.labs.map((p) => p.payments).flat();

            return (
              <tr
                key={e?.node.id}
                className="hover:bg-gray-100 bg-gray-50 cursor-pointer"
                onClick={() => e.node && handleOrderClick(e.node)}
              >
                <td className="px-6 py-4">
                  {format(parseISO(e?.node.createdAt), 'MMM d, y')}
                </td>

                <td className="px-6 py-4">
                  {`${
                    e?.node.orderedBy?.userTypes.some(
                      (t) => t?.title === 'Physician'
                    )
                      ? 'Dr. '
                      : ''
                  } ${e.node.orderedBy?.firstName} ${
                    e.node.orderedBy?.lastName
                  }`}
                </td>

                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {payments
                      .map((p) => `${p?.billing.item} (${p?.billing.code})`)
                      .join(', ')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {`ETB ${payments.reduce(
                      (a, c) => a + (c?.billing ? c?.billing.price : 0),
                      0
                    )}`}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-teal-700 tracking-wide font-semibold">
                  <span
                    className={cn(
                      'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                      {
                        'bg-yellow-100 text-yellow-800':
                          e?.node.status === LabOrderStatus.Ordered ||
                          payments.some(
                            (e) =>
                              e.status === 'NOTPAID' ||
                              e.status === 'PAYMENT_WAIVER_REQUESTED'
                          ),
                      },
                      {
                        'bg-green-100 text-green-800': payments.every(
                          (e) => e.status === 'PAID'
                        ),
                      }
                    )}
                  >
                    {e?.node.status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="">
        <TablePagination
          color="bg-gray-50 shadow-md"
          totalCount={data?.searchLabOrders.totalCount ?? 0}
          onNext={handleNextClick}
          onPrevious={handlePrevClick}
        />
      </div>
    </div>
  );
};

const ORDER_DATA = gql`
  query OrderData(
    $labPage: PaginationInput!
    $searchAppointmentsInput: AppointmentSearchInput!
    $appointmentsPage: PaginationInput!
  ) {
    labTypes(page: $labPage) {
      totalCount
      edges {
        node {
          id
          title
          billings {
            id
            item
            code
            price
          }
        }
      }
      pageInfo {
        totalPages
      }
    }

    searchAppointments(
      input: $searchAppointmentsInput
      page: $appointmentsPage
    ) {
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

const ORDER_AND_CONFIRM_LAB = gql`
  mutation OrderAndConfirmLab($input: OrderAndConfirmLabInput!) {
    orderAndConfirmLab(input: $input) {
      id
    }
  }
`;

interface OrderProps {
  patientId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderProps> = ({
  patientId,
  onSuccess,
  onCancel,
}) => {
  const notifDispatch = useNotificationDispatch();

  const [checkInTime, setCheckInTime] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const [selectedLabTypeId, setSelectedLabTypeId] = useState<string | null>(
    null
  );

  const [selectedBillings, setSelectedBillings] = useState<Array<any>>([]);

  const { register, handleSubmit } = useForm<OrderAndConfirmLabInput>({
    defaultValues: {
      patientId: patientId,
    },
  });

  const { data, refetch } = useQuery<Query, any>(ORDER_DATA, {
    variables: {
      labPage: {
        page: 1,
        size: 10000,
      },
      appointmentsPage: {
        page: 1,
        size: 10000,
      },
      searchAppointmentsInput: {
        patientId: patientId,
        checkInTime: new Date(checkInTime),
      },
    },
  });

  const [orderAndConfirm] = useMutation<any, MutationOrderAndConfirmLabArgs>(
    ORDER_AND_CONFIRM_LAB,
    {
      onCompleted(data) {
        onSuccess();
      },
      onError(error) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [checkInTime]);

  const onSubmit = (input: OrderAndConfirmLabInput) => {
    if (data?.searchAppointments.totalCount === 0) {
      alert('Please select appointment');
      return;
    }

    if (selectedLabTypeId === null) {
      alert('Please select lab');
      return;
    }

    if (selectedBillings.length === 0) {
      alert('Select atleast one billing item');
      return;
    }

    input.billingIds = selectedBillings.map((e) => e.value);
    input.patientId = patientId;
    input.labTypeId = selectedLabTypeId;

    orderAndConfirm({
      variables: {
        input,
      },
    });
  };

  const labTypes = data?.labTypes.edges.map((e) => ({
    value: e?.node.id,
    label: e?.node.title,
  }));

  const billings = data?.labTypes.edges
    .find((e) => e?.node.id.toString() === selectedLabTypeId?.toString())
    ?.node?.billings.map((e) => ({
      value: e?.id,
      label: e?.item,
      code: e?.code,
      price: e?.price,
    }));

  const patientAppointments = data?.searchAppointments;

  return (
    <div className="container mx-auto flex justify-center pt-4 pb-6">
      <div className="w-1/2">
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="text-2xl font-extrabold tracking-wider text-teal-800">
            Order Lab
          </p>
          <div className="mt-4">
            <Select
              placeholder="Lab"
              options={labTypes}
              onChange={(v) => {
                if (v?.value) {
                  setSelectedLabTypeId(v.value);
                }
              }}
            />
          </div>
          {selectedLabTypeId && (
            <div>
              <div className="mt-4">
                <Select
                  isMulti
                  placeholder="Billings"
                  options={billings}
                  onChange={(values) => {
                    setSelectedBillings(values.map((e) => e));
                  }}
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  value={checkInTime}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                  onChange={(evt) => {
                    setCheckInTime(evt.target.value);
                  }}
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="appointmentId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Select Appointment
                </label>
                {patientAppointments?.totalCount === 0 ? (
                  <div className="text-red-500">
                    No appointments found on this day
                  </div>
                ) : (
                  <div>
                    {patientAppointments?.edges.map((e) => (
                      <div
                        key={e?.node.id}
                        className="border border-gray-300 p-2 rounded-md mt-2"
                      >
                        <label className="inline-flex items-center">
                          <input
                            required
                            type="radio"
                            name="appointmentId"
                            value={e?.node.id}
                            ref={register({ required: true })}
                          />
                          <span className="ml-2">{`Sick visit with Dr. ${e?.node.providerName}`}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="mt-4">
                <label
                  htmlFor="invoiceNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Invoice
                </label>
                <input
                  id="invoiceNo"
                  name="invoiceNo"
                  required
                  ref={register({ required: true })}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mt-4">
                <label
                  htmlFor="orderNote"
                  className="block text-sm font-medium text-gray-700"
                >
                  Order Note
                </label>
                <textarea
                  name="orderNote"
                  rows={2}
                  ref={register}
                  className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md h-20 w-full"
                />
              </div>
              <div className="mt-4"></div>
              <button
                type="submit"
                className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-teal-800 focus:outline-none"
              >
                <span className="ml-2">Save</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
