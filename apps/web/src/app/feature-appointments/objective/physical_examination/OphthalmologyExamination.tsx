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
import React, { useEffect, useRef, useState } from 'react';
import {
  MutationSaveOphthalmologyExamArgs,
  MutationUpdateOphthalmologyExamArgs,
  OpthalmologyExamUpdateInput,
  Query,
  QueryOpthalmologyExamArgs,
} from '@tensoremr/models';
import { CoverTestComponent } from './CoverTestComponent';
import { ExternalExamComponent } from './ExternalExamComponent';
import { FunduscopyComponent } from './FunduscopyComponent';
import { OcularMotilityComponent } from './OcularMotilityComponent';
import { OpticDiscComponent } from './OpticDiscComponent';
import { PupilsComponent } from './PupilsComponent';
import { SlitLampExamComponent } from './SlitLampExamComponent';
import { useForm } from 'react-hook-form';
import { Prompt } from 'react-router-dom';
import { useNotificationDispatch } from '@tensoremr/notification';
import _ from 'lodash';
import ReactLoading from 'react-loading';
import { Autosave } from '@tensoremr/ui-components';

const AUTO_SAVE_INTERVAL = 1000;

const GET_OPTHALMOLOGY_EXAM = gql`
  query OpthalmologyExam($filter: OphthalmologyExamFilter!) {
    opthalmologyExam(filter: $filter) {
      id
      rightOrbits
      leftOrbits
      rightLids
      leftLids
      rightLacrimalSystem
      leftLacrimalSystem
      externalExamNote
      rightCoverTest
      leftCoverTest
      coverTestNote
      rightRetina
      leftRetina
      leftRetinaSketch
      rightRetinaSketch
      funduscopyNote
      rightOcularMotility
      leftOcularMotility
      rsr
      rio
      rlr
      rmr
      rir
      rso
      rightFlick
      lsr
      lio
      llr
      lmr
      lir
      lso
      leftFlick
      distance
      near
      ocularMotilityNote
      rightOpticDisc
      leftOpticDisc
      rightOpticDiscSketch
      leftOpticDiscSketch
      rightCdr
      leftCdr
      opticDiscNote
      rightPupils
      leftPupils
      pupilsNote
      rightConjunctiva
      leftConjunctiva
      rightCornea
      leftCornea
      rightCorneaSketch
      leftCorneaSketch
      leftSclera
      rightSclera
      rightAnteriorChamber
      leftAnteriorChamber
      rightIris
      leftIris
      rightLens
      leftLens
      rightLensSketch
      leftLensSketch
      rightVitreos
      leftVitreos
      slitLampExamNote
    }
  }
`;

const SAVE_OPTHALMOLOGY_EXAM = gql`
  mutation UpdateOphthalmologyExam($input: OpthalmologyExamUpdateInput!) {
    updateOphthalmologyExam(input: $input) {
      id
      rightFlick
    }
  }
`;

const CREATE_OPTHALMOLOGY_EXAM = gql`
  mutation SaveOphthalmologyExam($input: OpthalmologyExamInput!) {
    saveOphthalmologyExam(input: $input) {
      id
    }
  }
`;

