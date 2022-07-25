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
import { gql, useQuery } from '@apollo/client';
import { useBottomSheetDispatch } from '@tensoremr/bottomsheet';
import { Query } from '@tensoremr/models';
import { ChatComponent } from './ChatComponent';
import { ChatList } from './ChatList';
import { NewChatDialog } from './NewChatDialog';
import {
  Route,
  useRouteMatch,
  Switch,
  matchPath,
  useHistory,
} from 'react-router-dom';
import classnames from 'classnames';

const GET_USER_CHATS = gql`
  query GetUserChats {
    getUserChats {
      id
      recentMessage
      chatMembers {
        id
        chatId
        userId
        displayName
        photoUrl
      }
      chatUnreadMessages {
        id
        userId
        createdAt
      }
      chatMutes {
        id
        userId
      }
      createdAt
      updatedAt
    }
  }
`;

export const ChatsPage: React.FC = () => {
  const history = useHistory();
  const match = useRouteMatch();
  const bottomSheetDispatch = useBottomSheetDispatch();
  const { data, refetch } = useQuery<Query, any>(GET_USER_CHATS);

  const chatMatch = matchPath<{ id: 'string' }>(history.location.pathname, {
    path: '/chats/:id',
  });

  const selectedChat = data?.getUserChats.find(
    (e) => e?.id.toString() === chatMatch?.params.id
  );

  return (
    <div className="flex space-x-10 h-screen">
      <div className={classnames('w-1/3')}>
        <div className="flex justify-between">
          <div className="text-3xl text-gray-700 font-semibold">Messages</div>
          <div>
            <button
              className="flex space-x-2 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 px-4 py-2 text-white rounded-md shadow-lg"
              onClick={() => {
                bottomSheetDispatch({
                  type: 'show',
                  snapPoint: 0,
                  children: (
                    <NewChatDialog
                      onNewChat={(recipientId) => {
                        history.push(`/chats/new?userId=${recipientId}`);
                        bottomSheetDispatch({ type: 'hide' });
                      }}
                      onExistingChat={(chatId) => {
                        refetch();
                        history.push(`/chats/${chatId}`);
                        bottomSheetDispatch({ type: 'hide' });
                      }}
                      onCancel={() => bottomSheetDispatch({ type: 'hide' })}
                    />
                  ),
                });
              }}
            >
              <p className="material-icons">add</p>
              <p>New Chat</p>
            </button>
          </div>
        </div>

        <div className="mt-4 relative">
          <input
            type="search"
            className="w-full py-3 px-4 shadow-lg rounded-md focus:outline-none border-none"
            placeholder="Search"
          />
          <button type="button" className="absolute right-0 top-0 mt-3 mr-4">
            <p className="material-icons">search</p>
          </button>
        </div>

        <div className="mt-4">
          {data?.getUserChats.length === 0 ? (
            <div className="bg-white mt-5 flex h-72 rounded-md shadow-lg">
              <div className="m-auto flex space-x-1 text-gray-500">
                <div className="material-icons">inbox</div>
                <p className="text-center">Nothing here yet</p>
              </div>
            </div>
          ) : (
            <div>
              <ChatList
                chats={data?.getUserChats}
                selectedChatId={chatMatch?.params.id}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex-1">
        <Switch>
          <Route path={`${match.path}/new`}>
            <ChatComponent isNewChat={true} onRefresh={() => refetch()} />
          </Route>
          <Route path={`${match.path}/:chatId`}>
            {selectedChat && (
              <ChatComponent
                chat={selectedChat}
                isNewChat={false}
                onRefresh={() => refetch()}
              />
            )}
          </Route>

          <Route path={match.path}>
            <div className="bg-white mt-5 flex h-full shadow-lg">
              <div className="m-auto flex space-x-1 text-gray-500">
                <div className="material-icons">inbox</div>
                <p className="text-center">Select a chat</p>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    </div>
  );
};
