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
  MutationSaveSurgicalProcedureArgs,
  Query,
  QuerySurgicalProcedureArgs,
  SurgicalProcedureInput,
} from '@tensoremr/models';
import { PreOpForm } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useExitPrompt } from '@tensoremr/hooks';

const AUTO_SAVE_INTERVAL = 1000;

const SAVE_SURGICAL_PROCEDURE = gql`
  mutation SaveSurgicalProcedure($input: SurgicalProcedureInput!) {
    saveSurgicalProcedure(input: $input) {
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
  const [timer, setTimer] = useState<any>(null);
  const [modified, setModified] = useState<boolean>(false);
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);

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

  const { register, reset, getValues } = useForm<SurgicalProcedureInput>({
    defaultValues: {
      patientChartId: patientChartId,
    },
  });

  useEffect(() => {
    const surgicalProcedure = data?.surgicalProcedure;
    if (surgicalProcedure !== undefined) {
      reset({
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

  const [save] = useMutation<any, MutationSaveSurgicalProcedureArgs>(
    SAVE_SURGICAL_PROCEDURE,
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

      <div className="text-2xl text-gray-600 font-semibold">{`${data?.surgicalProcedure?.surgicalProcedureType?.title} Pre-op`}</div>

      <hr className="mt-5" />

      <PreOpForm
        register={register}
        locked={locked}
        handleChanges={handleChanges}
      />
    </div>
  );
};
