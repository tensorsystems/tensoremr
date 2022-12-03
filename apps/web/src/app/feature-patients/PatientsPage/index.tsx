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
import {
  Page,
  PaginationInput,
  Patient,
  PatientConnection,
  Query,
  QueryPatientsArgs,
} from '@tensoremr/models';
import { getPatientAge } from '@tensoremr/util';
import { gql, useQuery } from '@apollo/client';
import { TablePagination } from '@tensoremr/ui-components';
import { format, parseISO } from 'date-fns';
import { useHistory } from 'react-router-dom';

const PATIENTS = gql`
  query Patients($page: PaginationInput!) {
    patients(page: $page) {
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
          dateOfBirth
          gender
          createdAt
        }
      }
    }
  }
`;

export const PatientsPage: React.FC<{
  onAddPage: (page: Page) => void;
}> = ({ onAddPage }) => {
  const history = useHistory();
  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: 20,
  });

  const { data, refetch } = useQuery<Query, QueryPatientsArgs>(PATIENTS, {
    variables: {
      page: paginationInput,
    },
  });

  useEffect(() => {
    refetch();
  }, [paginationInput]);

  const handleNextClick = () => {
    const totalPages = data?.patients.pageInfo.totalPages ?? 0;

    if (totalPages > paginationInput.page) {
      setPaginationInput({
        ...paginationInput,
        page: paginationInput.page + 1,
      });
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    const page: Page = {
      title: `Patient - ${patient.firstName} ${patient.lastName}`,
      cancellable: true,
      route: `/patients/${patient.id}/appointments`,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    };

    onAddPage(page);
    history.replace(`/patients/${patient.id}/appointments`);
  };

  const handlePrevClick = () => {
    if (paginationInput.page > 1) {
      setPaginationInput({
        ...paginationInput,
        page: paginationInput.page - 1,
      });
    }
  };

  return (
    <div className="h-full">
      <PatientsTable
        data={data?.patients}
        onNext={handleNextClick}
        onPrev={handlePrevClick}
        onSelect={handlePatientSelect}
      />
    </div>
  );
};

const Toolbar: React.FC = () => {
  return (
    <div className="flex bg-white w-full h-16 p-4 mt-4 rounded-md shadow-md justify-between items-center">
      <div className="flex items-center text-gray-700"></div>
      <div>
        <div className="relative mx-auto text-gray-600">
          <input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="search"
            name="searchTerm"
            placeholder="Search"
            value={''}
            onChange={(evt) => {
              console.log('Test');
            }}
          />
          <button type="submit" className="absolute right-0 top-0 mt-3 mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-4 w-4"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

interface PatientsTableProps {
  data: PatientConnection | undefined;
  onNext: () => void;
  onPrev: () => void;
  onSelect: (patient: Patient) => void;
}

const PatientsTable: React.FC<PatientsTableProps> = ({
  data,
  onNext,
  onPrev,
  onSelect,
}) => {
  return (
    <div className="flex flex-col mt-4">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Phone Number
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Age
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Gender
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Registration
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.edges.map((e) => (
                  <tr
                    key={e?.node.id}
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => e?.node && onSelect(e?.node)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="h-10 w-10 text-gray-600"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {`${e?.node?.firstName} ${e?.node?.lastName}`}
                          </div>
                          <div className="text-sm text-gray-500">
                            {e?.node?.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {e?.node?.phoneNo}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {getPatientAge(e?.node.dateOfBirth)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {e?.node?.gender}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {format(parseISO(e?.node?.createdAt), 'LLL d, y')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <TablePagination
              totalCount={data?.totalCount ?? 0}
              onNext={onNext}
              onPrevious={onPrev}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
