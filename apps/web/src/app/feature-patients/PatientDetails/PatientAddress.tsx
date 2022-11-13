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
import { MapIcon, PhoneIcon, UserIcon } from '@heroicons/react/solid';
import { ContactPointsRecord, PatientContactsRecord } from '@tensoremr/models';
import { Telecom } from './Telecom';
import { Record } from 'pocketbase';
import cn from 'classnames';
import { Address } from './Address';

interface Props {
  data: Record[] | undefined;
  loading: boolean;
}

export default function PatientAddress(props: Props) {
  const { data, loading } = props;

  return (
    <div>
      {loading && (
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
      )}

      {!loading && (
        <div>
          {data?.map((e, i) => {
            return (
              <div key={e.id} className={cn({ 'mt-4': i !== 0 })}>
                <div className="flex items-center space-x-2">
                  <MapIcon className="w-5 h-5 text-gray-500" />
                  <p className="text-lg">{`Address ${i + 1}`}</p>
                </div>
                <hr className="mt-2 mb-2" />
                <div className="w-1/2">
                  <Address address={e} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
