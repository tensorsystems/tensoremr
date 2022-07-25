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
import React from 'react';
import { useForm } from 'react-hook-form';
import { AllergyInput, MutationSaveAllergyArgs } from '@tensoremr/models';

const SAVE_ALLERGY = gql`
  mutation SaveAllergy($input: AllergyInput!) {
    saveAllergy(input: $input) {
      id
    }
  }
`;

interface Props {
  patientHistoryId: string | undefined;
  onSuccess: () => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

export const AddAllergyForm: React.FC<Props> = ({
  patientHistoryId,
  onSuccess,
  onError,
  onCancel,
}) => {
  const { register, handleSubmit } = useForm<AllergyInput>();

  const [save, { error }] = useMutation<any, MutationSaveAllergyArgs>(
    SAVE_ALLERGY,
    {
      onCompleted(data) {
        onSuccess();
      },
      onError(error) {
        onError(error.message);
      },
    }
  );

  const onSubmit = (data: AllergyInput) => {
    if (patientHistoryId) {
      data.patientHistoryId = patientHistoryId;

      save({ variables: { input: data } });
    }
  };

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
          <p className="text-2xl font-extrabold tracking-wider">Add Allergy</p>
          <div className="mt-4">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              required
              ref={register({ required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
          <div className="mt-4">
            <label
              htmlFor="issueSeverity"
              className="block text-sm font-medium text-gray-700"
            >
              Issue Severity
            </label>
            <select
              name="issueSeverity"
              required
              ref={register}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={'Mild'}>Mild</option>
              <option value={'Moderate'}>Moderate</option>
              <option value={'Moderate'}>Moderate</option>
              <option value={'Severe'}>Severe</option>
              <option value={'Life threatening'}>Life threatening</option>
            </select>
          </div>

          <div className="mt-4">
            <label
              htmlFor="issueReaction"
              className="block text-sm font-medium text-gray-700"
            >
              Issue Reaction
            </label>
            <select
              name="issueReaction"
              required
              ref={register}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={'Hives'}>Hives</option>
              <option value={'Nausea'}>Nausea</option>
              <option value={'Shortness of breath'}>Shortness of breath</option>
            </select>
          </div>
          <div className="mt-4">
            <label
              htmlFor="issueOutcome"
              className="block text-sm font-medium text-gray-700"
            >
              Issue Outcome
            </label>
            <select
              name="issueOutcome"
              required
              ref={register}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={'Resolved'}>Resolved</option>
              <option value={'Improved'}>Improved</option>
              <option value={'Status quo'}>Status quo</option>
              <option value={'Worse'}>Worse</option>
              <option value={'Pending follow-up'}>Pending follow-up</option>
            </select>
          </div>
          <div className="mt-4">
            <label
              htmlFor="issueOccurrence"
              className="block text-sm font-medium text-gray-700"
            >
              Issue Occurrence
            </label>
            <select
              name="issueOccurrence"
              required
              ref={register}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value={'First'}>First</option>
              <option value={'Early Occurrence (<2 Mo)'}>
                {'Early Occurrence (<2 Mo)'}
              </option>
              <option value={'Late Occurrence (2-12 Mo)'}>
                {'Late Occurrence (2-12 Mo)'}
              </option>
              <option value={'Delayed Occurrence (>12 Mo)'}>
                {'Delayed Occurrence (>12 Mo)'}
              </option>
              <option value={'Chronic/Recurrent'}>{'Chronic/Recurrent'}</option>
              <option value={'Acute on Chronic'}>{'Acute on Chronic'}</option>
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
