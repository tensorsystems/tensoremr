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
import { parseJwt } from '@tensoremr/util';
import { Chat, MutationDeleteUnreadMessagesArgs } from '@tensoremr/models';
import { useHistory } from 'react-router-dom';
import { formatDistance, parseISO } from 'date-fns';
import { gql, useMutation } from '@apollo/client';

const DELETE_UNREAD_MESSAGES = gql`
  mutation DeleteUnreadMessages($userId: ID!, $chatId: ID!) {
    deleteUnreadMessages(userId: $userId, chatId: $chatId)
  }
`;

interface Props {
  chat: Chat;
  firstItem?: boolean;
  selected: boolean;
}

export const ChatListItem: React.FC<Props> = ({
  chat,
  firstItem,
  selected,
}) => {
  const history = useHistory();
  const token = sessionStorage.getItem('accessToken');
  const claim = parseJwt(token);

  const recipient = chat.chatMembers.find((e) => e?.userId !== claim.ID);

  const unreadMessages = chat.chatUnreadMessages.filter(
    (e) => e?.userId === claim.ID
  ).length;

  const [deleteUnreadMessages] = useMutation<
    any,
    MutationDeleteUnreadMessagesArgs
  >(DELETE_UNREAD_MESSAGES);

  return (
    <div
      className={classnames(
        'bg-white p-6 rounded-md shadow-lg cursor-pointer hover:bg-teal-200',
        {
          'mt-2': !firstItem,
          'bg-teal-100': selected,
        }
      )}
      onClick={() => {
        deleteUnreadMessages({
          variables: {
            chatId: chat.id,
            userId: claim.ID,
          },
        });

        history.push(`/chats/${chat.id}`);
      }}
    >
      <div className="flex justify-between">
        <div className="flex space-x-2">
          <div className="font-bold text-gray-700 rounded-full bg-gray-400 flex items-center justify-center font-mono h-10 w-10">
            <p className="text-center text-white text-xl">KT</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">
              {recipient?.displayName}
            </p>
            <p className="text-xs text-teal-600"></p>
          </div>
        </div>
        <div>
          <p className="text-gray-500 font-semibold text-xs">
            {' '}
            {formatDistance(parseISO(chat.updatedAt), new Date(), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
      <div className="flex justify-between mt-2">
        <div className="text-gray-600">{chat.recentMessage}</div>
        <div>
          {unreadMessages > 0 && (
            <div className="font-bold text-gray-700 rounded-full bg-red-400 flex items-center justify-center h-5 w-5">
              <p className="text-white text-sm">{unreadMessages}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
