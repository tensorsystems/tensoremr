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

import React from 'react';
import { FileUploader, IFileUploader } from './FileUploader';
import classnames from 'classnames';

interface Props {
  register: any;
  paperRecord: 'Yes' | 'No';
  setPaperRecord: (value: 'Yes' | 'No') => void;
  documents: Array<IFileUploader>;
  setDocuments: (value: Array<IFileUploader>) => void;
  onDocumentDelete: (index: number) => void;
  paperRecordDocument: Array<IFileUploader>;
  setPaperRecordDocument: (value: Array<IFileUploader>) => void;
  onPaperRecordDocumentDelete: (index: number) => void;
  onError: (message: string) => void;
}

export const PatientRegistrationDocumentsForm: React.FC<Props> = ({
  register,
  paperRecord,
  setPaperRecord,
  documents,
  setDocuments,
  onDocumentDelete,
  paperRecordDocument,
  setPaperRecordDocument,
  onPaperRecordDocumentDelete,
  onError,
}) => {
  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <div className="px-4 sm:px-0">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Documents
          </h3>
        </div>
      </div>
      <div className="mt-5 md:mt-0 md:col-span-2">
        <div className="shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 bg-white sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="paperRecord"
                  className="block text-sm font-medium text-gray-700"
                >
                  Paper Record <span className="text-red-600">*</span>
                </label>
                <select
                  required
                  name="paperRecord"
                  value={paperRecord}
                  onChange={(evt) =>
                    setPaperRecord(evt.target.value === 'Yes' ? 'Yes' : 'No')
                  }
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value={'Yes'}>Yes</option>
                  <option value={'No'}>No</option>
                </select>
              </div>
              <div
                className={classnames('col-span-6 sm:col-span-3', {
                  invisible: paperRecord === 'No',
                })}
              >
                <label
                  htmlFor="cardNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Card Number
                </label>
                <input
                  type="text"
                  name="cardNo"
                  required={paperRecord === 'Yes'}
                  ref={register({ required: paperRecord === 'Yes' })}
                  className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
                />
              </div>
              <div
                className="col-span-6 sm:col-span-3"
                hidden={paperRecord === 'No'}
              >
                <label className="block text-sm font-medium text-gray-700">
                  Paper document
                </label>
                <FileUploader
                  multiSelect={false}
                  values={paperRecordDocument}
                  accept={'document'}
                  onAdd={setPaperRecordDocument}
                  onDelete={onPaperRecordDocumentDelete}
                  onError={(message) => onError(message)}
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Other Documents
                </label>
                <FileUploader
                  multiSelect={true}
                  values={documents}
                  onAdd={setDocuments}
                  onDelete={onDocumentDelete}
                  onError={(message) => onError(message)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
