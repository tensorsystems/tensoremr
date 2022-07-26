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
import { Patient } from '@tensoremr/models';
import { getFileUrl } from '@tensoremr/util';
import { FileUploader, IFileUploader } from '@tensoremr/ui-components';
import { useNotificationDispatch } from '@tensoremr/notification';

export const PatientDocuments: React.FC<{
  data: Patient | undefined;
  loading: boolean;
}> = ({ data, loading }) => {
  const notifDispatch = useNotificationDispatch();

  const paperRecordDocument: IFileUploader = {
    id: data?.paperRecordDocument?.id,
    fileUrl: getFileUrl({
      baseUrl: process.env['NX_APP_SERVER_URL'],
      fileName: data?.paperRecordDocument?.fileName ?? '',
      hash: data?.paperRecordDocument?.hash ?? '',
      extension: data?.paperRecordDocument?.extension ?? '',
    }),
    name: data?.paperRecordDocument?.fileName ?? '',
    size: data?.paperRecordDocument?.size,
    createdAt: data?.paperRecordDocument?.createdAt,
    contentType: data?.paperRecordDocument?.contentType ?? '',
  };

  const otherDocuments: Array<IFileUploader> =
    data?.documents?.map((e: any) => ({
      id: e?.id,
      fileUrl: getFileUrl({
        baseUrl: process.env['NX_APP_SERVER_URL'],
        fileName: e?.fileName,
        hash: e?.hash,
        extension: e?.extension,
      }),
      name: e?.fileName ?? '',
      size: e?.size,
      createdAt: e?.createdAt,
      contentType: e?.contentType ?? '',
    })) ?? [];

  if (loading) {
    return (
      <div>
        <ContentLoader
          speed={2}
          width={'100%'}
          height={320}
          viewBox="0 0 100% 320"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          <rect y="10" rx="3" ry="3" width="200" height="10" />
          <rect y="25" rx="3" ry="3" width="270" height="18" />

          <rect y="60" rx="3" ry="3" width="200" height="10" />
          <rect y="75" rx="3" ry="3" width="270" height="18" />

          <rect y="105" rx="3" ry="3" width="200" height="10" />
          <rect y="120" rx="3" ry="3" width="270" height="18" />

          <rect y="150" rx="3" ry="3" width="200" height="10" />
          <rect y="165" rx="3" ry="3" width="270" height="18" />

          <rect y="195" rx="3" ry="3" width="200" height="10" />
          <rect y="210" rx="3" ry="3" width="270" height="18" />

          <rect y="240" rx="3" ry="3" width="200" height="10" />
          <rect y="255" rx="3" ry="3" width="270" height="18" />

          <rect y="285" rx="3" ry="3" width="200" height="10" />
          <rect y="300" rx="3" ry="3" width="270" height="18" />
        </ContentLoader>
      </div>
    );
  }

  return (
    <div>
      {data?.paperRecordDocument && (
        <div>
          <p className="font-semibold text-xl text-gray-700">Paper Record</p>
          <div className="mt-2">
            <FileUploader
              multiSelect={false}
              values={[paperRecordDocument]}
              accept={'document'}
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
        </div>
      )}

      {otherDocuments.length > 0 && (
        <div>
          <p className="mt-10 font-semibold text-xl text-gray-700">
            Other documents
          </p>
          <div className="mt-2">
            <FileUploader
              multiSelect={false}
              values={otherDocuments}
              accept={'document'}
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
        </div>
      )}

      {data?.paperRecordDocument === null && otherDocuments.length === 0 && (
        <p>Nothing here yet</p>
      )}
    </div>
  );
};
