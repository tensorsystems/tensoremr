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

import { gql, useMutation } from '@apollo/client';
import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  PatientChartUpdateInput,
  MutationUpdatePatientChartArgs,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useExitPrompt } from '@tensoremr/hooks';

const AUTO_SAVE_INTERVAL = 1000;

const UPDATE_PATIENT_CHART = gql`
  mutation UpdatePatientChart($input: PatientChartUpdateInput!) {
    updatePatientChart(input: $input) {
      id
    }
  }
`;

export const Stickie: React.FC<{
  stickieNote: string | undefined | null;
  patientChartId: string | undefined;
}> = ({ stickieNote, patientChartId }) => {
  const [timer, setTimer] = useState<any>(null);
  const [modified, setModified] = useState<boolean>(false);
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);

  const { register, setValue, getValues } = useForm<PatientChartUpdateInput>({
    defaultValues: {
      stickieNote: stickieNote,
    },
  });

  useEffect(() => {
    if (stickieNote) {
      setValue('stickieNote', stickieNote);
    }
  }, [stickieNote]);

  const notifDispatch = useNotificationDispatch();

  const [updatePatientChart] = useMutation<any, MutationUpdatePatientChartArgs>(
    UPDATE_PATIENT_CHART,
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

  const handleChanges = () => {
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
    <div className="shadow overflow-hidden h-36 bg-yellow-200">
      <div className="bg-yellow-300">
        <p className="text-xs text-gray-600 pl-2">Stickie</p>
      </div>
      <textarea
        name="stickieNote"
        ref={register}
        className="w-full h-full bg-yellow-100 p-1 text-xs focus:outline-none border-none"
        onChange={handleChanges}
      />
    </div>
  );
};
