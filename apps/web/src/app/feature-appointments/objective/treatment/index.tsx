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
import { TreatmentForm } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import {
  TreatmentInput,
  MutationSaveTreatmentArgs,
  Query,
  QueryTreatmentArgs,
} from '@tensoremr/models';
import { useExitPrompt } from '@tensoremr/hooks';

const AUTO_SAVE_INTERVAL = 1000;

const SAVE_TREATMENT = gql`
  mutation SaveTreatment($input: TreatmentInput!) {
    saveTreatment(input: $input) {
      id
    }
  }
`;

const GET_TREATMENT = gql`
  query GetTreatment($patientChartId: ID!) {
    treatment(patientChartId: $patientChartId) {
      id
      note
      result
      treatmentType {
        id
        title
      }
    }
  }
`;

interface Props {
  locked: boolean;
  patientChartId: string;
}

export const TreatmentObjectivePage: React.FC<Props> = ({
  locked,
  patientChartId,
}) => {
  const notifDispatch = useNotificationDispatch();
  const [timer, setTimer] = useState<any>(null);
  const [modified, setModified] = useState<boolean>(false);
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);

  const { register, getValues, reset } = useForm<TreatmentInput>();

  const { data, refetch } = useQuery<Query, QueryTreatmentArgs>(GET_TREATMENT, {
    variables: {
      patientChartId,
    },
  });

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    const treatment = data?.treatment;

    if (treatment !== undefined) {
      reset({
        note: treatment.note,
        result: treatment.result,
        patientChartId: treatment.patientChartId,
      });
    }
  }, [data?.treatment]);

  const [save] = useMutation<any, MutationSaveTreatmentArgs>(SAVE_TREATMENT, {
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

  const handleChange = () => {
    setModified(true);
    setShowExitPrompt(true);
    clearTimeout(timer);

    const data = getValues();
    const isEmpty = _.values(data).every((v) => _.isEmpty(v));

    setTimer(
      setTimeout(() => {
        if (patientChartId !== undefined && !isEmpty) {
          const input = {
            ...data,
            patientChartId,
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

      <div className="text-2xl text-gray-600 font-semibold">
        {data?.treatment.treatmentType.title}
      </div>

      <hr className="mt-5" />

      <TreatmentForm
        register={register}
        locked={locked}
        handleChange={handleChange}
      />
    </div>
  );
};
