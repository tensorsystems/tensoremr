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

import React from "react";

type Action =
  | { type: "show"; children: any; snapPoint: number }
  | { type: "hide" };

interface State {
  showBottomSheet: boolean;
  snapPoint: number;
  BottomSheetChildren: any | undefined;
}

type Dispatch = (action: Action) => void;

type BottomSheetProviderProps = { children: React.ReactNode };

const BottomSheetStateContext =
  React.createContext<State | undefined>(undefined);

const BottomSheetDispatchContext =
  React.createContext<Dispatch | undefined>(undefined);

function reducer(state: State, action: Action) {
  switch (action.type) {
    case "show": {
      return {
        showBottomSheet: true,
        snapPoint: action.snapPoint,
        BottomSheetChildren: action.children,
      };
    }
    case "hide": {
      return {
        showBottomSheet: false,
        snapPoint: 0,
        BottomSheetChildren: undefined,
      };
    }
    default:
      return state;
  }
}

function BottomSheetProvider({ children }: BottomSheetProviderProps) {
  const [state, dispatch] = React.useReducer(reducer, {
    showBottomSheet: false,
    snapPoint: 0,
    BottomSheetChildren: undefined,
  });

  return (
    <BottomSheetStateContext.Provider value={state}>
      <BottomSheetDispatchContext.Provider value={dispatch}>
        {children}
      </BottomSheetDispatchContext.Provider>
    </BottomSheetStateContext.Provider>
  );
}

function useBottonSheetState() {
  const context = React.useContext(BottomSheetStateContext);
  if (context === undefined) {
    throw new Error(
      "useBottonSheetState must be used within a BottomSheetProvider"
    );
  }

  return context;
}

function useBottomSheetDispatch() {
  const context = React.useContext(BottomSheetDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useBottomSheetDispatch must be used within a NotificationProvider"
    );
  }

  return context;
}

export { BottomSheetProvider, useBottonSheetState, useBottomSheetDispatch };
