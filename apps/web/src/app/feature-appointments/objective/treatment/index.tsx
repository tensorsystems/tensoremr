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
import { Autosave, Button, TreatmentForm } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import {
  Query,
  QueryTreatmentArgs,
  MutationUpdateTreatmentArgs,
  TreatmentUpdateInput,
} from '@tensoremr/models';

const SAVE_TREATMENT = gql`
  mutation UpdateTreatment($input: TreatmentUpdateInput!) {
    updateTreatment(input: $input) {
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
  const [modified, setModified] = useState<boolean>(false);

  const { register, getValues, reset } = useForm<TreatmentUpdateInput>();

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
        id: data?.treatment.id,
        note: treatment.note,
        result: treatment.result,
      });
    }
  }, [data?.treatment]);

  const [save, { loading }] = useMutation<any, MutationUpdateTreatmentArgs>(
    SAVE_TREATMENT,
    {
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
    }
  );

  const onSave = () => {
    const values = getValues();
    if (values.id) {
      const input = {
        ...values,
      };

      save({
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
    <div className="container mx-auto bg-gray-50 rounded shadow-lg p-5">
      <Prompt
        when={modified}
        message="You have unsaved work. Please go back and click save"
      />

      <div className="text-2xl text-gray-600 font-semibold">
        {data?.treatment.treatmentType.title}
      </div>

      <hr className="mt-5" />

      <input type="hidden" name="id" ref={register} />

      <TreatmentForm
        register={register}
        locked={locked}
        handleChange={handleInputOnChange}
      />

      <div className="mt-4">
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
  );
};
