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

import { Square3Stack3DIcon } from "@heroicons/react/24/outline";
import {
  MinusCircleIcon,
  PencilSquareIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { Avatar, Spinner } from "flowbite-react";
import React from "react";

interface MedicalHistoryItemDetail {
  label: string;
  value: string;
}

interface IMedicalHistoryItem {
  id: string;
  title: string;
  createdAt?: string;
  versionId?: string;
  details: MedicalHistoryItemDetail[];
}

interface Props {
  title: string;
  items: Array<IMedicalHistoryItem>;
  locked: boolean;
  loading?: boolean;
  onAddClick?: () => void;
  onUpdateClick?: (id: string) => void;
}

const MedicalHistoryItem: React.FC<Props> = ({
  title,
  items,
  locked,
  loading,
  onAddClick,
  onUpdateClick,
}) => {
  if (loading) {
    return (
      <MedicalHistoryItemLayout
        title={title}
        locked={locked}
        onAddClick={onAddClick}
      >
        <div className="h-20 flex items-center justify-center">
          <Spinner color="warning" aria-label="Button loading" />
        </div>
      </MedicalHistoryItemLayout>
    );
  }

  if (items && items.length === 0) {
    return (
      <MedicalHistoryItemLayout
        title={title}
        locked={locked}
        onAddClick={onAddClick}
      >
        <div className="bg-gray-50 mt-3 h-32 flex rounded-sm shadow-inner">
          <div className="m-auto flex space-x-1 text-gray-500">
            <div className="material-icons md-inbox"></div>
            <p className="text-center">Nothing here yet</p>
          </div>
        </div>
      </MedicalHistoryItemLayout>
    );
  }

  return (
    <MedicalHistoryItemLayout
      title={title}
      locked={locked}
      onAddClick={onAddClick}
    >
      <ul className="mt-3">
        {items &&
          items.map((item, i) => {
            const pertinence: "Positive" | "Negative" = "Positive";

            return (
              <li key={item?.id} className="border-t border-gray-200 py-2 px-2">
                <div className="flex justify-between ">
                  <div className="flex space-x-3">
                    <div>
                      {pertinence === "Positive" ? (
                        <PlusCircleIcon className="h-6 w-6 text-yellow-600" />
                      ) : (
                        <MinusCircleIcon className="h-6 w-6 text-green-600" />
                      )}
                    </div>
                    <div className="flex space-x-2 items-center">
                      <div>
                        <div className="flex items-center space-x-4">
                          <p className="text-gray-700 break-words">
                            {item?.title}
                          </p>
                          {item.createdAt && (
                            <div className="text-gray-500 italic text-sm min-w-fit">
                              <p>- {item?.createdAt}</p>
                            </div>
                          )}
                        </div>
                        <div className="text-sm">
                          {item.details?.map((e, i) => (
                            <div
                              key={i}
                              className="flex items-center space-x-1"
                            >
                              <span className="text-gray-500">{e.label}:</span>
                              <span>{e.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        onUpdateClick(item.id);
                      }}
                    >
                      <PencilSquareIcon className="h-5 w-5 text-teal-500 hover:text-teal-600" />
                    </button>
                  </div>
                </div>
                {false && (
                  <button
                    type="button"
                    className="flex items-center space-x-1 ml-8 mt-2"
                  >
                    <Square3Stack3DIcon className="w-4 h-4" />
                    <p className="text-xs underline text-sky-600">
                      Show Versions
                    </p>
                  </button>
                )}

                {false && (
                  <button className="mt-4 flex items-center space-x-3 ml-8">
                    <div className="text-sm bg-sky-600 text-sky-100 px-2 py-1 rounded-lg shadow-lg">
                      V1
                    </div>
                    <div className="text-sm text-gray-700 px-2 py-1 md">V2</div>
                  </button>
                )}
              </li>
            );
          })}
      </ul>
    </MedicalHistoryItemLayout>
  );
};

interface MedicalHistoryItemLayoutProps {
  title: string;
  children: any;
  locked: boolean;
  onAddClick?: () => void;
}

function MedicalHistoryItemLayout(props: MedicalHistoryItemLayoutProps) {
  const { title, locked, children, onAddClick } = props;

  return (
    <div className="rounded-md shadow-lg border border-gray-100 bg-zinc-50 p-4">
      <div className="flex justify-between items-center">
        <p className="tracking-wide font-semibold text-gray-800 text-lg">
          {title}
        </p>
        <button
          className="border border-teal-800 px-3 py-1 rounded-lg flex space-x-1 items-center text-teal-800 hover:bg-teal-500 hover:text-white"
          onClick={onAddClick}
          disabled={locked}
          type="button"
        >
          <p className="material-icons md-add"></p>
          <div>Add</div>
        </button>
      </div>
      {children}
    </div>
  );
}

export default MedicalHistoryItem;
