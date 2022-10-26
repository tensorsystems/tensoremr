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
import {  PaginationInput } from '@tensoremr/models';
import { useHistory, useLocation } from 'react-router-dom';
import PocketBaseClient from '../../pocketbase-client';
import { Record } from 'pocketbase';
import { getPatientAge } from '@tensoremr/util';
import cn from 'classnames';
import { TablePagination } from '@tensoremr/ui-components';

function useRouterQuery() {
  return new URLSearchParams(useLocation().search);
}

interface Filter {
  searchTerm?: string;
}

export const PatientsPage: React.FC = () => {
  const query = useRouterQuery();
  const history = useHistory();

  const [patients, setPatients] = useState<{
    totalPages: number;
    totalItems: number;
    page: number;
    perPage: number;
    records: Record[];
  }>();

  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: 2,
  });

  const [filter, setFilter] = useState<Filter>({ searchTerm: '' });

  useEffect(() => {
    fetchPatients(
      paginationInput.page,
      paginationInput.size,
      filter.searchTerm
    );
  }, [paginationInput, filter.searchTerm]);

  const fetchPatients = async (
    page: number,
    size: number,
    searchTerm: string | undefined
  ) => {
    try {
      const result = await PocketBaseClient.records.getList(
        'patients',
        page,
        size,
        searchTerm
          ? { filter: `firstName~"${searchTerm}" || lastName~"${searchTerm}"` }
          : undefined
      );
      setPatients({
        records: result.items,
        totalPages: result.totalPages,
        totalItems: result.totalItems,
        page: result.page,
        perPage: result.perPage,
      });
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleNextClick = () => {
    const totalPages = patients?.totalPages ?? 0;

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

  const onSelectPatient = (e: Record) => {
    history.push(`/patients/${e.id}/appointments`);
  };

  return (
    <div className="h-screen">
      <Toolbar filter={filter} onChange={setFilter} />

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
                      Patient
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
                      Gender
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
                      Phone Number
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
                  {patients?.records.map((e) => (
                    <tr
                      key={e?.id}
                      className="hover:bg-gray-100 cursor-pointer"
                      onClick={() => onSelectPatient(e)}
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
                              {`${e?.firstName} ${e?.lastName}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              {e?.mrn}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {e?.phoneNumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {e?.gender}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {getPatientAge(e?.dateOfBirth)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {e?.phoneNumber}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                            {
                              'bg-yellow-100 text-yellow-800':
                                e?.status === 'inactive',
                            },
                            {
                              'bg-green-100 text-green-800':
                                e?.status === 'active',
                            }
                          )}
                        >
                          {e?.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <TablePagination
                totalCount={patients?.totalItems ?? 0}
                onNext={handleNextClick}
                onPrevious={handlePrevClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ToolbarProps {
  filter: Filter | undefined;
  onChange: (input: Filter) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ filter, onChange }) => {
  return (
    <div className="flex bg-white w-full h-16 p-4 mt-4 rounded-md shadow-md justify-between items-center">
      <div>
        <div className="relative mx-auto text-gray-600">
          <input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="search"
            name="searchTerm"
            placeholder="Search"
            value={filter?.searchTerm ?? ''}
            onChange={(evt) => {
              const value = evt.target.value;

              const newValue = {
                ...filter,
                [evt.target.name]: value.length === 0 ? null : value,
              };

              onChange(newValue);
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
