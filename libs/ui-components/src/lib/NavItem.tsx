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
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';

export const NavItem: React.FC<{
  route: string;
  label: string;
  completed?: boolean;
  icon?: string;
  subItem: boolean;
  disabled?: boolean;
  notifs?: number;
  matchUrl: string;
  location: string;
  status?: 'success' | 'pending_actions' | 'warning' | 'locked';
}> = ({
  route,
  label,
  matchUrl,
  location,
  completed,
  subItem,
  icon,
  disabled,
  notifs,
  status,
}) => {
  const fullRoute = `${matchUrl}/${route}`;
  const selected = fullRoute === location;

  function BuildIcon() {
    if (subItem) {
      return <span className="material-icons text-gray-600">{icon}</span>;
    } else {
      return (
        <div>
          {icon === undefined ? (
            <div className="material-icons text-teal-800">
              {status === 'success' && 'check'}

              {status === 'warning' && 'warning'}

              {status === 'locked' && 'lock'}

              {status === 'pending_actions' && 'pending_actions'}
            </div>
          ) : (
            <span className="material-icons">{icon}</span>
          )}
        </div>
      );
    }
  }

  return (
    <NavLink
      to={disabled ? '#' : `${matchUrl}/${route}`}
      className={classNames({
        'pointer-events-none': disabled,
      })}
      activeClassName="bg-teal-100 text-teal-800"
    >
      <div
        className={classNames('px-3 py-1 rounded-md', {
          'ml-12': subItem,
          'bg-teal-100': selected,
          'text-green-700': completed,
        })}
      >
        <div
          className={classNames(
            'font-sans w-full text-left focus:outline-none flex justify-between space-x-3 items-center',
            {
              'text-teal-800': selected,
              'text-gray-700': !selected,
            }
          )}
        >
          <div className="flex space-x-2 items-center">
            <BuildIcon />

            {subItem ? (
              <p className="text-gray-600">{label}</p>
            ) : (
              <p className="text-lg font-semibold">{label}</p>
            )}
          </div>

          {notifs !== undefined && notifs > 0 && (
            <div className="bg-red-500 text-white h-6 w-6 rounded-full flex items-center justify-center shadow-inner">
              {notifs}
            </div>
          )}
        </div>
      </div>
    </NavLink>
  );
};
