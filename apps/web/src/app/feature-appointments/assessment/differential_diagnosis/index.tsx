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
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNotificationDispatch } from '@tensoremr/notification';
import { DiagnosisList } from './DiagnosisList';
import {
  MutationDeletePatientDiagnosisArgs,
  MutationSavePatientDiagnosisArgs,
  MutationUpdatePatientChartArgs,
  PatientChartUpdateInput,
  Query,
} from '@tensoremr/models';
import { Prompt } from 'react-router-dom';
import { useExitPrompt } from '@tensoremr/hooks';
import _ from 'lodash';

const AUTO_SAVE_INTERVAL = 1000;

const GET_DATA = gql`
  query PatientDiagnoses(
    $page: PaginationInput!
    $filter: PatientDiagnosisFilter
    $patientChartId: ID!
  ) {
    patientDiagnoses(page: $page, filter: $filter) {
      totalCount
      pageInfo {
        totalPages
      }
      edges {
        node {
          id
          fullDescription
          location
        }
      }
    }

    patientChart(id: $patientChartId) {
      differentialDiagnosisNote
    }
  }
`;

const SAVE_PATIENT_DIAGNOSIS = gql`
  mutation SavePatientDiagnosis($input: PatientDiagnosisInput!) {
    savePatientDiagnosis(input: $input) {
      id
    }
  }
`;

const DELETE_PATIENT_DIAGNOSIS = gql`
  mutation DeletePatientDiagnosis($id: ID!) {
    deletePatientDiagnosis(id: $id)
  }
`;

const UPDATE_PATIENT_CHART = gql`
  mutation UpdatePatientChart($input: PatientChartUpdateInput!) {
    updatePatientChart(input: $input) {
      id
    }
  }
`;

export const DifferentialDiagnosisPage: React.FC<{
  locked: boolean;
  patientChartId: string;
  medicalDepartment: string | undefined | null;
  onSaveChange: (saving: boolean) => void;
}> = ({ locked, patientChartId, medicalDepartment, onSaveChange }) => {
  const notifDispatch = useNotificationDispatch();
  const { register, getValues, setValue } = useForm<PatientChartUpdateInput>({
    defaultValues: {
      id: patientChartId,
    },
  });

  const [timer, setTimer] = useState<any>(null);
  const [modified, setModified] = useState<boolean>(false);
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);

  const { data, refetch } = useQuery<Query, any>(GET_DATA, {
    variables: {
      page: { page: 0, size: 100 },
      filter: {
        patientChartId,
        differential: true,
      },
      patientChartId,
    },
  });

  useEffect(() => {
    if (data?.patientChart) {
      setValue(
        'differentialDiagnosisNote',
        data?.patientChart.differentialDiagnosisNote
      );
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, []);

  const [savePatientDiagnosis] = useMutation<
    any,
    MutationSavePatientDiagnosisArgs
  >(SAVE_PATIENT_DIAGNOSIS, {
    onCompleted(data) {
      onSaveChange(false);

      notifDispatch({
        type: 'show',
        notifTitle: 'Success',
        notifSubTitle: 'Differential diagnosis saved successfully',
        variant: 'success',
      });

      refetch();
    },
    onError(error) {
      onSaveChange(false);

      notifDispatch({
        type: 'show',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  const [updatePatientChart] = useMutation<any, MutationUpdatePatientChartArgs>(
    UPDATE_PATIENT_CHART,
    {
      onCompleted() {
        setModified(false);
        setShowExitPrompt(false);
      },
      onError(error) {
        onSaveChange(false);
        notifDispatch({
          type: 'show',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  const [deletePatientDiagnosis] = useMutation<
    any,
    MutationDeletePatientDiagnosisArgs
  >(DELETE_PATIENT_DIAGNOSIS, {
    onCompleted(data) {
      onSaveChange(false);

      notifDispatch({
        type: 'show',
        notifTitle: 'Success',
        notifSubTitle: 'Differential Diagnosis deleted successfully',
        variant: 'success',
      });

      refetch();
    },
    onError(error) {
      onSaveChange(false);

      notifDispatch({
        type: 'show',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  const handleDiagnosisClick = (diagnosisId: string, location: string) => {
    if (patientChartId) {
      onSaveChange(true);
      savePatientDiagnosis({
        variables: {
          input: {
            diagnosisId,
            patientChartId: patientChartId,
            location: location,
            differential: true,
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

    setTimer(
      setTimeout(() => {
        if (patientChartId) {
          const input = {
            ...data,
            id: patientChartId,
          };

          updatePatientChart({
            variables: {
              input,
            },
          });
        }
      }, AUTO_SAVE_INTERVAL)
    );
  };

  return (
    <div>
      <Prompt
        when={modified}
        message="This page has unsaved data. Please click cancel and try again"
      />

      <div className="flex space-x-6">
        <div className="w-1/3">
          <DiagnosisList
            locked={locked}
            medicalDepartment={medicalDepartment}
            onItemClick={handleDiagnosisClick}
          />
        </div>
        <div className="flex-1">
          <div className="grid grid-rows-2 gap-y-5">
            <div className="row-span-1 bg-gray-50 rounded shadow-lg p-5">
              <p className="text-2xl text-gray-600 font-bold">
                Differential Diagnosis
              </p>

              <hr className="mt-4 mb-4" />

              {data?.patientDiagnoses.edges.length === 0 && (
                <div className="bg-gray-100 mt-5 flex h-44 rounded-sm shadow-inner">
                  <div className="m-auto flex space-x-1 text-gray-500">
                    <div className="material-icons">inbox</div>
                    <p className="text-center">Nothing here yet</p>
                  </div>
                </div>
              )}

              <ul className="overflow-auto">
                {data?.patientDiagnoses.edges.map((e, i) => (
                  <li
                    key={e?.node.id}
                    className="flex justify-between py-4 px-2"
                  >
                    <div className="flex space-x-3">
                      <span className="material-icons text-teal-800">
                        check_circle
                      </span>{' '}
                      <div>
                        <p className="font-semibold text-gray-700">
                          {e?.node.fullDescription}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {e?.node.location}
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
                              onSaveChange(true);

                              deletePatientDiagnosis({
                                variables: { id: e?.node.id },
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
              <p className="text-2xl text-gray-600 font-bold">Note</p>

              <hr className="mt-4 mb-4" />

              <textarea
                name="differentialDiagnosisNote"
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
