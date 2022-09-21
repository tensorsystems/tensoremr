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
import React, { useEffect, useState } from 'react';
import { TablePagination } from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import {
  Maybe,
  Mutation,
  MutationApprovePaymentOrderWaiverArgs,
  PaginationInput,
  PaymentOrderWaiver,
  PaymentOrderWaiverEdge,
  Query,
  QueryPaymentOrderWaiversArgs,
} from '@tensoremr/models';
import classnames from 'classnames';

export const PAYMENT_ORDER_WAIVERS = gql`
  query PaymentOrderWaivers($page: PaginationInput!) {
    paymentOrderWaivers(page: $page) {
      totalCount
      edges {
        node {
          id
          patient {
            id
            firstName
            lastName
          }
          user {
            id
            firstName
            lastName
          }
          orderId 
          orderType
          approved
        }
      }
      pageInfo {
        totalPages
      }
    }
  }
`;

const APPROVE_PAYMENT_WAIVER = gql`
  mutation ApprovePaymentOrderWaiver($id: ID!, $approve: Boolean!) {
    approvePaymentOrderWaiver(id: $id, approve: $approve) {
      id
    }
  }
`;

const ROWS_PER_PAGE = 20;

export const PaymentWaiversPage: React.FC = () => {
  const bottomSheetDispatch = useBottomSheetDispatch();

  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: ROWS_PER_PAGE,
  });

  const { data, refetch } = useQuery<Query, QueryPaymentOrderWaiversArgs>(
    PAYMENT_ORDER_WAIVERS,
    {
      variables: { page: paginationInput },
    }
  );

  useEffect(() => {
    refetch();
  }, [paginationInput]);

  const handleNextClick = () => {
    const totalPages = data?.paymentOrderWaivers.pageInfo.totalPages ?? 0;

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

  const handleRequestClick = (paymentWaiver: PaymentOrderWaiver) => {
    bottomSheetDispatch({
      type: 'show',
      snapPoint: 500,
      children: (
        <HandleWaiverForm
          paymentWaiver={paymentWaiver}
          onCancel={() => bottomSheetDispatch({ type: 'hide' })}
          onSuccess={() => {
            refetch();
            bottomSheetDispatch({ type: 'hide' });
          }}
        />
      ),
    });
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  scope="col"
                  colSpan={6}
                  className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                >
                  Payment waiver requests
                </th>
              </tr>
              <tr>
                <th colSpan={6}>
                  <input
                    type="text"
                    name="search"
                    placeholder="Search"
                    className="p-3 pl-4 block w-full sm:text-md border-gray-300"
                  />
                </th>
              </tr>
              <tr className="bg-gray-50">
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Patient
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Type
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Requested by
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.paymentOrderWaivers.edges.map(
                (value: Maybe<PaymentOrderWaiverEdge>) => (
                  <tr
                    key={value?.node.id}
                    className="hover:bg-gray-100"
                    onClick={() => {
                      value?.node && handleRequestClick(value.node);
                    }}
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {`${value?.node.patient.firstName} ${value?.node.patient.lastName}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {`${value?.node.orderType}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {`${value?.node.user.firstName} ${value?.node.user.lastName}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span
                        className={classnames(
                          'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                          {
                            'bg-yellow-100 text-yellow-800':
                              !value?.node.approved,
                          },
                          {
                            'bg-green-100 text-green-800': value?.node.approved,
                          }
                        )}
                      >
                        {value?.node.approved ? 'Approved' : 'Not approved'}
                      </span>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
          <TablePagination
            totalCount={data?.paymentOrderWaivers.totalCount ?? 0}
            onNext={handleNextClick}
            onPrevious={handlePreviousClick}
          />
        </div>
      </div>
    </div>
  );
};

interface HandleWaiverFormProps {
  paymentWaiver: PaymentOrderWaiver;
  onCancel: () => void;
  onSuccess: () => void;
}

export const HandleWaiverForm: React.FC<HandleWaiverFormProps> = ({
  paymentWaiver,
  onSuccess,
  onCancel,
}) => {
  const notifDispatch = useNotificationDispatch();

  const [updatePaymentWaiver] = useMutation<
    Mutation,
    MutationApprovePaymentOrderWaiverArgs
  >(APPROVE_PAYMENT_WAIVER, {
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
  });

  const onApprove = () => {
    updatePaymentWaiver({
      variables: {
        id: paymentWaiver.id,
        approve: true,
      },
    });
  };

  const onReject = () => {
    updatePaymentWaiver({
      variables: {
        id: paymentWaiver.id,
        approve: false,
      },
    });
  };

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

        <form>
          <p className="text-2xl text-teal-700 font-semibold tracking-wider">
            Payment waiver request
          </p>
          <div className="mt-5">
            <table className="table-fixed w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Patient
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Type
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Requested by
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {`${paymentWaiver?.patient.firstName} ${paymentWaiver?.patient.lastName}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {paymentWaiver?.orderType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {`${paymentWaiver?.user.firstName} ${paymentWaiver?.user.lastName}`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-5 flex space-x-3">
            <button
              type="button"
              className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-teal-800 focus:outline-none"
              onClick={onApprove}
            >
              <span className="ml-2">Approve</span>
            </button>

            <button
              type="button"
              className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-700 hover:bg-yellow-800 focus:outline-none"
              onClick={onReject}
            >
              <span className="ml-2">Reject</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
