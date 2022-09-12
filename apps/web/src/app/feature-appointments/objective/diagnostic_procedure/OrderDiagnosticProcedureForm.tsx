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
import { useForm } from 'react-hook-form';
import {
  DiagnosticProcedureType,
  OrderDiagnosticProcedureInput,
  MutationOrderDiagnosticProcedureArgs,
  Query,
  QueryModalitiesArgs,
  ModalityEdge,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';
import { ModalitySelectableItem } from '@tensoremr/ui-components';

const ORDER_DIAGNOSTIC_PROCEDURE = gql`
  mutation OrderDiagnosticProcedure($input: OrderDiagnosticProcedureInput!) {
    orderDiagnosticProcedure(input: $input) {
      id
    }
  }
`;

const MODALITIES = gql`
  query Modalities($page: PaginationInput!, $filter: ModalityFilter) {
    modalities(page: $page, filter: $filter) {
      totalCount
      edges {
        node {
          id
          value
          description
          active
          iconFileName
        }
      }
      pageInfo {
        totalPages
      }
    }
  }
`;

interface OrderFormProps {
  diagnosticProcedureType: DiagnosticProcedureType | undefined;
  patientId: string | undefined;
  patientChartId: string | undefined;
  appointmentId: string | undefined;
  onSuccess: () => void;
  onCancel: () => void;
}

export const OrderDiagnosticProcedureForm: React.FC<OrderFormProps> = ({
  diagnosticProcedureType,
  patientChartId,
  appointmentId,
  patientId,
  onSuccess,
  onCancel,
}) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, watch } =
    useForm<OrderDiagnosticProcedureInput>({
      defaultValues: {
        billingId: diagnosticProcedureType?.billings[0]?.id,
      },
    });

  const { data } = useQuery<Query, QueryModalitiesArgs>(MODALITIES, {
    variables: {
      page: { page: 1, size: 100 },
      filter: { active: true },
    },
  });

  const [orderDiagnosticProcedure, { error }] = useMutation<
    any,
    MutationOrderDiagnosticProcedureArgs
  >(ORDER_DIAGNOSTIC_PROCEDURE, {
    onCompleted(data) {
      onSuccess();
    },
    onError(error) {
      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  const onSubmit = (data: OrderDiagnosticProcedureInput) => {
    console.log('Data', data);

    if (
      patientChartId &&
      patientId &&
      appointmentId &&
      diagnosticProcedureType?.id
    ) {
      data.patientChartId = patientChartId;
      data.patientId = patientId;
      data.appointmentId = appointmentId;
      data.diagnosticProcedureTypeId = diagnosticProcedureType?.id;

      orderDiagnosticProcedure({ variables: { input: data } });
    }
  };

  const inputValue = watch();

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
            {`Order ${diagnosticProcedureType?.title}`}
          </p>

          <div className="mt-4">
            <p className=" font-light text-zinc-900 uppercase tracking-wide">
              Billing
            </p>
            <div className="mt-1">
              <select
                id="billingId"
                name="billingId"
                required
                ref={register({ required: true })}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {diagnosticProcedureType?.billings.map((e) => (
                  <option key={e?.id} value={e?.id}>
                    {`${e?.item} (${e?.code}) - ETB ${e?.price}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr className="my-3" />

          <div>
            <p className="font-light text-zinc-900 uppercase tracking-wide">
              Modality
            </p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-3 mt-1">
              {data?.modalities.edges.map((e: ModalityEdge) => (
                <div key={e.node.id}>
                  <ModalitySelectableItem
                    selected={e.node.value === inputValue.modality}
                    value={e.node.value}
                    description={e.node.description}
                    register={register}
                    iconUrl={
                      e.node.iconFileName
                        ? `${import.meta.env.VITE_APP_SERVER_URL}/files/${
                            e.node.iconFileName
                          }`
                        : undefined
                    }
                  />
                </div>
              ))}
            </div>
          </div>
          <hr className="my-3" />
          <div>
            <p className="font-light text-zinc-900 uppercase tracking-wide">
              Memo
            </p>
            <div className="flex space-x-4">
              <div className="mt-4 flex-1">
                <textarea
                  name="receptionNote"
                  placeholder="Reception Note"
                  rows={1}
                  ref={register}
                  className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md h-16 w-full"
                />
              </div>
              <div className="mt-4 flex-1">
                <textarea
                  name="orderNote"
                  placeholder="Order Note"
                  rows={1}
                  ref={register}
                  className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md h-16 w-full"
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            {error && <p className="text-red-600">Error: {error.message}</p>}
          </div>
          <button
            type="submit"
            className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-700 hover:bg-teal-800 focus:outline-none"
          >
            <span className="ml-2">Order</span>
          </button>
        </form>
      </div>
    </div>
  );
};
