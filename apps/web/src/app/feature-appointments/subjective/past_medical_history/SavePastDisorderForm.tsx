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
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Query,
  QueryConceptAttributesArgs,
  ConceptAttributes,
  Pertinence,
  QueryHistoryOfDisorderConceptsArgs,
  MutationSaveDisorderHistoryArgs,
  ClinicalFindingInput,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';
import AsyncSelect from 'react-select/async';
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/outline';
import { ExclamationIcon } from '@heroicons/react/solid';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';
import classNames from 'classnames';
import { GET_CONCEPT_ATTRIBUTES } from '@tensoremr/util';
import { Button, ConceptBrowser } from '@tensoremr/ui-components';
import { Tooltip } from 'flowbite-react';

const SEARCH_DISORDERS = gql`
  query SearchDisorders(
    $size: Int!
    $searchTerm: String!
    $pertinence: Pertinence
  ) {
    historyOfDisorderConcepts(
      size: $size
      searchTerm: $searchTerm
      pertinence: $pertinence
    ) {
      term
      sctid
    }
  }
`;

const SAVE_DISORDER_HISTORY = gql`
  mutation SaveDisorderHistory($input: ClinicalFindingInput!) {
    saveDisorderHistory(input: $input) {
      id
    }
  }
`;

export const SavePastDisorderForm: React.FC<{
  patientChartId: string;
  onSuccess: (message: string) => void;
  onCancel: () => void;
}> = ({ patientChartId, onSuccess, onCancel }) => {
  const notifDispatch = useNotificationDispatch();
  const { register, handleSubmit } = useForm<ClinicalFindingInput>();
  const [loading, setLoading] = useState<boolean>(false);
  const [openBrowser, setOpenBrowser] = useState<boolean>(false);

  const [pertinence, setPertinence] = useState<'Positive' | 'Negative'>(
    'Positive'
  );

  const [disablePertinence, setDisablePertinence] = useState<boolean>(false);

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

  useEffect(() => {
    const conceptAttributes = conceptAttributesQuery[1].data?.conceptAttributes;

    // If known present
    if (conceptAttributes?.findingContext === '410515003') {
      setPertinence('Positive');
      setDisablePertinence(true);
    }
    // If known absent
    else if (conceptAttributes?.findingContext === '410516002') {
      setPertinence('Negative');
      setDisablePertinence(true);
    }
  }, [conceptAttributesQuery[1].data]);

  const disordersQuery = useLazyQuery<
    Query,
    QueryHistoryOfDisorderConceptsArgs
  >(SEARCH_DISORDERS);

  const loadDisorderOptions = (
    inputValue: string,
    callback: (options: any[]) => void
  ) => {
    if (inputValue.length > 0) {
      disordersQuery[0]({
        variables: {
          size: 100,
          searchTerm: inputValue,
          pertinence:
            pertinence === 'Positive'
              ? Pertinence.Positive
              : Pertinence.Negative,
        },
      }).then((resp) => {
        const values = resp.data?.historyOfDisorderConcepts.map((e) => ({
          value: e?.sctid,
          label: e?.term,
        }));

        if (values) {
          callback(values);
        }
      });
    }
  };

  const savePastDisorder = useMutation<any, MutationSaveDisorderHistoryArgs>(
    SAVE_DISORDER_HISTORY,
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
    if (savePastDisorder[1].loading) setLoading(true);
  }, [savePastDisorder]);

  const onSubmit = (data: ClinicalFindingInput) => {
    if (selectedDisorder) {
      const clinicaFinding: ClinicalFindingInput = {
        conceptId: selectedDisorder?.value,
        term: selectedDisorder.label,
        patientChartId: parseInt(patientChartId),
        freeTextNote: data.freeTextNote,
      };

      savePastDisorder[0]({ variables: { input: clinicaFinding } });
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
            Add Past Disorder
          </p>

          <div className="mt-4">
            <div className="flex items-center">
              <div>
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button
                      disabled={disablePertinence}
                      className={classNames(
                        'inline-flex w-full justify-center rounded-md rounded-r-none border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm',
                        {
                          'bg-gray-50 hover:bg-gray-50': !disablePertinence,
                          'bg-gray-200': disablePertinence,
                        }
                      )}
                    >
                      <div
                        className={classNames('text-sm flex space-x-3', {
                          'text-yellow-600': pertinence === 'Positive',
                          'text-green-600': pertinence === 'Negative',
                        })}
                      >
                        {pertinence === 'Positive' ? (
                          <PlusCircleIcon className="w-5 h-5" />
                        ) : (
                          <MinusCircleIcon className="w-5 h-5" />
                        )}

                        <p>{pertinence}</p>
                      </div>
                      <ChevronDownIcon
                        className="-mr-1 ml-2 h-5 w-5"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          {({ active, disabled }) => (
                            <div
                              className={classNames(
                                'px-4 py-2 text-sm flex space-x-3 text-yellow-600 hover:bg-gray-100 hover:cursor-pointer',
                                {
                                  'bg-gray-200': pertinence === 'Positive',
                                }
                              )}
                              onClick={() => {
                                if (!disabled) {
                                  setPertinence('Positive');
                                }
                              }}
                            >
                              <PlusCircleIcon className="w-5 h-5 " />
                              <p>Positive</p>
                            </div>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active, disabled }) => (
                            <div
                              className={classNames(
                                ' px-4 py-2 text-sm flex space-x-3 text-green-600 hover:bg-gray-100 hover:cursor-pointer',
                                {
                                  'bg-gray-200': pertinence === 'Negative',
                                }
                              )}
                              onClick={() => {
                                if (!disabled) {
                                  setPertinence('Negative');
                                }
                              }}
                            >
                              <MinusCircleIcon className="w-5 h-5 " />
                              <p>Negative</p>
                            </div>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>

              <div className="flex-1">
                <AsyncSelect
                  placeholder={
                    pertinence === 'Positive'
                      ? 'History of ...'
                      : 'No history of ...'
                  }
                  cacheOptions={false}
                  defaultOptions
                  isClearable={true}
                  value={selectedDisorder}
                  loadOptions={loadDisorderOptions}
                  onChange={(selected) => {
                    setDisablePertinence(false);
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
                  conceptId={
                    pertinence === 'Positive' ? '417662000' : '443508001'
                  }
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
            {savePastDisorder[1].error && (
              <p className="text-red-600">Error: {savePastDisorder[1].error.message}</p>
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
