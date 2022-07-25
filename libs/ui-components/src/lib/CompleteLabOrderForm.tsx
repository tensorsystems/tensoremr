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

import { gql, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { MenuComponent } from './MenuComponent';
import { Menu } from '@headlessui/react';
import { PrinterIcon, SortAscendingIcon } from '@heroicons/react/outline';
import {
  LabOrder,
  LabOrderStatus,
  MutationConfirmLabOrderArgs,
  MutationRequestPaymentWaiverArgs,
} from '@tensoremr/models';
import { useForm } from 'react-hook-form';
import classnames from 'classnames';

const CONFIRM_LAB_ORDER = gql`
  mutation ConfirmLabOrder($id: ID!, $invoiceNo: String!) {
    confirmLabOrder(id: $id, invoiceNo: $invoiceNo) {
      id
    }
  }
`;

const REQUEST_WAIVER = gql`
  mutation RequestPaymentWaiver($paymentId: ID!, $patientId: ID!) {
    requestPaymentWaiver(paymentId: $paymentId, patientId: $patientId) {
      id
    }
  }
`;

const REQUEST_WAIVER_BATCH = gql`
  mutation RequestPaymentWaivers($ids: [ID!]!, $patientId: ID!) {
    requestPaymentWaivers(ids: $ids, patientId: $patientId)
  }
`;

interface Props {
  selectedOrder: LabOrder;
  onSuccess: () => void;
  onFailure: (message: string) => void;
  onCancel: () => void;
  onRefresh: () => void;
}

export const CompleteLabOrderForm: React.FC<Props> = ({
  selectedOrder,
  onSuccess,
  onFailure,
  onCancel,
  onRefresh,
}) => {
  const { register, handleSubmit } = useForm();

  const [order, setOrder] = useState<LabOrder>(selectedOrder);
  const [requestedWaiver, setRequestedWaiver] = useState<{
    labIdx: number | -1;
    paymentId: string | null;
    patientId: string | null;
  }>({
    labIdx: -1,
    paymentId: null,
    patientId: null,
  });

  const [errors, setErrors] = useState<Array<any>>([]);

  useEffect(() => {
    const { labIdx, paymentId, patientId } = requestedWaiver;
    if (labIdx !== -1 && paymentId !== null && patientId !== null) {
      requestWaiver({
        variables: {
          paymentId: paymentId,
          patientId: patientId,
        },
      });
    }
  }, [requestedWaiver]);

  const [confirmLabOrder, confirmLabOrderResult] = useMutation<
    any,
    MutationConfirmLabOrderArgs
  >(CONFIRM_LAB_ORDER, {
    onCompleted(data) {
      onSuccess();
    },
    onError(error) {
      onFailure(error.message);
    },
  });

  const [requestWaiver, requestWaiverResult] = useMutation<
    any,
    MutationRequestPaymentWaiverArgs
  >(REQUEST_WAIVER, {
    onCompleted(data) {
      const paymentId = data.requestPaymentWaiver.id;

      const lab = order.labs[requestedWaiver.labIdx];

      if (lab) {
        const labIdx = lab.payments.findIndex((p) => p.id === paymentId);

        setOrder({
          ...order,
          labs: [
            ...order.labs.slice(0, requestedWaiver.labIdx),
            {
              ...lab,
              payments: [
                ...lab.payments.slice(0, labIdx),
                {
                  ...lab.payments[labIdx],
                  status: 'PAYMENT_WAIVER_REQUESTED',
                },
                // eslint-disable-next-line no-unsafe-optional-chaining
                ...lab.payments?.slice(labIdx + 1),
              ],
            },
            ...order.labs.slice(requestedWaiver.labIdx + 1),
          ],
        });
      }
    },
    update: (cache, mutationResult) => {
      const lab = order.labs[requestedWaiver.labIdx];

      const payment = lab.payments?.find(
        (e) => e?.id === mutationResult.data.requestPaymentWaiver.id
      );

      if (payment) {
        cache.modify({
          id: cache.identify(payment),
          fields: {
            status(cachedStatus) {
              return 'PAYMENT_WAIVER_REQUESTED';
            },
          },
        });
      }
    },
    onError(error) {
      onFailure(error.message);
    },
  });

  useEffect(() => {
    const newErrors = [];
    if (requestWaiverResult.error) newErrors.push(requestWaiverResult.error);
    if (confirmLabOrderResult.error)
      newErrors.push(confirmLabOrderResult.error);
    setErrors(newErrors);
  }, [requestWaiverResult.error, confirmLabOrderResult.error]);

  const handleFormSubmit = (values: any) => {
    confirmLabOrder({
      variables: { id: order.id, invoiceNo: values.invoiceNo },
    });
  };

  const hasPendingPayments = order.labs
    .map((e) => e.payments)
    .flat()
    .some((e) => e.status === 'PAYMENT_WAIVER_REQUESTED');

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

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <p className="text-2xl text-teal-700 font-extrabold tracking-wider">{`Order for ${order.firstName} ${order.lastName}`}</p>

          {order.labs.map((lab, index) => (
            <div key={lab.id} className="mt-5">
              {order.labs.length - 1 === index && <hr className="mb-5" />}
              <p className="text-center font-semibold text-xl">
                {lab.labType.title}
              </p>
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
                  {lab.payments.map((payment) => (
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
                        <span>{payment.billing.price.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {payment.status === 'PAID' && (
                          <p className="text-green-700 uppercase font-semibold">
                            Payment Confirmed
                          </p>
                        )}
                        {payment.status === 'PAYMENT_WAIVER_REQUESTED' && (
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
                                      onClick={() => {
                                        setRequestedWaiver({
                                          labIdx: index,
                                          paymentId: payment.id,
                                          patientId: order.patientId,
                                        });
                                      }}
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
              {lab.receptionNote && (
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
                    value={lab.receptionNote}
                    className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md bg-gray-100"
                  />
                </div>
              )}
            </div>
          ))}

          <div className="mt-4">
            {errors.length > 0 &&
              errors.map((e) => (
                <p className="text-red-600">Error: {e?.message}</p>
              ))}
          </div>

          {order.status === LabOrderStatus.Ordered && (
            <div className="mt-5">
              <div>
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

              <div className="py-3 mt-2 bg-gray-50 text-right">
                <button
                  type="submit"
                  disabled={hasPendingPayments}
                  className={classnames(
                    'inline-flex justify-center w-full py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md focus:outline-none',
                    {
                      'bg-teal-600 hover:bg-teal-700 text-white':
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
        </form>
      </div>
    </div>
  );
};
