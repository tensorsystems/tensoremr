/* eslint-disable @typescript-eslint/ban-ts-comment */
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

import { useMutation, useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Prompt } from 'react-router-dom';
import { IopForm } from './IopForm';
import { VisualAcuityForm } from './VisualAcuityForm';
import {
  MutationSaveVitalSignsArgs,
  MutationUpdateVitalSignsArgs,
  Query,
  QueryVitalSignsArgs,
  VitalSignsUpdateInput,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useExitPrompt } from '@tensoremr/hooks';
import ReactLoading from 'react-loading';

const AUTO_SAVE_INTERVAL = 1000;

const GET_VITAL_SIGNS = gql`
  query GetVitalSigns($filter: VitalSignsFilter!) {
    vitalSigns(filter: $filter) {
      id
      bloodPressureSystolic
      bloodPressureDiastolic
      rightDistanceUncorrected
      leftDistanceUncorrected
      rightDistancePinhole
      leftDistancePinhole
      rightDistanceCorrected
      leftDistanceCorrected
      rightNearUncorrected
      leftNearUncorrected
      rightNearPinhole
      leftNearPinhole
      rightNearCorrected
      leftNearCorrected
      rightApplanation
      leftApplanation
      rightTonopen
      leftTonopen
      rightDigital
      leftDigital
      rightNoncontact
      leftNoncontact
    }
  }
`;

const SAVE_VITAL_SIGNS = gql`
  mutation SaveVitalSigns($input: VitalSignsUpdateInput!) {
    updateVitalSigns(input: $input) {
      id
    }
  }
`;

const CREATE_VITAL_SIGNS = gql`
  mutation SaveVitalSigns($input: VitalSignsInput!) {
    saveVitalSigns(input: $input) {
      id
    }
  }
`;

