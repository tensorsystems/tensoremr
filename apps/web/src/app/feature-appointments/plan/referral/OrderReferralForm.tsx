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
  OrderReferralInput,
  QueryGetByUserTypeTitleArgs,
  MutationOrderReferralArgs,
  Query,
  ReferralType,
} from '@tensoremr/models';
import { parseJwt } from '@tensoremr/util';

const ORDER_REFERRAL = gql`
  mutation OrderReferral($input: OrderReferralInput!) {
    orderReferral(input: $input) {
      id
    }
  }
`;

const GET_PROVIDERS = gql`
  query Providers($input: String!) {
    getByUserTypeTitle(input: $input) {
      id
      firstName
      lastName
    }
  }
`;

interface OrderFormProps {
  patientId: string | undefined;
  patientChartId: string | undefined;
  onSuccess: () => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

export const OrderReferralForm: React.FC<OrderFormProps> = ({
  patientChartId,
  patientId,
  onSuccess,
  onError,
  onCancel,
}) => {
  const { register, handleSubmit, watch } = useForm<OrderReferralInput>({
    defaultValues: {
      type: ReferralType.PatientInHouseReferral,
    },
  });

  const token = sessionStorage.getItem('accessToken');
  const claim = token === null ? null : parseJwt(token);

  const { data } = useQuery<Query, QueryGetByUserTypeTitleArgs>(GET_PROVIDERS, {
    variables: {
      input: 'Physician',
    },
  });

  const [orderReferral, { error }] = useMutation<
    any,
    MutationOrderReferralArgs
  >(ORDER_REFERRAL, {
    onCompleted(data) {
      onSuccess();
    },
    onError(error) {
      onError(error.message);
    },
  });

  const onSubmit = (data: OrderReferralInput) => {
    if (patientChartId && patientId) {
      data.patientId = patientId;
      data.patientChartId = patientChartId;
      data.type = orderValues.type;

      orderReferral({ variables: { input: data } });
    }
  };

  const orderValues = watch();

  const providers = data?.getByUserTypeTitle
    ? [...data.getByUserTypeTitle]
    : [];
  const reversedProviders = providers
    .reverse()
    .filter((e) => e.id !== claim.ID);

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
            Order referral
          </p>
          <div className="mt-4">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Refer Type
            </label>
            <select
              required
              name="type"
              ref={register({ required: true })}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={ReferralType.PatientInHouseReferral}>
                In-House Referral
              </option>
              <option value={ReferralType.PatientOutsourceReferral}>
                Outsource
              </option>
            </select>
          </div>
          {orderValues.type === ReferralType.PatientInHouseReferral && (
            <div className="mt-4">
              <label
                htmlFor="referredToId"
                className="block text-sm font-medium text-gray-700"
              >
                Refer To
              </label>
              <select
                required
                name="referredToId"
                ref={register({
                  required:
                    orderValues.type === ReferralType.PatientInHouseReferral,
                })}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {reversedProviders.map((e) => (
                  <option
                    key={e?.id}
                    value={e?.id}
                  >{`Dr. ${e?.firstName} ${e?.lastName}`}</option>
                ))}
              </select>
            </div>
          )}
          {orderValues.type === ReferralType.PatientOutsourceReferral && (
            <div className="mt-4">
              <label
                htmlFor="providerName"
                className="block text-sm font-medium text-gray-700"
              >
                Provider
              </label>
              <input
                required
                type="text"
                name="providerName"
                ref={register}
                className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
              />
            </div>
          )}
          <div className="mt-4">
            <label
              htmlFor="reason"
              className="block text-sm font-medium text-gray-700"
            >
              Reason
            </label>
            <input
              type="text"
              name="reason"
              ref={register({ required: false })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="receptionNote"
              className="block text-sm font-medium text-gray-700"
            >
              Reception Note
            </label>
            <input
              type="text"
              name="receptionNote"
              ref={register({ required: false })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
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
