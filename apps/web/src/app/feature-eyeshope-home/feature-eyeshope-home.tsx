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
import React, { useEffect, useState } from 'react';
import { CompleteEyewearPrescriptionOrder } from './CompleteEyewearPrescriptionOrder';
import { EyewearShopOrdersList } from './EyeShopOrdersList';
import {
  EyewearPrescriptionOrder,
  PaginationInput,
  Query,
  QuerySearchEyewearPrescriptionOrdersArgs,
} from '@tensoremr/models';
import { PrescriptionOrdersToolbar } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';

const SEARCH_EYEWEAR_PRESCRIPTION_ORDERS = gql`
  query SearchEyewearPrescriptionOrders(
    $page: PaginationInput!
    $filter: PrescriptionOrdersFilter
    $prescribedDate: Time
    $searchTerm: String
  ) {
    searchEyewearPrescriptionOrders(
      page: $page
      filter: $filter
      prescribedDate: $prescribedDate
      searchTerm: $searchTerm
    ) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          eyewearShopId
          patientChartId
          firstName
          lastName
          phoneNo
          userName
          orderedById
          orderedBy {
            id
            firstName
            lastName
          }
          eyewearPrescriptions {
            id
            glass
            plastic
            singleVision
            photoChromatic
            polarized
            polarizedClip
            glareFree
            scratchResistant
            bifocal
            progressive
            twoSeparateGlasses
            highIndex
            tint
            blueCut
            prescribedDate
            history
            status
          }
          status
          createdAt
        }
      }
    }
  }
`;

export const EyeShopHome: React.FC = () => {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });

  const [filter, setFilter] = useState({
    date: new Date(),
    status: 'ORDERED',
    userId: 'all',
    searchTerm: '',
  });

  const { data, refetch } = useQuery<
    Query,
    QuerySearchEyewearPrescriptionOrdersArgs
  >(SEARCH_EYEWEAR_PRESCRIPTION_ORDERS, {
    variables: {
      page: paginationInput,
      filter: {
        status: filter.status === 'all' ? undefined : filter.status,
      },
      prescribedDate: filter.date,
      searchTerm: filter.searchTerm === '' ? undefined : filter.searchTerm,
    },
    pollInterval: 10000,
  });

  useEffect(() => {
    refetch();
  }, [paginationInput, filter]);

  const handleNextClick = () => {
    const totalPages =
      data?.searchEyewearPrescriptionOrders.pageInfo.totalPages ?? 0;

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

  const handleItemClick = (value: EyewearPrescriptionOrder) => {
    bottomSheetDispatch({
      type: 'show',
      snapPoint: 0,
      children: (
        <CompleteEyewearPrescriptionOrder
          item={value}
          onSuccess={() => {
            bottomSheetDispatch({ type: 'hide' });

            refetch();

            notifDispatch({
              type: 'showNotification',
              notifTitle: 'Success',
              notifSubTitle: 'Prescription marked completed',
              variant: 'success',
            });
          }}
          onCancel={() => bottomSheetDispatch({ type: 'hide' })}
        />
      ),
    });
  };

  return (
    <div className="h-screen mb-20">
      <PrescriptionOrdersToolbar
        date={filter.date}
        onDateChange={(value) => {
          setFilter({
            ...filter,
            date: value,
          });
        }}
        status={filter.status}
        onStatusChange={(value) => {
          setFilter({
            ...filter,
            status: value,
          });
        }}
        searchTerm={filter.searchTerm}
        onSearchTermChange={(value) => {
          setFilter({
            ...filter,
            searchTerm: value,
          });
        }}
        onClear={() => {
          setFilter({
            date: new Date(),
            status: 'Ordered',
            userId: 'all',
            searchTerm: '',
          });
        }}
      />

      <EyewearShopOrdersList
        items={data?.searchEyewearPrescriptionOrders.edges.map((e) => e?.node)}
        totalCount={data?.searchEyewearPrescriptionOrders.totalCount ?? 0}
        onClick={handleItemClick}
        onNextPage={handleNextClick}
        onPrevPage={handlePreviousClick}
      />
    </div>
  );
};
