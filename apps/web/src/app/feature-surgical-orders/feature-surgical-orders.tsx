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
  OrdersToolbar,
  CompleteSurgicalOrderForm,
} from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import {
  OrderFilterInput,
  PaginationInput,
  Query,
  QuerySearchSurgicalOrdersArgs,
  SurgicalOrder,
} from '@tensoremr/models';
import { useLocation } from 'react-router-dom';
import { SurgicalOrdersTable } from './SurgicalOrdersTable';

const SEARCH_SURGICAL_ORDERS = gql`
  query SearchSurgicalOrders(
    $page: PaginationInput!
    $filter: SurgicalOrderFilter
    $date: Time
    $searchTerm: String
  ) {
    searchSurgicalOrders(
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
          surgicalProcedures {
            id
            receptionNote
            surgicalProcedureType {
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

export const SurgicalOrdersPage: React.FC = () => {
  const query = useRouterQuery();
  const queryUserId = query.get('userId');
  const queryStatus = query.get('status');

  const notifDispatch = useNotificationDispatch();
  const bottomSheetDispatch = useBottomSheetDispatch();

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

  const { data, refetch } = useQuery<Query, QuerySearchSurgicalOrdersArgs>(
    SEARCH_SURGICAL_ORDERS,
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
      orderType: 'SURGICAL_PROCEDURE',
    });
  };

  const handleNextClick = () => {
    const totalPages = data?.searchSurgicalOrders.pageInfo.totalPages ?? 0;

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

  const handleOrderClick = (order: SurgicalOrder) => {
    bottomSheetDispatch({
      type: 'show',
      snapPoint: 0,
      children: (
        <CompleteSurgicalOrderForm
          selectedOrder={order}
          onSuccess={() => {
            refetch();
          }}
          onCancel={() => bottomSheetDispatch({ type: 'hide' })}
          onRefresh={() => null}
          onFailure={(message) => {
            notifDispatch({
              type: 'show',
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
    <div className="h-screen">
      <OrdersToolbar
        filter={filter}
        onClear={handleClear}
        onChange={setFilter}
      />

      <SurgicalOrdersTable
        totalCount={data?.searchSurgicalOrders.totalCount ?? 0}
        orders={data?.searchSurgicalOrders.edges.map((e) => e.node) ?? []}
        onNext={handleNextClick}
        onPrev={handlePrevClick}
        onItemClick={handleOrderClick}
      />
    </div>
  );
};
