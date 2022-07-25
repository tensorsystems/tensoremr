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
import { TablePagination } from '@tensoremr/ui-components';
import {
  DiagnosticProcedureType,
  PaginationInput,
  Query,
  QueryDiagnosticProcedureTypesArgs,
} from '@tensoremr/models';

const DIAGNOSTIC_PROCEDURE_TYPES = gql`
  query DiagnosticProcedureTypes($page: PaginationInput!, $searchTerm: String) {
    diagnosticProcedureTypes(page: $page, searchTerm: $searchTerm) {
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
  }
`;

export const DiagnosticProcedureTypes: React.FC<{
  locked: boolean;
  onItemClick: (item: DiagnosticProcedureType) => void;
}> = ({ locked, onItemClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: 20,
  });

  const { data, refetch } = useQuery<Query, QueryDiagnosticProcedureTypesArgs>(
    DIAGNOSTIC_PROCEDURE_TYPES,
    {
      variables: { page: paginationInput, searchTerm },
    }
  );

  useEffect(() => {
    refetch();
  }, [paginationInput, searchTerm]);

  const handleNextClick = () => {
    const totalPages = data?.diagnosticProcedureTypes.pageInfo.totalPages ?? 0;

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

  const handleItemClick = (item: DiagnosticProcedureType | undefined) => {
    if (item !== undefined) {
      onItemClick(item);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg shadow-xl">
      <table className="w-full">
        <thead>
          <tr>
            <th
              scope="col"
              colSpan={2}
              className="px-4 py-2 bg-teal-700 text-left text-xs text-gray-50 uppercase tracking-wider"
            >
              Diagnostic procedures list
            </th>
          </tr>
          <tr>
            <th colSpan={2}>
              <input
                type="search"
                name="search"
                placeholder="Search"
                className="w-full border-none"
                onChange={(evt) => setSearchTerm(evt.target.value.trim())}
              />
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 p-1">
          {data?.diagnosticProcedureTypes.edges.map((e) => (
            <tr
              key={e?.node.id}
              onClick={() => !locked && handleItemClick(e?.node)}
              className="hover:bg-gray-100 border-t cursor-pointer"
            >
              <td className="px-6 py-5 text-sm text-gray-900">
                {e?.node.title}
              </td>
              <td className="p-2">
                <span className="material-icons">keyboard_arrow_right</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <TablePagination
        totalCount={data?.diagnosticProcedureTypes.totalCount ?? 0}
        onNext={handleNextClick}
        onPrevious={handlePreviousClick}
      />
    </div>
  );
};
