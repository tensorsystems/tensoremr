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

import corneaImage from './cornea.png';

import {
  SketchTool,
  AutocompleteInput,
  SketchDiagram,
} from '@tensoremr/ui-components';

// @ts-ignore
import { SketchField, Tools } from 'react-sketch2';
import './index.css';

interface Props {
  register: any;
  control: any;
  setValue: any;
  rightCorneaSketchRef: any;
  leftCorneaSketchRef: any;
  rightLensSketchRef: any;
  leftLensSketchRef: any;
  rightCorneaSketch: any;
  leftCorneaSketch: any;
  rightLensSketch: any;
  leftLensSketch: any;
  locked: boolean;
  onRightCorneaSketchChange: () => void;
  onLeftCorneaSketchChange: () => void;
  onRightLensSketchChange: () => void;
  onLeftLensSketchChange: () => void;
  onChange: () => void;
}

export const SlitLampExamComponent: React.FC<Props> = ({
  register,
  control,
  setValue,
  rightCorneaSketchRef,
  leftCorneaSketchRef,
  rightLensSketchRef,
  leftLensSketchRef,
  rightCorneaSketch,
  leftCorneaSketch,
  rightLensSketch,
  leftLensSketch,
  locked,
  onRightCorneaSketchChange,
  onLeftCorneaSketchChange,
  onRightLensSketchChange,
  onLeftLensSketchChange,
  onChange,
}) => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedLineWeight, setSelectedLineWeight] = useState(3);
  const [showSketchTool, setShowSketchTool] = useState(false);

  return (
    <div className="grid grid-cols-5 gap-y-2 gap-x-4 justify-items-stretch">
      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Conjuctiva</p>
      </div>
      <div className="col-span-2">
        <AutocompleteInput
          type="text"
          name="rightConjunctiva"
          field="right_conjunctiva"
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
          name="leftConjunctiva"
          field="left_conjunctiva"
          uri="postgres.public.opthalmology_exams"
          register={register}
          control={control}
          setFormValue={setValue}
          disabled={locked}
          onInputChange={onChange}
        />
      </div>

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
        <SketchDiagram
          alt={'Right Cornea'}
          refValue={rightCorneaSketchRef}
          selectedColor={selectedColor}
          selectedLineWeight={selectedLineWeight}
          width="18em"
          height="11rem"
          image={corneaImage}
          imageClassname="w-64 h-48"
          value={rightCorneaSketch}
          readOnly={locked}
          onChange={() => !locked && onRightCorneaSketchChange()}
        />
      </div>
      <div className="col-span-2 justify-self-center">
        <SketchDiagram
          alt={'Left Cornea'}
          refValue={leftCorneaSketchRef}
          selectedColor={selectedColor}
          selectedLineWeight={selectedLineWeight}
          width="18em"
          height="11rem"
          image={corneaImage}
          imageClassname="w-64 h-48"
          value={leftCorneaSketch}
          readOnly={locked}
          onChange={() => !locked && onLeftCorneaSketchChange()}
        />
      </div>

      <div className="col-span-1">
        <p className="text-gray-600 tracking-wide"></p>
      </div>
      <div className="col-span-2 justify-self-center">
        <button
          className="text-gray-500 text-sm"
          onClick={() => {
            setValue('rightCorneaSketch', '');
            rightCorneaSketchRef.current.clear();
            onRightCorneaSketchChange();
          }}
        >
          Clear
        </button>
      </div>
      <div className="col-span-2 justify-self-center">
        <button
          className="text-gray-500 text-sm"
          onClick={() => {
            setValue('leftCorneaSketch', '');
            leftCorneaSketchRef.current.clear();
            onLeftCorneaSketchChange();
          }}
        >
          Clear
        </button>
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Cornea</p>
      </div>
      <div className="col-span-2">
        <AutocompleteInput
          type="text"
          name="rightCornea"
          field="right_cornea"
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
          name="leftCornea"
          field="left_cornea"
          uri="postgres.public.opthalmology_exams"
          register={register}
          control={control}
          setFormValue={setValue}
          disabled={locked}
          onInputChange={onChange}
        />
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Sclera</p>
      </div>
      <div className="col-span-2">
        <AutocompleteInput
          type="text"
          name="rightSclera"
          field="right_sclera"
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
          name="leftSclera"
          field="left_sclera"
          uri="postgres.public.opthalmology_exams"
          register={register}
          control={control}
          setFormValue={setValue}
          disabled={locked}
          onInputChange={onChange}
        />
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Anterior Chamber</p>
      </div>
      <div className="col-span-2">
        <AutocompleteInput
          type="text"
          name="rightAnteriorChamber"
          field="right_anterior_chamber"
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
          name="leftAnteriorChamber"
          field="left_anterior_chamber"
          uri="postgres.public.opthalmology_exams"
          register={register}
          control={control}
          setFormValue={setValue}
          disabled={locked}
          onInputChange={onChange}
        />
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Iris</p>
      </div>
      <div className="col-span-2">
        <AutocompleteInput
          type="text"
          name="rightIris"
          field="right_iris"
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
          name="leftIris"
          field="left_iris"
          uri="postgres.public.opthalmology_exams"
          register={register}
          control={control}
          setFormValue={setValue}
          disabled={locked}
          onInputChange={onChange}
        />
      </div>

      <div className="col-span-1 justify-self-center">
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
        <div className="outer-circle">
          <div className="inner-circle">
            <SketchField
              ref={rightLensSketchRef}
              width="150px"
              height="150px"
              className="sketch-field"
              tool={Tools.Pencil}
              lineColor={selectedColor}
              lineWidth={selectedLineWeight}
              value={rightLensSketch}
              disabled={locked}
              onChange={() => !locked && onRightLensSketchChange()}
            />
          </div>
        </div>
      </div>
      <div className="col-span-2 justify-self-center">
        <div className="outer-circle">
          <div className="inner-circle">
            <SketchField
              ref={leftLensSketchRef}
              width="150px"
              height="150px"
              className="sketch-field"
              tool={Tools.Pencil}
              lineColor={selectedColor}
              lineWidth={selectedLineWeight}
              value={leftLensSketch}
              disabled={locked}
              onChange={() => !locked && onLeftLensSketchChange()}
            />
          </div>
        </div>
      </div>

      <div className="col-span-1">
        <p className="text-gray-600 tracking-wide"></p>
      </div>
      <div className="col-span-2 justify-self-center">
        <button
          className="text-gray-500 text-sm"
          onClick={() => {
            setValue('rightLensSketch', '');
            rightLensSketchRef.current.clear();
            onRightLensSketchChange();
          }}
        >
          Clear
        </button>
      </div>
      <div className="col-span-2 justify-self-center">
        <button
          className="text-gray-500 text-sm"
          onClick={() => {
            setValue('leftLensSketch', '');
            leftLensSketchRef.current.clear();
            onLeftLensSketchChange();
          }}
        >
          Clear
        </button>
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Lens</p>
      </div>
      <div className="col-span-2">
        <AutocompleteInput
          type="text"
          name="rightLens"
          field="right_lens"
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
          name="leftLens"
          field="left_lens"
          uri="postgres.public.opthalmology_exams"
          register={register}
          control={control}
          setFormValue={setValue}
          disabled={locked}
          onInputChange={onChange}
        />
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Vitreos</p>
      </div>
      <div className="col-span-2">
        <AutocompleteInput
          type="text"
          name="rightVitreos"
          field="right_vitreos"
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
          name="leftVitreos"
          field="left_vitreos"
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
          name="slitLampExamNote"
          ref={register}
          rows={2}
          className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
          onChange={onChange}
        />
      </div>
    </div>
  );
};
