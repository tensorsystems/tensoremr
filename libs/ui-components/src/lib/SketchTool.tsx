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
import { CirclePicker } from 'react-color';

interface Props {
  selectedColor: any;
  selectedLineWeight: any;
  onColorChange: (value: string) => void;
  onLineWeightChange: (value: any) => void;
}

export const SketchTool: React.FC<Props> = ({
  selectedColor,
  selectedLineWeight,
  onColorChange,
  onLineWeightChange,
}) => {
  return (
    <div className="bg-white p-4 shadow-md w-48">
      <p>Color</p>

      <CirclePicker
        colors={['#000000', '#FF0000 ', '#0000FF', '#008000', '#D2691E']}
        circleSize={20}
        color={selectedColor}
        onChange={(value) => onColorChange(value.hex)}
      />

      <p className="mt-3">{`Line Weight (${selectedLineWeight})`}</p>

      <input
        value={selectedLineWeight}
        type="range"
        max={20}
        onChange={(evt) => onLineWeightChange(evt.target.value)}
      />
    </div>
  );
};
