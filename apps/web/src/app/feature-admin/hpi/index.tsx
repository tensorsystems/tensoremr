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

import React, { useState } from 'react';
import { HpiComponentTable } from './HpiComponentAdminTable';
import { HpiComponentTypeTable } from './HpiComponentTypeAdminTable';

export const HpiPage: React.FC = () => {
  const [hpiComponentTypId, setHpiComponentTypeId] = useState<string>();

  const onSelect = (id: string | undefined) => {
    if (id !== undefined) {
      setHpiComponentTypeId(id);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-3 gap-10">
        <div>
          <HpiComponentTypeTable
            hpiComponentTypId={hpiComponentTypId}
            onHpiComponentTypeSelect={onSelect}
          />
        </div>
        <div className="col-span-2">
          {hpiComponentTypId === undefined ? (
            <div className="flex h-full justify-center items-center">
              <p className="text-gray-500 uppercase">Select Component Type</p>
            </div>
          ) : (
            <HpiComponentTable hpiComponentTypeId={hpiComponentTypId} />
          )}
        </div>
      </div>
    </div>
  );
};
