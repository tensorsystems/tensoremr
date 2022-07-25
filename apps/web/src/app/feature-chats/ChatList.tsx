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
import { Chat, Maybe } from '@tensoremr/models';
import { ChatListItem } from './ChatListItem';

interface ChatListProps {
  chats: Maybe<Chat>[] | undefined;
  selectedChatId: string | undefined;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChatId,
}) => {
  return (
    <div>
      {chats?.map((e, i) => (
        <div key={e?.id}>
          {e && (
            <ChatListItem
              chat={e}
              firstItem={i === 0}
              selected={e?.id.toString() === selectedChatId}
            />
          )}
        </div>
      ))}
    </div>
  );
};
