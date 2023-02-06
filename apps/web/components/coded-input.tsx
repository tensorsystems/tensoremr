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
import AsyncSelect from "react-select/async";
import { ISelectOption } from "@tensoremr/models";
import { DebouncedFunc } from "lodash";
import { Transition } from "@headlessui/react";
import { ConceptBrowser } from "./concept-browser";
import { useState } from "react";

interface Props {
title: string;
  conceptId: string;
  selectedItem: ISelectOption;
  setSelectedItem: (item: ISelectOption) => void;
  searchOptions: DebouncedFunc<
    (inputValue: string, callback: (options: any) => void) => void
  >;
}

export default function CodedInput({
    title,
  conceptId,
  selectedItem,
  searchOptions,
  setSelectedItem,
}: Props) {
  const [browserOpen, setBrowserOpen] = useState<boolean>(false);

  return (
    <div>
      <div className="flex items-center space-x-3 mt-4">
        <div className="flex-1">
          <label
            htmlFor="search"
            className="block text-gray-700"
          >
            {title}
          </label>

          <AsyncSelect
            placeholder="Search ..."
            cacheOptions
            isClearable
            value={selectedItem}
            loadOptions={searchOptions}
            onChange={(selected) => {
              setSelectedItem(selected);
            }}
            className="mt-1"
          />
        </div>
        <div>
          <button type="button" onClick={() => setBrowserOpen(!browserOpen)}>
            <p className="material-icons md-travel_explore md-36 mt-7 text-teal-600 hover:text-teal-700"></p>
          </button>
        </div>
      </div>

      <div className="mt-4">
        <div className="mt-2">
          <Transition
            enter="transition ease-out duration-300"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            show={browserOpen}
          >
            <ConceptBrowser
              conceptId={conceptId}
              onSelect={(item) => {
                setSelectedItem({
                  value: item.id,
                  label: item.pt?.term,
                });
              }}
            />
          </Transition>
        </div>
      </div>
    </div>
  );
}
