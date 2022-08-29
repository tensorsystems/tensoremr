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
import { Autosave } from '@tensoremr/ui-components';
import { Prompt } from 'react-router-dom';

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
  const [modified, setModified] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const { register, setValue, watch } = useForm<PatientChartUpdateInput>({
    defaultValues: {
      stickieNote: stickieNote,
    },
  });

  useEffect(() => {
    if (stickieNote) {
      setValue('stickieNote', stickieNote);
    }
  }, [stickieNote, setValue]);

  const notifDispatch = useNotificationDispatch();

  const [updatePatientChart] = useMutation<any, MutationUpdatePatientChartArgs>(
    UPDATE_PATIENT_CHART,
    {
      ignoreResults: true,
      onCompleted() {
        setIsUpdating(false);
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
    }
  );

  const onSave = (values: any) => {
    if (patientChartId) {
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
    setIsUpdating(true);
  };

  const dataWatch = watch();

  return (
    <div className="shadow overflow-hidden h-36 bg-yellow-200">
      <Prompt
        when={modified}
        message="This page has unsaved data. Please click cancel and try again"
      />

      <Autosave
        isLoading={isUpdating}
        data={dataWatch}
        onSave={(data: any) => {
          onSave(data);
        }}
      />

      <div className="bg-yellow-300">
        <p className="text-xs text-gray-600 pl-2">Stickie</p>
      </div>
      <textarea
        name="stickieNote"
        ref={register}
        className="w-full h-full bg-yellow-100 p-1 text-xs focus:outline-none border-none"
        onChange={handleInputOnChange}
      />
    </div>
  );
};
