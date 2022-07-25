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

interface Props {
  locked: boolean;
  register: any;
  onChange: () => void;
}

export const VisualAcuityForm: React.FC<Props> = ({
  locked,
  register,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-5 gap-y-4 gap-x-6 justify-items-stretch">
      <div className="text-sm text-gray-400 tracking-wider justify-self-center">
        Distance
      </div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Uncorrected</p>
      </div>
      <div className="col-span-2">
        <input
          type="text"
          name="rightDistanceUncorrected"
          ref={register}
          disabled={locked}
          className="border-gray-300 rounded-lg shadow-sm w-full h-9"
          onChange={onChange}
        />
      </div>
      <div className="col-span-2">
        <input
          type="text"
          name="leftDistanceUncorrected"
          ref={register}
          disabled={locked}
          className="border-gray-300 rounded-lg shadow-sm w-full h-9"
          onChange={onChange}
        />
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Pinhole</p>
      </div>
      <div className="col-span-2">
        <input
          type="text"
          name="rightDistancePinhole"
          ref={register}
          disabled={locked}
          className="border-gray-300 rounded-lg shadow-sm w-full h-9"
          onChange={onChange}
        />
      </div>
      <div className="col-span-2">
        <input
          type="text"
          name="leftDistancePinhole"
          ref={register}
          disabled={locked}
          className="border-gray-300 rounded-lg shadow-sm w-full h-9"
          onChange={onChange}
        />
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Corrected</p>
      </div>
      <div className="col-span-2">
        <input
          type="text"
          name="rightDistanceCorrected"
          ref={register}
          disabled={locked}
          className="border-gray-300 rounded-lg shadow-sm w-full h-9"
          onChange={onChange}
        />
      </div>
      <div className="col-span-2">
        <input
          type="text"
          name="leftDistanceCorrected"
          ref={register}
          disabled={locked}
          className="border-gray-300 rounded-lg shadow-sm w-full h-9"
          onChange={onChange}
        />
      </div>

      <div className="text-sm text-gray-400 tracking-wider justify-self-center">
        Near
      </div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Uncorrected</p>
      </div>
      <div className="col-span-2">
        <input
          type="text"
          name="rightNearUncorrected"
          ref={register}
          disabled={locked}
          className="border-gray-300 rounded-lg shadow-sm w-full h-9"
          onChange={onChange}
        />
      </div>
      <div className="col-span-2">
        <input
          type="text"
          name="leftNearUncorrected"
          ref={register}
          disabled={locked}
          className="border-gray-300 rounded-lg shadow-sm w-full h-9"
          onChange={onChange}
        />
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Pinhole</p>
      </div>
      <div className="col-span-2">
        <input
          type="text"
          name="rightNearPinhole"
          ref={register}
          disabled={locked}
          className="border-gray-300 rounded-lg shadow-sm w-full h-9"
          onChange={onChange}
        />
      </div>
      <div className="col-span-2">
        <input
          type="text"
          name="leftNearPinhole"
          ref={register}
          disabled={locked}
          className="border-gray-300 rounded-lg shadow-sm w-full h-9"
          onChange={onChange}
        />
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Corrected</p>
      </div>
      <div className="col-span-2">
        <input
          type="text"
          name="rightNearCorrected"
          ref={register}
          disabled={locked}
          className="border-gray-300 rounded-lg shadow-sm w-full h-9"
          onChange={onChange}
        />
      </div>
      <div className="col-span-2">
        <input
          type="text"
          name="leftNearCorrected"
          ref={register}
          disabled={locked}
          className="border-gray-300 rounded-lg shadow-sm w-full h-9"
          onChange={onChange}
        />
      </div>
    </div>
  );
};
