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
import cn from 'classnames';

interface Props {
  value: string;
  description: string;
  iconUrl?: string;
  selected: boolean;
  register: any;
}

export const ModalitySelectableItem: React.FC<Props> = ({
  value,
  description,
  iconUrl,
  selected,
  register,
}) => {
  return (
    <div
      className={cn(
        'border p-3 rounded-md flex space-x-4 text-sm items-center cursor-pointer',
        {
          'ring-1': selected,
        }
      )}
    >
      <div>
        <input
          type="radio"
          id="modality"
          name="modality"
          ref={register}
          value={value}
        />
      </div>
      <div className="flex items-center space-x-4 justify-between flex-1">
        <div>
          <p className="font-semibold">{value}</p>
          <p>{description}</p>
        </div>
        {iconUrl && (
          <div>
            <img alt="Icon" width={80} height={60} src={iconUrl} />
          </div>
        )}
      </div>
    </div>
  );
};
