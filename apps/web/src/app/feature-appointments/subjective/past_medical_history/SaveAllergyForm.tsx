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
import AsyncSelect from 'react-select/async';
import { Transition } from '@headlessui/react';
import { GET_CONCEPT_ATTRIBUTES } from '@tensoremr/util';
import {
  ClinicalFindingInput,
  ConceptAttributes,
  MutationSaveAllergyHistoryArgs,
  Query,
  QueryAllergicConditionConceptsArgs,
  QueryConceptAttributesArgs,
} from '@tensoremr/models';
import { useForm } from 'react-hook-form';
import { Button, ConceptBrowser } from '@tensoremr/ui-components';
import { Tooltip } from 'flowbite-react';
import { ExclamationIcon } from '@heroicons/react/solid';
import cn from 'classnames';

const SEARCH_ALLERGIES = gql`
  query SearchAllergies($size: Int!, $searchTerm: String!) {
    allergicConditionConcepts(size: $size, searchTerm: $searchTerm) {
      term
      sctid
    }
  }
`;

const SAVE_ALLERGY_HISTORY = gql`
  mutation SavePastSurgery($input: ClinicalFindingInput!) {
    saveAllergyHistory(input: $input) {
      id
    }
  }
`;

interface Props {
  patientChartId: string;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
  onCancel: () => void;
}

