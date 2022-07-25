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
import { format, parseISO } from 'date-fns';
import React from 'react';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { OrderReferralForm } from './OrderReferralForm';
import {
  MutationDeleteReferralArgs,
  Query,
  QueryReferralOrderArgs,
} from '@tensoremr/models';

const GET_REFERRAL_ORDER = gql`
  query ReferralOrder($patientChartId: ID!) {
    referralOrder(patientChartId: $patientChartId) {
      status
      createdAt
      orderedBy {
        id
        firstName
        lastName
      }
      referrals {
        id
        referralOrderId
        patientChartId
        reason
        referredToId
        referredToName
        status
        type
      }
    }
  }
`;

const CANCEL_ORDER = gql`
  mutation DeleteReferral($id: ID!) {
    deleteReferral(id: $id)
  }
`;

interface Props {
  patientId: string;
  patientChartId: string;
}

export const ReferralPage: React.FC<Props> = ({
  patientId,
  patientChartId,
}) => {
  const notifDispatch = useNotificationDispatch();
  const bottomSheetDispatch = useBottomSheetDispatch();

  const { data, refetch, error } = useQuery<Query, QueryReferralOrderArgs>(
    GET_REFERRAL_ORDER,
    {
      variables: {
        patientChartId,
      },
    }
  );

  const [cancelOrder] = useMutation<any, MutationDeleteReferralArgs>(
    CANCEL_ORDER,
    {
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
    }
  );

  return (
    <div className="rounded-lg shadow-lg border border-gray-100 py-3 px-3 bg-white">
      <div className="flex justify-between items-center">
        <p className="text-2xl tracking-wider text-gray-800 font-light">
          Referrals
        </p>
        <button
          className="border border-teal-800 text-teal-800 px-3 py-1 rounded-lg flex space-x-1 items-center"
          onClick={() => {
            bottomSheetDispatch({
              type: 'show',
              snapPoint: 0,
              children: (
                <OrderReferralForm
                  patientChartId={patientChartId}
                  patientId={patientId}
                  onSuccess={() => {
                    refetch();

                    notifDispatch({
                      type: 'show',
                      notifTitle: 'Success',
                      notifSubTitle: 'Referral ordered successfully',
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
          }}
        >
          <div className="material-icons">add</div>
          <p>Order Referral</p>
        </button>
      </div>

      {(data?.referralOrder.referrals.length ?? 0) === 0 ||
      error?.message === 'record not found' ? (
        <div className="bg-gray-100 mt-5 h-32 flex rounded-sm shadow-inner">
          <div className="m-auto flex space-x-1 text-gray-500">
            <div className="material-icons">inbox</div>
            <p className="text-center">Nothing here yet</p>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <table className="table-auto divide-y divide-gray-200 mt-4 w-full shadow-lg rounded-lg">
            <thead className="bg-teal-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                >
                  Referred By
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                >
                  Referred To
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                >
                  Reason
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                >
                  Referred Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.referralOrder.referrals.map((e) => (
                <tr key={e?.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {`Dr. ${data?.referralOrder?.orderedBy?.firstName} ${data?.referralOrder?.orderedBy?.lastName}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {e?.referredToName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {e?.reason}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {format(
                      parseISO(data?.referralOrder.createdAt),
                      'MMM d, y'
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {e.status === 'ORDERED' && (
                      <button
                        className="border border-red-600 text-red-800 px-2 text-sm py-1 rounded-lg flex space-x-1 items-center"
                        onClick={() => {
                          if (e?.id) {
                            cancelOrder({ variables: { id: e?.id } });
                          }
                        }}
                      >
                        <div className="material-icons">close</div>
                        <p>Cancel order</p>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
