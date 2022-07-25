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
import { IntraOpForm } from '@tensoremr/ui-components';
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

const GET_INTRA_OP = gql`
  query GetIntraOp($patientChartId: ID!) {
    surgicalProcedure(patientChartId: $patientChartId) {
      id
      orderNote
      la
      ga
      retrobulbar
      peribulbar
      subtenones
      topical
      conjFlapLimbal
      conjFlapFornix
      sectionLimbal
      sectionCorneral
      sectionScleralTunnel
      capsulotomyLinear
      capsulotomyCanOpener
      capsulotomyCcc
      iolPlacementBag
      iolSulcus
      iolBagSulcus
      irodectpmyNone
      irodectpmyPl
      irodectpmySl
      sphincterectomy
      lensExtractionIcce
      lensExtractionEcce
      lensExtractionPhaco
      sutureNone
      sutureContinuous
      sutureInterrupted
      drapes
      ringer
      bss
      air
      hpmc
      healon
      pilo
      adrenalin
      antibiotic
      steroid
      suture80
      suture90
      suture100
      irrigatingSolution
      visco
      interacameral
      subconj
      suture
      silk
      nylon
      pcTear
      vitreousLoss
      descematesStrip
      endothelialDamage
      nucluesDrop
      iridoDialysis
      irisDamage
      retainedCortex
      hyphema
      complicationsOthers
      complicationsNote
      vitrectomy
      typeOfIolAc
      typeOfIolPc
      typeOfIol
      iolModel
      company
      aclol
      aclolPlanned
      aclolUnplanned
      unplanned
      additionalNotes
      specialInstructions
      treatment
      assistantName
      performOnEye

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

export const IntraOpPage: React.FC<Props> = ({ locked, patientChartId }) => {
  const notifDispatch = useNotificationDispatch();
  const { register, getValues, reset, watch } = useForm<SurgicalProcedureInput>(
    {}
  );
  const [timer, setTimer] = useState<any>(null);
  const [modified, setModified] = useState<boolean>(false);
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);

  const { data, refetch } = useQuery<Query, QuerySurgicalProcedureArgs>(
    GET_INTRA_OP,
    {
      variables: {
        patientChartId,
      },
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    const surgicalProcedure = data?.surgicalProcedure;
    if (surgicalProcedure !== undefined) {
      reset({
        assistantName: surgicalProcedure.assistantName,
        performOnEye: surgicalProcedure.performOnEye,
        la: surgicalProcedure.la,
        ga: surgicalProcedure.ga,
        retrobulbar: surgicalProcedure.retrobulbar,
        peribulbar: surgicalProcedure.peribulbar,
        subtenones: surgicalProcedure.subtenones,
        topical: surgicalProcedure.topical,
        conjFlapLimbal: surgicalProcedure.conjFlapLimbal,
        conjFlapFornix: surgicalProcedure.conjFlapFornix,
        sectionLimbal: surgicalProcedure.sectionLimbal,
        sectionCorneral: surgicalProcedure.sectionCorneral,
        sectionScleralTunnel: surgicalProcedure.sectionScleralTunnel,
        capsulotomyLinear: surgicalProcedure.capsulotomyLinear,
        capsulotomyCanOpener: surgicalProcedure.capsulotomyCanOpener,
        capsulotomyCcc: surgicalProcedure.capsulotomyCcc,
        iolPlacementBag: surgicalProcedure.iolPlacementBag,
        iolSulcus: surgicalProcedure.iolSulcus,
        iolBagSulcus: surgicalProcedure.iolBagSulcus,
        irodectpmyNone: surgicalProcedure.irodectpmyNone,
        irodectpmyPl: surgicalProcedure.irodectpmyPl,
        irodectpmySl: surgicalProcedure.irodectpmySl,
        sphincterectomy: surgicalProcedure.sphincterectomy,
        lensExtractionIcce: surgicalProcedure.lensExtractionIcce,
        lensExtractionEcce: surgicalProcedure.lensExtractionEcce,
        lensExtractionPhaco: surgicalProcedure.lensExtractionPhaco,
        sutureNone: surgicalProcedure.sutureNone,
        sutureContinuous: surgicalProcedure.sutureContinuous,
        sutureInterrupted: surgicalProcedure.sutureInterrupted,
        drapes: surgicalProcedure.drapes,
        ringer: surgicalProcedure.ringer,
        bss: surgicalProcedure.bss,
        air: surgicalProcedure.air,
        hpmc: surgicalProcedure.hpmc,
        healon: surgicalProcedure.healon,
        pilo: surgicalProcedure.pilo,
        adrenalin: surgicalProcedure.adrenalin,
        antibiotic: surgicalProcedure.antibiotic,
        steroid: surgicalProcedure.steroid,
        suture80: surgicalProcedure.suture80,
        suture90: surgicalProcedure.suture90,
        suture100: surgicalProcedure.suture100,
        irrigatingSolution: surgicalProcedure.irrigatingSolution,
        visco: surgicalProcedure.visco,
        interacameral: surgicalProcedure.interacameral,
        subconj: surgicalProcedure.subconj,
        suture: surgicalProcedure.suture,
        silk: surgicalProcedure.silk,
        nylon: surgicalProcedure.nylon,
        pcTear: surgicalProcedure.pcTear,
        vitreousLoss: surgicalProcedure.vitreousLoss,
        descematesStrip: surgicalProcedure.descematesStrip,
        endothelialDamage: surgicalProcedure.endothelialDamage,
        nucluesDrop: surgicalProcedure.nucluesDrop,
        iridoDialysis: surgicalProcedure.iridoDialysis,
        irisDamage: surgicalProcedure.irisDamage,
        retainedCortex: surgicalProcedure.retainedCortex,
        hyphema: surgicalProcedure.hyphema,
        complicationsOthers: surgicalProcedure.complicationsOthers,
        complicationsNote: surgicalProcedure.complicationsNote,
        vitrectomy: surgicalProcedure.vitrectomy,
        typeOfIolAc: surgicalProcedure.typeOfIolAc,
        typeOfIolPc: surgicalProcedure.typeOfIolPc,
        typeOfIol: surgicalProcedure.typeOfIol,
        iolModel: surgicalProcedure.iolModel,
        company: surgicalProcedure.company,
        aclol: surgicalProcedure.aclol,
        aclolPlanned: surgicalProcedure.aclolPlanned,
        aclolUnplanned: surgicalProcedure.aclolUnplanned,
        unplanned: surgicalProcedure.unplanned,
        additionalNotes: surgicalProcedure.additionalNotes,
        specialInstructions: surgicalProcedure.specialInstructions,
        treatment: surgicalProcedure.treatment,
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

  const values = watch();

  return (
    <div className="container mx-auto bg-gray-50 rounded shadow-lg p-5">
      <Prompt
        when={modified}
        message="This page has unsaved data. Please click cancel and try again"
      />

      <div className="text-2xl text-gray-600 font-semibold">{`${data?.surgicalProcedure?.surgicalProcedureType?.title} Intra-op`}</div>

      <hr className="mt-5" />

      {(data?.surgicalProcedure.orderNote.length ?? 0) > 0 && (
        <div className="mt-4 flex space-x-2 items-center">
          <span className="material-icons text-yellow-600">bookmark</span>
          <input
            disabled
            type="text"
            name="orderNote"
            id="orderNote"
            value={data?.surgicalProcedure.orderNote}
            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md bg-gray-100"
          />
        </div>
      )}

      <IntraOpForm
        register={register}
        locked={locked}
        aclolUnplanned={values.aclolUnplanned ?? false}
        handleChanges={handleChanges}
      />
    </div>
  );
};
