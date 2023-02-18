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

import { Checkbox, Label } from "flowbite-react";
import React from "react";
import { Control, Controller, UseFormRegister } from "react-hook-form";

interface CheckboxInputProps {
  checked: boolean;
  control: Control<any, any>;
  register: UseFormRegister<any>;
  inputChildren: { id: string; name: string; type: string }[];
}

export default function TemplateCheckboxInput({
  inputChildren,
  control,
  register,
  checked,
}: CheckboxInputProps) {
  return (
    <div className="mt-4 ml-1 flex space-x-3 items-center">
      {inputChildren?.map((c) => {
        if (c.type === "DV_BOOLEAN")
          return (
            <div key={c.id} className="flex items-center gap-2 flex-1">
              <Controller
                name={c.id}
                control={control}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Checkbox
                    id={c.id}
                    name={c.id}
                    value={value}
                    ref={ref}
                    onChange={(evt) => {
                      onChange(evt.target.checked);
                    }}
                  />
                )}
              />

              <Label htmlFor={c.id}>{c?.name}</Label>
            </div>
          );

        if (c.type === "DV_TEXT")
          return (
            <div key={c.id} hidden={!checked}>
              <input
                type="text"
                id={c.name}
                placeholder="Note"
                {...register(c.id)}
                className="p-1 pl-4 block w-full text-sm border-gray-300 border rounded-md"
              />
            </div>
          );
      })}
    </div>
  );
}
