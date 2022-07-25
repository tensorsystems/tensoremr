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
import './index.css';

const ocularValues = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

interface Props {
  register: any;
  readOnly?: boolean;
  values: any;
  setValue?: any;
  onChange: (value: any) => void;
}

export const OcularMotilityOdDiagram: React.FC<Props> = ({
  register,
  readOnly,
  values,
  setValue,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-6 gap-2 justify-items-center">
      <div className="col-span-2 justify-self-end">
        <select
          name="rsr"
          ref={register}
          placeholder="rsr"
          disabled={readOnly}
          className="bg-gray-50 focus:outline-none border-none text-xs text-gray-500"
          onChange={onChange}
        >
          <option value="">RSR</option>
          {ocularValues.map((e) => (
            <option key={e + 'rsr'} value={e + ''}>
              {e}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-2"></div>
      <div className="col-span-2 justify-self-start">
        <select
          name="rio"
          ref={register}
          placeholder="rio"
          disabled={readOnly}
          className="bg-gray-50 focus:outline-none border-none text-xs text-gray-500"
          onChange={onChange}
        >
          <option value="">RIO</option>
          {ocularValues.map((e) => (
            <option key={e + 'rio'} value={e + ''}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-2"></div>
      <div className="col-span-2 "></div>
      <div className="col-span-2 justify-self-start">
        <label
          htmlFor="toggle"
          className={cn(
            'material-icons transform -scale-x-1 rotate-45 text-gray-500 cursor-pointer',
            {
              'text-teal-400': values.rightFlick === true,
            }
          )}
        >
          undo
        </label>
        <input
          type="checkbox"
          id="toggle"
          style={{
            position: 'absolute',
            left: '-100vw',
          }}
          name="rightFlick"
          ref={register}
          onChange={onChange}
        />
        <div className="control-me"></div>
      </div>

      <div className="col-span-1"></div>
      <div className="col-span-4">
        <div className="top-half-circle" />
      </div>
      <div className="col-span-1 "></div>

      <div className="col-span-2 justify-self-end">
        <select
          name="rlr"
          ref={register}
          disabled={readOnly}
          className="bg-gray-50 focus:outline-none border-none text-xs text-gray-500"
          onChange={onChange}
        >
          <option value="">RLR</option>
          {ocularValues.map((e) => (
            <option key={e + 'rlr'} value={e + ''}>
              {e}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-2"></div>
      <div className="col-span-2 justify-self-start">
        <select
          name="rmr"
          ref={register}
          disabled={readOnly}
          className="bg-gray-50 focus:outline-none border-none text-xs text-gray-500"
          onChange={onChange}
        >
          <option value="">RMR</option>
          {ocularValues.map((e) => (
            <option key={e + 'rmr'} value={e + ''}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-1"></div>
      <div className="col-span-4">
        <div className="bottom-half-circle" />
      </div>
      <div className="col-span-1"></div>

      <div className="col-span-2 justify-self-end">
        <select
          name="rir"
          ref={register}
          disabled={readOnly}
          className="bg-gray-50 focus:outline-none border-none text-xs text-gray-500"
          onChange={onChange}
        >
          <option value="">RIR</option>
          {ocularValues.map((e) => (
            <option key={e + 'rir'} value={e + ''}>
              {e}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-2"></div>
      <div className="col-span-2 justify-self-start">
        <select
          name="rso"
          ref={register}
          disabled={readOnly}
          className="bg-gray-50 focus:outline-none border-none text-xs text-gray-500"
          onChange={onChange}
        >
          <option value="">RSO</option>
          {ocularValues.map((e) => (
            <option key={e + 'rso'} value={e + ''}>
              {e}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
