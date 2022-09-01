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
import { useForm } from 'react-hook-form';
import { Prompt } from 'react-router-dom';
import {
  MutationSaveSurgicalProcedureArgs,
  MutationUpdateSurgicalProcedureArgs,
  Query,
  QuerySurgicalProcedureArgs,
  SurgicalProcedureUpdateInput,
} from '@tensoremr/models';
import { Autosave, Button, PreOpForm } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';

const SAVE_SURGICAL_PROCEDURE = gql`
  mutation SaveSurgicalProcedure($input: SurgicalProcedureUpdateInput!) {
    updateSurgicalProcedure(input: $input) {
      id
    }
  }
`;

const GET_PRE_OP = gql`
  query GetPreop($patientChartId: ID!) {
    surgicalProcedure(patientChartId: $patientChartId) {
      id
      rightCorrected
      leftCorrected
      rightIop
      leftIop
      rightAnteriorSegment
      leftAnteriorSegment
      rightPosteriorSegment
      leftPosteriorSegment
      rightBiometry
      leftBiometry
      diabetes
      hpn
      asthma
      cardiacDisease
      allergies
      bloodPressure
      bloodSugar
      uriAnalysis
      surgicalProcedureType {
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

export const PreOpPage: React.FC<Props> = ({ locked, patientChartId }) => {
  const notifDispatch = useNotificationDispatch();
  const [modified, setModified] = useState<boolean>(false);

  const { data, refetch } = useQuery<Query, QuerySurgicalProcedureArgs>(
    GET_PRE_OP,
    {
      variables: {
        patientChartId,
      },
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  const { register, reset, getValues } = useForm<SurgicalProcedureUpdateInput>(
    {}
  );

  useEffect(() => {
    const surgicalProcedure = data?.surgicalProcedure;
    if (surgicalProcedure !== undefined) {
      reset({
        id: surgicalProcedure.id.toString(),
        rightCorrected: surgicalProcedure.rightCorrected,
        leftCorrected: surgicalProcedure.leftCorrected,
        rightIop: surgicalProcedure.rightIop,
        leftIop: surgicalProcedure.leftIop,
        rightAnteriorSegment: surgicalProcedure.rightAnteriorSegment,
        leftAnteriorSegment: surgicalProcedure.leftAnteriorSegment,
        rightPosteriorSegment: surgicalProcedure.rightPosteriorSegment,
        leftPosteriorSegment: surgicalProcedure.leftPosteriorSegment,
        rightBiometry: surgicalProcedure.rightBiometry,
        leftBiometry: surgicalProcedure.leftBiometry,
        bloodPressure: surgicalProcedure.bloodPressure,
        bloodSugar: surgicalProcedure.bloodSugar,
        uriAnalysis: surgicalProcedure.uriAnalysis,
        diabetes: surgicalProcedure.diabetes,
        asthma: surgicalProcedure.asthma,
        hpn: surgicalProcedure.hpn,
        cardiacDisease: surgicalProcedure.cardiacDisease,
        allergies: surgicalProcedure.allergies,
      });
    }
  }, [data?.surgicalProcedure]);

  const [save, { loading }] = useMutation<
    any,
    MutationUpdateSurgicalProcedureArgs
  >(SAVE_SURGICAL_PROCEDURE, {
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
      <div className="text-2xl text-gray-600 font-semibold">{`${data?.surgicalProcedure?.surgicalProcedureType?.title} Pre-op`}</div>

      <hr className="mt-5" />

      <input type="hidden" name="id" ref={register} />

      <PreOpForm
        register={register}
        locked={locked}
        handleChanges={handleInputOnChange}
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
  );
};
