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

interface Props {
  title: string;
  isEdit?: boolean;
  items: Array<any> | undefined;
  locked: boolean;
  onAdd: () => void;
  onUpdate: (item: any) => void;
  onDelete: (id: string) => void;
}

export const HistoryTypeComponent: React.FC<Props> = ({
  title,
  items,
  isEdit,
  locked,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  return (
    <div className="rounded-lg shadow-lg border border-gray-100 p-1">
      <div className="flex justify-between items-center">
        <p className="tracking-wider font-bold text-gray-800">{title}</p>
        {isEdit && (
          <button
            className="border border-teal-800 text-teal-800 px-3 py-1 rounded-lg flex space-x-1 items-center"
            onClick={() => onAdd()}
            disabled={locked}
          >
            <div className="material-icons">add</div>
            <div>Add</div>
          </button>
        )}
      </div>

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
            items.map((e) => (
              <li
                key={e?.id}
                className="flex justify-between border-t border-gray-200 py-2 px-2"
              >
                <div className="flex space-x-3">
                  <span className="material-icons text-yellow-600">
                    add_circle
                  </span>{' '}
                  <div>
                    <p className="text-gray-700 break-words">{e?.title}</p>
                    <div className="text-gray-500 text-sm">{e?.subTitle}</div>
                    <div className="text-gray-500 text-sm">{e?.subTitle2}</div>
                  </div>
                </div>
                <div>
                  {isEdit && (
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        className="material-icons text-gray-700"
                        onClick={() => e?.id && onUpdate(e)}
                      >
                        create
                      </button>
                      <button
                        type="button"
                        className="material-icons text-gray-700"
                        onClick={() => {
                          if (e.id) {
                            onDelete(e.id);
                          }
                        }}
                      >
                        delete
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};
