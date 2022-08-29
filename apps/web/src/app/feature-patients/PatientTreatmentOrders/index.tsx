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
import { format, parseISO } from 'date-fns';
import React, { useState } from 'react';
import {
  TablePagination,
  CompleteTreatmentOrderForm,
} from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import {
  PaginationInput,
  Query,
  QuerySearchTreatmentOrdersArgs,
  TreatmentOrder,
  TreatmentOrderStatus,
} from '@tensoremr/models';
import cn from 'classnames';

const SEARCH_TREATMENT_ORDERS = gql`
  query SearchTreatmentOrders(
    $page: PaginationInput!
    $filter: TreatmentOrderFilter
    $date: Time
    $searchTerm: String
  ) {
    searchTreatmentOrders(
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
          treatments {
            id
            treatmentType {
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

export const PatientTreatmentOrders: React.FC<{ patientId: string }> = ({
  patientId,
}) => {
  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: 20,
  });

  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const { data, refetch } = useQuery<Query, QuerySearchTreatmentOrdersArgs>(
    SEARCH_TREATMENT_ORDERS,
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
    const totalPages = data?.searchTreatmentOrders.pageInfo.totalPages ?? 0;

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

  const handleOrderClick = (order: TreatmentOrder) => {
    bottomSheetDispatch({
      type: 'show',
      snapPoint: 0,
      children: (
        <CompleteTreatmentOrderForm
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
      <table className="w-full divide-y divide-gray-200 shadow-md rounded-md">
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
          {data?.searchTreatmentOrders.edges.map((e) => {
            const payments = e.node.treatments.map((p) => p.payments).flat();

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
                          e?.node.status === TreatmentOrderStatus.Ordered ||
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
          totalCount={data?.searchTreatmentOrders.totalCount ?? 0}
          onNext={handleNextClick}
          onPrevious={handlePrevClick}
        />
      </div>
    </div>
  );
};
