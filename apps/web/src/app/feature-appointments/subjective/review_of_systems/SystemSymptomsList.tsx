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

import React, { useState } from 'react';
import {
  BookmarkIcon as BookmarkSolidIcon,
  ChevronRightIcon,
} from '@heroicons/react/solid';
import {
  BookmarkIcon as BookmarkOutlineIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
} from '@heroicons/react/outline';
import { gql, useQuery } from '@apollo/client';
import {
  PaginationInput,
  Query,
  QuerySystemSymptomsArgs,
  SystemSymptom,
} from '@tensoremr/models';
import _ from 'lodash';
import { useEffect } from 'react';
import classnames from 'classnames';

const SYSTEM_SYMPTOMS = gql`
  query SystemSymptoms($page: PaginationInput!, $searchTerm: String) {
    systemSymptoms(page: $page, searchTerm: $searchTerm) {
      totalCount
      edges {
        node {
          id
          title
          systemId
          system {
            id
            title
          }
        }
      }
      pageInfo {
        totalPages
      }
    }
  }
`;

export const SystemSymptomsList: React.FC<{
  locked: boolean;
  onItemClick: (systemSymptomId: string) => void;
}> = ({ locked, onItemClick }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showFavorites, setShowFavorites] = useState<boolean>(true);
  const [systemSymptoms, setSystemSymptoms] = useState<Array<any>>([]);
  const [systemsListExpand, setSystemsListExpand] = useState<Array<any>>([]);

  const [paginationInput, setPaginationInput] = useState<PaginationInput>({
    page: 1,
    size: 200,
  });

  const { data, refetch } = useQuery<Query, QuerySystemSymptomsArgs>(
    SYSTEM_SYMPTOMS,
    {
      variables: {
        page: paginationInput,
        searchTerm,
      },
    }
  );

  const handleItemClick = (systemSymptomId: string) => {
    if (systemSymptomId !== undefined) {
      onItemClick(systemSymptomId);
    }
  };

  useEffect(() => {
    if (data?.systemSymptoms) {
      const result = data?.systemSymptoms.edges.map((e) => e.node);
      const s = Object.entries(_.groupBy(result, 'system.title'));
      setSystemSymptoms(s);

      const listExpand = s
        .map((e) => e[0])
        .map((e) => ({ system: e, expand: false }));

      setSystemsListExpand(listExpand);
    }
  }, [data?.systemSymptoms]);

  useEffect(() => {
    refetch();
  }, [searchTerm]);

  const handleExpandChange = (systemTitle: string) => {
    const item = systemsListExpand.find((e) => e.system === systemTitle);
    const index = systemsListExpand.findIndex((e) => e.system === systemTitle);

    const result = [
      ...systemsListExpand.slice(0, index),
      {
        system: item.system,
        expand: !item.expand,
      },
      ...systemsListExpand.slice(index + 1),
    ];

    setSystemsListExpand(result);
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
              <div className="flex justify-between items-center">
                <p>System Symptoms</p>
                <div>
                  <button type="button">
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
            <th colSpan={2}>
              <div className="flex space-x-1">
                <input
                  type="search"
                  name="search"
                  placeholder="Search"
                  value={searchTerm}
                  className="w-full sm:text-md border-none outline-none focus:outline-none focus:ring-0"
                  onChange={(evt) => setSearchTerm(evt.target.value)}
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200 p-1">
          {systemSymptoms.map((systemSymptom, index) => {
            const items: Array<any> = [
              <tr
                key={systemSymptom[0]}
                className="hover:bg-gray-100 bg-gray-100 border-t"
              >
                <td
                  className="px-6 py-2 uppercase text-sm text-gray-700 font-semibold"
                  colSpan={2}
                >
                  {systemSymptom[0]}
                </td>
              </tr>,
            ];

            let symptoms: Array<SystemSymptom> = [];

            const expand = systemsListExpand.find(
              (e) => e.system === systemSymptom[0]
            ).expand;

            if (expand) {
              symptoms = systemSymptom[1];
            } else {
              symptoms = systemSymptom[1].slice(0, 5);
            }

            symptoms.forEach((symptom: SystemSymptom) => {
              items.push(
                <tr
                  key={symptom.id}
                  className="hover:bg-gray-100 border-t cursor-pointer"
                  onClick={() => !locked && handleItemClick(symptom.id)}
                >
                  <td className="px-6 py-3 text-sm text-gray-900">
                    {symptom.title}
                  </td>
                  <td className="p-2 cursor-pointer">
                    <ChevronRightIcon className="h-6 w-6 text-gray-500" />
                  </td>
                </tr>
              );
            });

            if (systemSymptom[1].length > 5) {
              items.push(
                <tr
                  key={systemSymptom[0] + '-view-all'}
                  className={classnames('bg-white border-t cursor-pointer', {
                    'hover:bg-blue-50': !expand,
                    'hover:bg-yellow-50': expand,
                  })}
                  onClick={() => handleExpandChange(systemSymptom[0])}
                >
                  <td
                    className={classnames(
                      'px-6 py-2 text-sm flex space-x-2 items-center',
                      {
                        'text-blue-600': !expand,
                        'text-yellow-600': expand,
                      }
                    )}
                  >
                    {expand ? (
                      <ChevronDoubleUpIcon className="h-5 w-5" />
                    ) : (
                      <ChevronDoubleDownIcon className="h-5 w-5" />
                    )}
                    {expand ? <p>Collapse</p> : <p>View all</p>}
                  </td>
                  <td></td>
                </tr>
              );
            }

            return items;
          })}
        </tbody>
      </table>
    </div>
  );
};
