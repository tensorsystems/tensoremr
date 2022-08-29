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

import { gql, useLazyQuery, useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory, useLocation } from 'react-router-dom';
import {
  Chat,
  ChatMessageInput,
  MutationCreateChatArgs,
  MutationSendMessageArgs,
  Query,
  QueryGetChatMessagesArgs,
  QueryUserArgs,
} from '@tensoremr/models';
import { useNotificationDispatch } from '@tensoremr/notification';
import { parseJwt } from '@tensoremr/util';
import { ChatAvatar } from './ChatAvatar';
import { ChatBubble } from './ChatBubble';

const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($id: ID!) {
    getChatMessages(id: $id) {
      id
      body
      chatId
      userId
      createdAt
    }
  }
`;

const SEND_MESSAGE = gql`
  mutation SendMessage($input: ChatMessageInput!) {
    sendMessage(input: $input) {
      id
    }
  }
`;

const CREATE_NEW_CHAT = gql`
  mutation CreateChat($input: ChatInput!) {
    createChat(input: $input) {
      id
    }
  }
`;

const GET_USER_INFO = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
    }
  }
`;

interface Props {
  chat?: Chat | undefined;
  isNewChat: boolean;
  onRefresh: () => void;
}

function useRouterQuery() {
  return new URLSearchParams(useLocation().search);
}

export const ChatComponent: React.FC<Props> = ({
  chat,
  isNewChat,
  onRefresh,
}) => {
  const notifDispatch = useNotificationDispatch();
  const history = useHistory();

  const query = useRouterQuery();
  const queryUserId = query.get('userId');

  const token = sessionStorage.getItem('accessToken');
  const claim = parseJwt(token);

  const [recipient, setRecipient] = useState<{
    id: string | undefined;
    fullName: string | undefined;
  }>({
    id: undefined,
    fullName: '',
  });

  const chatMessagesQuery = useLazyQuery<Query, QueryGetChatMessagesArgs>(
    GET_CHAT_MESSAGES
  );

  const getUserQuery = useLazyQuery<Query, QueryUserArgs>(GET_USER_INFO, {
    onCompleted(data) {
      setRecipient({
        id: data.user.id,
        fullName: data.user.firstName + ' ' + data.user.lastName,
      });
    },
  });

  useEffect(() => {
    if (chat) {
      const member = chat?.chatMembers.find((e) => e?.userId !== claim.ID);

      setRecipient({
        id: member?.id,
        fullName: member?.displayName,
      });

      chatMessagesQuery[0]({
        variables: {
          id: chat.id,
        },
      });
    }
  }, [chat]);

  useEffect(() => {
    if (isNewChat && queryUserId) {
      getUserQuery[0]({
        variables: {
          id: queryUserId,
        },
      });
    }
  }, [isNewChat, queryUserId]);

  const [sendMessage] = useMutation<any, MutationSendMessageArgs>(
    SEND_MESSAGE,
    {
      onCompleted(data) {
        chatMessagesQuery[1].refetch();

        setValue('body', '');
      },
      onError(error) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  const [createChat] = useMutation<any, MutationCreateChatArgs>(
    CREATE_NEW_CHAT,
    {
      onCompleted(data) {
        if (data.createChat.id) {
          onRefresh();
          history.replace(`/chats/${data.createChat.id}`);
        }
      },
      onError(error) {
        notifDispatch({
          type: 'showNotification',
          notifTitle: 'Error',
          notifSubTitle: error.message,
          variant: 'failure',
        });
      },
    }
  );

  const { register, setValue, handleSubmit } = useForm<ChatMessageInput>();
  const onSubmit = (data: ChatMessageInput) => {
    if (isNewChat && queryUserId) {
      createChat({
        variables: {
          input: {
            recipientId: queryUserId,
            message: data.body,
          },
        },
      });
    } else {
      if (chat) {
        data.chatId = chat.id;
        sendMessage({
          variables: {
            input: data,
          },
        });
      }
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-md">
      <div className="flex justify-between items-center p-5">
        <div>
          <div className="flex space-x-2">
            <ChatAvatar fullName={recipient?.fullName ?? ''} />
            <div>
              <p className="font-semibold text-gray-700">
                {recipient?.fullName ?? ''}
              </p>
              <p className="text-xs text-teal-600"></p>
            </div>
          </div>
        </div>
        <div>
          <button type="button">
            <p className="material-icons">more_vert</p>
          </button>
        </div>
      </div>
      <hr />
      <div className="p-5 max-h-screen overflow-auto">
        {chatMessagesQuery[1].data?.getChatMessages.length === 0 ||
          (chatMessagesQuery[1].data?.getChatMessages.length === undefined && (
            <div className="bg-white mt-5 flex h-72">
              <div className="m-auto flex space-x-1 text-gray-500">
                <div className="material-icons">inbox</div>
                <p className="text-center">Nothing here yet</p>
              </div>
            </div>
          ))}

        {chatMessagesQuery[1].data?.getChatMessages.map((chatMessage) => (
          <ChatBubble
            key={chatMessage?.id}
            message={chatMessage?.body}
            isReceived={chatMessage?.userId !== claim.ID}
            displayName={
              chat?.chatMembers.find(
                (chatMember) => chatMember?.userId === chatMessage?.userId
              )?.displayName
            }
          />
        ))}
      </div>
      <hr />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex p-3 space-x-5 items-center">
          <div className="flex flex-1 space-x-2 items-center">
            <div>
              <button type="button" className="focus:outline-none">
                <p className="material-icons text-gray-600">attachment</p>
              </button>
            </div>
            <div className="flex-1">
              <input
                type="text"
                name="body"
                ref={register}
                className="w-full p-2 border-none"
                placeholder="Type a message here"
              />
            </div>
          </div>
          <div>
            <button type="submit" className="focus:outline-none">
              <p className="material-icons text-gray-600">send</p>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
