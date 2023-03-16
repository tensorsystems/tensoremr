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

import { QuestionnaireItem } from "fhir/r4";
import { debounce, isEmpty } from "lodash";
import { useCallback } from "react";
import { Control, Controller, UseFormSetValue } from "react-hook-form";
import { searchConceptChildren } from "../api";
import AsyncSelect from "react-select/async";

interface Props {
  values: any;
  searchCode: string;
  item: QuestionnaireItem;
  control: Control<any, any>;
  setValue: UseFormSetValue<any>;
  onError: (message: any) => void;
}

export default function QuestionnaireInput({
  item,
  control,
  values,
  setValue,
  onError,
  searchCode,
}: Props) {
  const search = useCallback(
    debounce((inputValue: string, callback: (options: any) => void) => {
      if (inputValue.length > 3) {
        searchConceptChildren({
          termFilter: inputValue,
          eclFilter: `<< ${searchCode}`,
          limit: 20,
        })
          .then((resp) => {
            const values = resp.data?.items?.map((e) => ({
              value: e.id,
              label: e?.pt?.term,
            }));

            if (values) {
              callback(values);
            }
          })
          .catch((error) => {
            onError(error.message);
            console.error(error);
          });
      }
    }, 600),
    []
  );

  return (
    <div className="p-3 shadow-md rounded-sm bg-white">
      <p className="font-semibold">{item?.text}</p>
      {item?.type === "string" &&
        values[item.linkId]
          ?.filter((e) => e !== undefined)
          .map((e, index) => (
            <div key={index} className="mt-2 flex items-center space-x-3">
              <div className="flex-1">
                {e?.type === "coded" && (
                  <Controller
                    name={`${item?.linkId}.${index}`}
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                      <AsyncSelect
                        ref={ref}
                        placeholder="Search ..."
                        cacheOptions
                        isClearable
                        value={value}
                        onChange={(values) => {
                          if (values === null) {
                            onChange(undefined);
                          } else {
                            onChange({
                              ...values,
                              type: e?.type,
                            });
                          }
                        }}
                        loadOptions={search}
                      />
                    )}
                  />
                )}
                {e?.type === "free_text" && (
                  <Controller
                    name={`${item?.linkId}.${index}`}
                    control={control}
                    render={({ field: { onChange, value, ref } }) => (
                      <textarea
                        rows={3}
                        ref={ref}
                        value={value?.value ?? ""}
                        placeholder="Free text"
                        onChange={(evt) =>
                          onChange({
                            value: evt.target.value,
                            label: evt.target.value,
                            type: e?.type,
                          })
                        }
                        className="p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md rounded-r-none "
                      />
                    )}
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setValue(`${item?.linkId}.${index}`, undefined);
                }}
              >
                <p className="material-symbols-outlined text-red-400">delete</p>
              </button>
            </div>
          ))}

      {item?.repeats && (
        <div className="flex space-x-2 text-sm">
          <button
            type="button"
            className="mt-3 flex text-teal-500 items-center border rounded-md px-2 hover:text-white hover:bg-teal-500"
            onClick={() => {
              if (!isEmpty(values[item.linkId])) {
                setValue(item.linkId, [
                  ...values[item.linkId],
                  { type: "coded" },
                ]);
              } else {
                setValue(item.linkId, [{ type: "coded" }]);
              }
            }}
          >
            <p className="material-symbols-outlined">add</p>
            <p>Add</p>
          </button>

          <button
            type="button"
            className="mt-3 flex text-teal-500 items-center border rounded-md px-2 hover:text-white hover:bg-teal-500"
            onClick={() => {
              if (!isEmpty(values[item.linkId])) {
                setValue(item.linkId, [
                  ...values[item.linkId],
                  { type: "free_text" },
                ]);
              } else {
                setValue(item.linkId, [{ type: "free_text" }]);
              }
            }}
          >
            <p className="material-symbols-outlined">edit_note</p>
            <p>Add free text</p>
          </button>
        </div>
      )}
    </div>
  );
}
