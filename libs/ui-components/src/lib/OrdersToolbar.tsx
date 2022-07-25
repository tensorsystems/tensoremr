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
import { format } from 'date-fns';
import React from 'react';
import {
  OrderFilterInput,
  Query,
  QueryGetByUserTypeTitleArgs,
} from '@tensoremr/models';

const GET_PROVIDERS = gql`
  query Providers($input: String!) {
    getByUserTypeTitle(input: $input) {
      id
      firstName
      lastName
    }
  }
`;

interface OrdersToolbarInterface {
  filter: OrderFilterInput | undefined;
  onChange: (filter: OrderFilterInput) => void;
  onClear: () => void;
}

export const OrdersToolbar: React.FC<OrdersToolbarInterface> = ({
  filter,
  onChange,
  onClear,
}) => {
  const { data } = useQuery<Query, QueryGetByUserTypeTitleArgs>(GET_PROVIDERS, {
    variables: {
      input: 'Physician',
    },
  });

  const handleChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    const value = evt.target.value;

    const newValue = {
      ...filter,
      [evt.target.name]: value === 'all' ? undefined : value,
    };

    onChange(newValue);
  };

  const handleTextFieldChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;

    const newValue = {
      ...filter,
      [evt.target.name]: value === 'all' ? undefined : value,
    };

    onChange(newValue);
  };

  return (
    <div className="flex bg-white w-full h-16 p-4 rounded-md shadow-md justify-between items-center">
      <div className="flex items-center text-gray-700">
        <input
          type="date"
          name="date"
          className="border-l-1 border-gray-100 rounded-md"
          value={format(filter?.date, 'yyyy-MM-dd')}
          onChange={(evt) => {
            if (filter !== undefined) {
              const value = evt.target.value;
              const newValue: OrderFilterInput = {
                ...filter,
                date: new Date(value),
              };

              onChange(newValue);
            }
          }}
        />

        <select
          name="userId"
          className="ml-6 border-l-1 border-gray-100 rounded-md"
          value={filter?.userId ?? 'all'}
          onChange={handleChange}
        >
          <option value={'all'}>All Doctors</option>
          {data?.getByUserTypeTitle.map((e) => (
            <option
              key={e?.id}
              value={e?.id}
            >{`Dr. ${e?.firstName} ${e?.lastName}`}</option>
          ))}
        </select>

        <select
          name="status"
          value={filter?.status ?? 'all'}
          className="ml-6 border-l-1 border-gray-100 rounded-md"
          onChange={handleChange}
        >
          <option value="all">All statuses</option>
          <option value="ORDERED">Ordered</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <div className="ml-6 border-l-2 p-1 pl-6">
          <button
            onClick={onClear}
            className="uppercase text-white tracking-wider text-sm rounded-md bg-teal-600 px-6 py-2"
          >
            Clear
          </button>
        </div>
      </div>
      <div>
        <div className="relative mx-auto text-gray-600">
          <input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="search"
            name="searchTerm"
            placeholder="Search"
            onChange={handleTextFieldChange}
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
