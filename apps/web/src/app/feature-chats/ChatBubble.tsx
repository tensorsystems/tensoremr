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

import classnames from 'classnames';
import React from 'react';
import { ChatAvatar } from './ChatAvatar';
import { MessageBody } from './MessageBody';

interface Props {
  isReceived: boolean;
  message: string | undefined;
  displayName: string | undefined;
}

export const ChatBubble: React.FC<Props> = ({
  isReceived,
  message,
  displayName,
}) => {
  return (
    <div
      className={classnames('flex space-x-3 mt-3', {
        'justify-end': !isReceived,
      })}
    >
      {!isReceived && <MessageBody body={message} isReceived={isReceived} />}

      <ChatAvatar fullName={displayName} />

      {isReceived && <MessageBody body={message} isReceived={isReceived} />}
    </div>
  );
};
