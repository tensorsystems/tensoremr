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

import { gql, useQuery, useLazyQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import {
  Query,
  QueryGetCommonChatArgs,
  QueryUsersArgs,
} from '@tensoremr/models';
import { ChatUserListItem } from './ChatUserListItem';

const GET_COMMON_CHAT = gql`
  query GetCommonChat($recipientID: ID!) {
    getCommonChat(recipientID: $recipientID) {
      id
    }
  }
`;

const GET_USERS = gql`
  query GetUsers($page: PaginationInput!) {
    users(page: $page) {
      edges {
        node {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

interface NewChatDialogProps {
  onNewChat: (recipientId: string) => void;
  onExistingChat: (chatId: string) => void;
  onCancel: () => void;
}

export const NewChatDialog: React.FC<NewChatDialogProps> = ({
  onExistingChat,
  onNewChat,
  onCancel,
}) => {
  const { data } = useQuery<Query, QueryUsersArgs>(GET_USERS, {
    variables: {
      page: { page: 0, size: 100 },
    },
  });

  const [selectedUserId, setSelectedUserId] = useState<string>();
  useEffect(() => {
    if (selectedUserId) {
      commonChatQuery[0]({
        variables: {
          recipientID: selectedUserId,
        },
      });
    }
  }, [selectedUserId]);

  const commonChatQuery = useLazyQuery<Query, QueryGetCommonChatArgs>(
    GET_COMMON_CHAT,
    {
      onCompleted(data) {
        if (data.getCommonChat.id) {
          onExistingChat(data.getCommonChat.id);
        }
      },
      onError(error) {
        if (selectedUserId) {
          onNewChat(selectedUserId);
        }
      },
    }
  );

  const handleSelect = (userId: string) => setSelectedUserId(userId);

  return (
    <div className="container mx-auto flex justify-center pt-4 pb-6">
      <div className="w-1/2">
        <div className="flex justify-between">
          <p className="text-2xl font-extrabold tracking-wider text-teal-800">
            Send message
          </p>

          <button onClick={onCancel}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-8 w-8 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="mt-4 relative">
          <input
            type="search"
            className="w-full py-3 px-4 shadow-lg rounded-md focus:outline-none"
            placeholder="Search"
          />
          <button type="button" className="absolute right-0 top-0 mt-3 mr-4">
            <p className="material-icons">search</p>
          </button>
        </div>

        <div className="mt-4">
          <ul className="shadow-lg">
            {data?.users.edges.map((e, i) => (
              <ChatUserListItem
                key={e?.node.id}
                user={e?.node}
                first={i === 0}
                onSelect={handleSelect}
              />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
