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
import { gql, useMutation, useQuery } from '@apollo/client';
import { TablePagination } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import {
  ModalityEdge,
  MutationUpdateModalityArgs,
  PaginationInput,
  Query,
  QueryModalitiesArgs,
} from '@tensoremr/models';

const MODALITIES = gql`
  query Modalities($page: PaginationInput!) {
    modalities(page: $page) {
      totalCount
      edges {
        node {
          id
          value
          description
          iconFileName
          active
        }
      }
      pageInfo {
        totalPages
      }
    }
  }
`;

const UPDATE_MODALITY = gql`
  mutation UpdateModality($input: ModalityUpdateInput!) {
    updateModality(input: $input) {
      id
    }
  }
`;

const ROWS_PER_PAGE = 20;

export const ModalityAdminPage: React.FC = () => {
  const notifDispatch = useNotificationDispatch();

  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: ROWS_PER_PAGE,
  });

  const { data, refetch } = useQuery<Query, QueryModalitiesArgs>(MODALITIES, {
    variables: {
      page: paginationInput,
    },
  });

  useEffect(() => {
    refetch();
  }, [paginationInput]);

  const handleNextClick = () => {
    const totalPages = data?.modalities?.pageInfo.totalPages ?? 0;

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

  const [updateModality, { error }] = useMutation<
    any,
    MutationUpdateModalityArgs
  >(UPDATE_MODALITY, {
    onCompleted(data) {
      //onSuccess();
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

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  scope="col"
                  colSpan={3}
                  className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                >
                  Modalities
                </th>
              </tr>

              <tr className="bg-gray-50">
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Active
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Value
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Description
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.modalities?.edges.map((value: ModalityEdge) => (
                <tr
                  key={value?.node.id}
                  className="hover:bg-gray-100 cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <input
                      type="checkbox"
                      defaultChecked={value.node.active}
                      onChange={(evt) => {
                        updateModality({
                          variables: {
                            input: {
                              id: value.node.id.toString(),
                              active: evt.target.checked,
                            },
                          },
                        });
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {value.node.value}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {value.node.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <TablePagination
            totalCount={data?.modalities?.totalCount ?? 0}
            onNext={handleNextClick}
            onPrevious={handlePreviousClick}
          />
        </div>
      </div>
    </div>
  );
};
