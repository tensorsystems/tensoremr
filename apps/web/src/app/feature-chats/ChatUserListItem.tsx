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
import classnames from 'classnames';
import { User } from '@tensoremr/models';

interface Props {
  user: User | undefined;
  first?: boolean;
  onSelect: (userId: string) => void;
}

export const ChatUserListItem: React.FC<Props> = ({
  user,
  first,
  onSelect,
}) => {
  return (
    <li
      className={classnames(
        'flex items-center space-x-5 p-2 cursor-pointer hover:bg-gray-50',
        {
          'border-t': !first,
        }
      )}
      onClick={() => {
        if (user?.id) {
          onSelect(user?.id);
        }
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-12 w-12 text-teal-800"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p>{`${user?.firstName} ${user?.lastName}`}</p>
    </li>
  );
};
