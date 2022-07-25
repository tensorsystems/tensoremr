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
import { Maybe, AllergyEdge, Allergy } from '@tensoremr/models';

interface Props {
  items: Maybe<AllergyEdge>[] | undefined;
  onEdit?: (item: Allergy) => void;
  readOnly?: boolean;
  locked: boolean;
}

export const AllergyTable: React.FC<Props> = ({
  items,
  onEdit,
  readOnly,
  locked,
}) => {
  return (
    <table className="table-auto divide-y divide-gray-200 mt-4 w-full shadow-lg rounded-lg">
      <thead className="bg-teal-700">
        <tr>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
          >
            Title
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
          >
            Occurrence
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
          >
            Severity
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
          >
            Reaction
          </th>
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
          >
            Outcome
          </th>
          {!readOnly && (
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
            >
              Action
            </th>
          )}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {items?.length === 0 && (
          <tr>
            <td colSpan={6} rowSpan={5}>
              <div className="bg-gray-100 flex h-32 shadow-inner">
                <div className="m-auto flex space-x-1 text-gray-500">
                  <div className="material-icons">inbox</div>
                  <p className="text-center">Nothing here yet</p>
                </div>
              </div>
            </td>
          </tr>
        )}

        {items?.map((e) => (
          <tr key={e?.node.id}>
            <td className="px-6 py-4 text-sm text-gray-900">{e?.node.title}</td>
            <td className="px-6 py-4 text-sm text-gray-900">
              {e?.node.issueOccurrence}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">
              {e?.node.issueSeverity}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">
              {e?.node.issueReaction}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900">
              {e?.node.issueOutcome}
            </td>
            {!readOnly && (
              <td className="px-6 py-4 text-sm text-gray-900">
                <button
                  className="text-indigo-600 hover:text-indigo-900"
                  disabled={locked}
                  onClick={() => {
                    if (e?.node && onEdit) {
                      onEdit(e?.node);
                    }
                  }}
                >
                  Edit
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
