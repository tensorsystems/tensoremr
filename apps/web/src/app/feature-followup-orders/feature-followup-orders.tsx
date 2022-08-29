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
import React, { useState, useEffect } from 'react';
import {
  CompleteFollowUpOrderForm,
  OrdersToolbar,
} from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import {
  FollowUpOrder,
  OrderFilterInput,
  PaginationInput,
  Query,
  QuerySearchFollowUpOrdersArgs,
} from '@tensoremr/models';
import { useLocation } from 'react-router-dom';
import { FollowUpOrdersTable } from './FollowUpOrdersTable';
import { useNotificationDispatch } from '@tensoremr/notification';

const SEARCH_FOLLOW_UP_ORDERS = gql`
  query SearchFollowUpOrders(
    $page: PaginationInput!
    $filter: FollowUpOrderFilter
    $date: Time
    $searchTerm: String
  ) {
    searchFollowUpOrders(
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
          followUps {
            id
            receptionNote
            status
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

export const FollowUpOrdersPage: React.FC = () => {
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

  const { data, refetch } = useQuery<Query, QuerySearchFollowUpOrdersArgs>(
    SEARCH_FOLLOW_UP_ORDERS,
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
      pollInterval: 10000,
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
      orderType: 'FOLLOW_UP',
    });
  };

  const handleNextClick = () => {
    const totalPages = data?.searchFollowUpOrders.pageInfo.totalPages ?? 0;

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

  const handleOrderClick = (order: FollowUpOrder) => {
    if (order.status === 'ORDERED') {
      bottomSheetDispatch({
        type: 'show',
        snapPoint: 0,
        children: (
          <CompleteFollowUpOrderForm
            selectedOrder={order}
            onSuccess={() => {
              refetch();
            }}
            onCancel={() => bottomSheetDispatch({ type: 'hide' })}
            onRefresh={() => null}
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
  };

  return (
    <div className="h-screen">
      <OrdersToolbar
        filter={filter}
        onClear={handleClear}
        onChange={setFilter}
      />

      <FollowUpOrdersTable
        totalCount={data?.searchFollowUpOrders.totalCount ?? 0}
        orders={data?.searchFollowUpOrders.edges.map((e) => e.node) ?? []}
        onNext={handleNextClick}
        onPrev={handlePrevClick}
        onItemClick={handleOrderClick}
      />
    </div>
  );
};
