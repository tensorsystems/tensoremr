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

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  FileUpload,
  MutationDeletePreanestheticDocumentArgs,
  MutationSaveSurgicalProcedureArgs,
  MutationUpdateSurgeryFitnessArgs,
  QuerySurgicalProcedureArgs,
  SurgicalProcedureInput,
  Query,
} from '@tensoremr/models';
import classnames from 'classnames';
import { formatDate, getFileUrl } from '@tensoremr/util';
import { format, parseISO } from 'date-fns';
import { gql, useMutation, useQuery } from '@apollo/client';
import { IFileUploader, FileUploader } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';
import { useExitPrompt } from '@tensoremr/hooks';
import { Prompt } from 'react-router-dom';
import _ from 'lodash';

const AUTO_SAVE_INTERVAL = 1000;

const SAVE_SURGICAL_PROCEDURE = gql`
  mutation SaveSurgicalProcedure($input: SurgicalProcedureInput!) {
    saveSurgicalProcedure(input: $input) {
      id
    }
  }
`;

const UPDATE_SURGERY_FITNESS = gql`
  mutation UpdateSurgeryFitness($id: ID!, $fit: Boolean!) {
    updateSurgeryFitness(id: $id, fit: $fit) {
      id
    }
  }
`;

const DELETE_PREANESTHETIC_DOCUMENT = gql`
  mutation DeletePreanestheticDocument(
    $surgicalProcedureId: ID!
    $fileId: ID!
  ) {
    deletePreanestheticDocument(
      surgicalProcedureId: $surgicalProcedureId
      fileId: $fileId
    )
  }
`;

