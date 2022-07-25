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

import { format, parseISO } from 'date-fns';
import React from 'react';
import classnames from 'classnames';
import {
  DiagnosticProcedureOrder,
  DiagnosticProcedureOrderStatus,
} from '@tensoremr/models';
import { TablePagination } from '@tensoremr/ui-components';

interface Props {
  orders: Array<DiagnosticProcedureOrder>;
  totalCount: number;
  onNext: () => void;
  onPrev: () => void;
  onItemClick: (order: DiagnosticProcedureOrder) => void;
}

export const DiagnosticOrdersTable: React.FC<Props> = ({
  orders,
  onItemClick,
  totalCount,
  onNext,
  onPrev,
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
                    Patient
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ordered By
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Items
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
                {orders?.map((e) => {
                  const payments = e.diagnosticProcedures
                    .map((p) => p.payments)
                    .flat();

                  return (
                    <tr
                      key={e?.id}
                      className="hover:bg-gray-100 cursor-pointer"
                      onClick={() => e && onItemClick(e)}
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
                              {`${e.firstName} ${e.lastName}`}
                            </div>
                            <div className="text-sm text-gray-500">
                              {e.patientId}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {`${
                            e?.orderedBy?.userTypes.some(
                              (t) => t?.title === 'Physician'
                            )
                              ? 'Dr. '
                              : ''
                          } ${e.orderedBy?.firstName} ${e.orderedBy?.lastName}`}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(parseISO(e.createdAt), 'MMM d, y')}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {payments
                            .map(
                              (p) => `${p?.billing.item} (${p?.billing.code})`
                            )
                            .join(', ')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {`ETB ${payments.reduce(
                            (a, c) => a + (c?.billing ? c?.billing.price : 0),
                            0
                          )}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-teal-700 tracking-wide font-semibold">
                        <span
                          className={classnames(
                            'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                            {
                              'bg-yellow-100 text-yellow-800':
                                e?.status ===
                                  DiagnosticProcedureOrderStatus.Ordered ||
                                payments.some(
                                  (e) =>
                                    e.status === 'NOTPAID' ||
                                    e.status === 'PAYMENT_WAIVER_REQUESTED'
                                ),
                            },
                            {
                              'bg-green-100 text-green-800': payments.every(
                                (e) => e.status === 'PAID'
                              ),
                            }
                          )}
                        >
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <TablePagination
              totalCount={totalCount}
              onNext={onNext}
              onPrevious={onPrev}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
