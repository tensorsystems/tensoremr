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
import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import { useNotificationDispatch } from '@tensoremr/notification';

import { useForm } from 'react-hook-form';
import { ChiefComplaintTypes } from './ChiefComplaintTypes';
import {
  HpiComponentEdge,
  Maybe,
  MutationDeleteChiefComplaintArgs,
  MutationSaveChiefComplaintArgs,
  MutationUpdatePatientChartArgs,
  PatientChartUpdateInput,
  Query,
  QueryChiefComplaintsArgs,
  QueryHpiComponentTypesArgs,
} from '@tensoremr/models';
import { Prompt } from 'react-router-dom';
import _ from 'lodash';
import { ChiefComplaintHpi } from './ChiefComplaintHpi';
import { Autosave, Button } from '@tensoremr/ui-components';

const UPDATE_PATIENT_CHART = gql`
  mutation SavePatientChart($input: PatientChartUpdateInput!) {
    updatePatientChart(input: $input) {
      id
    }
  }
`;

const GET_DATA = gql`
  query PatientChiefComplaints(
    $page: PaginationInput!
    $filter: ChiefComplaintFilter
    $patientChartId: ID!
  ) {
    chiefComplaints(page: $page, filter: $filter) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          title
          hpiComponents {
            id
            title
            hpiComponentTypeId
          }
        }
      }
    }

    patientChart(id: $patientChartId) {
      chiefComplaintsNote
    }
  }
`;

const SAVE_CHIEF_COMPLAINT = gql`
  mutation SavePatientChiefComplaint($input: ChiefComplaintInput!) {
    savePatientChiefComplaint(input: $input) {
      id
    }
  }
`;

const DELETE_CHIEF_COMPLAINT = gql`
  mutation DeletePatientChiefComplaint($id: ID!) {
    deletePatientChiefComplaint(id: $id)
  }
`;

const UPDATE_CHIEF_COMPLAINT = gql`
  mutation UpdatePatientChiefComplaint($input: ChiefComplaintUpdateInput!) {
    updateChiefComplaint(input: $input) {
      id
      title
      hpiComponents {
        id
        title
        hpiComponentTypeId
      }
    }
  }
`;

