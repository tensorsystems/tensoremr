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

import { ClinicalFindingAttribute } from '@tensoremr/models';
import React from 'react';
import { PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/solid';
import { Spinner } from 'flowbite-react';
import { format, parseISO } from 'date-fns';

interface Props {
  title: string;
  isEdit?: boolean;
  items: Array<any> | undefined;
  locked: boolean;
  loading?: boolean;
  onAdd: () => void;
  onUpdate: (item: any) => void;
  onDelete: (id: string) => void;
}

export const HistoryTypeComponent: React.FC<Props> = ({
  title,
  items,
  loading,
  isEdit,
  locked,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="rounded-lg shadow-lg border border-gray-100 bg-zinc-50 p-2">
      <div className="flex justify-between items-center">
        <p className="tracking-wide font-bold text-gray-800 text-lg">{title}</p>
        {isEdit && (
          <button
            className="border border-teal-800  px-3 py-1 rounded-lg flex space-x-1 items-center text-teal-800 hover:bg-teal-500 hover:text-white"
            onClick={() => onAdd()}
            disabled={locked}
          >
            <div className="material-icons">add</div>
            <div>Add</div>
          </button>
        )}
      </div>

      {loading && (
        <div className="h-20 flex items-center justify-center">
          <Spinner color="warning" aria-label="Button loading" />
        </div>
      )}

      {items && items.length === 0 ? (
        <div className="bg-gray-100 mt-5 h-32 flex rounded-sm shadow-inner">
          <div className="m-auto flex space-x-1 text-gray-500">
            <div className="material-icons">inbox</div>
            <p className="text-center">Nothing here yet</p>
          </div>
        </div>
      ) : (
        <ul className="mt-3">
          {items &&
            items.map((item) => {
              let pertinence: 'Positive' | 'Negative' = 'Positive';

              const findingContext = item.attributes?.find(
                (e: ClinicalFindingAttribute) =>
                  e.attributeTypeId === '408729009'
              );

              if (findingContext) {
                if (findingContext.attributeId === '410516002') {
                  pertinence = 'Negative';
                } else {
                  pertinence = 'Positive';
                }
              }

             
              return (
                <li
                  key={item?.id}
                  className="flex justify-between border-t border-gray-200 py-2 px-2"
                >
                  <div className="flex space-x-3">
                    {pertinence === 'Positive' ? (
                      <PlusCircleIcon className="h-6 w-6 text-yellow-600" />
                    ) : (
                      <MinusCircleIcon className="h-6 w-6 text-green-600" />
                    )}
                    <div className="flex space-x-5">
                      <div>
                        <p className="text-gray-700 break-words">
                          {item?.conceptTerm}
                        </p>
                        <div className="text-gray-500 text-sm">
                          {item?.subTitle}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {item?.subTitle2}
                        </div>
                      </div>
                      {item.createdAt && (
                        <div className="text-gray-500 italic text-sm">
                          <p>
                            - {format(parseISO(item.createdAt), 'MMM d, y')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {isEdit && (
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          className="material-icons text-red-500 hover:text-red-600"
                          onClick={() => {
                            if (item.id) {
                              const choice = window.confirm(
                                'Are you sure you want to delete this item?'
                              );
                              if (choice) {
                                onDelete(item.id);
                              }
                            }
                          }}
                        >
                          delete
                        </button>
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};
