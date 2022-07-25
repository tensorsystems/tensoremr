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
import { format, parseISO } from 'date-fns';
import { MedicalPrescription } from '@tensoremr/models';
import { Menu } from '@headlessui/react';
import { PencilIcon } from '@heroicons/react/outline';
import { MenuComponent } from './MenuComponent';

interface Props {
  items: Array<any> | null | undefined;
  onUpdate?: (item: MedicalPrescription, value: string) => void;
  onEdit?: (item: MedicalPrescription) => void;
  onPrint: (item: MedicalPrescription) => void;
  readOnly?: boolean;
  locked: boolean;
}

export const MedicationTable: React.FC<Props> = ({
  items,
  onUpdate,
  onEdit,
  onPrint,
  readOnly = false,
  locked,
}) => {
  return (
    <table className="table-auto divide-y divide-gray-200 mt-4 w-full shadow-lg rounded-lg">
      <thead className="bg-teal-700">
        <tr>
          <th
            scope="col"
            className="px-2 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
          >
            Medication
          </th>
          {readOnly && (
            <th
              scope="col"
              className="px-2 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
            >
              Sig
            </th>
          )}
          <th
            scope="col"
            className="px-2 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
          >
            Date
          </th>
          <th
            scope="col"
            className="px-2 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
          >
            Refill
          </th>
          <th
            scope="col"
            className="px-2 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
          >
            Status
          </th>
          {!readOnly && (
            <th
              scope="col"
              className="px-2 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
            >
              Action
            </th>
          )}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {items?.length === 0 && (
          <tr>
            <td colSpan={5} rowSpan={5}>
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
          <tr key={e?.id}>
            <td className="px-2 py-4 text-sm text-gray-900">{e?.medication}</td>
            {readOnly && (
              <td className="px-2 py-4 text-sm text-gray-900">{e?.sig}</td>
            )}
            <td className="px-2 py-4 text-sm text-gray-900">
              {e?.prescribedDate &&
                format(parseISO(e?.prescribedDate), 'MMM d, y')}
            </td>
            <td className="px-2 py-4 text-sm text-gray-900">{e?.refill}</td>
            {readOnly && (
              <td className="px-2 py-4 text-sm text-gray-900">{e?.status}</td>
            )}
            {!readOnly && (
              <td className="px-2 py-4 text-sm text-gray-900">
                <select
                  value={e?.status}
                  disabled={locked}
                  onChange={(evt) => {
                    if (e?.id !== undefined && onUpdate) {
                      onUpdate(e, evt.target.value);
                    }
                  }}
                  name="status"
                  className="text-sm border-none"
                >
                  <option value={'Active'}>Active</option>
                  <option value={'Inactive'}>Inactive</option>
                </select>
              </td>
            )}
            {!readOnly && (
              <td className="px-2 py-4 text-sm text-gray-900">
                <MenuComponent
                  title={'Options'}
                  menus={
                    <div className="px-1 py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? 'bg-teal-500 text-white'
                                : 'text-gray-900'
                            } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            onClick={() => e && onEdit && onEdit(e)}
                            disabled={locked}
                          >
                            <PencilIcon
                              className="w-5 h-5 mr-2 text-teal-700"
                              aria-hidden="true"
                            />
                            Edit
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  }
                />
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
