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
  MutationUpdateDiagnosticProcedureArgs,
  MutationDeleteDiagnosticDocumentArgs,
  FileUpload,
  DiagnosticProcedure,
  DiagnosticProcedureUpdateInput,
  MutationDeleteDiagnosticImageArgs,
  DiagnosticProcedureStatus,
} from '@tensoremr/models';
import { useExitPrompt } from '@tensoremr/hooks';
import cn from 'classnames';
import { RefractionDistanceComponent } from './RefractionDistanceForm';
import { RefractionNearComponent } from './RefractionNearForm';
import { getFileUrl } from '@tensoremr/util';

const AUTO_SAVE_INTERVAL = 1000;

export const UPDATE_DIAGNOSTIC_PROCEDURE = gql`
  mutation UpdateDiagnosticProcedure($input: DiagnosticProcedureUpdateInput!) {
    updateDiagnosticProcedure(input: $input) {
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

const DELETE_IMAGE = gql`
  mutation DeleteDiagnosticImage($input: DiagnosticProcedureDeleteFileInput!) {
    deleteDiagnosticImage(input: $input)
  }
`;

const DELETE_DIAGNOSTIC_DOCUMENT = gql`
  mutation DeleteDiagnosticDocument(
    $input: DiagnosticProcedureDeleteFileInput!
  ) {
    deleteDiagnosticDocument(input: $input)
  }
