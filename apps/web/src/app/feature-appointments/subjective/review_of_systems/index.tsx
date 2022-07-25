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
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Prompt } from 'react-router-dom';
import { SystemSymptomsList } from './SystemSymptomsList';
import {
  MutationDeleteReviewOfSystemArgs,
  MutationSaveReviewOfSystemArgs,
  MutationUpdatePatientHistoryArgs,
  PatientHistory,
  PatientHistoryUpdateInput,
  Query,
  QueryReviewOfSystemsArgs,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useExitPrompt } from '@tensoremr/hooks';

const AUTO_SAVE_INTERVAL = 1000;

const UPDATE_PATIENT_HISTORY = gql`
  mutation UpdatePatientHistory($input: PatientHistoryUpdateInput!) {
    updatePatientHistory(input: $input) {
      id
    }
  }
`;

const REVIEW_OF_SYSTEMS = gql`
  query ReviewOfSystems(
    $page: PaginationInput!
    $filter: ReviewOfSystemFilter
  ) {
    reviewOfSystems(page: $page, filter: $filter) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          systemSymptom {
            id
            title
            system {
              id
              title
            }
          }
          note
        }
      }
    }
  }
`;

const SAVE_REVIEW_OF_SYSTEM = gql`
  mutation SaveReviewOfSystem($input: ReviewOfSystemInput!) {
    saveReviewOfSystem(input: $input) {
      id
    }
  }
`;

const DELETE_REVIEW_OF_SYSTEM = gql`
  mutation DeleteReviewOfSystem($id: ID!) {
    deleteReviewOfSystem(id: $id)
  }
`;

export const ReviewOfSystemsPage: React.FC<{
  locked: boolean;
  patientHistory: PatientHistory | undefined;
}> = ({ locked, patientHistory }) => {
  const notifDispatch = useNotificationDispatch();

  const { register, getValues, setValue } = useForm<PatientHistoryUpdateInput>({
    defaultValues: {
      id: patientHistory?.id,
      reviewOfSystemsNote: patientHistory?.reviewOfSystemsNote,
    },
  });

  useEffect(() => {
    if (patientHistory?.reviewOfSystemsNote) {
      setValue('reviewOfSystemsNote', patientHistory.reviewOfSystemsNote);
    }
  }, [patientHistory?.reviewOfSystemsNote]);

  const [timer, setTimer] = useState<any>(null);
  const [modified, setModified] = useState<boolean>(false);
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);

  const reviewOfSystemQuery = useQuery<Query, QueryReviewOfSystemsArgs>(
    REVIEW_OF_SYSTEMS,
    {
      variables: {
        page: { page: 0, size: 100 },
        filter: { patientHistoryId: patientHistory?.id },
      },
    }
  );

  const [saveReviewOfSystem] = useMutation<any, MutationSaveReviewOfSystemArgs>(
    SAVE_REVIEW_OF_SYSTEM,
    {
      onCompleted(data) {
        notifDispatch({
          type: 'show',
          notifTitle: 'Success',
          notifSubTitle: 'ROS saved successfully',
          variant: 'success',
        });

        reviewOfSystemQuery.refetch();
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

  const [updatePatientHistory] = useMutation<
    any,
    MutationUpdatePatientHistoryArgs
  >(UPDATE_PATIENT_HISTORY, {
    onCompleted() {
      setModified(false);
      setShowExitPrompt(false);
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

  const handleReviewOfSystemClick = (systemSymptomId: string) => {
    if (patientHistory?.id !== undefined) {
      saveReviewOfSystem({
        variables: {
          input: {
            systemSymptomId: systemSymptomId,
            patientHistoryId: patientHistory?.id,
          },
        },
      });
    }
  };

  const handleChanges = () => {
    setModified(true);
    setShowExitPrompt(true);
    clearTimeout(timer);

    const data = getValues();
    const isEmpty = _.values(data).every((v) => _.isEmpty(v));

    setTimer(
      setTimeout(() => {
        if (patientHistory?.id !== undefined && !isEmpty) {
          const input = {
            ...data,
            id: patientHistory.id,
          };

          updatePatientHistory({
            variables: {
              input,
            },
          });
        }
      }, AUTO_SAVE_INTERVAL)
    );
  };

  const [deleteReviewOfSystem] = useMutation<
    any,
    MutationDeleteReviewOfSystemArgs
  >(DELETE_REVIEW_OF_SYSTEM, {
    onCompleted(data) {
      notifDispatch({
        type: 'show',
        notifTitle: 'Success',
        notifSubTitle: 'ROS deleted successfully',
        variant: 'success',
      });

      reviewOfSystemQuery.refetch();
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

  return (
    <div>
      <Prompt
        when={false}
        message="This page has unsaved data. Please click cancel and try again"
      />
      <div className="flex space-x-6">
        <div className="w-1/3">
          <SystemSymptomsList
            locked={locked}
            onItemClick={(systemSymptomId) =>
              handleReviewOfSystemClick(systemSymptomId)
            }
          />
        </div>
        <div className="flex-1">
          <div className="grid grid-rows-2 gap-y-5">
            <div className="row-span-1 bg-gray-50 rounded shadow-lg p-5">
              <p className="text-2xl text-gray-600 font-bold">
                Positive Findings
              </p>
              <hr className="mt-4 mb-4" />

              {reviewOfSystemQuery.data?.reviewOfSystems.edges.length === 0 && (
                <div className="bg-gray-100 mt-5 min-h-screen flex rounded-sm shadow-inner">
                  <div className="m-auto flex space-x-1 text-gray-500">
                    <div className="material-icons">inbox</div>
                    <p className="text-center">Nothing here yet</p>
                  </div>
                </div>
              )}

              <ul className="overflow-auto">
                {reviewOfSystemQuery.data?.reviewOfSystems.edges.map((e) => (
                  <li
                    key={e?.node.id}
                    className="flex justify-between py-4 px-2"
                  >
                    <div className="flex space-x-3 items-center">
                      <span className="material-icons text-yellow-600">
                        add_circle
                      </span>{' '}
                      <div>
                        <p className="font-semibold text-gray-700">
                          {e?.node.systemSymptom.title}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {e?.node.systemSymptom.system.title}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          disabled={locked}
                          className="material-icons text-gray-700"
                          onClick={() => {
                            if (e?.node.id !== undefined) {
                              deleteReviewOfSystem({
                                variables: {
                                  id: e?.node.id,
                                },
                              });
                            }
                          }}
                        >
                          delete
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="row-span-1 h-full bg-gray-50 rounded shadow-lg p-5">
              <p className="text-2xl text-gray-600 font-bold">Free Text Note</p>

              <hr className="mt-4 mb-4" />

              <textarea
                name="reviewOfSystemsNote"
                rows={3}
                ref={register}
                disabled={locked}
                className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md h-44 w-full"
                onChange={handleChanges}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
