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
import { PlusIcon } from '@heroicons/react/solid';
import { AddScheduleForm } from './AddScheduleForm';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';

export const ScheduleAdminPage: React.FC = () => {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  scope="col"
                  colSpan={2}
                  className="px-6 py-3 bg-teal-700 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                >
                  <div className="flex items-center space-x-2">
                    <p className="material-icons">schedule</p>
                    <p>Schedules</p>
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-teal-700 text-gray-100 text-right"
                >
                  <button
                    onClick={() => {
                      bottomSheetDispatch({
                        type: 'show',
                        snapPoint: 0,
                        children: (
                          <AddScheduleForm
                            onSuccess={() => {
                              bottomSheetDispatch({ type: 'hide' });

                              notifDispatch({
                                type: 'showNotification',
                                notifTitle: 'Success',
                                notifSubTitle: 'Schedule created succesfully',
                                variant: 'success',
                              });
                            }}
                            onCancel={() =>
                              bottomSheetDispatch({ type: 'hide' })
                            }
                          />
                        ),
                      });
                    }}
                    className="uppercase bg-teal-800 hover:bg-teal-600 py-1 px-2 rounded-md text-sm"
                  >
                    <div className="flex items-center space-x-1">
                      <div>
                        <PlusIcon className="h-6 w-6" />
                      </div>
                      <div className="font-semibold">Add</div>
                    </div>
                  </button>
                </th>
              </tr>

              <tr className="bg-gray-50">
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Active
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Value
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Description
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  );
};
