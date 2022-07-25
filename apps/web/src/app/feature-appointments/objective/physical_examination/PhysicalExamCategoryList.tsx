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

import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Query, QueryExamCategoriesArgs } from '@tensoremr/models';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/solid';
import { BookmarkIcon as BookmarkOutlineIcon } from '@heroicons/react/outline';

const EXAM_CATEGORIES = gql`
  query ExamCategories($page: PaginationInput!) {
    examCategories(page: $page) {
      totalCount
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        totalPages
      }
    }
  }
`;

export const PhysicalExamCategoryList: React.FC<{
  locked: boolean;
  onItemClick: (systemSymptomId: string) => void;
}> = ({ locked, onItemClick }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFavorites, setShowFavorites] = useState<boolean>(true);

  const { data } = useQuery<Query, QueryExamCategoriesArgs>(EXAM_CATEGORIES, {
    variables: {
      page: { page: 1, size: 200 },
    },
  });

  const handleItemClick = (examCategoryId: string) => {
    if (examCategoryId !== undefined) {
      onItemClick(examCategoryId);
    }
  };

  return (
    <div className="overflow-x-scroll rounded-lg shadow-xl">
      <table className="w-full">
        <thead>
          <tr>
            <th
              scope="col"
              colSpan={4}
              className="px-4 py-2 bg-teal-700 text-left text-xs text-gray-50 uppercase tracking-wider"
            >
              <div className="flex justify-between items-center">
                <p>Exam Category</p>
                <div>
                  <button
                    type="button"
                    onClick={() => setShowFavorites(!showFavorites)}
                  >
                    {showFavorites ? (
                      <BookmarkSolidIcon className="h-5 w-5 text-white" />
                    ) : (
                      <BookmarkOutlineIcon className="h-5 w-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </th>
          </tr>
          <tr>
            <th colSpan={3}>
              <input
                type="search"
                name="search"
                placeholder="Search"
                className="w-full sm:text-md border-none"
                onChange={(evt) => setSearchTerm(evt.target.value.trim())}
              />
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 p-2">
          {data?.examCategories.edges.map((e) => (
            <tr
              key={e?.node.id}
              className="hover:bg-gray-100 border-t cursor-pointer"
              onClick={() =>
                !locked && e?.node.id && handleItemClick(e?.node.id)
              }
            >
              <td className="pl-4 pt-1">
                <span className="material-icons text-yellow-600">
                  add_circle
                </span>
              </td>
              <td className="pl-4 px-4 py-4 text-sm font-light text-gray-900">
                {e?.node.title}
              </td>

              <td className="px-3">
                <span className="material-icons text-teal-700 transform hover:scale-110">
                  keyboard_arrow_right
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
