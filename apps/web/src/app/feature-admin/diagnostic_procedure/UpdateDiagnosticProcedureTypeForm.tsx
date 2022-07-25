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

import { gql, useQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  DiagnosticProcedureType,
  DiagnosticProcedureTypeUpdateInput,
  MutationDeleteDiagnosticProcedureTypeArgs,
  MutationUpdateDiagnosticProcedureTypeArgs,
  Query,
  QueryBillingsArgs,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';
import Select from 'react-select';
import { BILLINGS } from '@tensoremr/util';

const UPDATE_DIAGNOSTIC_PROCEDURE_TYPE = gql`
  mutation UpdateDiagnosticProcedureType(
    $input: DiagnosticProcedureTypeUpdateInput!
  ) {
    updateDiagnosticProcedureType(input: $input) {
      id
    }
  }
`;

const DELETE_DIAGNOSTIC_PROCEDURE_TYPE = gql`
  mutation DeleteDiagnosticProcedureType($id: ID!) {
    deleteDiagnosticProcedureType(id: $id)
  }
`;

interface Props {
  values: DiagnosticProcedureType | undefined;
  onUpdateSuccess: () => void;
  onDeleteSuccess: () => void;
  onCancel: () => void;
}

export const UpdateDiagnosticProcedureTypeForm: React.FC<Props> = ({
  values,
  onUpdateSuccess,
  onDeleteSuccess,
  onCancel,
}) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit, setValue } =
    useForm<DiagnosticProcedureTypeUpdateInput>();

  const { data } = useQuery<Query, QueryBillingsArgs>(BILLINGS, {
    variables: { page: { page: 0, size: 1000 } },
  });

  const [selectedBillings, setSelectedBillings] = useState<Array<any>>([]);

  useEffect(() => {
    const billings = values?.billings.map((e) => ({
      value: e?.id,
      label: e?.item,
    }));
    if (billings) {
      setSelectedBillings(billings);
    }

    setValue('title', values?.title);
    setValue('active', values?.active);
  }, [values, data]);

  const [save, { error }] = useMutation<
    any,
    MutationUpdateDiagnosticProcedureTypeArgs
  >(UPDATE_DIAGNOSTIC_PROCEDURE_TYPE, {
    onCompleted(data) {
      onUpdateSuccess();
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

  const [deleteDiagnosticProcedureType] = useMutation<
    any,
    MutationDeleteDiagnosticProcedureTypeArgs
  >(DELETE_DIAGNOSTIC_PROCEDURE_TYPE, {
    onCompleted(data) {
      onDeleteSuccess();
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

  const onUpdateSubmit = (data: any) => {
    const id: string = values?.id.toString() ?? '';
    save({
      variables: {
        input: {
          id: id,
          title: data.title,
          active: data.active === 'true',
          billingIds: selectedBillings.map((e) => e.value),
        },
      },
    });
  };

  const onDeleteSubmit = (data: DiagnosticProcedureTypeUpdateInput) => {
    const id: string = values?.id.toString() ?? '';
    deleteDiagnosticProcedureType({ variables: { id: id } });
  };

  const billings = data?.billings.edges.map((e) => ({
    value: e?.node.id,
    label: e?.node.item,
  }));

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
        <form>
          <p className="text-2xl font-extrabold tracking-wider">
            Update Diagnostic Procedure
          </p>
          <div className="mt-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              required
              id="title"
              type="text"
              name="title"
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <Select
              isMulti
              placeholder="Billings"
              options={billings}
              value={selectedBillings}
              onChange={(values) => {
                setSelectedBillings(values.map((e) => e));
              }}
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="active"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              required
              name="active"
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={'true'}>Active</option>
              <option value={'false'}>Inactive</option>
            </select>
          </div>
          <div className="mt-4">
            {error && <p className="text-red-600">Error: {error.message}</p>}
          </div>
          <div className="flex space-x-5">
            <button
              type="button"
              onClick={handleSubmit(onUpdateSubmit)}
              className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-600 focus:outline-none"
            >
              <span className="ml-2">Update</span>
            </button>

            <button
              type="submit"
              onClick={handleSubmit(onDeleteSubmit)}
              className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 focus:outline-none"
            >
              <span className="ml-2">Delete</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
