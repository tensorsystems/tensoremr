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
import ContentLoader from 'react-content-loader';
import { format, parseISO } from 'date-fns';
import { getPatientAge } from '@tensoremr/util';
import { Record } from 'pocketbase';

export const PatientBasicInfo: React.FC<{
  data: Record | undefined;
  loading: boolean;
  onEditClick: () => void;
}> = ({ data, loading, onEditClick }) => {
  return (
    <div className="bg-white shadow-md rounded-sm w-full p-4">
      {loading && (
        <div className="pl-4">
          <ContentLoader
            speed={2}
            height={120}
            backgroundColor="#f3f3f3"
            foregroundColor="#ecebeb"
            className="w-full"
          >
            <rect x="130" y="10" rx="5" ry="3" width="250" height="12" />
            <rect x="130" y="48" rx="3" ry="3" width="100%" height="8" />
            <rect x="130" y="64" rx="3" ry="3" width="100%" height="8" />
            <rect x="130" y="80" rx="3" ry="3" width="100%" height="8" />
            <circle cx="55" cy="55" r="55" />
          </ContentLoader>
        </div>
      )}

      {!loading && (
        <div className="flex items-center space-x-3">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-auto w-36 text-teal-600"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="w-full">
            <div className="flex justify-between">
              <p className="text-4xl font-semibold tracking-wide text-gray-800">{`${data?.firstName} ${data?.middleName} ${data?.lastName}`}</p>
              <button
                type="button"
                className=" px-3 py-1 flex space-x-2 items-center rounded-md text-gray-600 hover:bg-teal-700 hover:text-white"
                onClick={onEditClick}
              >
                <span className="material-icons">edit</span>
                <span>Edit</span>
              </button>
            </div>
            <hr className="mt-2" />
            <div className="grid grid-cols-3 mt-2">
              <div>
                <span className="font-semibold">MRN</span>: {data?.mrn}
              </div>
              <div>
                <span className="font-semibold">DOB</span>:{' '}
                {data && format(parseISO(data?.dateOfBirth), 'LLLL d, y')}
              </div>
              <div>
                <span className="font-semibold">Age</span>:{' '}
                {data && getPatientAge(data?.dateOfBirth)}
              </div>
              <div>
                <span className="font-semibold">Gender</span>: {data?.gender}
              </div>
              <div>
                <span className="font-semibold">ID Number</span>: {data?.identificationNo}
              </div>
              <div>
                <span className="font-semibold">Occupation</span>:{' '}
                {data?.occupation}
              </div>
              <div>
                <span className="font-semibold">Martial Status</span>:{' '}
                {data?.martialStatus}
              </div>
              <div>
                <span className="font-semibold">Memo</span>: {data?.memo}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
