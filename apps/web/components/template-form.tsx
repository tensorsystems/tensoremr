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

import { ChevronDoubleDownIcon, ChevronDoubleUpIcon } from "@heroicons/react/24/solid";
import React, { useState } from "react";
import { Control, UseFormRegister } from "react-hook-form";
import { ITemplateFormInput } from "../model";
import TemplateCheckboxInput from "./template-checkbox-input";

interface Props {
  values: any;
  control: Control<any, any>;
  formInput: ITemplateFormInput;
  register: UseFormRegister<any>;
}

export default function TemplateForm({
  formInput,
  control,
  register,
  values,
}: Props) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const items = expanded ? formInput.inputs : formInput.inputs.slice(0, 4);

  return (
    <div key={formInput?.id} className="mt-4 p-3 shadow-md rounded-sm">
      <p className="font-semibold">{formInput?.title}</p>

      {items.map((input) => (
        <div key={input?.id}>
          {input?.type === "checkbox" && (
            <TemplateCheckboxInput
              control={control}
              inputChildren={input?.children}
              register={register}
              checked={values[input.id] === true}
            />
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center space-x-1 mt-2 ml-1 text-sm text-teal-500"
      >
        {expanded ? (
          <ChevronDoubleUpIcon className="w-4 h-4" />
        ) : (
          <ChevronDoubleDownIcon className="w-4 h-4" />
        )}
        {expanded ? <p>Show less</p> : <p>Show more</p>}
      </button>
    </div>
  );
}
