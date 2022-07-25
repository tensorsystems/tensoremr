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

export const MessageBody: React.FC<{
  body: string | undefined;
  isReceived: boolean;
}> = ({ body, isReceived }) => {
  return (
    <div
      className={classnames('p-5 rounded-md', {
        'bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-tl-none':
          isReceived,
        'bg-white border text-gray-700 rounded-tr-none': !isReceived,
      })}
    >
      <p>{body}</p>
    </div>
  );
};
