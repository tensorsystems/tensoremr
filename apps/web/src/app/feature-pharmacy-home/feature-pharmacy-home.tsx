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
import { PrescriptionOrdersToolbar } from '@tensoremr/ui-components';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import { CompleteMedicalPrescriptionOrder } from './CompleteMedicalPrescriptionOrder';
import { PharmacyOrdersList } from './PharmacyOrdersList';
import {
  MedicalPrescriptionOrder,
  PaginationInput,
  Query,
  QuerySearchMedicationPrescriptionOrdersArgs,
} from '@tensoremr/models';

const SEARCH_MEDICAL_PRESCRIPTION_ORDERS = gql`
  query SearchMedicationPrescriptionOrders(
    $page: PaginationInput!
    $filter: PrescriptionOrdersFilter
    $prescribedDate: Time
    $searchTerm: String
  ) {
    searchMedicationPrescriptionOrders(
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
          pharmacyId
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
          medicalPrescriptions {
            id
            medication
            sig
            refill
            generic
            substitutionAllowed
            directionToPatient
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

export const PharmacyHome: React.FC = () => {
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
    QuerySearchMedicationPrescriptionOrdersArgs
  >(SEARCH_MEDICAL_PRESCRIPTION_ORDERS, {
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
      data?.searchMedicationPrescriptionOrders.pageInfo.totalPages ?? 0;

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

  const handleItemClick = (value: MedicalPrescriptionOrder) => {
    bottomSheetDispatch({
      type: 'show',
      snapPoint: 0,
      children: (
        <CompleteMedicalPrescriptionOrder
          item={value}
          onSuccess={() => {
            bottomSheetDispatch({ type: 'hide' });

            refetch();

            notifDispatch({
              type: 'show',
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

      <PharmacyOrdersList
        items={data?.searchMedicationPrescriptionOrders.edges.map(
          (e) => e?.node
        )}
        totalCount={data?.searchMedicationPrescriptionOrders.totalCount ?? 0}
        onClick={handleItemClick}
        onNextPage={handleNextClick}
        onPrevPage={handlePreviousClick}
      />
    </div>
  );
};