export const OphthalmologyVitalSigns: React.FC<{
  locked: boolean;
  patientChartId: string | undefined;
  onSaveChange: (saving: boolean) => void;
}> = ({ locked, patientChartId }) => {
  const notifDispatch = useNotificationDispatch();

  const { data, error, refetch, loading } = useQuery<
    Query,
    QueryVitalSignsArgs
  >(GET_VITAL_SIGNS, {
    variables: { filter: { patientChartId } },
  });

  useEffect(() => {
    refetch();
  }, []);

  const [createVitalSigns] = useMutation<any, MutationSaveVitalSignsArgs>(
    CREATE_VITAL_SIGNS,
    {
      onCompleted(data) {
        refetch();
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

  useEffect(() => {
    if (error?.message === 'record not found' && patientChartId) {
      createVitalSigns({
        variables: {
          input: {
            patientChartId: patientChartId,
          },
        },
      });
    }
  }, [error, patientChartId]);

  const [timer, setTimer] = useState<any>(null);
  const [modified, setModified] = useState<boolean>(false);
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);

  const { register, getValues, reset } = useForm<VitalSignsUpdateInput>();

  useEffect(() => {
    if (data?.vitalSigns) {
      const vitalSignsForm = data?.vitalSigns;

      reset({
        rightDistanceUncorrected: vitalSignsForm?.rightDistanceUncorrected,
        leftDistanceUncorrected: vitalSignsForm?.leftDistanceUncorrected,
        rightDistancePinhole: vitalSignsForm?.rightDistancePinhole,
        leftDistancePinhole: vitalSignsForm?.leftDistancePinhole,
        rightDistanceCorrected: vitalSignsForm?.rightDistanceCorrected,
        leftDistanceCorrected: vitalSignsForm?.leftDistanceCorrected,
        rightNearUncorrected: vitalSignsForm?.rightNearUncorrected,
        leftNearUncorrected: vitalSignsForm?.leftNearUncorrected,
        rightNearPinhole: vitalSignsForm?.rightNearPinhole,
        leftNearPinhole: vitalSignsForm?.leftNearPinhole,
        rightNearCorrected: vitalSignsForm?.rightNearCorrected,
        leftNearCorrected: vitalSignsForm?.leftNearCorrected,
        rightNoncontact: vitalSignsForm?.rightNoncontact,
        leftNoncontact: vitalSignsForm?.leftNoncontact,
        rightApplanation: vitalSignsForm?.rightApplanation,
        leftApplanation: vitalSignsForm?.leftApplanation,
        rightTonopen: vitalSignsForm?.rightTonopen,
        leftTonopen: vitalSignsForm?.leftTonopen,
        rightDigital: vitalSignsForm?.rightDigital,
        leftDigital: vitalSignsForm?.leftDigital,
        bloodPressureSystolic: vitalSignsForm?.bloodPressureSystolic,
        bloodPressureDiastolic: vitalSignsForm?.bloodPressureDiastolic,
      });
    }
  }, [data]);

  const [save] = useMutation<any, MutationUpdateVitalSignsArgs>(
    SAVE_VITAL_SIGNS,
    {
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
    }
  );

  const handleChange = () => {
    clearTimeout(timer);

    const values: any = getValues();

    const isEmpty = _.values(values).every((v) => _.isEmpty(v));

    if (!isEmpty) {
      setModified(true);
      setShowExitPrompt(true);
    }

    setTimer(
      setTimeout(() => {
        if (data?.vitalSigns.id !== undefined && !isEmpty) {
          const input: VitalSignsUpdateInput = {
            ...values,
            bloodPressureSystolic: values.bloodPressureSystolic
              ? parseFloat(values.bloodPressureSystolic)
              : undefined,
            bloodPressureDiastolic: values.bloodPressureDiastolic
              ? parseFloat(values.bloodPressureDiastolic)
              : undefined,
            id: data?.vitalSigns.id,
          };
          save({
            variables: {
              input,
            },
          });
        }
      }, AUTO_SAVE_INTERVAL)
    );
  };

  return (
    <div className="container mx-auto bg-gray-50 rounded shadow-lg p-5">
      <Prompt
        when={modified}
        message="This page has unsaved data. Please click cancel and try again"
      />

      <div className="text-2xl text-gray-600 font-semibold">Vital Signs</div>

      <hr className="mt-5" />

      {error?.message === 'record not found' || loading ? (
        <div className="flex justify-center mt-10 h-screen">
          {/* @ts-ignore */}
          <ReactLoading
            type={'spinningBubbles'}
            color={'gray'}
            height={70}
            width={70}
            className="inline-block"
          />
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-x-3 gap-y-7 mt-5">
          <div className="col-span-1"></div>
          <div className="col-span-5">
            <div className="grid grid-cols-5 gap-3 justify-items-center">
              <div></div>
              <div className="col-span-2">OD</div>
              <div className="col-span-2">OS</div>
            </div>
          </div>

          <div className="col-span-1 justify-self-end text-gray-500 tracking-wide font-semibold">
            Visual Acuity
          </div>
          <div className="col-span-5 border-l border-green-500">
            <VisualAcuityForm
              locked={locked}
              register={register}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-1 justify-self-end text-gray-500 tracking-wide font-semibold">
            IOP
          </div>
          <div className="col-span-5 border-l border-green-500">
            <IopForm
              locked={locked}
              register={register}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-1 justify-self-end text-gray-500 tracking-wide font-semibold">
            Other Vitals
          </div>
          <div className="col-span-5 border-l border-green-500">
            <div className="flex space-x-8 items-center mt-4">
              <div className="w-1/6">
                <p className="text-gray-600 tracking-wide text-center">
                  Blood Pressure
                </p>
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  name="bloodPressureSystolic"
                  placeholder="mmHg"
                  ref={register}
                  onChange={handleChange}
                  disabled={locked}
                  className="p-1 pl-4 sm:text-md w-full border-gray-300 border rounded-md"
                />
              </div>
              <div>/</div>
              <div className="flex-1">
                <input
                  type="number"
                  name="bloodPressureDiastolic"
                  placeholder="mmHg"
                  ref={register}
                  onChange={handleChange}
                  disabled={locked}
                  className="p-1 pl-4 sm:text-md w-full border-gray-300 border rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
