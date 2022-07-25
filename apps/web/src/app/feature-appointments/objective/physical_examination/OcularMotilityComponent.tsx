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
import {
  AutocompleteInput,
  OcularMotilityOdDiagram,
  OcularMotilityOsDiagram,
} from '@tensoremr/ui-components';
interface Props {
  register: any;
  control: any;
  setValue: any;
  values: any;
  locked: boolean;
  onChange: () => void;
}

export const OcularMotilityComponent: React.FC<Props> = ({
  register,
  control,
  setValue,
  values,
  locked,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-5 gap-y-2 gap-x-4 justify-items-stretch">
      <div className="col-span-1"></div>
      <div className="col-span-2 justify-self-stretch">
        <OcularMotilityOdDiagram
          register={register}
          values={values}
          readOnly={locked}
          setValue={setValue}
          onChange={onChange}
        />
      </div>

      <div className="col-span-2 justify-self-stretch">
        <OcularMotilityOsDiagram
          register={register}
          values={values}
          readOnly={locked}
          onChange={onChange}
        />
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-500 tracking-wide">Distance</p>
      </div>
      <div className="col-span-4">
        <input
          type="text"
          name="distance"
          ref={register}
          disabled={locked}
          className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
          onChange={onChange}
        />
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-500 tracking-wide">Near</p>
      </div>
      <div className="col-span-4">
        <input
          type="text"
          name="near"
          ref={register}
          disabled={locked}
          className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
          onChange={onChange}
        />
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-500 tracking-wide">Ocular Motility</p>
      </div>
      <div className="col-span-2">
        <AutocompleteInput
          type="text"
          name="rightOcularMotility"
          field="right_ocular_motility"
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
          name="leftOcularMotility"
          field="left_ocular_motility"
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
          name="ocularMotilityNote"
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
