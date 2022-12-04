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

import React from 'react';
import { Page } from '@tensoremr/models';

export const PatientsPage: React.FC<{
  onAddPage: (page: Page) => void;
}> = () => {
  return (
    <div className="h-screen">
      <Toolbar />
      <PatientsTable />
    </div>
  );
};

const Toolbar: React.FC = () => {
  return (
    <div className="flex bg-white w-full h-16 p-4 mt-4 rounded-md shadow-md justify-between items-center">
      <div className="flex items-center text-gray-700">
        <div className="relative mx-auto text-gray-600">
          <input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="search"
            name="searchTerm"
            placeholder="Search"
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

const PatientsTable: React.FC = () => {
  return (
    <div className="flex flex-col mt-4">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200"></table>
          </div>
        </div>
      </div>
    </div>
  );
};
