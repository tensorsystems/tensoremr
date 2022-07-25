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
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { useNotificationDispatch } from '@tensoremr/notification';
import classnames from 'classnames';
import { format, parseISO } from 'date-fns';
import { TreatmentTypesComponent } from './TreatmentTypes';
import {
  PatientChart,
  Query,
  QueryTreatmentOrderArgs,
  TreatmentStatus,
  TreatmentType,
} from '@tensoremr/models';
import { OrderTreatmentForm } from './OrderTreatmentForm';

const GET_PATIENT_TREATMENTS = gql`
  query TreatmentOrder($patientChartId: ID!) {
    treatmentOrder(patientChartId: $patientChartId) {
      id
      status
      createdAt
      userName
      orderedBy {
        id
        firstName
        lastName
      }
      treatments {
        id
        status
        treatmentType {
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
  mutation DeleteTreatment($id: ID!) {
    deleteTreatment(id: $id)
  }
`;

export const TreatmentPlanPage: React.FC<{
  locked: boolean;
  patientId: string;
  appointmentId: string | undefined;
  patientChart: PatientChart;
}> = ({ locked, patientId, appointmentId, patientChart }) => {
  const notifDispatch = useNotificationDispatch();
  const bottomSheetDispatch = useBottomSheetDispatch();

  const { data, refetch, error } = useQuery<Query, QueryTreatmentOrderArgs>(
    GET_PATIENT_TREATMENTS,
    {
      variables: {
        patientChartId: patientChart.id,
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

  const handleTreatmentClick = (item: TreatmentType) => {
    if (patientChart?.id) {
      bottomSheetDispatch({
        type: 'show',
        snapPoint: 0,
        children: (
          <OrderTreatmentForm
            patientId={patientId}
            patientChartId={patientChart.id}
            appointmentId={appointmentId}
            treatmentType={item}
            onSuccess={() => {
              refetch();
              notifDispatch({
                type: 'show',
                notifTitle: 'Success',
                notifSubTitle: 'Treatment ordered successfully',
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
        <TreatmentTypesComponent
          locked={locked}
          onItemClick={handleTreatmentClick}
        />
      </div>

      <div className="flex-1 bg-gray-50 rounded shadow-lg p-5">
        <p className="text-2xl text-gray-600 font-bold">Patient treatments</p>

        <hr className="mt-4 mb-4" />

        {((data?.treatmentOrder.treatments.length ?? 0) === 0 ||
          error?.message === 'record not found') && (
          <div className="bg-gray-100 mt-5 flex h-44 rounded-sm shadow-inner">
            <div className="m-auto flex space-x-1 text-gray-500">
              <div className="material-icons">inbox</div>
              <p className="text-center">Nothing here yet</p>
            </div>
          </div>
        )}

        {(data?.treatmentOrder.treatments.length ?? 0) > 0 &&
          error?.message !== 'record not found' && (
            <table className="table-auto divide-y divide-gray-200 mt-4 w-full shadow-lg rounded-lg">
              <thead className="bg-teal-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                  >
                    Treatment
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
                {data?.treatmentOrder.treatments.map((e, i) => (
                  <tr key={e?.id} className="cursor-pointer hover:bg-gray-100">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {e?.treatmentType.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {`${data?.treatmentOrder.userName}`}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {format(
                        parseISO(data?.treatmentOrder.createdAt),
                        'MMM d, y'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <span
                        className={classnames(
                          'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',

                          {
                            'bg-yellow-100 text-yellow-800':
                              e?.status === TreatmentStatus.Ordered,
                          },
                          {
                            'bg-green-100 text-green-800':
                              e?.status === TreatmentStatus.Completed,
                          }
                        )}
                      >
                        {e?.status === TreatmentStatus.Ordered && 'Ordered'}
                        {e?.status === TreatmentStatus.Completed && 'Completed'}
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
