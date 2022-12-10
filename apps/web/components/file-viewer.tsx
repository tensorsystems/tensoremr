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

import { format, parseISO } from 'date-fns';
import React, { useState } from 'react';
import Modal from 'react-modal';
import { saveAs } from 'file-saver';
import { Document, Page } from 'react-pdf';

export interface FileViewerProps {
  isOpen: boolean;
  src: any;
  meta: any;
  onClose: () => void;
}

const customStyles = {
  content: {
    top: '3%',
    left: '3%',
    right: '3%',
    bottom: '3%',
    padding: 0,
    border: 'none',
    backgroundColor: 'rgba(0,0,0,0.2)',
    zIndex: 30,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.1)',
    backdropFilter: 'blur(40px)',
    zIndex: 100,
  },
};


export const FileViewer: React.FC<FileViewerProps> = ({
  isOpen,
  src,
  meta,
  onClose,
}) => {
  const isImage = meta.type.split('/')[0] === 'image';
  const isPdf = meta.type === 'application/pdf';

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles}>
      {isImage && <RenderImages src={src} meta={meta} onClose={onClose} />}
      {isPdf && <RenderDocument src={src} meta={meta} onClose={onClose} />}
    </Modal>
  );
};

interface RenderProps {
  src: any;
  meta?: any;
  onClose: () => void;
}

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
const RenderImages: React.FC<RenderProps> = ({ src, meta, onClose }) => {
  const onPrint = () => {
    saveAs(src, meta?.name);
  };

  const getValidDate = (date: any) => {
    if (date instanceof Date) {
      return format(date, 'MMM d, y');
    } else {
      return format(parseISO(date), 'MMM d, y');
    }
  };

  return (
    <div className="flex h-full bg-gray-800">
      <div className="flex-initial text-left bg-gray-800 pr-4 pl-4 pt-4">
        <p className="text-white text-lg font-bold">{meta?.name}</p>
        <hr className="mt-4" />
        <div className="mt-4" />
        <span className="text-white">Kind: </span>
        <span className="text-gray-300">{meta?.type}</span> <br />
        <span className="text-white">Size: </span>
        <span className="text-gray-300">{formatBytes(meta.size)}</span> <br />
        <span className="text-white">Created: </span>
        <span className="text-gray-300">
          {meta.createdAt && getValidDate(meta.createdAt)}
        </span>
        <hr className="mt-4" />
        <div className="mt-4">
          <label
            htmlFor="comments"
            className="block text-sm font-medium text-gray-300"
          >
            Comments
          </label>
          <textarea
            name="comments"
            id="comments"
            rows={4}
            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-800 bg-gray-700 focus:bg-gray-600 text-white border rounded-md"
          />
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="w-full border-white border rounded-lg px-2 py-1 text-white"
            onClick={onPrint}
          >
            Download Image
          </button>
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="w-full border-white border rounded-lg px-2 py-1 text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
      <div className="flex-1">
        <img src={src} className="w-full h-full object-cover" />
      </div>
    </div>
  );
};

const RenderDocument: React.FC<RenderProps> = ({ src, meta, onClose }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isDocumentFocused, setIsDocumentFocused] = useState(false);

  const onDocumentLoadSuccess = (pdf: any) => {
    setNumPages(pdf.numPages);
  };

  const onPrint = () => {
    saveAs(src, meta?.name);
  };

  const getValidDate = (date: any) => {
    if (date instanceof Date) {
      return format(date, 'MMM d, y');
    } else {
      return format(parseISO(date), 'MMM d, y');
    }
  };

  return (
    <div className="flex ">
      <div className="flex-initial text-left bg-gray-800 pr-4 pl-4 pt-4">
        <p className="text-white text-lg font-bold">{meta?.name}</p>
        <hr className="mt-4" />
        <div className="mt-4" />
        <span className="text-white">Kind: </span>
        <span className="text-gray-300">{meta?.type}</span> <br />
        <span className="text-white">Size: </span>
        <span className="text-gray-300">{formatBytes(meta.size)}</span> <br />
        <span className="text-white">Created: </span>
        <span className="text-gray-300">
          {meta.createdAt && getValidDate(meta.createdAt)}
        </span>
        <hr className="mt-4" />
        <div className="mt-4">
          <label
            htmlFor="comments"
            className="block text-sm font-medium text-gray-300"
          >
            Comments
          </label>
          <textarea
            name="comments"
            id="comments"
            rows={4}
            className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-800 bg-gray-700 focus:bg-gray-600 text-white border rounded-md"
          />
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="w-full border-white border rounded-lg px-2 py-1 text-white"
            onClick={onPrint}
          >
            Download Document
          </button>
        </div>
        <div className="mt-5">
          <button
            type="button"
            className="w-full border-white border rounded-lg px-2 py-1 text-white"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="relative">
          <div
            onMouseEnter={() => setIsDocumentFocused(true)}
            onMouseLeave={() => setIsDocumentFocused(false)}
          >
            <Document file={src} onLoadSuccess={onDocumentLoadSuccess}>
              <Page pageNumber={pageNumber} />
            </Document>
          </div>
          <div
            hidden={!isDocumentFocused}
            className="absolute bottom-10 inset-x-0"
            onMouseEnter={() => setIsDocumentFocused(true)}
            onMouseLeave={() => setIsDocumentFocused(false)}
          >
            <div className="flex justify-between">
              <div></div>
              <div>
                <div className="bg-white px-3 py-3 shadow-2xl rounded-md">
                  <div className="flex items-center space-x-5">
                    <button
                      type="button"
                      disabled={pageNumber === 1}
                      onClick={() => setPageNumber(pageNumber - 1)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 text-gray-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                    <p className="italic">
                      {pageNumber} of {numPages}
                    </p>
                    <button
                      type="button"
                      disabled={pageNumber === numPages}
                      onClick={() => setPageNumber(pageNumber + 1)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 text-gray-500"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
