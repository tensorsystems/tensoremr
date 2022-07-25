/* eslint-disable @typescript-eslint/ban-ts-comment */
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

import { AutocompleteInput, SketchTool } from '@tensoremr/ui-components';
// @ts-ignore
import { SketchField, Tools } from 'react-sketch2';

interface Props {
  register: any;
  control: any;
  setValue: any;
  rightRetinaSketchRef: any;
  leftRetinaSketchRef: any;
  rightRetinaSketch: any;
  leftRetinaSketch: any;
  locked: boolean;
  onSketchChange: () => void;
  onChange: () => void;
}

export const FunduscopyComponent: React.FC<Props> = ({
  register,
  control,
  setValue,
  rightRetinaSketchRef,
  leftRetinaSketchRef,
  rightRetinaSketch,
  leftRetinaSketch,
  locked,
  onSketchChange,
  onChange,
}) => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedLineWeight, setSelectedLineWeight] = useState(3);
  const [showSketchTool, setShowSketchTool] = useState(false);

  return (
    <div className="grid grid-cols-5 gap-y-2 gap-x-4 justify-items-stretch">
      <div className="col-span-1 text-center">
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
          ref={rightRetinaSketchRef}
          width="200px"
          height="200px"
          style={{
            border: '1px solid #7F7F7F',
            borderRadius: '50%',
          }}
          tool={Tools.Pencil}
          lineColor={selectedColor}
          lineWidth={selectedLineWeight}
          value={rightRetinaSketch}
          disabled={locked}
          onChange={() => !locked && onSketchChange()}
        />
      </div>
      <div className="col-span-2 justify-self-center">
        <SketchField
          ref={leftRetinaSketchRef}
          width="200px"
          height="200px"
          style={{
            border: '1px solid #7F7F7F',
            borderRadius: '50%',
          }}
          tool={Tools.Pencil}
          lineColor={selectedColor}
          lineWidth={selectedLineWeight}
          value={leftRetinaSketch}
          disabled={locked}
          onChange={() => !locked && onSketchChange()}
        />
      </div>

      <div className="col-span-1">
        <p className="text-gray-600 tracking-wide"></p>
      </div>
      <div className="col-span-2 justify-self-center">
        <button
          className="text-gray-500 text-sm"
          onClick={() => {
            setValue('rightRetinaSketch', '');
            rightRetinaSketchRef.current.clear();
            onSketchChange();
          }}
        >
          Clear
        </button>
      </div>
      <div className="col-span-2 justify-self-center">
        <button
          className="text-gray-500 text-sm"
          onClick={() => {
            setValue('leftRetinaSketch', '');
            leftRetinaSketchRef.current.clear();
            onSketchChange();
          }}
        >
          Clear
        </button>
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Retina</p>
      </div>
      <div className="col-span-2">
        <AutocompleteInput
          type="text"
          name="rightRetina"
          field="right_retina"
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
          name="leftRetina"
          field="left_retina"
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
          name="funduscopyNote"
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
