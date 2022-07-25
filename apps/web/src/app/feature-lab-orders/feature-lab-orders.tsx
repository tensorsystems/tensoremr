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
import React, { useState, useEffect } from 'react';
import { OrdersToolbar, CompleteLabOrderForm } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import {
  LabOrder,
  MutationSavePaymentWaiverArgs,
  OrderFilterInput,
  PaginationInput,
  Query,
  QuerySearchLabOrdersArgs,
} from '@tensoremr/models';
import { LabOrdersTable } from './LabOrdersTable';
import { useLocation } from 'react-router-dom';

const PAYMENT_WAIVER_REQUEST = gql`
  mutation PaymentWaiverRequest($input: PaymentWaiverInput!) {
    savePaymentWaiver(input: $input) {
      id
    }
  }
`;

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
              id
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

function useRouterQuery() {
  return new URLSearchParams(useLocation().search);
}

export const LabOrdersPage: React.FC = () => {
  const query = useRouterQuery();
  const queryUserId = query.get('userId');
  const queryStatus = query.get('status');

  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: 20,
  });

  const [filter, setFilter] = useState<OrderFilterInput>({
    date: new Date(),
    userId: queryUserId === null ? 'all' : queryUserId,
    status: queryStatus === null ? 'all' : queryStatus,
    searchTerm: '',
  });

  const { data, refetch } = useQuery<Query, QuerySearchLabOrdersArgs>(
    SEARCH_LAB_ORDERS,
    {
      variables: {
        page: paginationInput,
        filter: {
          orderedById: filter.userId === 'all' ? undefined : filter.userId,
          status: filter.status === 'all' ? undefined : filter.status,
        },
        searchTerm:
          filter.searchTerm?.length === 0 ? undefined : filter.searchTerm,
        date: filter.date,
      },
    }
  );

  useEffect(() => {
    refetch();
  }, [filter, paginationInput]);

  const handleClear = () => {
    setFilter({
      date: new Date(),
      userId: 'all',
      status: 'all',
    });
  };

  const [requestPaymentWaiver] = useMutation<
    any,
    MutationSavePaymentWaiverArgs
  >(PAYMENT_WAIVER_REQUEST, {
    onCompleted(data) {
      notifDispatch({
        type: 'show',
        notifTitle: 'Success',
        notifSubTitle: 'Payment waiver requested',
        variant: 'success',
      });
      bottomSheetDispatch({ type: 'hide' });
    },
    onError(error) {
      notifDispatch({
        type: 'show',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

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
              type: 'show',
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
          onFailure={(message) =>
            notifDispatch({
              type: 'show',
              notifTitle: 'Error',
              notifSubTitle: message,
              variant: 'failure',
            })
          }
        />
      ),
    });
  };

  return (
    <div className="h-screen">
      <OrdersToolbar
        filter={filter}
        onClear={handleClear}
        onChange={setFilter}
      />

      <LabOrdersTable
        totalCount={data?.searchLabOrders.totalCount ?? 0}
        orders={data?.searchLabOrders.edges.map((e) => e.node) ?? []}
        onNext={handleNextClick}
        onPrev={handlePrevClick}
        onItemClick={handleOrderClick}
      />
    </div>
  );
};