export const OphthalmologyExamination: React.FC<{
  locked: boolean;
  patientChartId: string | undefined;
  onSaveChange: (saving: boolean) => void;
}> = ({ locked, patientChartId, onSaveChange }) => {
  const notifDispatch = useNotificationDispatch();

  const [timer, setTimer] = useState<any>(null);
  const [modified, setModified] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const rightCorneaSketchRef = useRef<any>(null);
  const leftCorneaSketchRef = useRef<any>(null);

  const rightLensSketchRef = useRef<any>(null);
  const leftLensSketchRef = useRef<any>(null);

  const rightRetinaSketchRef = useRef<any>(null);
  const leftRetinaSketchRef = useRef<any>(null);

  const rightOpticDiscSketchRef = useRef<any>(null);
  const leftOpticDiscSketchRef = useRef<any>(null);

  const { data, error, refetch, loading } = useQuery<
    Query,
    QueryOpthalmologyExamArgs
  >(GET_OPTHALMOLOGY_EXAM, {
    variables: { filter: { patientChartId } },
  });

  useEffect(() => {
    refetch();
  }, []);

  const [createOpthalmologyExam] = useMutation<
    any,
    MutationSaveOphthalmologyExamArgs
  >(CREATE_OPTHALMOLOGY_EXAM, {
    onCompleted(data) {
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

  useEffect(() => {
    if (error?.message === 'record not found' && patientChartId) {
      createOpthalmologyExam({
        variables: {
          input: {
            patientChartId: patientChartId,
          },
        },
      });
    }
  }, [error, patientChartId]);

  const { register, control, getValues, setValue, reset, watch } =
    useForm<OpthalmologyExamUpdateInput>();

  useEffect(() => {
    if (data?.opthalmologyExam) {
      const opthalmologyForm = data?.opthalmologyExam;

      reset({
        rightOrbits: opthalmologyForm?.rightOrbits,
        leftOrbits: opthalmologyForm?.leftOrbits,
        rightLids: opthalmologyForm?.rightLids,
        leftLids: opthalmologyForm?.leftLids,
        rightLacrimalSystem: opthalmologyForm?.rightLacrimalSystem,
        leftLacrimalSystem: opthalmologyForm?.leftLacrimalSystem,
        externalExamNote: opthalmologyForm?.externalExamNote,
        rightOcularMotility: opthalmologyForm?.rightOcularMotility,
        leftOcularMotility: opthalmologyForm?.leftOcularMotility,
        rsr: opthalmologyForm?.rsr,
        rio: opthalmologyForm?.rio,
        rlr: opthalmologyForm?.rlr,
        rmr: opthalmologyForm?.rmr,
        rir: opthalmologyForm?.rir,
        rso: opthalmologyForm?.rso,
        rightFlick: opthalmologyForm?.rightFlick,
        lsr: opthalmologyForm?.lsr,
        lio: opthalmologyForm?.lio,
        llr: opthalmologyForm?.llr,
        lmr: opthalmologyForm?.lmr,
        lir: opthalmologyForm?.lir,
        lso: opthalmologyForm?.lso,
        leftFlick: opthalmologyForm?.leftFlick,
        distance: opthalmologyForm?.distance,
        near: opthalmologyForm?.near,
        ocularMotilityNote: opthalmologyForm?.ocularMotilityNote,
        rightCoverTest: opthalmologyForm?.rightCoverTest,
        leftCoverTest: opthalmologyForm?.leftCoverTest,
        coverTestNote: opthalmologyForm?.coverTestNote,
        rightPupils: opthalmologyForm?.rightPupils,
        leftPupils: opthalmologyForm?.leftPupils,
        pupilsNote: opthalmologyForm?.pupilsNote,
        rightConjunctiva: opthalmologyForm?.rightConjunctiva,
        leftConjunctiva: opthalmologyForm?.leftConjunctiva,
        rightCornea: opthalmologyForm?.rightCornea,
        leftCornea: opthalmologyForm?.leftCornea,
        rightCorneaSketch: opthalmologyForm?.rightCorneaSketch,
        leftCorneaSketch: opthalmologyForm?.leftCorneaSketch,
        rightSclera: opthalmologyForm?.rightSclera,
        leftSclera: opthalmologyForm?.leftSclera,
        rightAnteriorChamber: opthalmologyForm?.rightAnteriorChamber,
        leftAnteriorChamber: opthalmologyForm?.leftAnteriorChamber,
        rightIris: opthalmologyForm?.rightIris,
        leftIris: opthalmologyForm?.leftIris,
        rightLens: opthalmologyForm?.rightLens,
        leftLens: opthalmologyForm?.leftLens,
        rightLensSketch: opthalmologyForm?.rightLensSketch,
        leftLensSketch: opthalmologyForm?.leftLensSketch,
        rightVitreos: opthalmologyForm?.rightVitreos,
        leftVitreos: opthalmologyForm?.leftVitreos,
        slitLampExamNote: opthalmologyForm?.slitLampExamNote,
        rightRetina: opthalmologyForm?.rightRetina,
        leftRetina: opthalmologyForm?.leftRetina,
        rightRetinaSketch: opthalmologyForm?.rightRetinaSketch,
        leftRetinaSketch: opthalmologyForm?.leftRetinaSketch,
        funduscopyNote: opthalmologyForm?.funduscopyNote,
        rightCdr: opthalmologyForm?.rightCdr,
        leftCdr: opthalmologyForm?.leftCdr,
        rightOpticDisc: opthalmologyForm?.rightOpticDisc,
        leftOpticDisc: opthalmologyForm?.leftOpticDisc,
        rightOpticDiscSketch: opthalmologyForm?.rightOpticDiscSketch,
        leftOpticDiscSketch: opthalmologyForm?.leftOpticDiscSketch,
        opticDiscNote: opthalmologyForm?.opticDiscNote,
      });
    }
  }, [data]);

  const [save] = useMutation<any, MutationUpdateOphthalmologyExamArgs>(
    SAVE_OPTHALMOLOGY_EXAM,
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

  const handleSlitLampSketchChange = () => {
    setIsUpdating(true);
    setModified(true);
    clearTimeout(timer);

    setTimer(
      setTimeout(() => {
        if (data?.opthalmologyExam.id !== undefined) {
          const currentValues = getValues();
          const input: OpthalmologyExamUpdateInput = {
            ...currentValues,
            id: data?.opthalmologyExam.id,
          };
          if (rightCorneaSketchRef.current !== null) {
            input.rightCorneaSketch = JSON.stringify(
              rightCorneaSketchRef.current.toJSON()
            );
          }
          if (leftCorneaSketchRef.current !== null) {
            input.leftCorneaSketch = JSON.stringify(
              leftCorneaSketchRef.current.toJSON()
            );
          }
          if (rightLensSketchRef.current !== null) {
            input.rightLensSketch = JSON.stringify(
              rightLensSketchRef.current.toJSON()
            );
          }
          if (leftLensSketchRef.current !== null) {
            input.leftLensSketch = JSON.stringify(
              leftLensSketchRef.current.toJSON()
            );
          }

          save({ variables: { input } });
        }
      }, AUTO_SAVE_INTERVAL)
    );
  };

  const handleFunduscopySketchChange = () => {
    setIsUpdating(true);
    setModified(true);
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        if (data?.opthalmologyExam.id !== undefined) {
          const currentValues = getValues();
          const input: OpthalmologyExamUpdateInput = {
            ...currentValues,
            id: data?.opthalmologyExam.id,
          };
          if (rightRetinaSketchRef.current !== null) {
            input.rightRetinaSketch = JSON.stringify(
              rightRetinaSketchRef.current.toJSON()
            );
          }
          if (leftRetinaSketchRef.current !== null) {
            input.leftRetinaSketch = JSON.stringify(
              leftRetinaSketchRef.current.toJSON()
            );
          }
          save({ variables: { input } });
        }
      }, AUTO_SAVE_INTERVAL)
    );
  };

  const handleOpticDiscSketchChange = () => {
    setIsUpdating(true);
    setModified(true);
    clearTimeout(timer);
    setTimer(
      setTimeout(() => {
        if (data?.opthalmologyExam.id !== undefined) {
          const currentValues = getValues();
          const input: OpthalmologyExamUpdateInput = {
            ...currentValues,
            id: data?.opthalmologyExam.id,
          };
          if (rightOpticDiscSketchRef.current !== null) {
            input.rightOpticDiscSketch = JSON.stringify(
              rightOpticDiscSketchRef.current.toJSON()
            );
          }
          if (leftOpticDiscSketchRef.current !== null) {
            input.leftOpticDiscSketch = JSON.stringify(
              leftOpticDiscSketchRef.current.toJSON()
            );
          }
          save({ variables: { input } });
        }
      }, AUTO_SAVE_INTERVAL)
    );
  };

  const onSave = (values: any) => {
    if (data?.opthalmologyExam.id) {
      const input: OpthalmologyExamUpdateInput = {
        ...values,
        id: data?.opthalmologyExam.id,
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
    setIsUpdating(true);
  };

  const dataWatch = watch();

  return (
    <div className="container mx-auto bg-gray-50 rounded shadow-lg p-5">
      <Prompt
        when={modified}
        message="This page has unsaved data. Please click cancel and try again"
      />

      <div className="text-2xl text-gray-600 font-semibold">
        Physical Examination
      </div>

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
          <Autosave
            isLoading={isUpdating}
            data={dataWatch}
            onSave={(data: any) => {
              onSave(data);
            }}
          />

          <div className="col-span-1"></div>
          <div className="col-span-5">
            <div className="grid grid-cols-5 gap-3 justify-items-center">
              <div></div>
              <div className="col-span-2">OD</div>
              <div className="col-span-2">OS</div>
            </div>
          </div>

          <div className="col-span-1 justify-self-end text-gray-500 tracking-wide font-semibold">
            External Exam
          </div>
          <div className="col-span-5 border-l border-green-500">
            <ExternalExamComponent
              register={register}
              control={control}
              setValue={setValue}
              locked={locked}
              onChange={handleInputOnChange}
            />
          </div>

          <div className="col-span-1 justify-self-end text-gray-500 tracking-wide font-semibold">
            Ocular Motility
          </div>
          <div className="col-span-5 border-l border-green-500">
            <OcularMotilityComponent
              register={register}
              control={control}
              setValue={setValue}
              values={dataWatch}
              locked={locked}
              onChange={handleInputOnChange}
            />
          </div>

          <div className="col-span-1 justify-self-end text-gray-500 tracking-wide font-semibold">
            Cover Test
          </div>
          <div className="col-span-5 border-l border-green-500">
            <CoverTestComponent
              register={register}
              control={control}
              setValue={setValue}
              locked={locked}
              onChange={handleInputOnChange}
            />
          </div>

          <div className="col-span-1 justify-self-end text-gray-500 tracking-wide font-semibold">
            Pupils
          </div>
          <div className="col-span-5 border-l border-green-500">
            <PupilsComponent
              register={register}
              control={control}
              setValue={setValue}
              locked={locked}
              onChange={handleInputOnChange}
            />
          </div>

          <div className="col-span-1 justify-self-end text-gray-500 tracking-wide font-semibold">
            Slit Lamp Exam
          </div>
          <div className="col-span-5 border-l border-green-500">
            <SlitLampExamComponent
              register={register}
              control={control}
              setValue={setValue}
              rightCorneaSketchRef={rightCorneaSketchRef}
              leftCorneaSketchRef={leftCorneaSketchRef}
              rightLensSketchRef={rightLensSketchRef}
              leftLensSketchRef={leftLensSketchRef}
              rightCorneaSketch={data?.opthalmologyExam.rightCorneaSketch}
              leftCorneaSketch={data?.opthalmologyExam.leftCorneaSketch}
              rightLensSketch={data?.opthalmologyExam.rightLensSketch}
              leftLensSketch={data?.opthalmologyExam.leftLensSketch}
              onSketchChange={handleSlitLampSketchChange}
              locked={locked}
              onChange={handleInputOnChange}
            />
          </div>

          <div className="col-span-1 justify-self-end text-gray-500 tracking-wide font-semibold">
            Funduscopy
          </div>
          <div className="col-span-5 border-l border-green-500">
            <FunduscopyComponent
              register={register}
              control={control}
              setValue={setValue}
              rightRetinaSketchRef={rightRetinaSketchRef}
              leftRetinaSketchRef={leftRetinaSketchRef}
              rightRetinaSketch={data?.opthalmologyExam.rightRetinaSketch}
              leftRetinaSketch={data?.opthalmologyExam.leftRetinaSketch}
              onSketchChange={handleFunduscopySketchChange}
              locked={locked}
              onChange={handleInputOnChange}
            />
          </div>

          <div className="col-span-1 justify-self-end text-gray-500 tracking-wide font-semibold">
            Optic Disc
          </div>
          <div className="col-span-5 border-l border-green-500">
            <OpticDiscComponent
              register={register}
              control={control}
              setValue={setValue}
              rightOpticDiscSketchRef={rightOpticDiscSketchRef}
              leftOpticDiscSketchRef={leftOpticDiscSketchRef}
              rightOpticDiscSketch={data?.opthalmologyExam.rightOpticDiscSketch}
              leftOpticDiscSketch={data?.opthalmologyExam.leftOpticDiscSketch}
              onSketchChange={handleOpticDiscSketchChange}
              locked={locked}
              onChange={handleInputOnChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};