`;

interface Props {
  readOnly: boolean;
  values: DiagnosticProcedure | undefined;
  onRefersh: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

export const DiagnosticProcedureComponent: React.FC<Props> = ({
  values,
  readOnly,
  onRefersh,
  onSuccess,
  onError,
}) => {
  const [timer, setTimer] = useState<any>(null);
  const [modified, setModified] = useState<boolean>(false);
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);

  const hasImages = (values?.images.length ?? 0) > 0;
  const hasDocuments = (values?.documents.length ?? 0) > 0;
  const hasTextArea = (values?.generalText?.length ?? 0) > 0;

  const [refractionExpanded, setRefractionExpanded] = useState<boolean>(
    values?.status === DiagnosticProcedureStatus.Ordered
  );

  const [sectionExpand, setSectionExpand] = useState<any>({
    imagery: hasImages,
    documents: hasDocuments,
    textArea: hasTextArea,
  });

  const { register, getValues } = useForm<DiagnosticProcedureUpdateInput>({
    defaultValues: {
      id: values?.id,
      generalText: values?.generalText,
      rightDistanceSubjectiveSph: values?.rightDistanceSubjectiveSph,
      leftDistanceSubjectiveSph: values?.leftDistanceSubjectiveSph,
      rightDistanceSubjectiveCyl: values?.rightDistanceSubjectiveCyl,
      leftDistanceSubjectiveCyl: values?.leftDistanceSubjectiveCyl,
      rightDistanceSubjectiveAxis: values?.rightDistanceSubjectiveAxis,
      leftDistanceSubjectiveAxis: values?.leftDistanceSubjectiveAxis,
      rightNearSubjectiveSph: values?.rightNearSubjectiveSph,
      leftNearSubjectiveSph: values?.leftNearSubjectiveSph,
      rightNearSubjectiveCyl: values?.rightNearSubjectiveCyl,
      leftNearSubjectiveCyl: values?.leftNearSubjectiveCyl,
      rightNearSubjectiveAxis: values?.rightNearSubjectiveAxis,
      leftNearSubjectiveAxis: values?.leftNearSubjectiveAxis,
      rightDistanceObjectiveSph: values?.rightDistanceObjectiveSph,
      leftDistanceObjectiveSph: values?.leftDistanceObjectiveSph,
      rightDistanceObjectiveCyl: values?.rightDistanceObjectiveCyl,
      leftDistanceObjectiveCyl: values?.leftDistanceObjectiveCyl,
      rightDistanceObjectiveAxis: values?.rightDistanceObjectiveAxis,
      leftDistanceObjectiveAxis: values?.leftDistanceObjectiveAxis,
      rightNearObjectiveSph: values?.rightNearObjectiveSph,
      leftNearObjectiveSph: values?.leftNearObjectiveSph,
      rightNearObjectiveCyl: values?.rightNearObjectiveCyl,
      leftNearObjectiveCyl: values?.leftNearObjectiveCyl,
      rightNearObjectiveAxis: values?.rightNearObjectiveAxis,
      leftNearObjectiveAxis: values?.leftNearObjectiveAxis,
      rightDistanceFinalSph: values?.rightDistanceFinalSph,
      leftDistanceFinalSph: values?.leftDistanceFinalSph,
      rightDistanceFinalCyl: values?.rightDistanceFinalCyl,
      leftDistanceFinalCyl: values?.leftDistanceFinalCyl,
      rightDistanceFinalAxis: values?.rightDistanceFinalAxis,
      leftDistanceFinalAxis: values?.leftDistanceFinalAxis,
      rightNearFinalSph: values?.rightNearFinalSph,
      leftNearFinalSph: values?.leftNearFinalSph,
      rightNearFinalCyl: values?.rightNearFinalCyl,
      leftNearFinalCyl: values?.leftNearFinalCyl,
      rightNearFinalAxis: values?.rightNearFinalAxis,
      leftNearFinalAxis: values?.leftNearFinalAxis,
      rightVisualAcuity: values?.rightVisualAcuity,
      leftVisualAcuity: values?.leftVisualAcuity,
      farPd: values?.farPd,
      nearPd: values?.nearPd,
      status: values?.status,
    },
  });

  const defaultImages: Array<IFileUploader> =
    values?.images.map((e: any) => ({
      id: e?.id,
      fileUrl: getFileUrl({
        // @ts-ignore
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

  const defaultDocuments: Array<IFileUploader> =
    values?.documents.map((e: any) => ({
      id: e?.id,
      fileUrl: getFileUrl({
        // @ts-ignore
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

  const [images, setImages] = useState<Array<IFileUploader>>(defaultImages);
  const [documents, setDocuments] =
    useState<Array<IFileUploader>>(defaultDocuments);

  const [updateDiagnosticProcedure] = useMutation<
    any,
    MutationUpdateDiagnosticProcedureArgs
  >(UPDATE_DIAGNOSTIC_PROCEDURE, {
    onCompleted(data) {
      setModified(false);
      setShowExitPrompt(false);
      onRefersh();

      const incomingImages = data.updateDiagnosticProcedure.images.map(
        (e: any) => ({
          id: e?.id,
          fileUrl: getFileUrl({
            // @ts-ignore
            baseUrl: window.__RUNTIME_CONFIG__.REACT_APP_SERVER_URL,
            fileName: e?.fileName,
            hash: e?.hash,
            extension: e?.extension,
          }),
          name: e?.fileName ?? '',
          size: e?.size,
          createdAt: e?.createdAt,
          contentType: e?.contentType ?? '',
        })
      );

      setImages([...images, ...incomingImages]);

      const incomingDocuments = data.updateDiagnosticProcedure.documents.map(
        (e: any) => ({
          id: e?.id,
          fileUrl: getFileUrl({
            // @ts-ignore
            baseUrl: window.__RUNTIME_CONFIG__.REACT_APP_SERVER_URL,
            fileName: e?.fileName,
            hash: e?.hash,
            extension: e?.extension,
          }),
          name: e?.fileName ?? '',
          size: e?.size,
          createdAt: e?.createdAt,
          contentType: e?.contentType ?? '',
        })
      );

      setDocuments([...documents, ...incomingDocuments]);
    },
    onError(error) {
      onError(error.message);
    },
  });

  const [updateDiagnosticProcedureStatus] = useMutation<
    any,
    MutationUpdateDiagnosticProcedureArgs
  >(UPDATE_DIAGNOSTIC_PROCEDURE, {
    onCompleted(data) {
      onRefersh();
      onSuccess('Procedure marked as done');
    },
    onError(error) {
      onError(error.message);
    },
  });

  const [deleteImage] = useMutation<any, MutationDeleteDiagnosticImageArgs>(
    DELETE_IMAGE,
    {
      onError(error) {
        onError(error.message);
      },
    }
  );

  const [deleteDocument] = useMutation<
    any,
    MutationDeleteDiagnosticDocumentArgs
  >(DELETE_DIAGNOSTIC_DOCUMENT, {
    onError(error) {
      onError(error.message);
    },
  });

  const handleImageAdd = (change: Array<IFileUploader>) => {
    const files: Array<FileUpload> = change
      .filter((e) => e.fileObject !== undefined)
      .map((e) => ({
        file: e.fileObject,
        name: e.name,
      }));

    if (values?.id !== undefined && files.length > 0) {
      updateDiagnosticProcedure({
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
    if (values?.id !== undefined) {
      setImages([]);
      updateDiagnosticProcedure({
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
      updateDiagnosticProcedure({
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
      updateDiagnosticProcedure({
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
            diagnosticProcedureId: values?.id,
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
            diagnosticProcedureId: values?.id,
            fileId: file.id,
          },
        },
      });
    }
  };

  const handleChanges = () => {
    setModified(true);
    setShowExitPrompt(true);
    clearTimeout(timer);

    const data = getValues();
    const isEmpty = _.values(data).every((v) => _.isEmpty(v));

    setTimer(
      setTimeout(() => {
        if (values?.id !== undefined && !isEmpty) {
          const input = {
            ...data,
            id: values.id,
          };

          updateDiagnosticProcedure({
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
      updateDiagnosticProcedureStatus({
        variables: {
          input: {
            id: values?.id,
            status: DiagnosticProcedureStatus.Completed,
          },
        },
      });
    }
  };

  if (!values?.payments.every((e: any) => e.status === 'PAID')) {
    return (
      <div className="p-4 bg-gray-50 shadow-inner rounded-lg">
        <div className="mt-5 flex h-32 rounded-sm">
          <div className="m-auto flex space-x-1 text-gray-500">
            <div className="material-icons">money_off</div>
            <p className="text-center">Not paid for</p>
          </div>
        </div>
      </div>
    );
  }

  const hasVisualAcuity = values.rightVisualAcuity || values.leftVisualAcuity;

  if (values?.diagnosticProcedureTypeTitle.startsWith('Refraction')) {
    return (
      <form>
        <Prompt
          when={modified}
          message="This page has unsaved data. Please click cancel and try again"
        />

        <div>
          <div className="grid grid-cols-9 gap-y-4 gap-x-6 justify-items-stretch items-center">
            <div className="col-span-1"></div>
            <div className="col-span-4 justify-self-center">OD</div>
            <div className="col-span-4 justify-self-center">OS</div>

            <div className="col-span-1"></div>
            <div className="col-span-4">
              <div className="flex justify-around">
                <div>SPH</div>
                <div>CYL</div>
                <div>AXIS</div>
              </div>
            </div>
            <div className="col-span-4">
              <div className="flex justify-around">
                <div>SPH</div>
                <div>CYL</div>
                <div>AXIS</div>
              </div>
            </div>

            <div className="col-span-2"></div>
            <div className="col-span-3"></div>
            <div className="col-span-4"></div>
          </div>

          <div className="mt-2"></div>

          <div>
            <p className="mb-2">Distance</p>
            <RefractionDistanceComponent
              values={getValues()}
              readonly={readOnly}
              register={register}
              onChange={handleChanges}
            />
          </div>

          <div className="mt-4">
            <p className="mb-2">Near</p>
            <RefractionNearComponent
              values={getValues()}
              readonly={readOnly}
              register={register}
              onChange={handleChanges}
            />
          </div>
          <div className="grid grid-cols-9 gap-y-4 gap-x-6 justify-items-stretch items-center mt-5">
            <div hidden={readOnly && !hasVisualAcuity} className="col-span-1">
              <span className="text-gray-600 tracking-wide text-sm">
                Visual Acuity
              </span>
            </div>
            <div hidden={readOnly && !hasVisualAcuity} className="col-span-4">
              <input
                type="text"
                name="rightVisualAcuity"
                ref={register}
                disabled={readOnly}
                onChange={handleChanges}
                className={cn(
                  'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                  {
                    'bg-gray-400':
                      readOnly && values?.rightVisualAcuity?.length === 0,
                  }
                )}
              />
            </div>
            <div hidden={readOnly && !hasVisualAcuity} className="col-span-4">
              <input
                type="text"
                name="leftVisualAcuity"
                ref={register}
                disabled={readOnly}
                onChange={handleChanges}
                className={cn(
                  'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                  {
                    'bg-gray-400':
                      readOnly && values?.leftVisualAcuity?.length === 0,
                  }
                )}
              />
            </div>
          </div>

          {!readOnly && (
            <div className="grid grid-cols-9 gap-y-4 gap-x-6 justify-items-stretch items-center mt-2">
              <div className="col-span-1">
                <span className="text-gray-600 tracking-wide text-sm">
                  Far PD
                </span>
              </div>
              <div className="col-span-4">
                <input
                  type="text"
                  name="farPd"
                  ref={register}
                  disabled={readOnly}
                  onChange={handleChanges}
                  className={cn(
                    'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                    {
                      'bg-gray-400': readOnly && values?.farPd?.length === 0,
                    }
                  )}
                />
              </div>
              <div className="col-span-4"></div>
              <div className="col-span-1">
                <span className="text-gray-600 tracking-wide text-sm">
                  Near PD
                </span>
              </div>
              <div className="col-span-4">
                <input
                  type="text"
                  name="nearPd"
                  ref={register}
                  disabled={readOnly}
                  onChange={handleChanges}
                  className={cn(
                    'p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full',
                    {
                      'bg-gray-400': readOnly && values?.nearPd?.length === 0,
                    }
                  )}
                />
              </div>
              <div className="col-span-4"></div>
            </div>
          )}

          <div hidden={readOnly && !values.generalText} className="mt-7">
            <textarea
              rows={3}
              name="generalText"
              placeholder="Free Text Note"
              ref={register}
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
              disabled={readOnly}
              onChange={handleChanges}
            />
          </div>
        </div>

        {!readOnly && (
          <div className="text-center mt-6">
            {values?.status !== 'COMPLETED' && (
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
        )}
      </form>
    );
  }

  return (
    <div className="p-4 bg-gray-50 shadow-inner rounded-lg">
      <Prompt
        when={modified}
        message="This page has unsaved data. Please click cancel and try again"
      />

      <form>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setSectionExpand({
                  ...sectionExpand,
                  imagery: !sectionExpand.imagery,
                })
              }
            >
              <p className="text-gray-700 text-lg font-light">Imagery</p>
              <p className="material-icons">
                {sectionExpand.imagery ? 'expand_less' : 'expand_more'}
              </p>
            </div>
            <hr className="mt-1" />
          </div>

          <div hidden={!sectionExpand.imagery} className="col-span-2">
            <div>
              <FileUploader
                multiSelect={true}
                disabled={readOnly}
                accept={'image'}
                values={images}
                onAdd={handleImageAdd}
                onClear={handleImagesClear}
                onDelete={handleImageDelete}
                onFileNameChange={(fileId, fileName) => {
                  const file = images.find((e) => e.id === fileId);
                  const fileIndex = images.findIndex((e) => e.id === fileId);

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

          <div className="col-span-2 mt-2">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setSectionExpand({
                  ...sectionExpand,
                  documents: !sectionExpand.documents,
                })
              }
            >
              <p className="text-gray-700 text-lg font-light">Documents</p>
              <p className="material-icons">
                {sectionExpand.documents ? 'expand_less' : 'expand_more'}
              </p>
            </div>
            <hr className="mt-1" />
          </div>

          <div hidden={!sectionExpand.documents} className="col-span-2">
            <FileUploader
              multiSelect={true}
              disabled={readOnly}
              accept={'document'}
              values={documents}
              onAdd={handleDocumentsAdd}
              onClear={handleDocumentsClear}
              onDelete={handleDocumentDelete}
              onFileNameChange={(fileId, fileName) => {
                const file = documents.find((e) => e.id === fileId);
                const fileIndex = documents.findIndex((e) => e.id === fileId);

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

          <div className="col-span-2 mt-2">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() =>
                setSectionExpand({
                  ...sectionExpand,
                  textArea: !sectionExpand.textArea,
                })
              }
            >
              <p className="text-gray-700 text-lg font-light">Free Text Note</p>
              <p className="material-icons">
                {sectionExpand.documents ? 'expand_less' : 'expand_more'}
              </p>
            </div>
            <hr className="mt-1" />
          </div>

          <div hidden={!sectionExpand.textArea} className="col-span-2">
            <textarea
              rows={3}
              name="generalText"
              placeholder="Note"
              ref={register}
              className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
              disabled={readOnly}
              onChange={handleChanges}
            />
          </div>

          <div className="col-span-2 text-center">
            {values?.status !== 'COMPLETED' && !readOnly && (
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
      </form>
    </div>
  );
};
