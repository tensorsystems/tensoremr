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

import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  LabType,
  MutationOrderLabArgs,
  OrderLabInput,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';
import Select from 'react-select';

const ORDER_LAB = gql`
  mutation OrderLab($input: OrderLabInput!) {
    orderLab(input: $input) {
      id
    }
  }
`;

interface Props {
  labType: LabType | undefined;
  patientId: string | undefined;
  patientChartId: string | undefined;
  appointmentId: string | undefined;
  onSuccess: () => void;
  onCancel: () => void;
}

export const OrderLabForm: React.FC<Props> = ({
  labType,
  patientChartId,
  appointmentId,
  patientId,
  onSuccess,
  onCancel,
}) => {
  const notifDispatch = useNotificationDispatch();
  const [selectedBillings, setSelectedBillings] = useState<Array<any>>([]);

  const { register, handleSubmit, watch } = useForm<any>({
    defaultValues: {
      billingIds: labType?.billings.map((e) => e?.id),
    },
  });

  const [orderLab, { error }] = useMutation<any, MutationOrderLabArgs>(
    ORDER_LAB,
    {
      onCompleted(data) {
        onSuccess();
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

  const onSubmit = (data: OrderLabInput) => {
    if (selectedBillings.length === 0) {
      alert('Select atleast one billing item');
      return;
    }

    if (patientChartId && patientId && appointmentId && labType?.id) {
      data.patientChartId = patientChartId;
      data.patientId = patientId;
      data.labTypeId = labType?.id;
      data.billingIds = selectedBillings.map((e) => e.value);

      orderLab({ variables: { input: data } });
    }
  };

  const billings = labType?.billings.map((e) => ({
    value: e?.id,
    label: e?.item,
    code: e?.code,
    price: e?.price,
  }));

  const total = selectedBillings.reduce((a, c) => a + (c?.price ?? 0), 0);

  return (
    <div className="container mx-auto flex justify-center pt-4 pb-6">
      <div className="w-1/2">
        <div className="float-right">
          <button onClick={onCancel}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-8 w-8 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="text-2xl font-extrabold tracking-wider text-teal-800">
            {`Order ${labType?.title}`}
          </p>
          <div className="mt-4">
            <Select
              isMulti
              placeholder="Billings"
              options={billings}
              onChange={(values) => {
                setSelectedBillings(values.map((e) => e));
              }}
            />
          </div>
          <div className="mt-4">
            <table className="table-fixed w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Item
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Code
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedBillings.map((e, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {e?.label}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {e?.code}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {`ETB ${e?.price}`}
                    </td>
                  </tr>
                ))}
                {selectedBillings.length > 0 && (
                  <tr>
                    <td></td>
                    <td></td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      Total: {`ETB ${total}`}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <textarea
              name="receptionNote"
              placeholder="Reception Note"
              rows={2}
              ref={register}
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md h-24 w-full"
            />
          </div>
          <div className="mt-4">
            <textarea
              name="orderNote"
              placeholder="Order Note"
              rows={2}
              ref={register}
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md h-24 w-full"
            />
          </div>
          <div className="mt-4">
            {error && <p className="text-red-600">Error: {error.message}</p>}
          </div>
          <button
            type="submit"
            className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-teal-800 focus:outline-none"
          >
            <span className="ml-2">Save</span>
          </button>
        </form>
      </div>
    </div>
  );
};
