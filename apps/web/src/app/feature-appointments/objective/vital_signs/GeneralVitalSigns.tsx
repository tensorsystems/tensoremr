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

import { gql, useMutation, useQuery } from '@apollo/client';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Prompt } from 'react-router-dom';
import {
  MutationUpdateVitalSignsArgs,
  Patient,
  Query,
  QueryVitalSignsArgs,
  VitalSignsUpdateInput,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useExitPrompt } from '@tensoremr/hooks';
import { InformationCircleIcon } from '@heroicons/react/solid';
import ReactTooltip from 'react-tooltip';
import { differenceInMonths, parseISO } from 'date-fns';

const AUTO_SAVE_INTERVAL = 1000;

const GET_VITAL_SIGNS = gql`
  query GetVitalSigns($filter: VitalSignsFilter!) {
    vitalSigns(filter: $filter) {
      id
      temperature
      pulse
      bloodPressureSystolic
      bloodPressureDiastolic
      respiratoryRate
      oxygenSaturation
      height
      weight
      bmi
    }
  }
`;

const UPDATE_VITAL_SIGNS = gql`
  mutation UpdateVitalSigns($input: VitalSignsUpdateInput!) {
    updateVitalSigns(input: $input) {
      id
    }
  }
`;

interface Props {
  patientChartId: string;
  patient: Patient;
  locked: boolean;
}

