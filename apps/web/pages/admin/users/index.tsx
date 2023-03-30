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
import { getAllUsers } from "../../../api";
import { ReactElement, useEffect, useState } from "react";
import useSWR from "swr";
import { AdminLayout } from "..";
import { NextPageWithLayout } from "../../_app";
import UserCreateForm from "./create-user-form";
import cn from "classnames";
import CreateUserForm from "./create-user-form";
import { Spinner } from "flowbite-react";

const Users: NextPageWithLayout = () => {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const [searchTerm, setSearchTerm] = useState<string>("");

  const usersQuery = useSWR("users", () => getAllUsers(searchTerm));

  useEffect(() => {
    const error = usersQuery?.error;
    if (error) {
      notifDispatch({
        type: "showNotification",
        notifTitle: "Error",
        notifSubTitle: error.message ?? "",
        variant: "failure",
      });
    }
  }, [usersQuery?.error]);

  useEffect(() => {
    usersQuery.mutate();
  }, [searchTerm]);

  const handleSearchTermChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = evt.target.value;
    setSearchTerm(value);
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  scope="col"
                  colSpan={3}
                  className="px-6 py-3 bg-teal-700 text-left text-xs font-medium text-gray-50 uppercase tracking-wider"
                >
                  Users
                </th>

                <th
                  scope="col"
                  className="px-6 py-3 bg-teal-700 text-gray-100 text-right"
                >
                  <button
                    onClick={() =>
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
                                    notifSubTitle:
                                      "User has been created successfully",
                                    variant: "success",
                                  });

                                  usersQuery.mutate();
                                }}
                              />
                            </div>
                          </div>
                        ),
                      })
                    }
                    className="uppercase bg-teal-800 hover:bg-teal-600 py-1 px-2 rounded-md text-sm"
                  >
                    <div className="flex items-center">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="h-6 w-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="font-semibold">Add</div>
                    </div>
                  </button>
                </th>
              </tr>
              <tr>
                <th colSpan={4}>
                  <input
                    type="text"
                    name="search"
                    placeholder="Search"
                    className="p-3 pl-4 block w-full sm:text-md border-gray-300"
                    onChange={handleSearchTermChange}
                  />
                </th>
              </tr>
              <tr className="bg-gray-50">
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  User Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usersQuery.data?.data?.map((value: any) => (
                <tr
                  key={value?.id}
                  className="hover:bg-gray-100 cursor-pointer"
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
                            <UserCreateForm
                              updateId={value?.id}
                              onSuccess={() => {
                                bottomSheetDispatch({
                                  type: "hide",
                                });

                                notifDispatch({
                                  type: "showNotification",
                                  notifTitle: "Success",
                                  notifSubTitle:
                                    "User has been updated successfully",
                                  variant: "success",
                                });

                                usersQuery.mutate();
                              }}
                            />
                          </div>
                        </div>
                      ),
                    });
                  }}
                >
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {`${value?.traits?.name?.prefix ?? ""} ${
                      value?.traits?.name?.given
                    } ${value?.traits?.name?.family}`}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {value?.traits?.email}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    {value?.traits?.role}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900">
                    <span
                      className={cn(
                        "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
                        {
                          "bg-yellow-100 text-yellow-800":
                            value?.status !== "active",
                        },
                        {
                          "bg-green-100 text-green-800":
                            value?.status === "active",
                        }
                      )}
                    >
                      {value?.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {usersQuery.isLoading && (
            <div className="flex items-center justify-center w-full py-10 bg-white">
              <Spinner color="warning" aria-label="Button loading" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

Users.getLayout = function getLayout(page: ReactElement) {
  return <AdminLayout>{page}</AdminLayout>;
};

export default Users;
