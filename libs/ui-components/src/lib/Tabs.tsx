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
import cn from 'classnames';
import { Tab } from '@tensoremr/models';
import {
  useRouteMatch,
  useHistory,
  useLocation,
  NavLink,
} from 'react-router-dom';

interface Props {
  tabs: Array<Tab>;
  value: string;
  onChange: (title: string) => void;
}

export const Tabs: React.FC<Props> = ({ tabs, value, onChange }) => {
  const match = useRouteMatch();
  const history = useHistory();
  const { search } = useLocation();

  return (
    <div className="mb-3">
      <ul className="list-reset flex space-x-3 items-center">
        {tabs.map((e) => {
          const fullRoute = `${match.url}/${e.route}`;
          const location = `${history.location.pathname}${search}`;
          const selected = fullRoute === location;

          return (
            <NavLink
              to={`${match.url}/${e.route}`}
              key={e.title}
              className="-mb-px"
              activeClassName="bg-teal-100 text-teal-800"
            >
              <div
                className={cn(
                  'bg-gray-50 inline-block py-3 px-5 text-gray-800 rounded-sm',
                  {
                    'border-r-2 font-bold text-teal-800 shadow-lg transform scale-y-110':
                      selected,
                    'shadow-md': !selected,
                  }
                )}
              >
                <div className="flex space-x-2 items-center">
                  <div>{selected ? e.selectedIcon : e.icon}</div>

                  <div>{e.title}</div>
                </div>
              </div>
            </NavLink>
          );
        })}
      </ul>
    </div>
  );
};
