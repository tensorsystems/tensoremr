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
  register: any;
  locked: boolean;
  handleChange: (value: any) => void;
}

export const TreatmentForm: React.FC<Props> = ({ register, locked, handleChange }) => {
  return (
    <div>
       <div className="mt-4">
        <label
          htmlFor="note"
          className="block text-sm font-medium text-gray-700"
        >
          Treatment Note
        </label>
        <textarea
          name="note"
          ref={register}
          rows={3}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
          onChange={handleChange}
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="result"
          className="block text-sm font-medium text-gray-700"
        >
          Result
        </label>
        <textarea
          name="result"
          ref={register}
          rows={3}
          className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
          onChange={handleChange}
        />
      </div>
    </div>
  )
}
