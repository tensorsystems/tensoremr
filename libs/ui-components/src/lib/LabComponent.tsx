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

import { gql, useMutation } from '@apollo/client';
import _ from 'lodash';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Prompt } from 'react-router-dom';
import { IFileUploader, FileUploader } from './FileUploader';
import {
  Lab,
  LabUpdateInput,
  MutationUpdateLabArgs,
  MutationDeleteLabDocumentArgs,
  FileUpload,
  LabStatus,
  MutationDeleteLabImageArgs,
} from '@tensoremr/models';
import classnames from 'classnames';
import { getFileUrl } from '@tensoremr/util';

const AUTO_SAVE_INTERVAL = 1000;

const UPDATE_LAB = gql`
  mutation UpdateLab($input: LabUpdateInput!) {
    updateLab(input: $input) {
      id
      status
      images {
        id
        size
        hash
        fileName
        extension
        contentType
        createdAt
      }
      documents {
        id
        size
        hash
        fileName
        extension
        contentType
        createdAt
      }
    }
  }
`;

const DELETE_LAB_IMAGE = gql`
  mutation DeleteLabImage($input: LabDeleteFileInput!) {
    deleteLabImage(input: $input)
  }
`;

const DELETE_LAB_DOCUMENT = gql`
  mutation DeleteLabDocument($input: LabDeleteFileInput!) {
    deleteLabDocument(input: $input)
  }
`;

