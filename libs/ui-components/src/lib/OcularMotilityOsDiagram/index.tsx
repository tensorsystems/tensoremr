import React from 'react';
import cn from 'classnames';

interface Props {
  register: any;
  readOnly?: boolean;
  values: any;
  setValue?: any;
  onChange: (value: any) => void;
}
const ocularValues = [-4, -3, -2, -1, 0, 1, 2, 3, 4];

export const OcularMotilityOsDiagram: React.FC<Props> = ({
  register,
  readOnly,
  onChange,
  values,
}) => {
  return (
    <div className="grid grid-cols-6 gap-2 justify-items-center">
      <div className="col-span-2 justify-self-end">
        <select
          name="lio"
          ref={register}
          disabled={readOnly}
          className="bg-gray-50 focus:outline-none border-none text-xs text-gray-500"
          onChange={onChange}
        >
          <option value="">LIO</option>
          {ocularValues.map((e) => (
            <option key={e + 'lio'} value={e + ''}>
              {e}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-2"></div>
      <div className="col-span-2 justify-self-start">
        <select
          name="lsr"
          ref={register}
          disabled={readOnly}
          className="bg-gray-50 focus:outline-none border-none text-xs text-gray-500"
          onChange={onChange}
        >
          <option value="">LSR</option>
          {ocularValues.map((e) => (
            <option key={e + 'lsr'} value={e + ''}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-2 justify-self-end">
        <label
          htmlFor="toggle-os"
          className={cn(
            'material-icons md-undo transform -rotate-45 text-gray-500 cursor-pointer',
            {
              'text-teal-400': values.leftFlick === true,
            }
          )}
        >
          
        </label>
        <input
          type="checkbox"
          id="toggle-os"
          style={{
            position: 'absolute',
            left: '-100vw',
          }}
          name="leftFlick"
          ref={register}
          onChange={onChange}
        />
        <div className="control-me"></div>
      </div>

      <div className="col-span-2"></div>
      <div className="col-span-2 "></div>

      <div className="col-span-1"></div>
      <div className="col-span-4">
        <div className="top-half-circle" />
      </div>
      <div className="col-span-1"></div>

      <div className="col-span-2 justify-self-end">
        <select
          name="lmr"
          ref={register}
          disabled={readOnly}
          className="bg-gray-50 focus:outline-none border-none text-xs text-gray-500"
          onChange={onChange}
        >
          <option value="">LMR</option>
          {ocularValues.map((e) => (
            <option key={e + 'lmr'} value={e + ''}>
              {e}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-2"></div>
      <div className="col-span-2 justify-self-start">
        <select
          name="llr"
          ref={register}
          disabled={readOnly}
          className="bg-gray-50 focus:outline-none border-none text-xs text-gray-500"
          onChange={onChange}
        >
          <option value="">LLR</option>
          {ocularValues.map((e) => (
            <option key={e + 'llr'} value={e + ''}>
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
          name="lso"
          ref={register}
          disabled={readOnly}
          className="bg-gray-50 focus:outline-none border-none text-xs text-gray-500"
          onChange={onChange}
        >
          <option value="">LSO</option>
          {ocularValues.map((e) => (
            <option key={e + 'lso'} value={e + ''}>
              {e}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-2"></div>
      <div className="col-span-2 justify-self-start">
        <select
          name="lir"
          ref={register}
          disabled={readOnly}
          className="bg-gray-50 focus:outline-none border-none text-xs text-gray-500"
          onChange={onChange}
        >
          <option value="">LIR</option>
          {ocularValues.map((e) => (
            <option key={e + 'lir'} value={e + ''}>
              {e}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