export const SaveAllergyForm: React.FC<Props> = ({
  patientChartId,
  onSuccess,
  onCancel,
  onError,
}) => {
  const { register, handleSubmit } = useForm<any>();
  const [freeText, setFreeText] = useState<boolean>(false);
  const [openBrowser, setOpenBrowser] = useState<boolean>(false);
  const [selectedConcept, setSelectedConcept] = useState<{
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
    if (selectedConcept) {
      conceptAttributesQuery[0]({
        variables: {
          conceptId: selectedConcept.value,
        },
      }).then((resp) => {
        if (resp.data?.conceptAttributes) {
          setSelectedAttributes(resp.data?.conceptAttributes);
        }
      });
    }
  }, [selectedConcept]);

  const save = useMutation<any, MutationSaveAllergyHistoryArgs>(
    SAVE_ALLERGY_HISTORY,
    {
      onCompleted(data) {
        onSuccess('History item saved successfuly');
      },
      onError(error) {
        onError(error.message);
      },
    }
  );

  const allergyQuery = useLazyQuery<Query, QueryAllergicConditionConceptsArgs>(
    SEARCH_ALLERGIES
  );

  const loadOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    if (inputValue.length > 0) {
      allergyQuery[0]({
        variables: {
          size: 100,
          searchTerm: inputValue,
        },
      }).then((resp) => {
        const values = resp.data?.allergicConditionConcepts.map((e) => ({
          value: e?.sctid,
          label: e?.term,
        }));

        if (values) {
          callback(values);
        }
      });
    }
  };

  const onSubmit = (data: ClinicalFindingInput) => {
    if (selectedConcept) {
      const clinicaFinding: ClinicalFindingInput = {
        conceptId: selectedConcept?.value,
        term: selectedConcept.label,
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
          <p className="text-2xl font-extrabold tracking-wide">Add Allergy</p>

          {freeText && (
            <div className="mt-2 mb-3">
              <textarea
                placeholder="Type Allergy"
                name="item"
                id="item"
                required
                ref={register({ required: true })}
                className="mt-1 p-1 pl-2 block w-full sm:text-md border-gray-300 border rounded-md h-20"
              />
            </div>
          )}
          {!freeText && (
            <div>
              <div className="mt-4 flex items-center space-x-2">
                <div className="flex-1 mb-1">
                  <label
                    htmlFor="freeTextNote"
                    className="block font-medium text-gray-500 text-sm"
                  >
                    Allergy
                  </label>
                  <AsyncSelect
                    cacheOptions={false}
                    defaultOptions
                    isClearable={true}
                    loadOptions={loadOptions}
                    value={selectedConcept}
                    className="mt-1"
                    onChange={(selected) => {
                      setSelectedConcept(selected);
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="mt-6"
                  onClick={() => setOpenBrowser(!openBrowser)}
                >
                  {openBrowser ? (
                    <span
                      className="material-icons text-yellow-600 transform hover:text-yellow-700 hover:scale-105 mt-1"
                      style={{ fontSize: '40px' }}
                    >
                      open_in_browser
                    </span>
                  ) : (
                    <span
                      className="material-icons text-teal-600 transform hover:text-teal-700 hover:scale-105 mt-1"
                      style={{ fontSize: '40px' }}
                    >
                      assignment_returned
                    </span>
                  )}
                </button>
              </div>

              <Transition
                enter="transition ease-out duration-300"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                show={openBrowser}
              >
                <div className="mt-4 mb-4">
                  <ConceptBrowser
                    conceptId="473011001"
                    onSelect={(item) =>
                      setSelectedConcept({
                        value: item.concept.sctid,
                        label: item.description.term,
                      })
                    }
                  />
                </div>
              </Transition>

              <div className="mt-4">
                <label
                  htmlFor="issueSeverity"
                  className="block text-sm font-medium text-gray-500"
                >
                  Severity
                </label>
                <select
                  name="issueSeverity"
                  required
                  ref={register}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option></option>
                  <option value={'Mild'}>Mild</option>
                  <option value={'Moderate'}>Moderate</option>
                  <option value={'Severe'}>Severe</option>
                  <option value={'Life threatening'}>Life threatening</option>
                </select>
              </div>

              <div className="mt-4">
                <label
                  htmlFor="issueReaction"
                  className="block text-sm font-medium text-gray-500"
                >
                  Issue Reaction
                </label>
                <select
                  name="issueReaction"
                  required
                  ref={register}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option></option>
                  <option value={'Hives'}>Hives</option>
                  <option value={'Nausea'}>Nausea</option>
                  <option value={'Shortness of breath'}>
                    Shortness of breath
                  </option>
                </select>
              </div>
              <div className="mt-4">
                <label
                  htmlFor="issueOutcome"
                  className="block text-sm font-medium text-gray-500"
                >
                  Issue Outcome
                </label>
                <select
                  name="issueOutcome"
                  required
                  ref={register}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option></option>
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
                  className="block text-sm font-medium text-gray-500"
                >
                  Issue Occurrence
                </label>
                <select
                  name="issueOccurrence"
                  required
                  ref={register}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option></option>
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
                  <option value={'Chronic/Recurrent'}>
                    {'Chronic/Recurrent'}
                  </option>
                  <option value={'Acute on Chronic'}>
                    {'Acute on Chronic'}
                  </option>
                </select>
              </div>

              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <label
                    htmlFor="freeTextNote"
                    className="block font-medium text-gray-500 text-sm"
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
                  className="mt-1 p-1 pl-2 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <label className="inline-flex items-center mt-2">
              <input
                type="radio"
                name="illnessType"
                value={'Natural Illness'}
                ref={register}
                defaultChecked={true}
              />
              <span className="ml-2">No Known Allergies (NKA)</span>
            </label>

            <label className="inline-flex items-center mt-2">
              <input
                type="radio"
                name="illnessType"
                value={'Natural Illness'}
                ref={register}
                defaultChecked={true}
              />
              <span className="ml-2">No Known Food Allergies (NKFA)</span>
            </label>
          </div>

          <div className="mt-2">
            <label className="inline-flex items-center">
              <input type="checkbox" name="preanestheticAllergies" />
              <span className="ml-2">Reviewed</span>
            </label>
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

          <div className={cn('flex items-end justify-end text-xs mt-4')}>
            <Tooltip
              content={
                'If selected, field will not be coded. Decision support and interactions will not be active'
              }
            >
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="freeText"
                  checked={freeText}
                  onChange={(evt) => setFreeText(!freeText)}
                />
                <span className="ml-2  text-sky-600">Free Text</span>
              </label>
            </Tooltip>
          </div>

          <div className="mt-4 mb-2">
            {save[1].error && (
              <p className="text-red-600">Error: {save[1].error.message}</p>
            )}
          </div>
          <Button
            pill={true}
            loading={save[1].loading}
            loadingText={'Saving'}
            type="submit"
            text="Save"
            icon="save"
            variant="filled"
            disabled={save[1].loading || !selectedConcept}
          />
        </form>
      </div>
    </div>
  );
};