interface Props {
  values: Lab;
  readOnly: boolean;
  forPrint?: boolean;
  onRefresh: () => void;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export const LabComponent: React.FC<Props> = ({
  values,
  readOnly,
  forPrint = false,
  onRefresh,
  onError,
  onSuccess,
}) => {
  const hasImages = (values?.images.length ?? 0) > 0;

  const hasDocuments = (values?.documents.length ?? 0) > 0;
  const hasTextArea = (values?.generalText?.length ?? 0) > 0;

  const [sectionExpand, setSectionExpand] = useState<any>({
    imagery: hasImages,
    documents: hasDocuments,
    textArea: hasTextArea,
  });

  const [timer, setTimer] = useState<any>(null);
  const [modified, setModified] = useState<boolean>(false);

  const { register, getValues, watch } = useForm<LabUpdateInput>({
    defaultValues: {
      cbcWbcActive: values.cbcWbcActive,
      cbcWbcResults: values.cbcWbcResults,
      cbcWbcDate: values.cbcWbcDate,
      cbcHgbActive: values.cbcHgbActive,
      cbcHgbResults: values.cbcHgbResults,
      cbcHgbDate: values.cbcHgbDate,
      cbcHctActive: values.cbcHctActive,
      cbcHctResults: values.cbcHctResults,
      cbcHctDate: values.cbcHctDate,
      cbcEsrActive: values.cbcEsrActive,
      cbcEsrResults: values.cbcEsrResults,
      cbcEsrDate: values.cbcEsrDate,
      cbcBloodGroupActive: values.cbcBloodGroupActive,
      cbcBloodGroupResults: values.cbcBloodGroupResults,
      cbcBloodGroupDate: values.cbcBloodGroupDate,
      cbcRhActive: values.cbcRhActive,
      cbcRhResults: values.cbcRhResults,
      cbcRhDate: values.cbcRhDate,
      cbcBloodFilmActive: values.cbcBloodFilmActive,
      cbcBloodFilmResults: values.cbcBloodFilmResults,
      cbcBloodFilmDate: values.cbcBloodFilmDate,
      cbcPltActive: values.cbcPltActive,
      cbcPltResults: values.cbcPltResults,
      cbcPltDate: values.cbcPltDate,
      liverCoagulationPtActive: values.liverCoagulationPtActive,
      liverCoagulationPtResults: values.liverCoagulationPtResults,
      liverCoagulationPtDate: values.liverCoagulationPtDate,
      liverCoagulationPttActive: values.liverCoagulationPttActive,
      liverCoagulationPttResults: values.liverCoagulationPttResults,
      liverCoagulationPttDate: values.liverCoagulationPttDate,
      liverCoagulationInrActive: values.liverCoagulationInrActive,
      liverCoagulationInrResults: values.liverCoagulationInrResults,
      liverCoagulationInrDate: values.liverCoagulationInrDate,
      liverAstsgotActive: values.liverAstsgotActive,
      liverAstsgotResults: values.liverAstsgotResults,
      liverAstsgotDate: values.liverAstsgotDate,
      liverAltsgptActive: values.liverAltsgptActive,
      liverAltsgptResults: values.liverAltsgptResults,
      liverAltsgptDate: values.liverAltsgptDate,
      liverAlpActive: values.liverAlpActive,
      liverAlpResults: values.liverAlpResults,
      liverAlpDate: values.liverAlpDate,
      renalCrActive: values.renalCrActive,
      renalCrResults: values.renalCrResults,
      renalCrDate: values.renalCrDate,
      renalBunActive: values.renalBunActive,
      renalBunResults: values.renalBunResults,
      renalBunDate: values.renalBunDate,
      thyroidFreeT3Active: values.thyroidFreeT3Active,
      thyroidFreeT3Results: values.thyroidFreeT3Results,
      thyroidFreeT3Date: values.thyroidFreeT3Date,
      thyroidTotalT4Active: values.thyroidTotalT4Active,
      thyroidTotalT4Results: values.thyroidTotalT4Results,
      thyroidTotalT4Date: values.thyroidTotalT4Date,
      thyroidTshActive: values.thyroidTshActive,
      thyroidTshResults: values.thyroidTshResults,
      thyroidTshDate: values.thyroidTshDate,
      electrolytesNaPlusActive: values.electrolytesNaPlusActive,
      electrolytesNaPlusResults: values.electrolytesNaPlusResults,
      electrolytesNaPlusDate: values.electrolytesNaPlusDate,
      electrolytesKPlusActive: values.electrolytesKPlusActive,
      electrolytesKPlusResults: values.electrolytesKPlusResults,
      electrolytesKPlusDate: values.electrolytesKPlusDate,
      electrolytesClMinusActive: values.electrolytesClMinusActive,
      electrolytesClMinusResults: values.electrolytesClMinusResults,
      electrolytesClMinusDate: values.electrolytesClMinusDate,
      electrolytesCa2PlusActive: values.electrolytesCa2PlusActive,
      electrolytesCa2PlusResults: values.electrolytesCa2PlusResults,
      electrolytesCa2PlusDate: values.electrolytesCa2PlusDate,
      electrolytesMg2PlusActive: values.electrolytesMg2PlusActive,
      electrolytesMg2PlusResults: values.electrolytesMg2PlusResults,
      electrolytesMg2PlusDate: values.electrolytesMg2PlusDate,
      electrolytesPMinusActive: values.electrolytesPMinusActive,
      electrolytesPMinusResults: values.electrolytesPMinusResults,
      electrolytesPMinusDate: values.electrolytesPMinusDate,
      stoolConsistencyActive: values.stoolConsistencyActive,
      stoolConsistencyResults: values.stoolConsistencyResults,
      stoolConsistencyDate: values.stoolConsistencyDate,
      stoolOpActive: values.stoolOpActive,
      stoolOpResults: values.stoolOpResults,
      stoolOpDate: values.stoolOpDate,
      stoolConcentrationActive: values.stoolConcentrationActive,
      stoolConcentrationResults: values.stoolConcentrationResults,
      stoolConcentrationDate: values.stoolConcentrationDate,
      stoolOccultBloodActive: values.stoolOccultBloodActive,
      stoolOccultBloodResults: values.stoolOccultBloodResults,
      stoolOccultBloodDate: values.stoolOccultBloodDate,
      microscopyEpitCellsActive: values.microscopyEpitCellsActive,
      microscopyEpitCellsResults: values.microscopyEpitCellsResults,
      microscopyEpitCellsDate: values.microscopyEpitCellsDate,
      microscopyWbcActive: values.microscopyWbcActive,
      microscopyWbcResults: values.microscopyWbcResults,
      microscopyWbcDate: values.microscopyWbcDate,
      microscopyRbcActive: values.microscopyRbcActive,
      microscopyRbcResults: values.microscopyRbcResults,
      microscopyRbcDate: values.microscopyRbcDate,
      microscopyCastsActive: values.microscopyCastsActive,
      microscopyCastsResults: values.microscopyCastsResults,
      microscopyCastsDate: values.microscopyCastsDate,
      microscopyCrystalsActive: values.microscopyCrystalsActive,
      microscopyCrystalsResults: values.microscopyCrystalsResults,
      microscopyCrystalsDate: values.microscopyCrystalsDate,
      microscopyBacteriaActive: values.microscopyBacteriaActive,
      microscopyBacteriaResults: values.microscopyBacteriaResults,
      microscopyBacteriaDate: values.microscopyBacteriaDate,
      microscopyHcgActive: values.microscopyHcgActive,
      microscopyHcgResults: values.microscopyHcgResults,
      microscopyHcgDate: values.microscopyHcgDate,
      urinalysisColorActive: values.urinalysisColorActive,
      urinalysisColorResults: values.urinalysisColorResults,
      urinalysisColorDate: values.urinalysisColorDate,
      urinalysisAppearanceActive: values.urinalysisAppearanceActive,
      urinalysisAppearanceResults: values.urinalysisAppearanceResults,
      urinalysisAppearanceDate: values.urinalysisAppearanceDate,
      urinalysisPhActive: values.urinalysisPhActive,
      urinalysisPhResults: values.urinalysisPhResults,
      urinalysisPhDate: values.urinalysisPhDate,
      urinalysisSgActive: values.urinalysisSgActive,
      urinalysisSgResults: values.urinalysisSgResults,
      urinalysisSgDate: values.urinalysisSgDate,
      urinalysisProteinActive: values.urinalysisProteinActive,
      urinalysisProteinResults: values.urinalysisProteinResults,
      urinalysisProteinDate: values.urinalysisProteinDate,
      urinalysisGlucoseActive: values.urinalysisGlucoseActive,
      urinalysisGlucoseResults: values.urinalysisGlucoseResults,
      urinalysisGlucoseDate: values.urinalysisGlucoseDate,
      urinalysisLeukocyteActive: values.urinalysisLeukocyteActive,
      urinalysisLeukocyteResults: values.urinalysisLeukocyteResults,
      urinalysisLeukocyteDate: values.urinalysisLeukocyteDate,
      urinalysisKetoneActive: values.urinalysisKetoneActive,
      urinalysisKetoneResults: values.urinalysisKetoneResults,
      urinalysisKetoneDate: values.urinalysisKetoneDate,
      urinalysisBilirubinActive: values.urinalysisBilirubinActive,
      urinalysisBilirubinResults: values.urinalysisBilirubinResults,
      urinalysisBilirubinDate: values.urinalysisBilirubinDate,
      urinalysisUrobilingenActive: values.urinalysisUrobilingenActive,
      urinalysisUrobilingenResults: values.urinalysisUrobilingenResults,
      urinalysisUrobilingenDate: values.urinalysisUrobilingenDate,
      urinalysisBloodActive: values.urinalysisBloodActive,
      urinalysisBloodResults: values.urinalysisBloodResults,
      urinalysisBloodDate: values.urinalysisBloodDate,
      serologyVdrlActive: values.serologyVdrlActive,
      serologyVdrlResults: values.serologyVdrlResults,
      serologyVdrlDate: values.serologyVdrlDate,
      serologyWidalHActive: values.serologyWidalHActive,
      serologyWidalHResults: values.serologyWidalHResults,
      serologyWidalHDate: values.serologyWidalHDate,
      serologyWidalOActive: values.serologyWidalOActive,
      serologyWidalOResults: values.serologyWidalOResults,
      serologyWidalODate: values.serologyWidalODate,
      serologyWeilFelixActive: values.serologyWeilFelixActive,
      serologyWeilFelixResults: values.serologyWeilFelixResults,
      serologyWeilFelixDate: values.serologyWeilFelixDate,
      serologyHbsAgActive: values.serologyHbsAgActive,
      serologyHbsAgResults: values.serologyHbsAgResults,
      serologyHbsAgDate: values.serologyHbsAgDate,
      serologyHcvAbActive: values.serologyHcvAbActive,
      serologyHcvAbResults: values.serologyHcvAbResults,
      serologyHcvAbDate: values.serologyHcvAbDate,
      serologyAsoActive: values.serologyAsoActive,
      serologyAsoResults: values.serologyAsoResults,
      serologyAsoDate: values.serologyAsoDate,
      serologyRfActive: values.serologyRfActive,
      serologyRfResults: values.serologyRfResults,
      serologyRfDate: values.serologyRfDate,
      serologyHpayloryAgActive: values.serologyHpayloryAgActive,
      serologyHpayloryAgResults: values.serologyHpayloryAgResults,
      serologyHpayloryAgDate: values.serologyHpayloryAgDate,
      serologyHpyloryAbActive: values.serologyHpyloryAbActive,
      serologyHpyloryAbResults: values.serologyHpyloryAbResults,
      serologyHpyloryAbDate: values.serologyHpyloryAbDate,
      bacterologySampleActive: values.bacterologySampleActive,
      bacterologySampleResults: values.bacterologySampleResults,
      bacterologySampleDate: values.bacterologySampleDate,
      bacterologyKohActive: values.bacterologyKohActive,
      bacterologyKohResults: values.bacterologyKohResults,
      bacterologyKohDate: values.bacterologyKohDate,
      bacterologyGramStainActive: values.bacterologyGramStainActive,
      bacterologyGramStainResults: values.bacterologyGramStainResults,
      bacterologyGramStainDate: values.bacterologyGramStainDate,
      bacterologyWetFilmActive: values.bacterologyWetFilmActive,
      bacterologyWetFilmResults: values.bacterologyWetFilmResults,
      bacterologyWetFilmDate: values.bacterologyWetFilmDate,
      bacterologyAfb1Active: values.bacterologyAfb1Active,
      bacterologyAfb1Results: values.bacterologyAfb1Results,
      bacterologyAfb1Date: values.bacterologyAfb1Date,
      bacterologyAfb2Active: values.bacterologyAfb2Active,
      bacterologyAfb2Results: values.bacterologyAfb2Results,
      bacterologyAfb2Date: values.bacterologyAfb2Date,
      bacterologyAfb3Active: values.bacterologyAfb3Active,
      bacterologyAfb3Results: values.bacterologyAfb3Results,
      bacterologyAfb3Date: values.bacterologyAfb3Date,
      bacterologyCultureActive: values.bacterologyCultureActive,
      bacterologyCultureResults: values.bacterologyCultureResults,
      bacterologyCultureDate: values.bacterologyCultureDate,
      chemistryFbsRbsActive: values.chemistryFbsRbsActive,
      chemistryFbsRbsResults: values.chemistryFbsRbsResults,
      chemistryFbsRbsDate: values.chemistryFbsRbsDate,
      chemistrySgotActive: values.chemistrySgotActive,
      chemistrySgotResults: values.chemistrySgotResults,
      chemistrySgotDate: values.chemistrySgotDate,
      chemistrySgptActive: values.chemistrySgptActive,
      chemistrySgptResults: values.chemistrySgptResults,
      chemistrySgptDate: values.chemistrySgptDate,
      chemistryAlkalinePhosphatesActive:
        values.chemistryAlkalinePhosphatesActive,
      chemistryAlkalinePhosphatesResults:
        values.chemistryAlkalinePhosphatesResults,
      chemistryAlkalinePhosphatesDate: values.chemistryAlkalinePhosphatesDate,
      chemistryBilirubinTotalActive: values.chemistryBilirubinTotalActive,
      chemistryBilirubinTotalResults: values.chemistryBilirubinTotalResults,
      chemistryBilirubinTotalDate: values.chemistryBilirubinTotalDate,
      chemistryBilirubinDirectActive: values.chemistryBilirubinDirectActive,
      chemistryBilirubinDirectResults: values.chemistryBilirubinDirectResults,
      chemistryBilirubinDirectDate: values.chemistryBilirubinDirectDate,
      chemistryUreaActive: values.chemistryUreaActive,
      chemistryUreaResults: values.chemistryUreaResults,
      chemistryUreaDate: values.chemistryUreaDate,
      chemistryBunActive: values.chemistryBunActive,
      chemistryBunResults: values.chemistryBunResults,
      chemistryBunDate: values.chemistryBunDate,
      chemistryCreatnineActive: values.chemistryCreatnineActive,
      chemistryCreatnineResults: values.chemistryCreatnineResults,
      chemistryCreatnineDate: values.chemistryCreatnineDate,
      chemistryUricAcidActive: values.chemistryUricAcidActive,
      chemistryUricAcidResults: values.chemistryUricAcidResults,
      chemistryUricAcidDate: values.chemistryUricAcidDate,
      chemistryTotalProteinActive: values.chemistryTotalProteinActive,
      chemistryTotalProteinResults: values.chemistryTotalProteinResults,
      chemistryTotalProteinDate: values.chemistryTotalProteinDate,
      chemistryTriglyceridesActive: values.chemistryTriglyceridesActive,
      chemistryTriglyceridesResults: values.chemistryTriglyceridesResults,
      chemistryTriglyceridesDate: values.chemistryTriglyceridesDate,
      chemistryCholestrolActive: values.chemistryCholestrolActive,
      chemistryCholestrolResults: values.chemistryCholestrolResults,
      chemistryCholestrolDate: values.chemistryCholestrolDate,
      chemistryHdlActive: values.chemistryHdlActive,
      chemistryHdlResults: values.chemistryHdlResults,
      chemistryHdlDate: values.chemistryHdlDate,
      chemistryLdlActive: values.chemistryLdlActive,
      chemistryLdlResults: values.chemistryLdlResults,
      chemistryLdlDate: values.chemistryLdlDate,
    },
  });

  const defaultImages: Array<IFileUploader> =
    values?.images.map((e) => ({
      id: e?.id,
      fileUrl: getFileUrl({
        // @ts-ignore
        baseUrl: import.meta.env.VITE_APP_SERVER_URL,
        fileName: e?.fileName ?? '',
        hash: e?.hash ?? '',
        extension: e?.extension ?? '',
      }),
      name: e?.fileName ?? '',
      size: e?.size,
      createdAt: e?.createdAt,
      contentType: e?.contentType ?? '',
    })) ?? [];

  const defaultDocuments: Array<IFileUploader> =
    values?.documents.map((e) => ({
      id: e?.id,
      fileUrl: getFileUrl({
        // @ts-ignore
        baseUrl: import.meta.env.VITE_APP_SERVER_URL,
        fileName: e?.fileName ?? '',
        hash: e?.hash ?? '',
        extension: e?.extension ?? '',
      }),
      name: e?.fileName ?? '',
      size: e?.size,
      createdAt: e?.createdAt,
      contentType: e?.contentType ?? '',
    })) ?? [];

  const [images, setImages] = useState<Array<IFileUploader>>(defaultImages);
  const [documents, setDocuments] =
    useState<Array<IFileUploader>>(defaultDocuments);

  const [updateLab] = useMutation<any, MutationUpdateLabArgs>(UPDATE_LAB, {
    onCompleted(data) {
      setModified(false);
      onRefresh();

      const incomingImages = data.updateLab.images.map((e: any) => ({
        id: e?.id,
        fileUrl: getFileUrl({
          // @ts-ignore
          baseUrl: import.meta.env.VITE_APP_SERVER_URL,
          fileName: e?.fileName,
          hash: e?.hash,
          extension: e?.extension,
        }),
        name: e?.fileName ?? '',
        size: e?.size,
        createdAt: e?.createdAt,
        contentType: e?.contentType ?? '',
      }));

      setImages([...images, ...incomingImages]);

      const incomingDocuments = data.updateLab.documents.map((e: any) => ({
        id: e?.id,
        fileUrl: getFileUrl({
          // @ts-ignore
          baseUrl: import.meta.env.VITE_APP_SERVER_URL,
          fileName: e?.fileName,
          hash: e?.hash,
          extension: e?.extension,
        }),
        name: e?.fileName ?? '',
        size: e?.size,
        createdAt: e?.createdAt,
        contentType: e?.contentType ?? '',
      }));

      setDocuments([...documents, ...incomingDocuments]);
    },
    onError(error) {
      onError(error.message);
    },
  });

  const [updateLabStatus] = useMutation<any, MutationUpdateLabArgs>(
    UPDATE_LAB,
    {
      onCompleted(data) {
        onRefresh();
        onSuccess('Lab marked as done');
      },
      onError(error) {
        onError(error.message);
      },
    }
  );

  const [deleteDocument] = useMutation<any, MutationDeleteLabDocumentArgs>(
    DELETE_LAB_DOCUMENT,
    {
      onError(error) {
        onError(error.message);
      },
    }
  );

  const [deleteImage] = useMutation<any, MutationDeleteLabImageArgs>(
    DELETE_LAB_IMAGE,
    {
      onError(error) {
        onError(error.message);
      },
    }
  );

  const handleImagesAdd = (change: Array<IFileUploader>) => {
    const files: Array<FileUpload> = change
      .filter((e) => e.fileObject !== undefined)
      .map((e) => ({
        file: e.fileObject,
        name: e.name,
      }));

    if (values?.id !== undefined && files.length > 0) {
      updateLab({
        variables: {
          input: {
            id: values?.id,
            images: files,
          },
        },
      });
    }
  };

  const handleImagesClear = () => {
    setImages([]);
    if (values?.id !== undefined) {
      updateLab({
        variables: {
          input: {
            id: values?.id,
            images: [],
          },
        },
      });
    }
  };

  const handleDocumentsAdd = (change: Array<IFileUploader>) => {
    const files: Array<FileUpload> = change
      .filter((e) => e.fileObject !== undefined)
      .map((e) => ({
        file: e.fileObject,
        name: e.name,
      }));

    if (values?.id !== undefined && files.length > 0) {
      updateLab({
        variables: {
          input: {
            id: values?.id,
            documents: files,
          },
        },
      });
    }
  };

  const handleDocumentsClear = () => {
    setDocuments([]);
    if (values?.id !== undefined) {
      updateLab({
        variables: {
          input: {
            id: values?.id,
            documents: [],
          },
        },
      });
    }
  };

  const handleImageDelete = (index: number) => {
    const file = images.find((_, i) => i === index);
    setImages(images.filter((_, i) => i !== index));

    if (file?.id !== undefined && values?.id !== undefined) {
      deleteImage({
        variables: {
          input: {
            labId: values?.id,
            fileId: file.id,
          },
        },
      });
    }
  };

  const handleDocumentDelete = (index: number) => {
    const file = documents.find((_, i) => i === index);
    setDocuments(documents.filter((_, i) => i !== index));

    if (file?.id !== undefined && values?.id !== undefined) {
      deleteDocument({
        variables: {
          input: {
            labId: values?.id,
            fileId: file.id,
          },
        },
      });
    }
  };

  const handleChanges = () => {
    setModified(true);
    clearTimeout(timer);

    const data = getValues();
    const isEmpty = _.values(data).every((v) => _.isEmpty(v));

    setTimer(
      setTimeout(() => {
        if (values?.id !== undefined && !isEmpty) {
          const input = {
            ...data,
            id: values?.id,
          };

          updateLab({
            variables: {
              input,
            },
          });
        }
      }, AUTO_SAVE_INTERVAL)
    );
  };

  const handleMarkAsDone = () => {
    if (values?.id) {
      updateLabStatus({
        variables: {
          input: {
            id: values?.id,
            status: LabStatus.Completed,
          },
        },
      });
    }
  };

  const data = watch();

  if (!values?.payments.every((e) => e.status === 'PAID')) {
    return (
      <div className="p-4">
        <div className="mt-5 flex h-32 rounded-sm">
          <div className="m-auto flex space-x-1 text-gray-500">
            <div className="material-icons">money_off</div>
            <p className="text-center">Not paid for</p>
          </div>
        </div>
      </div>
    );
  }

  let Form = <div />;

  if (
    values?.labType.title.toLowerCase() === 'Hematology'.toLowerCase() ||
    values?.labType.title.toLowerCase() === 'CBC'.toLowerCase()
  ) {
    Form = (
      <form className="p-4">
        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full">
          <div className="col-span-1"></div>
          <div className="col-span-1 text-center">Results</div>
        </div>

        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full mt-5">
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="cbcWbcActive"
              />
              <span className="ml-2">WBC</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="cbcWbcResults"
              active={data.cbcWbcActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="cbcHgbActive"
              />
              <span className="ml-2">HGB</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="cbcHgbResults"
              active={data.cbcHgbActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="cbcHctActive"
              />
              <span className="ml-2">HCT</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="cbcHctResults"
              active={data.cbcHctActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="cbcEsrActive"
              />
              <span className="ml-2">ESR</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="cbcEsrResults"
              active={data.cbcEsrActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="cbcBloodGroupActive"
              />
              <span className="ml-2">Blood Group</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="cbcBloodGroupResults"
              active={data.cbcBloodGroupActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="cbcRhActive"
              />
              <span className="ml-2">RH</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="cbcRhResults"
              active={data.cbcRhActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="cbcBloodFilmActive"
              />
              <span className="ml-2">Blood Film</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="cbcBloodFilmResults"
              active={data.cbcBloodFilmActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="cbcPltActive"
              />
              <span className="ml-2">PLT</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="cbcPltResults"
              active={data.cbcPltActive}
              register={register}
              onChange={handleChanges}
            />
          </div>
        </div>
      </form>
    );
  }

  if (values?.labType.title.toLowerCase() === 'Chemistry'.toLowerCase()) {
    Form = (
      <form className="p-4">
        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full">
          <div className="col-span-1"></div>
          <div className="col-span-1 text-center">Results</div>
        </div>

        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full mt-5">
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="chemistryFbsRbsActive"
              />
              <span className="ml-2">FBS/RBS</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="chemistryFbsRbsResults"
              active={data.chemistryFbsRbsActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="chemistrySgotActive"
              />
              <span className="ml-2">sGOT</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="chemistrySgotResults"
              active={data.chemistrySgotActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="chemistrySgptActive"
              />
              <span className="ml-2">sGPT</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="chemistrySgptResults"
              active={data.chemistrySgptActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="chemistryAlkalinePhosphatesActive"
              />
              <span className="ml-2">Alkaline Phosphates</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="chemistryAlkalinePhosphatesResults"
              active={data.chemistryAlkalinePhosphatesActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="chemistryBilirubinTotalActive"
              />
              <span className="ml-2">Bilirubin (Total)</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="chemistryBilirubinTotalResults"
              active={data.chemistryBilirubinTotalActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="chemistryBilirubinDirectActive"
              />
              <span className="ml-2">Bilirubin (Direct)</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="chemistryBilirubinDirectResults"
              active={data.chemistryBilirubinDirectActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="chemistryUreaActive"
              />
              <span className="ml-2">Urea</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="chemistryUreaResults"
              active={data.chemistryUreaActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="chemistryBunActive"
              />
              <span className="ml-2">BUN</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="chemistryBunResults"
              active={data.chemistryBunActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="chemistryCreatnineActive"
              />
              <span className="ml-2">Creatnine</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="chemistryCreatnineResults"
              active={data.chemistryCreatnineActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="chemistryUricAcidActive"
              />
              <span className="ml-2">Uric Acid</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="chemistryUricAcidResults"
              active={data.chemistryUricAcidActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="chemistryTotalProteinActive"
              />
              <span className="ml-2">Total Protien</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="chemistryTotalProteinResults"
              active={data.chemistryTotalProteinActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="chemistryTriglyceridesActive"
              />
              <span className="ml-2">Triglycerides</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="chemistryTriglyceridesResults"
              active={data.chemistryTriglyceridesActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="chemistryCholestrolActive"
              />
              <span className="ml-2">Cholestrol</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="chemistryCholestrolResults"
              active={data.chemistryCholestrolActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="chemistryHdlActive"
              />
              <span className="ml-2">HDL</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="chemistryHdlResults"
              active={data.chemistryHdlActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="chemistryLdlActive"
              />
              <span className="ml-2">LDL</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="chemistryLdlResults"
              active={data.chemistryLdlActive}
              register={register}
              onChange={handleChanges}
            />
          </div>
        </div>
      </form>
    );
  }

  if (values?.labType.title.toLowerCase() === 'Electrolytes'.toLowerCase()) {
    Form = (
      <form className="p-4">
        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full">
          <div className="col-span-1"></div>
          <div className="col-span-1 text-center">Results</div>
        </div>

        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full mt-5">
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="electrolytesNaPlusActive"
              />
              <span className="ml-2">Na</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="electrolytesNaPlusResults"
              active={data.electrolytesNaPlusActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="electrolytesKPlusActive"
              />
              <span className="ml-2">K</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="electrolytesKPlusResults"
              active={data.electrolytesKPlusActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="electrolytesClMinusActive"
              />
              <span className="ml-2">CI</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="electrolytesClMinusResults"
              active={data.electrolytesClMinusActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="electrolytesCa2PlusActive"
              />
              <span className="ml-2">Ca2+</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="electrolytesCa2PlusResults"
              active={data.electrolytesCa2PlusActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="electrolytesMg2PlusActive"
              />
              <span className="ml-2">Mg2+</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="electrolytesMg2PlusResults"
              active={data.electrolytesMg2PlusActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="electrolytesPMinusActive"
              />
              <span className="ml-2">P-</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="electrolytesPMinusResults"
              active={data.electrolytesPMinusActive}
              register={register}
              onChange={handleChanges}
            />
          </div>
        </div>
      </form>
    );
  }

  if (
    values?.labType.title.toLowerCase() ===
    'Liver Function Test'.toLocaleLowerCase()
  ) {
    Form = (
      <form className="p-4">
        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full">
          <div className="col-span-1"></div>
          <div className="col-span-1 text-center">Results</div>
        </div>

        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full mt-5">
          <div className="col-span-1 font-semibold">Coagulation Profile</div>
          <div className="col-span-1 text-center"></div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center ml-5">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="liverCoagulationPtActive"
              />
              <span className="ml-2">PT</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="liverCoagulationPtResults"
              active={data.liverCoagulationPtActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center ml-5">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="liverCoagulationPttActive"
              />
              <span className="ml-2">PTT</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="liverCoagulationPttResults"
              active={data.liverCoagulationPttActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center ml-5">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="liverCoagulationInrActive"
              />
              <span className="ml-2">INR</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="liverCoagulationInrResults"
              active={data.liverCoagulationInrActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="liverAstsgotActive"
              />
              <span className="ml-2">AST/SGOT</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="liverAstsgotResults"
              active={data.liverAstsgotActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="liverAltsgptActive"
              />
              <span className="ml-2">ALT/SGPT</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="liverAltsgptResults"
              active={data.liverAltsgptActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="liverAlpActive"
              />
              <span className="ml-2">ALP</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="liverAlpResults"
              active={data.liverAlpActive}
              register={register}
              onChange={handleChanges}
            />
          </div>
        </div>
      </form>
    );
  }

  if (
    values?.labType.title.toLowerCase() ===
    'Renal Function Test'.toLocaleLowerCase()
  ) {
    Form = (
      <form className="p-4">
        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full">
          <div className="col-span-1"></div>
          <div className="col-span-1 text-center">Results</div>
        </div>

        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full mt-5">
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="renalCrActive"
              />
              <span className="ml-2">Cr</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="renalCrResults"
              active={data.renalCrActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="renalBunActive"
              />
              <span className="ml-2">BUN</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="renalBunResults"
              active={data.renalBunActive}
              register={register}
              onChange={handleChanges}
            />
          </div>
        </div>
      </form>
    );
  }

  if (
    values?.labType.title.toLowerCase() ===
    'Thyroid Function Test'.toLocaleLowerCase()
  ) {
    Form = (
      <form className="p-4">
        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full">
          <div className="col-span-1"></div>
          <div className="col-span-1 text-center">Results</div>
        </div>

        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full mt-5">
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="thyroidFreeT3Active"
              />
              <span className="ml-2">Free T3</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="thyroidFreeT3Results"
              active={data.thyroidFreeT3Active}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="thyroidTotalT4Active"
              />
              <span className="ml-2">Free T4</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="thyroidTotalT4Results"
              active={data.thyroidTotalT4Active}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="thyroidTshActive"
              />
              <span className="ml-2">TSH</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="thyroidTshResults"
              active={data.thyroidTshActive}
              register={register}
              onChange={handleChanges}
            />
          </div>
        </div>
      </form>
    );
  }

  if (
    values?.labType.title.toLowerCase() ===
    'Stool Examination'.toLocaleLowerCase()
  ) {
    Form = (
      <form className="p-4">
        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full">
          <div className="col-span-1"></div>
          <div className="col-span-1 text-center">Results</div>
        </div>

        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full mt-5">
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="stoolConsistencyActive"
              />
              <span className="ml-2">Consistency</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="stoolConsistencyResults"
              active={data.stoolConsistencyActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="stoolOpActive"
              />
              <span className="ml-2">O/P</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="stoolOpResults"
              active={data.stoolOpActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="stoolConcentrationActive"
              />
              <span className="ml-2">Concentration</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="stoolConcentrationResults"
              active={data.stoolConcentrationActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="stoolOccultBloodActive"
              />
              <span className="ml-2">Occult Blood</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="stoolOccultBloodResults"
              active={data.stoolOccultBloodActive}
              register={register}
              onChange={handleChanges}
            />
          </div>
        </div>
      </form>
    );
  }

  if (
    values?.labType.title.toLowerCase() === 'Microscopy'.toLocaleLowerCase()
  ) {
    Form = (
      <form className="p-4">
        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full">
          <div className="col-span-1"></div>
          <div className="col-span-1 text-center">Results</div>
        </div>

        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full mt-5">
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="microscopyEpitCellsActive"
              />
              <span className="ml-2">Epit Cells</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="microscopyEpitCellsResults"
              active={data.microscopyEpitCellsActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="microscopyWbcActive"
              />
              <span className="ml-2">WBC</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="microscopyWbcResults"
              active={data.microscopyWbcActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="microscopyRbcActive"
              />
              <span className="ml-2">RBC</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="microscopyRbcResults"
              active={data.microscopyRbcActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="microscopyCastsActive"
              />
              <span className="ml-2">Casts</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="microscopyCastsResults"
              active={data.microscopyCastsActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="microscopyCrystalsActive"
              />
              <span className="ml-2">Crystals</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="microscopyCrystalsResults"
              active={data.microscopyCrystalsActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="microscopyBacteriaActive"
              />
              <span className="ml-2">Bacteria</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="microscopyBacteriaResults"
              active={data.microscopyBacteriaActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="microscopyHcgActive"
              />
              <span className="ml-2">HCG</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="microscopyHcgResults"
              active={data.microscopyHcgActive}
              register={register}
              onChange={handleChanges}
            />
          </div>
        </div>
      </form>
    );
  }

  if (
    values?.labType.title.toLowerCase() === 'Urinalysis'.toLocaleLowerCase()
  ) {
    Form = (
      <form className="p-4">
        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full">
          <div className="col-span-1"></div>
          <div className="col-span-1 text-center">Results</div>
          <div className="col-span-1 text-center">Date</div>
        </div>

        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full mt-5">
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="urinalysisColorActive"
              />
              <span className="ml-2">Color</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="urinalysisColorResults"
              active={data.urinalysisColorActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="urinalysisAppearanceActive"
              />
              <span className="ml-2">Appearance</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="urinalysisAppearanceResults"
              active={data.urinalysisAppearanceActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="urinalysisPhActive"
              />
              <span className="ml-2">PH</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="urinalysisPhResults"
              active={data.urinalysisPhActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="urinalysisSgActive"
              />
              <span className="ml-2">SG</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="urinalysisSgResults"
              active={data.urinalysisSgActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="urinalysisProteinActive"
              />
              <span className="ml-2">Protein</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="urinalysisProteinResults"
              active={data.urinalysisProteinActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="urinalysisGlucoseActive"
              />
              <span className="ml-2">Glucose</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="urinalysisGlucoseResults"
              active={data.urinalysisGlucoseActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="urinalysisLeukocyteActive"
              />
              <span className="ml-2">Leukocyte</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="urinalysisLeukocyteResults"
              active={data.urinalysisLeukocyteActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="urinalysisKetoneActive"
              />
              <span className="ml-2">Ketone</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="urinalysisKetoneResults"
              active={data.urinalysisKetoneActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="urinalysisBilirubinActive"
              />
              <span className="ml-2">Bilirubin</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="urinalysisBilirubinResults"
              active={data.urinalysisBilirubinActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="urinalysisUrobilingenActive"
              />
              <span className="ml-2">Urobilingen</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="urinalysisUrobilingenResults"
              active={data.urinalysisUrobilingenActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="urinalysisBloodActive"
              />
              <span className="ml-2">Blood</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="urinalysisBloodResults"
              active={data.urinalysisBloodActive}
              register={register}
              onChange={handleChanges}
            />
          </div>
        </div>
      </form>
    );
  }

  if (values?.labType.title.toLowerCase() === 'Serology'.toLocaleLowerCase()) {
    Form = (
      <form className="p-4">
        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full">
          <div className="col-span-1"></div>
          <div className="col-span-1 text-center">Results</div>
        </div>

        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full mt-5">
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="serologyVdrlActive"
              />
              <span className="ml-2">VDRL</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="serologyVdrlResults"
              active={data.serologyVdrlActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="serologyWidalHActive"
              />
              <span className="ml-2">Widal H</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="serologyWidalHResults"
              active={data.serologyWidalHActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="serologyWidalOActive"
              />
              <span className="ml-2">Widal O</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="serologyWidalOResults"
              active={data.serologyWidalOActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="serologyWeilFelixActive"
              />
              <span className="ml-2">Weil Felix</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="serologyWeilFelixResults"
              active={data.serologyWeilFelixActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="serologyHbsAgActive"
              />
              <span className="ml-2">HBS Ag</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="serologyHbsAgResults"
              active={data.serologyHbsAgActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="serologyHcvAbActive"
              />
              <span className="ml-2">HCV Ab</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="serologyHcvAbResults"
              active={data.serologyHcvAbActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="serologyAsoActive"
              />
              <span className="ml-2">ASO</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="serologyAsoResults"
              active={data.serologyAsoActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="serologyRfActive"
              />
              <span className="ml-2">RF</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="serologyRfResults"
              active={data.serologyRfActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="serologyHpayloryAgActive"
              />
              <span className="ml-2">H/paylory Ag</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="serologyHpayloryAgResults"
              active={data.serologyHpayloryAgActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="serologyHpyloryAbActive"
              />
              <span className="ml-2">H/pylory Ab</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="serologyHpyloryAbResults"
              active={data.serologyHpyloryAbActive}
              register={register}
              onChange={handleChanges}
            />
          </div>
        </div>
      </form>
    );
  }

  if (
    values?.labType.title.toLowerCase() === 'Bacterology'.toLocaleLowerCase()
  ) {
    Form = (
      <form className="p-4">
        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full">
          <div className="col-span-1"></div>
          <div className="col-span-1 text-center">Results</div>
        </div>

        <div className="text-gray-600 grid grid-cols-2 gap-y-3 gap-x-6 w-full mt-5">
          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="bacterologySampleActive"
              />
              <span className="ml-2">Sample</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="bacterologySampleResults"
              active={data.bacterologySampleActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="bacterologyKohActive"
              />
              <span className="ml-2">KOH</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="bacterologyKohResults"
              active={data.bacterologyKohActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="bacterologyGramStainActive"
              />
              <span className="ml-2">Gram Stain</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="bacterologyGramStainResults"
              active={data.bacterologyGramStainActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="bacterologyWetFilmActive"
              />
              <span className="ml-2">Wet Film</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="bacterologyWetFilmResults"
              active={data.bacterologyWetFilmActive}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="bacterologyAfb1Active"
              />
              <span className="ml-2">AFB 1</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="bacterologyAfb1Results"
              active={data.bacterologyAfb1Active}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="bacterologyAfb2Active"
              />
              <span className="ml-2">AFB 2</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="bacterologyAfb2Results"
              active={data.bacterologyAfb2Active}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="bacterologyAfb3Active"
              />
              <span className="ml-2">AFB 3</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="bacterologyAfb3Results"
              active={data.bacterologyAfb3Active}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="font-semibold col-span-1">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                ref={register}
                onChange={handleChanges}
                name="bacterologyCultureActive"
              />
              <span className="ml-2">Culture</span>
            </label>
          </div>
          <div className="col-span-1">
            <LabInput
              type="text"
              name="bacterologyCultureResults"
              active={data.bacterologyCultureActive}
              register={register}
              onChange={handleChanges}
            />
          </div>
        </div>
      </form>
    );
  }

  return (
    <div className="p-4">
      <Prompt
        when={modified}
        message="This page has unsaved data. Please click cancel and try again"
      />

      {!values?.payments.every((e) => e.status === 'PAID') ? (
        <div className="mt-5 flex h-32 rounded-sm">
          <div className="m-auto flex space-x-1 text-gray-500">
            <div className="material-icons">money_off</div>
            <p className="text-center">Not paid for</p>
          </div>
        </div>
      ) : (
        <div className="container mx-auto bg-gray-50 shadow-inner rounded-lg">
          <div>{Form}</div>

          {!forPrint && (
            <div className="mt-5 p-4 flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mt-2">
                  Imagery
                </label>
                <div className="mt-2">
                  <FileUploader
                    multiSelect={true}
                    values={images}
                    accept="image"
                    onAdd={handleImagesAdd}
                    onClear={handleImagesClear}
                    onDelete={handleImageDelete}
                    disabled={false}
                    onFileNameChange={(fileId, fileName) => {
                      const file = images.find((e) => e.id === fileId);
                      const fileIndex = images.findIndex(
                        (e) => e.id === fileId
                      );

                      if (file) {
                        const ext = file.contentType.split('/')[1];
                        const files = [...images];

                        files[fileIndex].name = fileName + '.' + ext;

                        setImages(files);
                      }
                    }}
                    onError={(message) => onError(message)}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mt-2">
                  Documents
                </label>
                <div className="mt-2">
                  <FileUploader
                    multiSelect={true}
                    values={documents}
                    accept="document"
                    onAdd={handleDocumentsAdd}
                    onClear={handleDocumentsClear}
                    onDelete={handleDocumentDelete}
                    disabled={false}
                    onFileNameChange={(fileId, fileName) => {
                      const file = documents.find((e) => e.id === fileId);
                      const fileIndex = documents.findIndex(
                        (e) => e.id === fileId
                      );

                      if (file) {
                        const ext = file.contentType.split('/')[1];
                        const files = [...documents];

                        files[fileIndex].name = fileName + '.' + ext;

                        setDocuments(files);
                      }
                    }}
                    onError={(message) => onError(message)}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="text-center mt-4">
            {values?.status !== LabStatus.Completed && !readOnly && (
              <button
                type="button"
                className="border border-teal-500 w-full text-teal-700 rounded-md p-1 flex justify-center space-x-2 hover:bg-teal-600 hover:text-white"
                onClick={handleMarkAsDone}
              >
                <p className="material-icons">check</p>
                <p>Mark as Done</p>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

function LabInput({
  type,
  name,
  active,
  register,
  onChange,
}: {
  type: 'text' | 'date';
  name: string;
  active: boolean | undefined | null;
  register: any;
  onChange: (value: any) => void;
}) {
  return (
    <input
      type={type}
      name={name}
      disabled={!active}
      ref={register}
      onChange={onChange}
      className={classnames(
        'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
        { 'bg-gray-200': !active }
      )}
    />
  );
}