const GET_HPI_COMPONENT_TYPES = gql`
  query HpiComponentTypes($page: PaginationInput!) {
    hpiComponentTypes(page: $page) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;

export const ChiefComplaints: React.FC<{
  locked: boolean;
  patientChartId: string;
  onSaveChange: (saving: boolean) => void;
}> = ({ locked, patientChartId, onSaveChange }) => {
  const [hpiComponentState, setHpiComponentState] = useState<Array<any>>([]);
  const notifDispatch = useNotificationDispatch();

  const { register, setValue, getValues } = useForm<PatientChartUpdateInput>({
    defaultValues: {
      id: patientChartId,
    },
  });

  const [modified, setModified] = useState<boolean>(false);

  const { data, refetch } = useQuery<Query, any>(GET_DATA, {
    variables: {
      page: { page: 0, size: 100 },
      filter: { patientChartId },
      patientChartId,
    },
  });

  useEffect(() => {
    if (data?.patientChart) {
      setValue('chiefComplaintsNote', data?.patientChart.chiefComplaintsNote);
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, []);

  const hpiComponentTypeQuery = useQuery<Query, QueryHpiComponentTypesArgs>(
    GET_HPI_COMPONENT_TYPES,
    {
      variables: { page: { page: 0, size: 100 } },
    }
  );

  const [saveChiefComplaint] = useMutation<any, MutationSaveChiefComplaintArgs>(
    SAVE_CHIEF_COMPLAINT,
    {
      onCompleted(data) {
        onSaveChange(false);
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Success',
          notifSubTitle: 'Chief complaint saved successfully',
          variant: 'success',
        });

        refetch();
      },
      onError(error) {
        onSaveChange(false);
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  const [updatePatientChart, { loading }] = useMutation<
    any,
    MutationUpdatePatientChartArgs
  >(UPDATE_PATIENT_CHART, {
    onCompleted() {
      setModified(false);
      notifDispatch({
        type: 'showSavedNotification',
      });
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

  const [deleteChiefComplaint] = useMutation<
    any,
    MutationDeleteChiefComplaintArgs
  >(DELETE_CHIEF_COMPLAINT, {
    onCompleted(data) {
      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Success',
        notifSubTitle: 'Chief complaint deleted successfully',
        variant: 'success',
      });

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

  const [updateChiefComplaint] = useMutation<any, any>(UPDATE_CHIEF_COMPLAINT, {
    update: (cache, mutationResult) => {
      const chiefComplaint = mutationResult.data.updateChiefComplaint;

      const data = cache.readQuery<Query, QueryChiefComplaintsArgs>({
        query: GET_DATA,
        variables: {
          page: { page: 0, size: 100 },
          filter: { patientChartId: patientChartId },
        },
      });

      if (data !== null) {
        cache.writeQuery({
          query: GET_DATA,
          variables: {
            page: { page: 0, size: 100 },
            filter: { patientChartId: patientChartId },
          },
          data: {
            chiefComplaints: [...data.chiefComplaints.edges, chiefComplaint],
          },
        });
      }
    },
    onError(error) {
      onSaveChange(false);
      notifDispatch({
        type: 'showNotification',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
    onCompleted(data) {
      onSaveChange(false);
    },
  });

  const handleChiefComplaintClick = (title: string) => {
    if (patientChartId !== undefined) {
      onSaveChange(true);

      saveChiefComplaint({
        variables: {
          input: {
            title,
            patientChartId: patientChartId,
            hpiComponentIds: [],
          },
        },
      });
    }
  };

  const onSave = () => {
    const values = getValues();
    if (patientChartId !== undefined) {
      const input = {
        ...values,
        id: patientChartId,
      };

      updatePatientChart({
        variables: {
          input,
        },
      });
    }
  };

  const handleInputOnChange = () => {
    setModified(true);
  };

  return (
    <div>
      <Prompt
        when={modified}
        message="This page has unsaved data. Please click cancel and try again"
      />
      <div className="flex space-x-6">
        <div className="w-1/3">
          <ChiefComplaintTypes
            locked={locked}
            onItemClick={handleChiefComplaintClick}
          />
        </div>
        <div className="flex-1">
          <div className="grid grid-rows-2 gap-y-5">
            <div className="row-span-1 bg-gray-50 rounded shadow-lg p-5">
              <p className="text-2xl text-gray-600 font-bold">
                History of Present Illness
              </p>

              <hr className="mt-4 mb-4" />

              {data?.chiefComplaints.edges.length === 0 && (
                <div className="bg-gray-100 mt-5 flex h-44 rounded-sm shadow-inner">
                  <div className="m-auto flex space-x-1 text-gray-500">
                    <div className="material-icons">inbox</div>
                    <p className="text-center">Nothing here yet</p>
                  </div>
                </div>
              )}

              {data?.chiefComplaints.edges.map((e, i) => {
                const isEdit = hpiComponentState.find(
                  (e) => e.index === i
                )?.edit;
                const isModified = hpiComponentState.find(
                  (e) => e.index === i
                )?.modified;

                return (
                  <div
                    key={e?.node.id}
                    className={classnames(
                      'rounded-lg shadow-lg border border-gray-100 py-3 px-3 bg-white',
                      { 'mt-5': i !== 0 }
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-2xl tracking-wider text-gray-800 font-light">
                        {e?.node.title}
                      </p>
                      <button
                        className={classnames(
                          'border border-teal-600 px-3 py-1 rounded-lg flex space-x-1 items-center',
                          {
                            'text-teal-800': !isModified,
                            'text-white bg-teal-800': isModified,
                          }
                        )}
                        disabled={locked}
                        onClick={() => {
                          if (isEdit) {
                            const index = hpiComponentState.findIndex(
                              (e) => e.index === i
                            );

                            setHpiComponentState([
                              ...hpiComponentState.slice(0, index),
                              Object.assign({}, hpiComponentState[index], {
                                index: i,
                                edit: false,
                                modified: false,
                              }),
                              ...hpiComponentState.slice(index + 1),
                            ]);
                          } else {
                            const index = hpiComponentState.findIndex(
                              (e) => e.index === i
                            );

                            setHpiComponentState([
                              ...hpiComponentState.slice(0, index),
                              Object.assign({}, hpiComponentState[index], {
                                index: i,
                                edit: true,
                                modified: false,
                              }),
                              ...hpiComponentState.slice(index + 1),
                            ]);
                          }
                        }}
                      >
                        <div className="material-icons">
                          {isEdit ? 'list' : 'edit'}
                        </div>
                        <p>{isEdit ? 'List' : 'Edit'}</p>
                      </button>
                    </div>

                    <div className="mt-5">
                      {isEdit && (
                        <div>
                          <ChiefComplaintHpi
                            values={e?.node}
                            onChange={(
                              values: Maybe<HpiComponentEdge>[] | undefined,
                              hpiComponentTypeId: string | undefined
                            ) => {
                              if (
                                e?.node.id !== undefined &&
                                hpiComponentTypeId !== undefined &&
                                values !== undefined
                              ) {
                                const patientHpiComponents =
                                  e.node.hpiComponents
                                    .filter(
                                      (e) =>
                                        e?.hpiComponentTypeId !==
                                        hpiComponentTypeId
                                    )
                                    .map((e) => e?.id);

                                const selectedHpiComponents = values.map(
                                  (e) => e?.node.id
                                );

                                const hpiComponentIds = [
                                  ...patientHpiComponents,
                                  ...selectedHpiComponents,
                                ];

                                updateChiefComplaint({
                                  variables: {
                                    input: {
                                      id: e?.node.id,
                                      hpiComponentIds: hpiComponentIds,
                                    },
                                  },
                                });
                              }
                            }}
                          />

                          <div className="text-center w-full p-1 text-sm bg-red-400 text-white rounded-b-md">
                            <button
                              type="button"
                              onClick={() => {
                                if (e?.node.id !== undefined) {
                                  deleteChiefComplaint({
                                    variables: { id: e?.node.id },
                                  });
                                }
                              }}
                              className=""
                            >
                              Delete Chief Complaint
                            </button>
                          </div>
                        </div>
                      )}

                      {isEdit !== true && e?.node.hpiComponents.length === 0 && (
                        <div className="bg-gray-100 mt-5 h-32 flex rounded-sm shadow-inner">
                          <div className="m-auto flex space-x-1 text-gray-500">
                            <div className="material-icons">inbox</div>
                            <p className="text-center">Nothing here yet</p>
                          </div>
                        </div>
                      )}

                      {isEdit !== true &&
                        e?.node.hpiComponents &&
                        e?.node.hpiComponents.length > 0 && (
                          <ul>
                            {hpiComponentTypeQuery.data?.hpiComponentTypes.edges
                              .filter((t) => {
                                const hpiComponentTypeIds =
                                  e.node.hpiComponents.map(
                                    (e) => e?.hpiComponentTypeId
                                  );
                                return hpiComponentTypeIds.includes(t?.node.id);
                              })
                              .map((t) => {
                                const hpiComponents =
                                  e?.node.hpiComponents.filter(
                                    (e) => e?.hpiComponentTypeId === t?.node.id
                                  );

                                return (
                                  <li className="mt-2 pb-2" key={t?.node.id}>
                                    <div className="flex space-x-3 items-center">
                                      <span className="material-icons md-16 text-yellow-600">
                                        add_circle
                                      </span>{' '}
                                      <div>
                                        <p className="text-gray-700 text-lg">
                                          {t?.node.title}
                                        </p>
                                      </div>
                                    </div>

                                    <ul className="ml-10 mt-1 list-inside list-disc">
                                      {hpiComponents.map((e) => (
                                        <li
                                          className="text-gray-800 font-light"
                                          key={e?.id}
                                        >
                                          {e?.title}
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                );
                              })}
                          </ul>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="row-span-1 bg-gray-50 rounded shadow-lg p-5">
              <p className="text-2xl text-gray-600 font-bold">Free Text Note</p>

              <hr className="mt-4 mb-4" />

              <textarea
                name="chiefComplaintsNote"
                rows={3}
                ref={register}
                className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md h-44 w-full"
                disabled={locked}
                onChange={handleInputOnChange}
              />

              <div className="mt-2">
                <Button
                  pill={true}
                  loading={loading}
                  loadingText={'Saving'}
                  type="button"
                  text="Save"
                  icon="save"
                  variant="filled"
                  disabled={!modified}
                  onClick={() => onSave()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
