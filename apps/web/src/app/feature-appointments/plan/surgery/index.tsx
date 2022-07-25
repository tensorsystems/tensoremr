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

import { gql, useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import classnames from 'classnames';
import { SurgicalProcedureTypes } from './SurgicalProcedureTypes';
import { format, parseISO } from 'date-fns';
import { OrderSurgicalProcedureForm } from './OrderSurgicalProcedureForm';
import {
  PatientChart,
  Query,
  QuerySurgicalOrderArgs,
  SurgeryStatus,
  SurgicalProcedureType,
} from '@tensoremr/models';

const GET_PATIENT_SURGICAL_PROCEDURES = gql`
  query SurgicalProcedureOrder($patientChartId: ID!) {
    surgicalOrder(patientChartId: $patientChartId) {
      id
      status
      createdAt
      userName
      orderedBy {
        id
        firstName
        lastName
      }
      surgicalProcedures {
        id
        status
        surgicalProcedureType {
          title
        }
        payments {
          id
          status
        }
      }
    }
  }
`;

const CANCEL_ORDER = gql`
  mutation DeleteSurgicalProcedure($id: ID!) {
    deleteSurgicalProcedure(id: $id)
  }
`;

export const SurgeryPage: React.FC<{
  locked: boolean;
  patientId: string;
  patientChart: PatientChart;
  appointmentId: string | undefined;
}> = ({ locked, patientId, appointmentId, patientChart }) => {
  const notifDispatch = useNotificationDispatch();
  const bottomSheetDispatch = useBottomSheetDispatch();

  const { data, refetch, error } = useQuery<Query, QuerySurgicalOrderArgs>(
    GET_PATIENT_SURGICAL_PROCEDURES,
    {
      variables: {
        patientChartId: patientChart?.id,
      },
    }
  );

  const [cancelOrder] = useMutation<any, any>(CANCEL_ORDER, {
    onCompleted(data) {
      notifDispatch({
        type: 'show',
        notifTitle: 'Success',
        notifSubTitle: 'Order cancelled successfully',
        variant: 'success',
      });

      refetch();
    },
    onError(error) {
      notifDispatch({
        type: 'show',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  const handleProcedureClick = (item: SurgicalProcedureType) => {
    if (patientChart?.id) {
      bottomSheetDispatch({
        type: 'show',
        snapPoint: 0,
        children: (
          <OrderSurgicalProcedureForm
            patientId={patientId}
            patientChartId={patientChart.id}
            appointmentId={appointmentId}
            surgicalProcedureType={item}
            onSuccess={() => {
              refetch();
              notifDispatch({
                type: 'show',
                notifTitle: 'Success',
                notifSubTitle: 'Surgery ordered successfully',
                variant: 'success',
              });
              bottomSheetDispatch({ type: 'hide' });
            }}
            onError={(message) => {
              notifDispatch({
                type: 'show',
                notifTitle: 'Error',
                notifSubTitle: message,
                variant: 'failure',
              });
            }}
            onCancel={() => bottomSheetDispatch({ type: 'hide' })}
          />
        ),
      });
    }
  };

  return (
    <div className="flex space-x-6">
      <div className="w-1/3">
        <SurgicalProcedureTypes
          locked={locked}
          onItemClick={handleProcedureClick}
        />
      </div>

      <div className="flex-1 bg-gray-50 rounded shadow-lg p-5">
        <p className="text-2xl text-gray-600 font-bold">Patient surgeries</p>

        <hr className="mt-4 mb-4" />

        {((data?.surgicalOrder.surgicalProcedures.length ?? 0) === 0 ||
          error?.message === 'record not found') && (
          <div className="bg-gray-100 mt-5 flex h-screen rounded-sm shadow-inner">
            <div className="m-auto flex space-x-1 text-gray-500">
              <div className="material-icons">inbox</div>
              <p className="text-center">Nothing here yet</p>
            </div>
          </div>
        )}

        {(data?.surgicalOrder.surgicalProcedures.length ?? 0) > 0 &&
          error?.message !== 'record not found' && (
            <table className="table-auto divide-y divide-gray-200 mt-4 w-full shadow-lg rounded-lg">
              <thead className="bg-teal-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                  >
                    Surgery
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                  >
                    Doctor
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                  >
                    Order Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                  ></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data?.surgicalOrder.surgicalProcedures.map((e, i) => (
                  <tr key={e?.id} className="hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {e?.surgicalProcedureType.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {`${data?.surgicalOrder.userName}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {format(
                        parseISO(data?.surgicalOrder.createdAt),
                        'MMM d, y'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span
                        className={classnames(
                          'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',

                          {
                            'bg-yellow-100 text-yellow-800':
                              e?.status === SurgeryStatus.Ordered,
                          },
                          {
                            'bg-green-100 text-green-800':
                              e?.status === SurgeryStatus.Completed,
                          }
                        )}
                      >
                        {e?.status === SurgeryStatus.Ordered && 'Ordered'}
                        {e?.status === SurgeryStatus.Completed && 'Completed'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {!e?.payments.every((e) => e.status === 'PAID') && (
                        <button
                          className="border border-red-600 text-red-800 px-2 text-sm py-1 rounded-lg flex space-x-1 items-center"
                          onClick={() => {
                            if (e?.id) {
                              cancelOrder({ variables: { id: e?.id } });
                            }
                          }}
                        >
                          <p>Cancel order</p>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
    </div>
  );
};
