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
import { AutocompleteInput } from '@tensoremr/ui-components';

interface Props {
  register: any;
  control: any;
  setValue: any;
  locked: boolean;
  onChange: () => void;
}

export const ExternalExamComponent: React.FC<Props> = ({
  register,
  control,
  setValue,
  locked,
  onChange,
}) => {
  return (
    <div className="grid grid-cols-5 gap-y-2 gap-x-4 justify-items-stretch">
      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Orbits</p>
      </div>
      <div className="col-span-2">
        <AutocompleteInput
          type="text"
          name="rightOrbits"
          field="right_orbits"
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
          name="leftOrbits"
          field="left_orbits"
          uri="postgres.public.opthalmology_exams"
          control={control}
          register={register}
          setFormValue={setValue}
          disabled={locked}
          onInputChange={onChange}
        />
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Lids</p>
      </div>
      <div className="col-span-2">
        <AutocompleteInput
          type="text"
          name="rightLids"
          field="right_lids"
          uri="postgres.public.opthalmology_exams"
          control={control}
          register={register}
          setFormValue={setValue}
          disabled={locked}
          onInputChange={onChange}
        />
      </div>
      <div className="col-span-2">
        <AutocompleteInput
          type="text"
          name="leftLids"
          field="left_lids"
          uri="postgres.public.opthalmology_exams"
          control={control}
          register={register}
          setFormValue={setValue}
          disabled={locked}
          onInputChange={onChange}
        />
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Lacrimal System</p>
      </div>
      <div className="col-span-2">
        <AutocompleteInput
          type="text"
          name="rightLacrimalSystem"
          field="right_lacrimal_system"
          uri="postgres.public.opthalmology_exams"
          control={control}
          register={register}
          setFormValue={setValue}
          disabled={locked}
          onInputChange={onChange}
        />
      </div>
      <div className="col-span-2">
        <AutocompleteInput
          type="text"
          name="leftLacrimalSystem"
          field="left_lacrimal_system"
          uri="postgres.public.opthalmology_exams"
          control={control}
          register={register}
          setFormValue={setValue}
          disabled={locked}
          onInputChange={onChange}
        />
      </div>

      <div className="col-span-1 justify-self-center">
        <p className="text-gray-600 tracking-wide">Note</p>
      </div>
      <div className="col-span-4">
        <textarea
          name="externalExamNote"
          ref={register}
          rows={2}
          className="p-1 pl-4 sm:text-md border-gray-300 border rounded-md w-full"
          disabled={locked}
          onChange={onChange}
        />
      </div>
    </div>
  );
};
