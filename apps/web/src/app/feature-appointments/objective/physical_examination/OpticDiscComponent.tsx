/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useState } from 'react';

import { SketchTool, AutocompleteInput } from '@tensoremr/ui-components';
// @ts-ignore
import { SketchField, Tools } from 'react-sketch2';

interface Props {
  register: any;
  control: any;
  setValue: any;
  rightOpticDiscSketchRef: any;
  leftOpticDiscSketchRef: any;
  rightOpticDiscSketch: any;
  leftOpticDiscSketch: any;
  locked: boolean;
  onRightSketchChange: () => void;
  onLeftSketchChange: () => void;
  onChange: () => void;
}

const cdrValues = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

export const OpticDiscComponent: React.FC<Props> = ({
  register,
  control,
  setValue,
  rightOpticDiscSketchRef,
  leftOpticDiscSketchRef,
  rightOpticDiscSketch,
  leftOpticDiscSketch,
  locked,
  onRightSketchChange,
  onLeftSketchChange,
  onChange,
}) => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedLineWeight, setSelectedLineWeight] = useState(3);
  const [showSketchTool, setShowSketchTool] = useState(false);

  return (
    <div className="grid grid-cols-5 gap-y-2 gap-x-4 justify-items-stretch">
      <div className="col-span-1 justify-items-stretch text-center">
        <button
          type="button"
          className="material-icons text-teal-700"
          onClick={() => setShowSketchTool(!showSketchTool)}
        >
          settings
        </button>
        <div className="relative z-20" hidden={!showSketchTool}>
          <div className="absolute right-0">
            <SketchTool
              selectedColor={selectedColor}
              selectedLineWeight={selectedLineWeight}
              onColorChange={setSelectedColor}
              onLineWeightChange={setSelectedLineWeight}
            />
          </div>
        </div>
      </div>

      <div className="col-span-2 justify-self-center">
        <SketchField
          ref={rightOpticDiscSketchRef}
          width="150px"
          height="150px"
          style={{
            border: '1px solid #7F7F7F',
            borderRadius: '50%',
          }}
          tool={Tools.Pencil}
          lineColor={selectedColor}
          lineWidth={selectedLineWeight}
          value={rightOpticDiscSketch}
          disabled={locked}
          onChange={() => !locked && onRightSketchChange()}
        />
      </div>
      <div className="col-span-2 justify-self-center">
        <SketchField
          ref={leftOpticDiscSketchRef}
          width="150px"
          height="150px"
          style={{
            border: '1px solid #7F7F7F',
            borderRadius: '50%',
          }}
          tool={Tools.Pencil}
          lineColor={selectedColor}
          lineWidth={selectedLineWeight}
          value={leftOpticDiscSketch}
          disabled={locked}
          onChange={() => !locked && onLeftSketchChange()}
        />
      </div>

      <div className="col-span-1">
        <p className="text-gray-600 tracking-wide"></p>
      </div>
      <div className="col-span-2 justify-self-center">
        <button
          className="text-gray-500 text-sm"
          onClick={() => {
            setValue('rightOpticDiscSketch', '');
            rightOpticDiscSketchRef.current.clear();
            onRightSketchChange();
          }}
        >
          Clear
        </button>
      </div>
      <div className="col-span-2 justify-self-center">
        <button
          className="text-gray-500 text-sm"
          onClick={() => {
            setValue('leftOpticDiscSketch', '');
            leftOpticDiscSketchRef.current.clear();
            onLeftSketchChange();
          }}
        >
          Clear
        </button>
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">CDR</p>
      </div>
      <div className="col-span-2">
        <select
          name="rightCdr"
          ref={register}
          disabled={locked}
          className="mt-1 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          onChange={onChange}
        >
          <option></option>
          {cdrValues.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-2">
        <select
          name="leftCdr"
          ref={register}
          disabled={locked}
          className="mt-1 block w-full py-1 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          onChange={onChange}
        >
          <option></option>
          {cdrValues.map((e) => (
            <option key={e} value={e}>
              {e}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Optic Disc</p>
      </div>
      <div className="col-span-2">
        <AutocompleteInput
          type="text"
          name="rightOpticDisc"
          field="right_optic_disc"
          uri="postgres.public.opthalmology_exams"
          register={register}
          control={control}
          setFormValue={setValue}
          disabled={locked}
          onInputChange={onChange}
        />
      </div>
      <div className="col-span-2">
        <AutocompleteInput
          type="text"
          name="leftOpticDisc"
          field="left_optic_disc"
          uri="postgres.public.opthalmology_exams"
          register={register}
          control={control}
          setFormValue={setValue}
          disabled={locked}
          onInputChange={onChange}
        />
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-500 tracking-wide">Note</p>
      </div>
      <div className="col-span-4">
        <textarea
          name="opticDiscNote"
          ref={register}
          rows={2}
          disabled={locked}
          className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
          onChange={onChange}
        />
      </div>
    </div>
  );
};
