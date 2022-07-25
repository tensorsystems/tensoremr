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

import React from 'react';
// @ts-ignore
import { SketchField, Tools } from 'react-sketch2';

interface Props {
  alt: string;
  refValue: any;
  selectedColor: any;
  selectedLineWeight: any;
  width: string;
  height: string;
  image: any;
  value: any;
  readOnly: boolean;
  imageClassname: string;
  onChange: (value: any) => void;
}

export const SketchDiagram: React.FC<Props> = ({
  alt,
  refValue,
  selectedColor,
  selectedLineWeight,
  width,
  height,
  image,
  value,
  readOnly,
  imageClassname,
  onChange,
}) => {
  return (
    <div className="relative">
      <div className="static top-0 left-0">
        <img className={imageClassname} src={image} alt={alt} />
      </div>
      <div className="absolute top-5 left-4">
        <SketchField
          ref={refValue}
          tool={Tools.Pencil}
          width={width}
          height={height}
          lineColor={selectedColor}
          lineWidth={selectedLineWeight}
          value={value}
          disabled={readOnly}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