const GET_PREANESTHETIC = gql`
  query GetPreop($patientChartId: ID!) {
    surgicalProcedure(patientChartId: $patientChartId) {
      id
      orderNote
      preanestheticDocuments {
        id
        size
        hash
        fileName
        extension
        contentType
        createdAt
      }
      respiratory
      cardiovascular
      abdomen
      gus
      ismss
      cns
      preanestheticAllergies
      preanestheticAllergiesNote
      physicalBloodPressure
      physicalPr
      physicalRr
      physicalSaO2
      physicalTemperature
      physicalWeight
      physicalHeent
      physicalArtificalDenture
      physicalArtificalDentureNote
      physicalLgs
      physicalChest
      physicalCvs
      physicalAbdomen
      physicalGus
      physicalIs
      physicalMss
      physicalCns
      asa1
      asa2
      asa3
      asa4
      asa5
      opv1
      opv2
      opv3
      opv4
      bleedingTendancy
      bleedingTendancyNote
      dm
      dmNote
      hypertension
      hypertensionNote
      cardiac
      cardiacNote
      preanestheticAsthma
      preanestheticAsthmaNote
      rvi
      rviNote
      renal
      renalNote
      preanestheticPerformedBy
      fitForSurgery
      fitForSurgeryNote
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

export const PreanestheticPage: React.FC<Props> = ({
  locked,
  patientChartId,
}) => {
  const notifDispatch = useNotificationDispatch();
  const [timer, setTimer] = useState<any>(null);
  const [modified, setModified] = useState<boolean>(false);
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);

  const { data, refetch } = useQuery<Query, QuerySurgicalProcedureArgs>(
    GET_PREANESTHETIC,
    {
      variables: {
        patientChartId,
      },
    }
  );

  useEffect(() => {
    refetch();
  }, []);

  const { register, getValues, reset, watch } =
    useForm<SurgicalProcedureInput>();

  const defaultPreanestheticDocuments: Array<IFileUploader> =
    data?.surgicalProcedure.preanestheticDocuments.map((e: any) => ({
      id: e?.id,
      fileUrl: getFileUrl({
        baseUrl: window.__RUNTIME_CONFIG__.REACT_APP_SERVER_URL,
        fileName: e?.fileName,
        hash: e?.hash,
        extension: e?.extension,
      }),
      name: e?.fileName ?? '',
      size: e?.size,
      createdAt: e?.createdAt,
      contentType: e?.contentType ?? '',
    })) ?? [];

  const [preanestheticDocuments, setPreanestheticDocuments] = useState<
    Array<IFileUploader>
  >(defaultPreanestheticDocuments);

  const [saveSurgicalProcedure] = useMutation<
    any,
    MutationSaveSurgicalProcedureArgs
  >(SAVE_SURGICAL_PROCEDURE, {
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

  const [fitForSurgery, setFitForSurgery] = useState<boolean>(
    data?.surgicalProcedure.fitForSurgery ?? false
  );

  useEffect(() => {
    if (data?.surgicalProcedure.id) {
      updateSurgeryFitness({
        variables: {
          id: data?.surgicalProcedure.id,
          fit: fitForSurgery,
        },
      });
    }
  }, [fitForSurgery]);

  const [updateSurgeryFitness] = useMutation<
    any,
    MutationUpdateSurgeryFitnessArgs
  >(UPDATE_SURGERY_FITNESS, {
    onError(error) {
      notifDispatch({
        type: 'show',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  const [deletePreanestheticDocument] = useMutation<
    any,
    MutationDeletePreanestheticDocumentArgs
  >(DELETE_PREANESTHETIC_DOCUMENT, {
    onError(error) {
      notifDispatch({
        type: 'show',
        notifTitle: 'Error',
        notifSubTitle: error.message,
        variant: 'failure',
      });
    },
  });

  useEffect(() => {
    const surgicalProcedure = data?.surgicalProcedure;
    if (surgicalProcedure !== undefined) {
      reset({
        respiratory: surgicalProcedure.respiratory,
        cardiovascular: surgicalProcedure.cardiovascular,
        abdomen: surgicalProcedure.abdomen,
        gus: surgicalProcedure.gus,
        ismss: surgicalProcedure.ismss,
        cns: surgicalProcedure.cns,
        preanestheticAllergies: surgicalProcedure.preanestheticAllergies,
        preanestheticAllergiesNote:
          surgicalProcedure.preanestheticAllergiesNote,
        physicalBloodPressure: surgicalProcedure.physicalBloodPressure,
        physicalPr: surgicalProcedure.physicalPr,
        physicalRr: surgicalProcedure.physicalRr,
        physicalSaO2: surgicalProcedure.physicalSaO2,
        physicalTemperature: surgicalProcedure.physicalTemperature,
        physicalWeight: surgicalProcedure.physicalWeight,
        physicalHeent: surgicalProcedure.physicalHeent,
        physicalArtificalDenture: surgicalProcedure.physicalArtificalDenture,
        physicalArtificalDentureNote:
          surgicalProcedure.physicalArtificalDentureNote,
        physicalLgs: surgicalProcedure.physicalLgs,
        physicalChest: surgicalProcedure.physicalChest,
        physicalCvs: surgicalProcedure.physicalCvs,
        physicalAbdomen: surgicalProcedure.physicalAbdomen,
        physicalGus: surgicalProcedure.physicalGus,
        physicalIs: surgicalProcedure.physicalIs,
        physicalMss: surgicalProcedure.physicalMss,
        physicalCns: surgicalProcedure.physicalCns,
        wbcActive: surgicalProcedure.wbcActive,
        wbcResults: surgicalProcedure.wbcResults,
        wbcDate: surgicalProcedure.wbcDate
          ? format(parseISO(surgicalProcedure.wbcDate), 'yyyy-MM-dd')
          : undefined,
        hgbhctActive: surgicalProcedure.hgbhctActive,
        hgbhctResults: surgicalProcedure.hgbhctResults,
        hgbhctDate: surgicalProcedure.hgbhctDate
          ? format(parseISO(surgicalProcedure.hgbhctDate), 'yyyy-MM-dd')
          : undefined,
        pltActive: surgicalProcedure.pltActive,
        pltResults: surgicalProcedure.pltResults,
        pltDate: surgicalProcedure.pltDate
          ? format(parseISO(surgicalProcedure.pltDate), 'yyyy-MM-dd')
          : undefined,
        coagulationPtActive: surgicalProcedure.coagulationPtActive,
        coagulationPtResults: surgicalProcedure.coagulationPtResults,
        coagulationPtDate: surgicalProcedure.coagulationPtDate
          ? format(parseISO(surgicalProcedure.coagulationPtDate), 'yyyy-MM-dd')
          : undefined,
        coagulationPttActive: surgicalProcedure.coagulationPttActive,
        coagulationPttResults: surgicalProcedure.coagulationPttResults,
        coagulationPttDate: surgicalProcedure.coagulationPttDate
          ? format(parseISO(surgicalProcedure.coagulationPttDate), 'yyyy-MM-dd')
          : undefined,
        coagulationInrActive: surgicalProcedure.coagulationInrActive,
        coagulationInrResults: surgicalProcedure.coagulationInrResults,
        coagulationInrDate: surgicalProcedure.coagulationInrDate
          ? format(parseISO(surgicalProcedure.coagulationInrDate), 'yyyy-MM-dd')
          : undefined,
        serumAlbuminActive: surgicalProcedure.serumAlbuminActive,
        serumAlbuminResults: surgicalProcedure.serumAlbuminResults,
        serumAlbuminDate: surgicalProcedure.serumAlbuminDate
          ? format(parseISO(surgicalProcedure.serumAlbuminDate), 'yyyy-MM-dd')
          : undefined,
        totalProteinActive: surgicalProcedure.totalProteinActive,
        totalProteinResults: surgicalProcedure.totalProteinResults,
        totalProteinDate: surgicalProcedure.totalProteinDate
          ? format(parseISO(surgicalProcedure.totalProteinDate), 'yyyy-MM-dd')
          : undefined,
        bilirubinTotalActive: surgicalProcedure.bilirubinTotalActive,
        bilirubinTotalResults: surgicalProcedure.bilirubinTotalResults,
        bilirubinTotalDate: surgicalProcedure.bilirubinTotalDate
          ? format(parseISO(surgicalProcedure.bilirubinTotalDate), 'yyyy-MM-dd')
          : undefined,
        bilirubinDirectActive: surgicalProcedure.bilirubinDirectActive,
        bilirubinDirectResults: surgicalProcedure.bilirubinDirectResults,
        bilirubinDirectDate: surgicalProcedure.bilirubinDirectDate
          ? format(
              parseISO(surgicalProcedure.bilirubinDirectDate),
              'yyyy-MM-dd'
            )
          : undefined,
        astsgotActive: surgicalProcedure.astsgotActive,
        astsgotResults: surgicalProcedure.astsgotResults,
        astsgotDate: surgicalProcedure.astsgotDate
          ? format(parseISO(surgicalProcedure.astsgotDate), 'yyyy-MM-dd')
          : undefined,
        altsgptActive: surgicalProcedure.altsgptActive,
        altsgptResults: surgicalProcedure.altsgptResults,
        altsgptDate: surgicalProcedure.altsgptDate
          ? format(parseISO(surgicalProcedure.altsgptDate), 'yyyy-MM-dd')
          : undefined,
        alpActive: surgicalProcedure.alpActive,
        alpResults: surgicalProcedure.alpResults,
        alpDate: surgicalProcedure.alpDate
          ? format(parseISO(surgicalProcedure.alpDate), 'yyyy-MM-dd')
          : undefined,
        renalCrActive: surgicalProcedure.renalCrActive,
        renalCrResults: surgicalProcedure.renalCrResults,
        renalCrDate: surgicalProcedure.renalCrDate
          ? format(parseISO(surgicalProcedure.renalCrDate), 'yyyy-MM-dd')
          : undefined,
        renalBunActive: surgicalProcedure.renalBunActive,
        renalBunResults: surgicalProcedure.renalBunResults,
        renalBunDate: surgicalProcedure.renalBunDate
          ? format(parseISO(surgicalProcedure.renalBunDate), 'yyyy-MM-dd')
          : undefined,
        thyroidFreeT3Active: surgicalProcedure.thyroidFreeT3Active,
        thyroidFreeT3Results: surgicalProcedure.thyroidFreeT3Results,
        thyroidFreeT3Date: surgicalProcedure.thyroidFreeT3Date
          ? format(parseISO(surgicalProcedure.thyroidFreeT3Date), 'yyyy-MM-dd')
          : undefined,
        thyroidTotalT4Active: surgicalProcedure.thyroidTotalT4Active,
        thyroidTotalT4Results: surgicalProcedure.thyroidTotalT4Results,
        thyroidTotalT4Date: surgicalProcedure.thyroidTotalT4Date
          ? format(parseISO(surgicalProcedure.thyroidTotalT4Date), 'yyyy-MM-dd')
          : undefined,
        thyroidTshActive: surgicalProcedure.thyroidTshActive,
        thyroidTshResults: surgicalProcedure.thyroidTshResults,
        thyroidTshDate: surgicalProcedure.thyroidTshDate
          ? format(parseISO(surgicalProcedure.thyroidTshDate), 'yyyy-MM-dd')
          : undefined,
        electrolytesNaPlusActive: surgicalProcedure.electrolytesNaPlusActive,
        electrolytesNaPlusResults: surgicalProcedure.electrolytesNaPlusResults,
        electrolytesNaPlusDate: surgicalProcedure.electrolytesNaPlusDate
          ? format(
              parseISO(surgicalProcedure.electrolytesNaPlusDate),
              'yyyy-MM-dd'
            )
          : undefined,
        electrolytesKPlusActive: surgicalProcedure.electrolytesKPlusActive,
        electrolytesKPlusResults: surgicalProcedure.electrolytesKPlusResults,
        electrolytesKPlusDate: surgicalProcedure.electrolytesKPlusDate
          ? format(
              parseISO(surgicalProcedure.electrolytesKPlusDate),
              'yyyy-MM-dd'
            )
          : undefined,
        electrolytesClMinusActive: surgicalProcedure.electrolytesClMinusActive,
        electrolytesClMinusResults:
          surgicalProcedure.electrolytesClMinusResults,
        electrolytesClMinusDate: surgicalProcedure.electrolytesClMinusDate
          ? format(
              parseISO(surgicalProcedure.electrolytesClMinusDate),
              'yyyy-MM-dd'
            )
          : undefined,
        electrolytesCa2PlusActive: surgicalProcedure.electrolytesCa2PlusActive,
        electrolytesCa2PlusResults:
          surgicalProcedure.electrolytesCa2PlusResults,
        electrolytesCa2PlusDate: surgicalProcedure.electrolytesCa2PlusDate
          ? format(
              parseISO(surgicalProcedure.electrolytesCa2PlusDate),
              'yyyy-MM-dd'
            )
          : undefined,
        electrolytesMg2PlusActive: surgicalProcedure.electrolytesMg2PlusActive,
        electrolytesMg2PlusResults:
          surgicalProcedure.electrolytesMg2PlusResults,
        electrolytesMg2PlusDate: surgicalProcedure.electrolytesMg2PlusDate
          ? format(
              parseISO(surgicalProcedure.electrolytesMg2PlusDate),
              'yyyy-MM-dd'
            )
          : undefined,
        electrolytesPMinusActive: surgicalProcedure.electrolytesPMinusActive,
        electrolytesPMinusResults: surgicalProcedure.electrolytesPMinusResults,
        electrolytesPMinusDate: surgicalProcedure.electrolytesPMinusDate
          ? format(
              parseISO(surgicalProcedure.electrolytesPMinusDate),
              'yyyy-MM-dd'
            )
          : undefined,
        asa1: surgicalProcedure.asa1,
        asa2: surgicalProcedure.asa2,
        asa3: surgicalProcedure.asa3,
        asa4: surgicalProcedure.asa4,
        asa5: surgicalProcedure.asa5,
        opv1: surgicalProcedure.opv1,
        opv2: surgicalProcedure.opv2,
        opv3: surgicalProcedure.opv3,
        opv4: surgicalProcedure.opv4,
        bleedingTendancy: surgicalProcedure.bleedingTendancy,
        bleedingTendancyNote: surgicalProcedure.bleedingTendancyNote,
        dm: surgicalProcedure.dm,
        dmNote: surgicalProcedure.dmNote,
        hypertension: surgicalProcedure.hypertension,
        hypertensionNote: surgicalProcedure.hypertensionNote,
        cardiac: surgicalProcedure.cardiac,
        cardiacNote: surgicalProcedure.cardiacNote,
        preanestheticAsthma: surgicalProcedure.preanestheticAsthma,
        preanestheticAsthmaNote: surgicalProcedure.preanestheticAsthmaNote,
        rvi: surgicalProcedure.rvi,
        rviNote: surgicalProcedure.rviNote,
        renal: surgicalProcedure.renal,
        renalNote: surgicalProcedure.renalNote,
        fitForSurgery: surgicalProcedure.fitForSurgery,
        fitForSurgeryNote: surgicalProcedure.fitForSurgeryNote,
      });
    }
  }, [data?.surgicalProcedure]);

  const handleChanges = () => {
    setModified(true);
    setShowExitPrompt(true);
    clearTimeout(timer);

    const data = getValues();
    const isEmpty = _.values(data).every((v) => _.isEmpty(v));

    setTimer(
      setTimeout(() => {
        if (patientChartId !== undefined && !isEmpty) {
          const surgicalProcedure: any = {
            ...data,
            patientChartId,
            wbcDate: data.wbcDate ? formatDate(data.wbcDate) : undefined,
            hgbhctDate: data.hgbhctDate
              ? formatDate(data.hgbhctDate)
              : undefined,
            pltDate: data.pltDate ? formatDate(data.pltDate) : undefined,
            coagulationPtDate: data.coagulationPtDate
              ? formatDate(data.coagulationPtDate)
              : undefined,
            coagulationPttDate: data.coagulationPttDate
              ? formatDate(data.coagulationPttDate)
              : undefined,
            coagulationInrDate: data.coagulationInrDate
              ? formatDate(data.coagulationInrDate)
              : undefined,
            serumAlbuminDate: data.serumAlbuminDate
              ? formatDate(data.serumAlbuminDate)
              : undefined,
            totalProteinDate: data.totalProteinDate
              ? formatDate(data.totalProteinDate)
              : undefined,
            bilirubinTotalDate: data.bilirubinTotalDate
              ? formatDate(data.bilirubinTotalDate)
              : undefined,
            bilirubinDirectDate: data.bilirubinDirectDate
              ? formatDate(data.bilirubinDirectDate)
              : undefined,
            astsgotDate: data.astsgotDate
              ? formatDate(data.astsgotDate)
              : undefined,
            altsgptDate: data.altsgptDate
              ? formatDate(data.altsgptDate)
              : undefined,
            alpDate: data.alpDate ? formatDate(data.alpDate) : undefined,
            renalCrDate: data.renalCrDate
              ? formatDate(data.renalCrDate)
              : undefined,
            renalBunDate: data.renalBunDate
              ? formatDate(data.renalBunDate)
              : undefined,
            thyroidFreeT3Date: data.thyroidFreeT3Date
              ? formatDate(data.thyroidFreeT3Date)
              : undefined,
            thyroidTotalT4Date: data.thyroidTotalT4Date
              ? formatDate(data.thyroidTotalT4Date)
              : undefined,
            thyroidTshDate: data.thyroidTshDate
              ? formatDate(data.thyroidTshDate)
              : undefined,
            electrolytesNaPlusDate: data.electrolytesNaPlusDate
              ? formatDate(data.electrolytesNaPlusDate)
              : undefined,
            electrolytesKPlusDate: data.electrolytesKPlusDate
              ? formatDate(data.electrolytesKPlusDate)
              : undefined,
            electrolytesClMinusDate: data.electrolytesClMinusDate
              ? formatDate(data.electrolytesClMinusDate)
              : undefined,
            electrolytesCa2PlusDate: data.electrolytesCa2PlusDate
              ? formatDate(data.electrolytesCa2PlusDate)
              : undefined,
            electrolytesMg2PlusDate: data.electrolytesMg2PlusDate
              ? formatDate(data.electrolytesMg2PlusDate)
              : undefined,
            electrolytesPMinusDate: data.electrolytesPMinusDate
              ? formatDate(data.electrolytesPMinusDate)
              : undefined,
          };

          saveSurgicalProcedure({
            variables: {
              input: surgicalProcedure,
            },
          });
        }
      }, AUTO_SAVE_INTERVAL)
    );
  };

  const handlePreanestheticDocumentsChange = (change: Array<IFileUploader>) => {
    setPreanestheticDocuments(change);

    const files: Array<FileUpload> = change
      .filter((e) => e.fileObject !== undefined)
      .map((e) => ({
        file: e.fileObject,
        name: e.name,
      }));

    if (patientChartId) {
      saveSurgicalProcedure({
        variables: {
          input: {
            patientChartId,
            preanestheticDocuments: files,
          },
        },
      });
    }
  };

  const handlePreanestheticDocumentDelete = (index: number) => {
    const file = preanestheticDocuments.find((_, i) => i === index);
    setPreanestheticDocuments(
      preanestheticDocuments.filter((_, i) => i !== index)
    );

    if (file?.id !== undefined && data?.surgicalProcedure.id) {
      deletePreanestheticDocument({
        variables: {
          surgicalProcedureId: data?.surgicalProcedure.id,
          fileId: file.id,
        },
      });
    }
  };

  const dataWatch = watch();

  return (
    <div className="container mx-auto bg-gray-50 rounded shadow-lg p-5">
      <Prompt
        when={modified}
        message="This page has unsaved data. Please click cancel and try again"
      />

      <div className="text-2xl text-gray-600 font-semibold">{`${data?.surgicalProcedure.surgicalProcedureType.title} Preanesthetic Evaluation`}</div>
      <hr className="mt-5" />

      <div className="mt-5">
        <label className="block text-sm font-medium text-gray-700">
          Documents
        </label>
        <FileUploader
          multiSelect={true}
          values={preanestheticDocuments}
          onAdd={handlePreanestheticDocumentsChange}
          onDelete={handlePreanestheticDocumentDelete}
          disabled={locked}
          onError={(message) => {
            notifDispatch({
              type: 'show',
              notifTitle: 'Error',
              notifSubTitle: message,
              variant: 'failure',
            });
          }}
        />
      </div>

      <div className="mt-4 shadow-md bg-white rounded-md p-4">
        <div className="text-xl text-gray-600 font-semibold">History</div>
        <hr className="mt-2" />

        <div className="text-gray-600 grid grid-cols-3 gap-y-3 w-full mt-2">
          <div className="font-semibold col-span-1">Resparatory</div>
          <div className="col-span-2">
            <input
              type="text"
              name="respiratory"
              ref={register}
              onChange={handleChanges}
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">Cardiovascular</div>
          <div className="col-span-2">
            <input
              type="text"
              name="cardiovascular"
              ref={register}
              onChange={handleChanges}
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">Abdomen</div>
          <div className="col-span-2">
            <input
              type="text"
              name="abdomen"
              ref={register}
              onChange={handleChanges}
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">GUS</div>
          <div className="col-span-2">
            <input
              type="text"
              name="gus"
              ref={register}
              onChange={handleChanges}
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">IS/MSS</div>
          <div className="col-span-2">
            <input
              type="text"
              name="ismss"
              ref={register}
              onChange={handleChanges}
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">CNS</div>
          <div className="col-span-2">
            <input
              type="text"
              name="cns"
              ref={register}
              onChange={handleChanges}
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">Allergies</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="preanestheticAllergies"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Yes</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="preanestheticAllergiesNote"
              disabled={!dataWatch.preanestheticAllergies}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                {
                  'bg-gray-200 placeholder-gray-400':
                    !dataWatch.preanestheticAllergies,
                }
              )}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 shadow-md bg-white rounded-md p-4">
        <div className="text-xl text-gray-600 font-semibold">
          Chronic Illnesses
        </div>
        <hr className="mt-2" />

        <div className="text-gray-600 grid grid-cols-3 gap-y-3 w-full mt-2">
          <div className="font-semibold col-span-1">Bleeding Tendency</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="bleedingTendancy"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Yes</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="bleedingTendancyNote"
              disabled={!dataWatch.bleedingTendancy}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                {
                  'bg-gray-200 placeholder-gray-400':
                    !dataWatch.bleedingTendancy,
                }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">DM</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="dm"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Yes</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="dmNote"
              disabled={!dataWatch.dm}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                {
                  'bg-gray-200 placeholder-gray-400': !dataWatch.dm,
                }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">Hypertension</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="hypertension"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Yes</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="hypertensionNote"
              disabled={!dataWatch.hypertension}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                {
                  'bg-gray-200 placeholder-gray-400': !dataWatch.hypertension,
                }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">Cardiac</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="cardiac"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Yes</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="cardiacNote"
              disabled={!dataWatch.cardiac}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                {
                  'bg-gray-200 placeholder-gray-400': !dataWatch.cardiac,
                }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">Asthma</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="preanestheticAsthma"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Yes</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="preanestheticAsthmaNote"
              disabled={!dataWatch.preanestheticAsthma}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                {
                  'bg-gray-200 placeholder-gray-400':
                    !dataWatch.preanestheticAsthma,
                }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">RVI</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="rvi"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Yes</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="rviNote"
              disabled={!dataWatch.rvi}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                {
                  'bg-gray-200 placeholder-gray-400': !dataWatch.rvi,
                }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">Renal</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="renal"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Yes</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="renalNote"
              disabled={!dataWatch.renal}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                {
                  'bg-gray-200 placeholder-gray-400': !dataWatch.renal,
                }
              )}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4">
        <div className="mt-4 shadow-md bg-white rounded-md p-4">
          <div className="text-xl text-gray-600 font-semibold">ASA</div>
          <hr className="mt-2" />

          <div className="text-gray-600 grid grid-cols-3 gap-y-3 w-full mt-2">
            <div className="font-semibold col-span-1">ASA I</div>
            <div className="col-span-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="asa1"
                  ref={register}
                  onChange={handleChanges}
                />
                <span className="ml-2">Yes</span>
              </label>
            </div>
            <div className="col-span-1"></div>

            <div className="font-semibold col-span-1">ASA II</div>
            <div className="col-span-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="asa2"
                  ref={register}
                  onChange={handleChanges}
                />
                <span className="ml-2">Yes</span>
              </label>
            </div>
            <div className="col-span-1"></div>

            <div className="font-semibold col-span-1">ASA III</div>
            <div className="col-span-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="asa3"
                  ref={register}
                  onChange={handleChanges}
                />
                <span className="ml-2">Yes</span>
              </label>
            </div>
            <div className="col-span-1"></div>

            <div className="font-semibold col-span-1">ASA IV</div>
            <div className="col-span-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="asa4"
                  ref={register}
                  onChange={handleChanges}
                />
                <span className="ml-2">Yes</span>
              </label>
            </div>
            <div className="col-span-1"></div>

            <div className="font-semibold col-span-1">ASA V</div>
            <div className="col-span-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="asa5"
                  ref={register}
                  onChange={handleChanges}
                />
                <span className="ml-2">Yes</span>
              </label>
            </div>
            <div className="col-span-1"></div>
          </div>
        </div>

        <div className="mt-4 shadow-md bg-white rounded-md p-4">
          <div className="text-xl text-gray-600 font-semibold">Mallapati</div>
          <hr className="mt-2" />

          <div className="text-gray-600 grid grid-cols-3 gap-y-3 w-full mt-2">
            <div className="font-semibold col-span-1">OPV I</div>
            <div className="col-span-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="opv1"
                  ref={register}
                  onChange={handleChanges}
                />
                <span className="ml-2">Yes</span>
              </label>
            </div>
            <div className="col-span-1"></div>

            <div className="font-semibold col-span-1">OPV II</div>
            <div className="col-span-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="opv2"
                  ref={register}
                  onChange={handleChanges}
                />
                <span className="ml-2">Yes</span>
              </label>
            </div>
            <div className="col-span-1"></div>

            <div className="font-semibold col-span-1">OPV III</div>
            <div className="col-span-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="opv3"
                  ref={register}
                  onChange={handleChanges}
                />
                <span className="ml-2">Yes</span>
              </label>
            </div>
            <div className="col-span-1"></div>

            <div className="font-semibold col-span-1">OPV IV</div>
            <div className="col-span-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="opv4"
                  ref={register}
                  onChange={handleChanges}
                />
                <span className="ml-2">Yes</span>
              </label>
            </div>
            <div className="col-span-1"></div>
          </div>
        </div>
      </div>

      <div className="mt-4 shadow-md bg-white rounded-md p-4">
        <div className="text-xl text-gray-600 font-semibold">
          Physical Examination
        </div>
        <hr className="mt-2" />

        <div className="text-gray-600 grid grid-cols-3 gap-y-3 w-full mt-2">
          <div className="font-semibold col-span-1">Blood Pressure</div>
          <div className="col-span-2">
            <input
              type="text"
              name="physicalBloodPressure"
              placeholder="mmhg"
              ref={register}
              onChange={handleChanges}
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">PR</div>
          <div className="col-span-2">
            <input
              type="text"
              name="physicalPr"
              placeholder="bpm"
              ref={register}
              onChange={handleChanges}
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">RR</div>
          <div className="col-span-2">
            <input
              type="text"
              name="physicalRr"
              placeholder="RR"
              ref={register}
              onChange={handleChanges}
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">
            <span>S</span>
            <sub>a</sub>O<sub>2</sub>
          </div>
          <div className="col-span-2">
            <input
              type="text"
              name="physicalSaO2"
              ref={register}
              onChange={handleChanges}
              placeholder="%"
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">
            T<sup>°</sup>
          </div>
          <div className="col-span-2">
            <input
              type="text"
              name="physicalTemperature"
              ref={register}
              onChange={handleChanges}
              placeholder="C°"
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">Weight</div>
          <div className="col-span-2">
            <input
              type="text"
              name="physicalWeight"
              ref={register}
              onChange={handleChanges}
              placeholder="Kg"
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">HEENT</div>
          <div className="col-span-2">
            <input
              type="text"
              name="physicalHeent"
              ref={register}
              onChange={handleChanges}
              placeholder="HEENT"
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">Artifical Denture</div>
          <div className="col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="physicalArtificalDenture"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Yes</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="physicalArtificalDentureNote"
              disabled={!dataWatch.physicalArtificalDenture}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                {
                  'bg-gray-200 placeholder-gray-400':
                    !dataWatch.physicalArtificalDenture,
                }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">LGS</div>
          <div className="col-span-2">
            <input
              type="text"
              name="physicalLgs"
              ref={register}
              onChange={handleChanges}
              placeholder="LGS"
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">Chest</div>
          <div className="col-span-2">
            <input
              type="text"
              name="physicalChest"
              ref={register}
              onChange={handleChanges}
              placeholder="Chest"
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">CVS</div>
          <div className="col-span-2">
            <input
              type="text"
              name="physicalCvs"
              ref={register}
              onChange={handleChanges}
              placeholder="CVS"
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">Abdomen</div>
          <div className="col-span-2">
            <input
              type="text"
              name="physicalAbdomen"
              ref={register}
              onChange={handleChanges}
              placeholder="Abdomen"
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">GUS</div>
          <div className="col-span-2">
            <input
              type="text"
              name="physicalGus"
              ref={register}
              onChange={handleChanges}
              placeholder="GUS"
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">IS</div>
          <div className="col-span-2">
            <input
              type="text"
              name="physicalIs"
              ref={register}
              onChange={handleChanges}
              placeholder="IS"
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">MSS</div>
          <div className="col-span-2">
            <input
              type="text"
              name="physicalMss"
              ref={register}
              onChange={handleChanges}
              placeholder="MSS"
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>

          <div className="font-semibold col-span-1">CNS</div>
          <div className="col-span-2">
            <input
              type="text"
              name="physicalCns"
              ref={register}
              onChange={handleChanges}
              placeholder="CNS"
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 shadow-md bg-white rounded-md p-4">
        <div className="text-xl text-gray-600 font-semibold">
          Investigations Summary
        </div>
        <hr className="mt-2" />

        <div className="text-gray-600 grid grid-cols-3 gap-y-3 gap-x-5 w-full mt-2">
          <div className="col-span-1"></div>
          <div className="col-span-1 text-center">Results</div>
          <div className="col-span-1 text-center">Date</div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="wbcActive"
              />
              <span className="ml-2">WBC</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="wbcResults"
              disabled={!dataWatch.wbcActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.wbcActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="wbcDate"
              disabled={!dataWatch.wbcActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.wbcActive }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="hgbhctActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">HGB/HCT</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="hgbhctResults"
              disabled={!dataWatch.hgbhctActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.hgbhctActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="hgbhctDate"
              disabled={!dataWatch.hgbhctActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.hgbhctActive }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="pltActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">PLT</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="pltResults"
              disabled={!dataWatch.pltActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.pltActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="pltDate"
              disabled={!dataWatch.pltActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.pltActive }
              )}
            />
          </div>
        </div>

        <div className="text-gray-800 font-light text-sm mt-5">
          Liver Function Tests
        </div>

        <div className="text-gray-600 grid grid-cols-3 gap-y-3 gap-x-5 w-full mt-1">
          <div className="col-span-1 font-semibold">Coagulation Profile</div>
          <div className="col-span-1 text-center"></div>
          <div className="col-span-1 text-center"></div>
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center ml-5">
              <input
                type="checkbox"
                name="coagulationPtActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">PT</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="coagulationPtResults"
              disabled={!dataWatch.coagulationPtActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.coagulationPtActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="coagulationPtDate"
              disabled={!dataWatch.coagulationPtActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.coagulationPtActive }
              )}
            />
          </div>
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center ml-5">
              <input
                type="checkbox"
                name="coagulationPttActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">PTT</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="coagulationPttResults"
              disabled={!dataWatch.coagulationPttActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.coagulationPttActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="coagulationPttDate"
              disabled={!dataWatch.coagulationPttActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.coagulationPttActive }
              )}
            />
          </div>
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center ml-5">
              <input
                type="checkbox"
                name="coagulationInrActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">INR</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="coagulationInrResults"
              disabled={!dataWatch.coagulationInrActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.coagulationInrActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="coagulationInrDate"
              disabled={!dataWatch.coagulationInrActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.coagulationInrActive }
              )}
            />
          </div>
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="serumAlbuminActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Serum Albumin</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="serumAlbuminResults"
              disabled={!dataWatch.serumAlbuminActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.serumAlbuminActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="serumAlbuminDate"
              disabled={!dataWatch.serumAlbuminActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.serumAlbuminActive }
              )}
            />
          </div>
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="totalProteinActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Total Protein</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="totalProteinResults"
              disabled={!dataWatch.totalProteinActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.totalProteinActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="totalProteinDate"
              disabled={!dataWatch.totalProteinActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.totalProteinActive }
              )}
            />
          </div>
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="bilirubinTotalActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Bilirubin (Total)</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="bilirubinTotalResults"
              disabled={!dataWatch.bilirubinTotalActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.bilirubinTotalActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="bilirubinTotalDate"
              disabled={!dataWatch.bilirubinTotalActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.bilirubinTotalActive }
              )}
            />
          </div>
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="bilirubinDirectActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Bilirubin (Direct)</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="bilirubinDirectResults"
              disabled={!dataWatch.bilirubinDirectActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.bilirubinDirectActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="bilirubinDirectDate"
              disabled={!dataWatch.bilirubinDirectActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.bilirubinDirectActive }
              )}
            />
          </div>
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="astsgotActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">AST/SGOT</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="astsgotResults"
              disabled={!dataWatch.astsgotActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.astsgotActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="astsgotDate"
              disabled={!dataWatch.astsgotActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.astsgotActive }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="altsgptActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">ALT/SGPT</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="altsgptResults"
              disabled={!dataWatch.altsgptActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.altsgptActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="altsgptDate"
              disabled={!dataWatch.altsgptActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.altsgptActive }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="alpActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">ALP</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="alpResults"
              disabled={!dataWatch.alpActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.alpActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="alpDate"
              disabled={!dataWatch.alpActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.alpActive }
              )}
            />
          </div>
        </div>

        <div className="text-gray-800 font-light text-sm mt-5">
          Renal Function Tests
        </div>

        <div className="text-gray-600 grid grid-cols-3 gap-y-3 gap-x-5 w-full mt-1">
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="renalCrActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Cr</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="renalCrResults"
              disabled={!dataWatch.renalCrActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.renalCrActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="renalCrDate"
              disabled={!dataWatch.renalCrActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.renalCrActive }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="renalBunActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">BUN</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="renalBunResults"
              disabled={!dataWatch.renalBunActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.renalBunActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="renalBunDate"
              disabled={!dataWatch.renalBunActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.renalBunActive }
              )}
            />
          </div>
        </div>

        <div className="text-gray-800 font-light text-sm mt-5">
          Thyroid Function Tests
        </div>

        <div className="text-gray-600 grid grid-cols-3 gap-y-3 gap-x-5 w-full mt-1">
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="thyroidFreeT3Active"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Free T3</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="thyroidFreeT3Results"
              disabled={!dataWatch.thyroidFreeT3Active}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.thyroidFreeT3Active }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="thyroidFreeT3Date"
              disabled={!dataWatch.thyroidFreeT3Active}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.thyroidFreeT3Active }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="thyroidTotalT4Active"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">Total T4</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="thyroidTotalT4Results"
              disabled={!dataWatch.thyroidTotalT4Active}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.thyroidTotalT4Active }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="thyroidTotalT4Date"
              disabled={!dataWatch.thyroidTotalT4Active}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.thyroidTotalT4Active }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="thyroidTshActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">TSH</span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="thyroidTshResults"
              disabled={!dataWatch.thyroidTshActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.thyroidTshActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="thyroidTshDate"
              disabled={!dataWatch.thyroidTshActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.thyroidTshActive }
              )}
            />
          </div>
        </div>

        <div className="text-gray-800 font-light text-sm mt-5">
          Electrolytes
        </div>

        <div className="text-gray-600 grid grid-cols-3 gap-y-3 gap-x-5 w-full mt-1">
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="electrolytesNaPlusActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">
                Na<sup>+</sup>
              </span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="electrolytesNaPlusResults"
              disabled={!dataWatch.electrolytesNaPlusActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.electrolytesNaPlusActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="electrolytesNaPlusDate"
              disabled={!dataWatch.electrolytesNaPlusActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.electrolytesNaPlusActive }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="electrolytesKPlusActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">
                K<sup>+</sup>
              </span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="electrolytesKPlusResults"
              disabled={!dataWatch.electrolytesKPlusActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.electrolytesKPlusActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="electrolytesKPlusDate"
              disabled={!dataWatch.electrolytesKPlusActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.electrolytesKPlusActive }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="electrolytesClMinusActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">
                CL<sup>-</sup>
              </span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="electrolytesClMinusResults"
              disabled={!dataWatch.electrolytesClMinusActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.electrolytesClMinusActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="electrolytesClMinusDate"
              disabled={!dataWatch.electrolytesClMinusActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.electrolytesClMinusActive }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="electrolytesCa2PlusActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">
                Ca<sup>2+</sup>
              </span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="electrolytesCa2PlusResults"
              disabled={!dataWatch.electrolytesCa2PlusActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.electrolytesCa2PlusActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="electrolytesCa2PlusDate"
              disabled={!dataWatch.electrolytesCa2PlusActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.electrolytesCa2PlusActive }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="electrolytesMg2PlusActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">
                Mg<sup>2+</sup>
              </span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="electrolytesMg2PlusResults"
              disabled={!dataWatch.electrolytesMg2PlusActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.electrolytesMg2PlusActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="electrolytesMg2PlusDate"
              disabled={!dataWatch.electrolytesMg2PlusActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.electrolytesMg2PlusActive }
              )}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="electrolytesPMinusActive"
                ref={register}
                onChange={handleChanges}
              />
              <span className="ml-2">
                P<sup>-</sup>
              </span>
            </label>
          </div>
          <div className="col-span-1">
            <input
              type="text"
              name="electrolytesPMinusResults"
              disabled={!dataWatch.electrolytesPMinusActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.electrolytesPMinusActive }
              )}
            />
          </div>
          <div className="col-span-1">
            <input
              type="date"
              name="electrolytesPMinusDate"
              disabled={!dataWatch.electrolytesPMinusActive}
              ref={register}
              onChange={handleChanges}
              className={classnames(
                'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                { 'bg-gray-200': !dataWatch.electrolytesPMinusActive }
              )}
            />
          </div>
        </div>
      </div>

      <div className="mt-4 shadow-md bg-white rounded-md p-4">
        <div className="text-xl text-gray-600 font-semibold">Fitness</div>
        <hr className="mt-2" />

        <div className="mt-2">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="fitForSurgery"
              checked={fitForSurgery}
              onChange={(evt) => setFitForSurgery(true)}
            />
            <span className="ml-2">Fit</span>
          </label>
          <label className="inline-flex items-center ml-5">
            <input
              type="radio"
              name="fitForSurgery"
              checked={!fitForSurgery}
              onChange={(evt) => setFitForSurgery(false)}
            />
            <span className="ml-2">Unfit</span>
          </label>
        </div>

        <div className="mt-4 text-gray-600">
          <textarea
            name="fitForSurgeryNote"
            rows={4}
            ref={register}
            onChange={handleChanges}
            className="mt-1 p-1 pl-4 block w-full sm:text-md border border-gray-300 rounded-md"
          />
        </div>
      </div>
    </div>
  );
};
