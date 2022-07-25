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

import { useQuery, useMutation, gql } from '@apollo/client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  MutationSaveSurgicalProcedureTypeArgs,
  Query,
  QueryBillingsArgs,
  QuerySuppliesArgs,
  SurgicalProcedureTypeInput,
} from '@tensoremr/models';
import Select from 'react-select';
import { BILLINGS, SUPPLIES } from '@tensoremr/util';

const SAVE_SURGICAL_PROCEDURE_TYPE = gql`
  mutation SaveSurgicalProcedureType($input: SurgicalProcedureTypeInput!) {
    saveSurgicalProcedureType(input: $input) {
      id
    }
  }
`;

interface AddSurgicalProcedureTypeProps {
  onSuccess: () => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

export const AddSurgicalProcedureTypeForm: React.FC<
  AddSurgicalProcedureTypeProps
> = ({ onSuccess, onError, onCancel }) => {
  const { register, handleSubmit } = useForm<SurgicalProcedureTypeInput>({
    defaultValues: {
      active: true,
    },
  });

  const [selectedBillings, setSelectedBillings] = useState<Array<any>>([]);
  const [selectedSupplies, setSelectedSupplies] = useState<Array<any>>([]);

  const billingQuery = useQuery<Query, QueryBillingsArgs>(BILLINGS, {
    variables: { page: { page: 0, size: 1000 } },
  });

  const supplyQuery = useQuery<Query, QuerySuppliesArgs>(SUPPLIES, {
    variables: { page: { page: 0, size: 1000 } },
  });

  const [save, { error }] = useMutation<
    any,
    MutationSaveSurgicalProcedureTypeArgs
  >(SAVE_SURGICAL_PROCEDURE_TYPE, {
    onCompleted(data) {
      onSuccess();
    },
    onError(error) {
      onError(error.message);
    },
  });

  const onSubmit = (data: any) => {
    save({
      variables: {
        input: {
          title: data.title,
          active: data.active === 'true',
          billingIds: selectedBillings.map((e) => e.value),
          supplyIds: selectedSupplies.map((e) => e.value),
        },
      },
    });
  };

  const billings = billingQuery.data?.billings.edges.map((e) => ({
    value: e?.node.id,
    label: e?.node.item,
  }));

  const supplies = supplyQuery.data?.supplies.edges.map((e) => ({
    value: e?.node.id,
    label: e?.node.title,
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <p className="text-2xl font-extrabold tracking-wider">
            Add Surgical Procedure
          </p>
          <div className="mt-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              name="title"
              required
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
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
            <Select
              isMulti
              placeholder="Supplies"
              options={supplies}
              onChange={(values) => {
                setSelectedSupplies(values.map((e) => e));
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
              name="active"
              required
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
          <button
            type="submit"
            className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 focus:outline-none"
          >
            <span className="ml-2">Save</span>
          </button>
        </form>
      </div>
    </div>
  );
};