export const GeneralVitalSigns: React.FC<Props> = ({
  locked,
  patientChartId,
  patient,
}) => {
  const notifDispatch = useNotificationDispatch();

  const [timer, setTimer] = useState<any>(null);
  const [modified, setModified] = useState<boolean>(false);
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);

  const { data, refetch } = useQuery<Query, QueryVitalSignsArgs>(
    GET_VITAL_SIGNS,
    {
      variables: {
        filter: { patientChartId },
      },
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  const { register, getValues, setValue, watch, reset } =
    useForm<VitalSignsUpdateInput>();

  useEffect(() => {
    if (data?.vitalSigns) {
      reset({
        temperature: data?.vitalSigns.temperature,
        pulse: data?.vitalSigns.pulse,
        bloodPressureSystolic: data?.vitalSigns.bloodPressureSystolic,
        bloodPressureDiastolic: data?.vitalSigns.bloodPressureDiastolic,
        respiratoryRate: data?.vitalSigns.respiratoryRate,
        oxygenSaturation: data?.vitalSigns.oxygenSaturation,
        height: data?.vitalSigns.height,
        weight: data?.vitalSigns.weight,
        bmi: data?.vitalSigns.bmi,
      });
    }
  }, [data?.vitalSigns]);

  const [updateVitalSigns] = useMutation<any, MutationUpdateVitalSignsArgs>(
    UPDATE_VITAL_SIGNS,
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

  const handleChanges = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setModified(true);
    setShowExitPrompt(true);
    clearTimeout(timer);

    if (evt.target.name === 'height' || evt.target.name === 'weight') {
      const bmi =
        (formData.height &&
          formData.weight &&
          (formData.weight / formData.height / formData.height) * 10000) ??
        -1;

      if (bmi) {
        setValue('bmi', bmi);
      }
    }

    const values: any = getValues();
    const isEmpty = _.values(data).every((v) => _.isEmpty(v));

    setTimer(
      setTimeout(() => {
        if (data?.vitalSigns.id !== undefined && !isEmpty) {
          const input: VitalSignsUpdateInput = {
            id: data?.vitalSigns.id,
            temperature: parseFloat(values.temperature),
            pulse: values.pulse ? parseFloat(values.pulse) : null,
            bloodPressureSystolic: values.bloodPressureSystolic
              ? parseFloat(values.bloodPressureSystolic)
              : undefined,
            bloodPressureDiastolic: values.bloodPressureDiastolic
              ? parseFloat(values.bloodPressureDiastolic)
              : undefined,
            respiratoryRate: values.respiratoryRate
              ? parseFloat(values.respiratoryRate)
              : undefined,
            oxygenSaturation: values.oxygenSaturation
              ? parseFloat(values.oxygenSaturation)
              : undefined,
            height: values.height ? parseFloat(values.height) : undefined,
            weight: values.weight ? parseFloat(values.weight) : undefined,
            bmi: values.bmi ? parseFloat(values.bmi) : undefined,
          };

          updateVitalSigns({
            variables: {
              input,
            },
          });
        }
      }, AUTO_SAVE_INTERVAL)
    );
  };

  const ageInMonths = differenceInMonths(
    new Date(),
    parseISO(patient.dateOfBirth)
  );

  const formData = watch();

  const temperatureNormal =
    formData.temperature &&
    formData.temperature > 36.1 &&
    formData.temperature < 37.2;

  let bpmNormal = true;

  if (formData.pulse) {
    if (ageInMonths <= 0) {
      // Upto 1 month
      bpmNormal = formData.pulse >= 100 && formData.pulse <= 160;
    } else if (ageInMonths > 0 && ageInMonths <= 5) {
      // 0 - 5 months
      bpmNormal = formData.pulse >= 90 && formData.pulse <= 150;
    } else if (ageInMonths > 6 && ageInMonths < 12) {
      // 6 - 12 months
      bpmNormal = formData.pulse >= 80 && formData.pulse <= 140;
    } else if (ageInMonths >= 12 && ageInMonths < 36) {
      // 1 - 3 years
      bpmNormal = formData.pulse >= 80 && formData.pulse <= 130;
    } else if (ageInMonths >= 36 && ageInMonths < 60) {
      // 3 - 5 years
      bpmNormal = formData.pulse >= 80 && formData.pulse <= 120;
    } else if (ageInMonths >= 60 && ageInMonths < 120) {
      // 6 - 10 years
      bpmNormal = formData.pulse >= 70 && formData.pulse <= 100;
    } else if (ageInMonths >= 120 && ageInMonths < 168) {
      // 11 - 14 years
      bpmNormal = formData.pulse >= 60 && formData.pulse <= 105;
    } else if (ageInMonths < 168) {
      // 14 years or older
      bpmNormal = formData.pulse >= 60 && formData.pulse <= 100;
    }
  }

  const bloodPressureNormal =
    formData.bloodPressureDiastolic &&
    formData.bloodPressureSystolic &&
    formData.bloodPressureSystolic <= 120 &&
    formData.bloodPressureDiastolic <= 80;

  const rpmNormal =
    formData.respiratoryRate &&
    formData.respiratoryRate >= 12 &&
    formData.respiratoryRate <= 20;

  const oxygenSaturationNormal =
    formData.oxygenSaturation && formData.oxygenSaturation >= 90;

  const bmiNormal =
    formData.bmi && formData.bmi >= 18.5 && formData.bmi <= 24.9;

  return (
    <div className="container mx-auto bg-gray-50 rounded shadow-lg p-5">
      <Prompt
        when={modified}
        message="This page has unsaved data. Please click cancel and try again"
      />

      <div className="text-2xl text-gray-600 font-semibold">Vital Signs</div>

      <hr className="mt-5" />

      <div className="flex space-x-8 items-center mt-4">
        <div className="w-1/6">
          <p className="text-gray-900 tracking-wide">Temperature</p>
        </div>
        <div className="flex-1">
          <input
            type="number"
            name="temperature"
            placeholder="C°"
            ref={register}
            onChange={handleChanges}
            disabled={locked}
            className="p-1 pl-4 sm:text-md w-full border-gray-300 border rounded-md"
          />
        </div>
        {formData.temperature && !temperatureNormal && (
          <div>
            <div data-tip data-for={'temperature'}>
              <InformationCircleIcon className="h-6 w-6 text-yellow-400" />
            </div>
            {/* @ts-ignore */}
            <ReactTooltip id={'temperature'} type="warning">
              Abnormal
            </ReactTooltip>
          </div>
        )}
      </div>

      <div className="flex space-x-8 items-center mt-4">
        <div className="w-1/6">
          <p className="text-gray-900 tracking-wide">Pulse</p>
        </div>
        <div className="flex-1">
          <input
            type="number"
            name="pulse"
            placeholder="bpm"
            ref={register}
            onChange={handleChanges}
            disabled={locked}
            className="p-1 pl-4 sm:text-md w-full border-gray-300 border rounded-md"
          />
        </div>
        {formData.pulse && !bpmNormal && (
          <div>
            <div data-tip data-for={'pulse'}>
              <InformationCircleIcon className="h-6 w-6 text-yellow-400" />
            </div>
            {/* @ts-ignore */}
            <ReactTooltip id={'pulse'} type="warning">
              Abnormal
            </ReactTooltip>
          </div>
        )}
      </div>

      <div className="flex space-x-8 items-center mt-4">
        <div className="w-1/6">
          <p className="text-gray-900 tracking-wide">Blood Pressure</p>
        </div>
        <div className="flex-1">
          <input
            type="number"
            name="bloodPressureSystolic"
            placeholder="mmHg"
            ref={register}
            onChange={handleChanges}
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
            onChange={handleChanges}
            disabled={locked}
            className="p-1 pl-4 sm:text-md w-full border-gray-300 border rounded-md"
          />
        </div>
        {formData.bloodPressureDiastolic &&
          formData.bloodPressureSystolic &&
          !bloodPressureNormal && (
            <div>
              <div data-tip data-for={'bloodPressure'}>
                <InformationCircleIcon className="h-6 w-6 text-yellow-400" />
              </div>
              {/* @ts-ignore */}
              <ReactTooltip id={'bloodPressure'} type="warning">
                Abnormal
              </ReactTooltip>
            </div>
          )}
      </div>

      <div className="flex space-x-8 items-center mt-4">
        <div className="w-1/6">
          <p className="text-gray-900 tracking-wide">Respiratory Rate</p>
        </div>
        <div className="flex-1">
          <input
            type="number"
            name="respiratoryRate"
            placeholder="rpm"
            ref={register}
            onChange={handleChanges}
            disabled={locked}
            className="p-1 pl-4 sm:text-md w-full border-gray-300 border rounded-md"
          />
        </div>
        {formData.respiratoryRate && !rpmNormal && (
          <div>
            <div data-tip data-for={'rpm'}>
              <InformationCircleIcon className="h-6 w-6 text-yellow-400" />
            </div>
            {/* @ts-ignore */}
            <ReactTooltip id={'rpm'} type="warning">
              Abnormal
            </ReactTooltip>
          </div>
        )}
      </div>

      <div className="flex space-x-8 items-center mt-4">
        <div className="w-1/6">
          <p className="text-gray-900 tracking-wide">Oxygen Saturation</p>
        </div>
        <div className="flex-1">
          <input
            type="number"
            name="oxygenSaturation"
            placeholder="%"
            ref={register}
            onChange={handleChanges}
            disabled={locked}
            className="p-1 pl-4 sm:text-md w-full border-gray-300 border rounded-md"
          />
        </div>
        {formData.oxygenSaturation && !oxygenSaturationNormal && (
          <div>
            <div data-tip data-for={'oxygenSaturation'}>
              <InformationCircleIcon className="h-6 w-6 text-yellow-400" />
            </div>
            {/* @ts-ignore */}
            <ReactTooltip id={'oxygenSaturation'} type="warning">
              Abnormal
            </ReactTooltip>
          </div>
        )}
      </div>

      <div className="flex space-x-8 items-center mt-4">
        <div className="w-1/6">
          <p className="text-gray-900 tracking-wide">Height</p>
        </div>
        <div className="flex-1">
          <input
            type="number"
            name="height"
            placeholder="cm"
            ref={register}
            onChange={handleChanges}
            disabled={locked}
            className="p-1 pl-4 sm:text-md w-full border-gray-300 border rounded-md"
          />
        </div>
      </div>

      <div className="flex space-x-8 items-center mt-4">
        <div className="w-1/6">
          <p className="text-gray-900 tracking-wide">Weight</p>
        </div>
        <div className="flex-1">
          <input
            type="number"
            name="weight"
            placeholder="kg"
            ref={register}
            onChange={handleChanges}
            disabled={locked}
            className="p-1 pl-4 sm:text-md w-full border-gray-300 border rounded-md"
          />
        </div>
      </div>

      <div className="flex space-x-8 items-center mt-4">
        <div className="w-1/6">
          <p className="text-gray-900 tracking-wide">BMI</p>
        </div>
        <div className="flex-1">
          <input
            type="number"
            name="bmi"
            placeholder="BMI"
            ref={register}
            onChange={handleChanges}
            disabled={locked}
            className="p-1 pl-4 sm:text-md w-full border-gray-300 border rounded-md"
          />
        </div>
        {formData.height && formData.weight && !bmiNormal && (
          <div>
            <div data-tip data-for={'bmi'}>
              <InformationCircleIcon className="h-6 w-6 text-yellow-400" />
            </div>
            {/* @ts-ignore */}
            <ReactTooltip id={'bmi'} type="warning">
              Abnormal
            </ReactTooltip>
          </div>
        )}
      </div>
    </div>
  );
};
