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
import { Switch } from '@headlessui/react';
import { TrashIcon } from '@heroicons/react/outline';
import React, { useState } from 'react';
import { Prompt } from 'react-router-dom';
import { PhysicalExamCategoryList } from './PhysicalExamCategoryList';
import {
  MutationDeletePhysicalExamFindingArgs,
  MutationSavePhysicalExamFindingArgs,
  MutationUpdatePhysicalExamFindingArgs,
  PhysicalExamFinding,
  Query,
  QueryPhysicalExamFindingsArgs,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';

const AUTO_SAVE_INTERVAL = 1000;

const SAVE_PHYSICAL_EXAM_FINDING = gql`
  mutation SavePhysicalExamFinding($input: PhysicalExamFindingInput!) {
    savePhysicalExamFinding(input: $input) {
      id
    }
  }
`;

const UPDATE_PHYSICAL_EXAM_FINDING = gql`
  mutation UpdatePhysicalExamFinding($input: PhysicalExamFindingUpdateInput!) {
    updatePhysicalExamFinding(input: $input) {
      id
    }
  }
`;

const DELETE_PHYSICAL_EXAM_FINDING = gql`
  mutation DeletePhysicalExamFinding($id: ID!) {
    deletePhysicalExamFinding(id: $id)
  }
`;

const PHYSICAL_EXAM_FINDINGS = gql`
  query PhyscialExamFindings(
    $page: PaginationInput!
    $filter: PhysicalExamFindingFilter
  ) {
    physicalExamFindings(page: $page, filter: $filter) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          abnormal
          examCategory {
            id
            title
          }
          examCategoryId
          patientChartId
          note
        }
      }
    }
  }
`;

export const GeneralExamination: React.FC<{
  locked: boolean;
  patientChartId: string;
}> = ({ locked, patientChartId }) => {
  const notifDispatch = useNotificationDispatch();
  const [timer, setTimer] = useState<any>(null);
  const [modified, setModified] = useState<boolean>(false);

  const { data, refetch } = useQuery<Query, QueryPhysicalExamFindingsArgs>(
    PHYSICAL_EXAM_FINDINGS,
    {
      variables: {
        page: { page: 0, size: 100 },
        filter: { patientChartId },
      },
    }
  );

  const [savePhysicalExamFinding] = useMutation<
    any,
    MutationSavePhysicalExamFindingArgs
  >(SAVE_PHYSICAL_EXAM_FINDING, {
    onCompleted(data) {
      // notifDispatch({
      //   type: "show",
      //   notifTitle: "Success",
      //   notifSubTitle: "Order cancelled successfully",
      //   variant: "success",
      // });

      refetch();
      setModified(false);
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

  const [updatePhysicalExamFinding] = useMutation<
    any,
    MutationUpdatePhysicalExamFindingArgs
  >(UPDATE_PHYSICAL_EXAM_FINDING, {
    onCompleted(data) {
      setModified(false);
      refetch();
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

  const [deletePhysicalExamFinding] = useMutation<
    any,
    MutationDeletePhysicalExamFindingArgs
  >(DELETE_PHYSICAL_EXAM_FINDING, {
    onCompleted(data) {
      setModified(false);
      refetch();
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

  const handleChange = (note: string, e: PhysicalExamFinding) => {
    setModified(true);
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        updatePhysicalExamFinding({
          variables: {
            input: {
              id: e.id,
              examCategoryId: e.examCategoryId,
              patientChartId: e.patientChartId,
              abnormal: e.abnormal,
              note: note,
            },
          },
        });
      }, AUTO_SAVE_INTERVAL)
    );
  };

  const handleDeletePhysicalExamFinding = (id: string | undefined) => {
    if (id) {
      deletePhysicalExamFinding({
        variables: {
          id,
        },
      });
    }
  };

  return (
    <div>
      <Prompt
        when={false}
        message="This page has unsaved data. Please click cancel and try again"
      />

      <div className="flex space-x-6">
        <div className="w-1/3">
          <PhysicalExamCategoryList
            onItemClick={(examCategoryId) => {
              savePhysicalExamFinding({
                variables: {
                  input: {
                    examCategoryId: examCategoryId,
                    patientChartId: patientChartId,
                    abnormal: true,
                  },
                },
              });
            }}
            locked={locked}
          />
        </div>
        <div className="flex-1">
          <div className="grid grid-rows-2 gap-y-5">
            <div className="row-span-1 bg-gray-50 rounded shadow-lg p-5">
              <p className="text-2xl text-gray-600 font-bold">
                Pertinent Findings
              </p>
              <hr className="mt-4 mb-4" />

              {(data?.physicalExamFindings.edges.length ?? 0) === 0 && (
                <div className="bg-gray-100 mt-5 flex h-44 rounded-sm shadow-inner">
                  <div className="m-auto flex space-x-1 text-gray-500">
                    <div className="material-icons">inbox</div>
                    <p className="text-center">Nothing here yet</p>
                  </div>
                </div>
              )}

              <ul>
                {data?.physicalExamFindings.edges.map((e) => (
                  <li
                    key={e?.node.id}
                    className="rounded-lg shadow-lg py-3 px-3 bg-white mt-4"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-3">
                        <div className="flex space-x-2 items-center">
                          {e?.node.abnormal ? (
                            <span className="material-icons text-yellow-600">
                              add_circle
                            </span>
                          ) : (
                            <span className="material-icons text-green-600">
                              remove_circle
                            </span>
                          )}

                          <span className="text-xl tracking-wider text-gray-800 font-light ">
                            {e?.node.examCategory.title}
                          </span>
                        </div>
                        <div>
                          <TrashIcon
                            className="h-6 w-6 text-red-400 transform hover:scale-110 cursor-pointer"
                            onClick={() =>
                              !locked &&
                              handleDeletePhysicalExamFinding(e?.node.id)
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Switch
                          disabled={locked}
                          checked={e?.node.abnormal}
                          onChange={(value) => {
                            updatePhysicalExamFinding({
                              variables: {
                                input: {
                                  id: e?.node.id,
                                  examCategoryId: e?.node.examCategoryId,
                                  patientChartId: e?.node.patientChartId,
                                  note: e?.node.note,
                                  abnormal: value,
                                },
                              },
                            });
                          }}
                          className={`${
                            e?.node.abnormal ? 'bg-yellow-600' : 'bg-gray-200'
                          } relative inline-flex items-center h-6 rounded-full w-11`}
                        >
                          <span className="sr-only">Abnormal</span>
                          <span
                            className={`${
                              e?.node.abnormal
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            } inline-block w-4 h-4 transform bg-white rounded-full`}
                          />
                        </Switch>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div>
                        <textarea
                          name="note"
                          rows={3}
                          className="p-3 block w-full sm:text-md border-gray-200 border rounded-md"
                          disabled={locked}
                          defaultValue={e?.node.note ?? ''}
                          onChange={(evt) =>
                            handleChange(evt.target.value, e.node)
                          }
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
