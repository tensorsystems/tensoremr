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

import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import { ReactElement } from "react";
import { AdminLayout } from "..";
import { NextPageWithLayout } from "../../_app";
import cn from "classnames";
import CreateUserForm from "./create-user-form";
import Link from "next/link";

const Users: NextPageWithLayout = () => {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  return (
    <div className="bg-white rounded-md shadowm-md p-4">
      <div>
        <Link
          href={`${process.env.NX_PUBLIC_APP_SERVER_URL}/api/auth/dashboard`}
          target="_blank"
          className="text-blue-600 flex items-center space-x-1"
        >
          <span className="material-symbols-outlined">open_in_new</span>
          <span className="underline text-sm">User Management Dashboard</span>
        </Link>
      </div>

      <div className="mt-4 text-sm">
        <button
          className="bg-teal-500 px-4 py-2 rounded-md text-white flex items-center space-x-3"
          onClick={() => {
            bottomSheetDispatch({
              type: "show",
              width: "full",
              children: (
                <div className="px-10 py-4">
                  <div className="">
                    <div className="float-right">
                      <button
                        onClick={() => {
                          bottomSheetDispatch({
                            type: "hide",
                          });
                        }}
                      >
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
                    <CreateUserForm
                      onSuccess={() => {
                        bottomSheetDispatch({
                          type: "hide",
                        });

                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "User has been created successfully",
                          variant: "success",
                        });
                      }}
                    />
                  </div>
                </div>
              ),
            });
          }}
        >
          <span className="material-symbols-outlined">add</span>
          <span> Create New User</span>
        </button>
      </div>
    </div>
  );
};

Users.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Users;
