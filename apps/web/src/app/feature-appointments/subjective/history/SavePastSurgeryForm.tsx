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

import { gql, useLazyQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  PastSurgeryInput,
  MutationSavePastSurgeryArgs,
  ConceptAttributes,
  Query,
  QueryConceptAttributesArgs,
  QueryProcedureConceptsArgs,
} from '@tensoremr/models';
import AsyncSelect from 'react-select/async';
import { useNotificationDispatch } from '@tensoremr/notification';
import { formatDate, GET_CONCEPT_ATTRIBUTES } from '@tensoremr/util';

const SAVE_PAST_SURGERY = gql`
  mutation SavePastSurgery($input: PastSurgeryInput!) {
    savePastSurgery(input: $input) {
      id
    }
  }
`;

const SEARCH_PROCEDURES = gql`
  query SearchProcedures(
    $size: Int!
    $searchTerm: String!
    $pertinence: Pertinence
  ) {
    procedureConcepts(
      size: $size
      searchTerm: $searchTerm
      pertinence: $pertinence
    ) {
      term
      sctid
    }
  }
`;

export const SavePastSurgeryForm: React.FC<{
  patientHistoryId: string | undefined;
  onSuccess: () => void;
  onCancel: () => void;
  onSaveChange?: (saving: boolean) => void;
}> = ({ patientHistoryId, onSuccess, onCancel, onSaveChange }) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit } = useForm<PastSurgeryInput>();

  const [disablePertinence, setDisablePertinence] = useState<boolean>(false);

  const [selectedDisorder, setSelectedDisorder] = useState<{
    value: string;
    label: string;
  }>();

  const [selectedAttributes, setSelectedAttributes] =
    useState<ConceptAttributes>();

  const conceptAttributesQuery = useLazyQuery<
    Query,
    QueryConceptAttributesArgs
  >(GET_CONCEPT_ATTRIBUTES);

  useEffect(() => {
    if (selectedDisorder) {
      conceptAttributesQuery[0]({
        variables: {
          conceptId: selectedDisorder.value,
        },
      }).then((resp) => {
        if (resp.data?.conceptAttributes) {
          setSelectedAttributes(resp.data?.conceptAttributes);
        }
      });
    }
  }, [selectedDisorder]);

  useEffect(() => {
    const conceptAttributes = conceptAttributesQuery[1].data?.conceptAttributes;
  }, [conceptAttributesQuery[1].data]);

  const proceduresQuery = useLazyQuery<Query, QueryProcedureConceptsArgs>(
    SEARCH_PROCEDURES
  );

  const loadDisorderOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    if (inputValue.length > 0) {
      proceduresQuery[0]({
        variables: {
          size: 100,
          searchTerm: inputValue,
        },
      }).then((resp) => {
        const values = resp.data?.procedureConcepts.map((e) => ({
          value: e?.sctid,
          label: e?.term,
        }));

        if (values) {
          callback(values);
        }
      });
    }
  };

  const [save, { error }] = useMutation<any, MutationSavePastSurgeryArgs>(
    SAVE_PAST_SURGERY,
    {
      onCompleted(data) {
        onSaveChange && onSaveChange(false);
        onSuccess();
      },
      onError(error) {
        onSaveChange && onSaveChange(false);
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  const onSubmit = (data: PastSurgeryInput) => {
    if (patientHistoryId !== undefined) {
      data.patientHistoryId = patientHistoryId;
      data.surgeryDate = formatDate(data.surgeryDate);

      onSaveChange && onSaveChange(true);
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
          <p className="text-2xl font-extrabold tracking-wide">
            Add Past Procedure
          </p>

          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex-1">
                <AsyncSelect
                  placeholder={'Surgical procedures'}
                  cacheOptions={false}
                  defaultOptions
                  isClearable={true}
                  loadOptions={loadDisorderOptions}
                  onChange={(selected) => {
                    setDisablePertinence(false);
                    setSelectedDisorder(selected);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 border rounded-md shadow-sm">
            <div className="w-full bg-gray-100 p-2">Source of Information</div>

            <div className="mt-1 flex space-x-6 ml-2 p-1">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="illnessType"
                  value={'Natural Illness'}
                  ref={register}
                  defaultChecked={true}
                />
                <span className="ml-2">Patient Reported</span>
              </label>

              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="illnessType"
                  value={'Industrial Accident'}
                  ref={register}
                />
                <span className="ml-2">External</span>
              </label>
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Memo
            </label>
            <input
              type="text"
              name="description"
              id="description"
              ref={register}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>

          <div className="mt-4">
            {error && <p className="text-red-600">Error: {error.message}</p>}
          </div>
          <button
            type="submit"
            className="inline-flex justify-center w-full py-2 px-4 mt-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none"
          >
            <span className="ml-2">Save</span>
          </button>
        </form>
      </div>
    </div>
  );
};
