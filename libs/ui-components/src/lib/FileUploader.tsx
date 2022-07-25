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

import React, { useState, createRef } from 'react';
import classnames from 'classnames';
import { FileViewer } from './FileViewer';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack';
import { gql, useMutation } from '@apollo/client';
import { FileUpdateInput, MutationUpdateFileArgs } from '@tensoremr/models';

const UPDATE_FILE = gql`
  mutation UpdateFile($input: FileUpdateInput!) {
    updateFile(input: $input) {
      id
      size
      hash
      fileName
      extension
      contentType
      createdAt
    }
  }
`;

export interface IFileUploader {
  id?: string;
  fileObject?: File | undefined;
  fileUrl?: string | undefined;
  name: string;
  size: number | undefined;
  createdAt: any;
  contentType: string;
  title?: string;
}

interface Props {
  disabled?: boolean;
  multiSelect: boolean;
  values?: Array<IFileUploader>;
  accept?: 'image' | 'document' | undefined;
  onDelete?: (index: number) => void;
  onAdd?: (files: Array<IFileUploader>) => void;
  onClear?: () => void;
  onError: (message: string) => void;
  onFileNameChange?: (fileId: string, name: string) => void;
}

export const FileUploader: React.FC<Props> = ({
  multiSelect,
  accept,
  values,
  disabled,
  onAdd,
  onDelete,
  onClear,
  onError,
  onFileNameChange,
}) => {
  const [updateFile] = useMutation<any, MutationUpdateFileArgs>(UPDATE_FILE, {
    onError(error) {
      onError(error.message);
    },
  });

  const [fileViewer, setFileViewer] = useState<any>({
    isOpen: false,
  });

  const rand = Math.random();

  const inputRef = createRef<HTMLInputElement>();

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files !== null) {
      const files: Array<IFileUploader> = [];

      for (let i = 0; i < event.target.files?.length; i++) {
        files.push({
          fileObject: event.target.files[i],
          name: event.target.files[i].name,
          size: event.target.files[i].size,
          createdAt: new Date(),
          contentType: event.target.files[i].type,
        });
      }

      onAdd && onAdd(files);
    }
  };

  const handleAddClick = () => {
    if (inputRef.current !== null) {
      inputRef.current.click();
    }
  };

  const handlePreviewClick = (e: IFileUploader) => {
    setFileViewer({
      isOpen: true,
      src:
        e.fileObject !== undefined
          ? URL.createObjectURL(e.fileObject)
          : e.fileUrl,
      type: e.contentType,
      meta: {
        name: e.name,
        type: e.contentType,
        size: e.size,
        createdAt: e.createdAt,
      },
    });
  };

  const handleChangeName = (id: string, fileName: string) => {
    const fileUpdateInput: FileUpdateInput = {
      id,
      fileName,
    };

    updateFile({
      variables: {
        input: fileUpdateInput,
      },
    });
  };

  let acceptString;
  if (accept === 'image') {
    acceptString = 'image/*';
  } else if (accept === 'document') {
    acceptString = 'application/pdf';
  } else {
    acceptString = '*/*';
  }

  return (
    <div>
      <div
        className={classnames(
          'flex p-3 border-2 border-gray-300 border-dashed rounded-md',
          {
            'justify-center': values === undefined || values.length === 0,
          }
        )}
      >
        <div
          hidden={!(values?.length === 0 || values?.length === undefined)}
          className="space-y-1 text-center"
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex items-center justify-center text-sm text-gray-600">
            <label
              htmlFor={'file-upload-' + rand}
              className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span className="text-center">
                {multiSelect ? 'Upload multiple files' : 'Upload a file'}
              </span>
            </label>
            <input
              id={'file-upload-' + rand}
              name="file-upload"
              type="file"
              className="sr-only"
              ref={inputRef}
              multiple={multiSelect}
              onChange={changeHandler}
              accept={acceptString}
              disabled={disabled}
            />
          </div>
          <p className="text-xs text-gray-500">
            {accept === 'image' && 'PNG, JPG up to 20MB'}
            {accept === 'document' && 'PDF up to 20MB'}
            {accept === undefined && 'Files up to 20MB'}
          </p>
        </div>

        <div
          hidden={values?.length === 0 || values?.length === undefined}
          className="w-full"
        >
          <div className="flex space-x-5 text-sm">
            {multiSelect && (
              <button
                type="button"
                className="uppercase bg-teal-600 hover:bg-teal-500 text-teal-200 px-3 py-1 rounded-md shadow-lg"
                onClick={handleAddClick}
                disabled={disabled}
              >
                Add
              </button>
            )}
          </div>
          <hr className="mt-2" />

          {values?.map((e, i) => (
            <div key={i} className="mt-5 flex space-x-3 justify-between">
              <div className="flex space-x-4 flex-grow">
                {e.contentType?.startsWith('image') && (
                  <img
                    className="rounded-lg h-16 w-16 object-cover shadow-xl cursor-pointer transform hover:scale-110"
                    src={
                      e.fileObject !== undefined
                        ? URL.createObjectURL(e.fileObject)
                        : e.fileUrl
                    }
                    onClick={() => handlePreviewClick(e)}
                  />
                )}

                {e.contentType === 'application/pdf' && (
                  <div
                    className="rounded-lg shadow-xl cursor-pointer transform hover:scale-110"
                    onClick={() => handlePreviewClick(e)}
                  >
                    <Document
                      file={
                        e.fileObject !== undefined
                          ? URL.createObjectURL(e.fileObject)
                          : e.fileUrl
                      }
                    >
                      <Page height={60} pageNumber={1} />
                    </Document>
                  </div>
                )}

                <div className="flex-grow">
                  <input
                    className="text-sm font-semibold p-2 rounded-lg w-full bg-transparent border"
                    value={e.name.split('.')[0]}
                    disabled={disabled}
                    onChange={(evt) => {
                      if (e.id) {
                        handleChangeName(e.id, evt.target.value);
                        onFileNameChange &&
                          onFileNameChange(e.id, evt.target.value);
                      }
                    }}
                  />
                  <p className="text-sm text-gray-500">{e.contentType}</p>
                </div>
              </div>
              <div>
                <button
                  onClick={() => {
                    onDelete && onDelete(i);
                  }}
                  disabled={disabled}
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="text-gray-500 w-5"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {fileViewer.isOpen && (
        <FileViewer
          isOpen={fileViewer.isOpen}
          src={fileViewer.src}
          meta={fileViewer.meta}
          onClose={() => setFileViewer({ isOpen: false })}
        />
      )}
    </div>
  );
};
