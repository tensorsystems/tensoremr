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

import React, { useEffect } from 'react';

type Action =
  | { type: 'show'; notifTitle: string; notifSubTitle: string; variant: string }
  | { type: 'hide' };
type Dispatch = (action: Action) => void;
interface State {
  showNotification: boolean;
  notifTitle: string;
  notifSubTitle: string;
  variant: string;
}
type NotificationProviderProps = { children: React.ReactNode };

const NotificationStateContext = React.createContext<State | undefined>(
  undefined
);
const NotificationDispatchContext = React.createContext<Dispatch | undefined>(
  undefined
);

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'show': {
      return {
        showNotification: true,
        notifTitle: action.notifTitle,
        notifSubTitle: action.notifSubTitle,
        variant: action.variant,
      };
    }
    case 'hide': {
      return {
        showNotification: false,
        notifTitle: '',
        notifSubTitle: '',
        variant: '',
      };
    }
    default:
      return state;
  }
}

function NotificationProvider({ children }: NotificationProviderProps) {
  const [state, dispatch] = React.useReducer(reducer, {
    showNotification: false,
    notifTitle: '',
    notifSubTitle: '',
    variant: '',
  });

  useEffect(() => {
    if (state.showNotification === true) {
      const timer = setTimeout(() => {
        dispatch({ type: 'hide' });
      }, 6000);
      return () => clearTimeout(timer);
    }

    return () => null
  }, [state]);

  return (
    <NotificationStateContext.Provider value={state}>
      <NotificationDispatchContext.Provider value={dispatch}>
        {children}
      </NotificationDispatchContext.Provider>
    </NotificationStateContext.Provider>
  );
}

function useNotificationState() {
  const context = React.useContext(NotificationStateContext);
  if (context === undefined) {
    throw new Error(
      'useNotificationState must be used within a NotificationProvider'
    );
  }
  return context;
}

function useNotificationDispatch() {
  const context = React.useContext(NotificationDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useNotificationDispatch must be used within a NotificationProvider'
    );
  }
  return context;
}

export { NotificationProvider, useNotificationState, useNotificationDispatch };
