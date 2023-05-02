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

import React, { Fragment, useEffect } from "react";
import { Actionbar } from "./action-bar";
import { Header } from "./header";
import { Footer } from "./footer";
import {
  useNotificationDispatch,
  useNotificationState,
} from "@tensoremr/notification";
import { Transition } from "@headlessui/react";
import classnames from "classnames";
import {
  useBottomSheetDispatch,
  useBottonSheetState,
} from "@tensoremr/bottomsheet";
import Drawer from "./drawer";
import { useRouter } from "next/router";

interface Props {
  children: JSX.Element;
}


export const MainLayout: React.FC<Props> = ({ children }) => {
  const notifDispatch = useNotificationDispatch();
  const { showNotification, notifTitle, notifSubTitle, variant } =
    useNotificationState();

  const bottomSheetDispatch = useBottomSheetDispatch();
  const { showBottomSheet, width, BottomSheetChildren } = useBottonSheetState();

  let sheetWidth: "small" | "medium" | "full" = "medium";
  if (width === "small") {
    sheetWidth = "small";
  } else if (width === "full") {
    sheetWidth = "full";
  }

  return (
    <div>
      <div className="sticky top-0 z-20">
        <div>
          <Header />
        </div>
        <div>
          <Actionbar />
        </div>
      </div>
      <main className="bg-gray-200 z-10">
        <div className="mx-auto max-w-full sm:px-6 lg:px-8">
          <div className="px-4 py-2 sm:px-0">
            <div>{children}</div>
          </div>
        </div>
      </main>
      <Footer />
      <Transition.Root
        show={showNotification}
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="h-10 fixed top-10 right-10 z-50">
          <div
            className={classnames(
              "flex p-5 bg-white rounded-md shadow-xl border-l-8 ",
              {
                "border-green-600": variant === "success",
                "border-yellow-600": variant !== "success",
              }
            )}
          >
            <div className="flex-initial">
              {variant === "success" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-7 w-7 text-green-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-7 w-7 text-red-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1 ml-2">
              <p className="font-bold text-gray-700">{notifTitle}</p>
              <p className="text-gray-500">{notifSubTitle}</p>
            </div>
            <div className="flex-initial ml-5">
              <button
                onClick={() => {
                  notifDispatch({ type: "hideNotification" });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6 text-gray-500"
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
          </div>
        </div>
      </Transition.Root>
      <Drawer
        width={sheetWidth}
        isOpen={showBottomSheet}
        setIsOpen={(open) => {
          if (!open) {
            bottomSheetDispatch({ type: "hide" });
          }
        }}
      >
        {BottomSheetChildren}
      </Drawer>
    </div>
  );
};
