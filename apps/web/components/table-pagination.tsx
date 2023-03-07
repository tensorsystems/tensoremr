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

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import React from "react";

interface Props {
  color?: string;
  totalCount: number;
  onNext: () => void;
  onPrevious: () => void;
}

export const TablePagination: React.FC<Props> = ({
  color,
  totalCount,
  onNext,
  onPrevious,
}) => {
  const c = color ? color : "bg-white";
  return (
    <div
      className={`px-4 py-2 flex items-center justify-between border-t border-gray-200 rounded-md rounded-t-none ${c}`}
    >
      <div className="flex-1 flex justify-between sm:hidden">
        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500">
          Previous
        </button>
        <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:text-gray-500">
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>{`${totalCount} results`}</div>
        <div>
          <nav
            className=" inline-flex shadow-sm -space-x-px"
            aria-label="Pagination"
          >
            <button
              className="inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              onClick={(evt) => {
                onPrevious();
              }}
            >
              <span className="sr-only">Previous</span>

              <ChevronLeftIcon className="h-5 w-5" />
            </button>

            <button
              className="inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              onClick={(evt) => {
                onNext();
              }}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
