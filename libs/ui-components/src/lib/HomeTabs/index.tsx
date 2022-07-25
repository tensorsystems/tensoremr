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
import { Page } from '@tensoremr/models';
import './index.css';

interface Props {
  pages: Array<Page>;
  activeTab: string;
  onTabOpen: (route: string) => void;
  onClose: (route: string) => void;
}

export const HomeTabs: React.FC<Props> = ({
  pages,
  activeTab,
  onTabOpen,
  onClose,
}) => {
  const color = 'teal';

  return (
    <div className="w-full">
      <ul className="gap-2 w-full flex flex-wrap -m-1" role="tablist">
        {pages.map((e) => (
          <li className="-mb-px ml-2 flex-initial text-center" key={e.route}>
            <div
              className={
                'text-xs font-bold px-5 py-3 shadow-lg rounded block leading-normal ' +
                (activeTab === e.route
                  ? 'text-white bg-' + color + '-600'
                  : 'text-' + 'gray' + '-600 bg-white')
              }
              data-toggle="tab"
              role="tablist"
              onClick={() => {
                onTabOpen(e.route);
              }}
            >
              <div className="flex justify-between items-center cursor-pointer">
                <div className="pl-12 uppercase tracking-wide flex flex-1 items-center">
                  <div>{e.icon}</div>

                  <div className="pl-1 ml-1">{e.title}</div>
                </div>
                <div className="pl-12">
                  {e.cancellable && activeTab === e.route && (
                    <a
                      onClick={(evt) => {
                        evt.preventDefault();
                        onClose(e.route);
                      }}
                      className="items-center"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        className="h-4 w-4 fill-current"
                        stroke="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
