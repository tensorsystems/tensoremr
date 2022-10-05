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
  ConceptAttributes,
  Query,
  QueryConceptAttributesArgs,
  QueryProcedureConceptsArgs,
  MutationSaveSurgicalHistoryArgs,
  ClinicalFindingInput,
} from '@tensoremr/models';
import AsyncSelect from 'react-select/async';
import { useNotificationDispatch } from '@tensoremr/notification';
import { GET_CONCEPT_ATTRIBUTES } from '@tensoremr/util';
import { Transition } from '@headlessui/react';
import { Button, ConceptBrowser } from '@tensoremr/ui-components';
import { Tooltip } from 'flowbite-react';
import { ExclamationIcon } from '@heroicons/react/solid';

const SAVE_SURGICAL_HISTORY = gql`
  mutation SavePastSurgery($input: ClinicalFindingInput!) {
    saveSurgicalHistory(input: $input) {
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
  patientChartId: string;
  onSuccess: (message: string) => void;
  onCancel: () => void;
}> = ({ patientChartId, onSuccess, onCancel }) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit } = useForm<PastSurgeryInput>();

  const [openBrowser, setOpenBrowser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedDisorder, setSelectedDisorder] = useState<{
    value: string;
    label: string;
  } | null>();

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

  const save = useMutation<any, MutationSaveSurgicalHistoryArgs>(
    SAVE_SURGICAL_HISTORY,
    {
      onCompleted(data) {
        onSuccess('History item saved successfuly');
      },
      onError(error) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  useEffect(() => {
    if (save[1].loading) setLoading(true);
  }, [save]);

  const onSubmit = (data: ClinicalFindingInput) => {
    if (selectedDisorder) {
      const clinicaFinding: ClinicalFindingInput = {
        conceptId: selectedDisorder?.value,
        term: selectedDisorder.label,
        patientChartId: parseInt(patientChartId),
        freeTextNote: data.freeTextNote,
      };

      save[0]({ variables: { input: clinicaFinding } });
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
            Add Surgical History
          </p>

          <div className="mt-4">
            <div className="flex items-center">
              <div className="flex-1">
                <AsyncSelect
                  placeholder={'Surgical procedures'}
                  cacheOptions={false}
                  defaultOptions
                  isClearable={true}
                  value={selectedDisorder}
                  loadOptions={loadDisorderOptions}
                  onChange={(selected) => {
                    setSelectedDisorder(selected);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => setOpenBrowser(!openBrowser)}
              >
                {openBrowser ? (
                  <p className="uppercase text-sm text-yellow-500 hover:text-yellow-700 font-bold tracking-wider cursor-pointer">
                    Close Browser
                  </p>
                ) : (
                  <p className="uppercase text-sm text-teal-500 hover:text-teal-700 font-bold tracking-wider cursor-pointer">
                    Open Browser
                  </p>
                )}
              </button>
            </div>

            <div className="mt-2">
              <Transition
                enter="transition ease-out duration-300"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                show={openBrowser}
              >
                <ConceptBrowser
                  conceptId="387713003"
                  onSelect={(item) =>
                    setSelectedDisorder({
                      value: item.concept.sctid,
                      label: item.description.term,
                    })
                  }
                />
              </Transition>
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
            <div className="flex items-center space-x-2">
              <label
                htmlFor="freeTextNote"
                className="block font-medium text-gray-700"
              >
                Free Text Note
              </label>

              <Tooltip content="This field is not coded. Decision support and interactions will not be active">
                <ExclamationIcon className="h-5 w-5 text-yellow-300" />
              </Tooltip>
            </div>
            <input
              type="text"
              name="freeTextNote"
              id="freeTextNote"
              ref={register}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>

          <div className="mt-4">
            {save[1].error && (
              <p className="text-red-600">
                Error: {save[1].error.message}
              </p>
            )}
          </div>
          <Button
            pill={true}
            loading={loading}
            loadingText={'Saving'}
            type="submit"
            text="Save"
            icon="save"
            variant="filled"
            disabled={loading || !selectedDisorder}
          />
        </form>
      </div>
    </div>
  );
};
