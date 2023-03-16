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

import { useRouter } from "next/router";
import { NextPageWithLayout } from "../../../_app";
import { useNotificationDispatch } from "@tensoremr/notification";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { ReactElement, useState } from "react";
import { EncounterLayout } from "..";
import Button from "../../../../components/button";
import useSWR from "swr";
import { getEncounter, getServiceRequests } from "../../../../api";
import { Encounter, ServiceRequest } from "fhir/r4";
import { PaginationInput } from "../../../../model";
import { Spinner } from "flowbite-react";
import { TablePagination } from "../../../../components/table-pagination";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { CheckBadgeIcon, PencilIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import LabOrderForm from "./order-form";

const Laboratory: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const notifDispatch = useNotificationDispatch();
  const bottomSheetDispatch = useBottomSheetDispatch();
  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;

  const [page, setPage] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });

  const ordersQuery = useSWR(encounter?.id ? `labServiceRequests` : null, () =>
    getServiceRequests(page, `encounter=${encounter.id}&category=108252007`)
  );

  const orders: ServiceRequest[] =
    ordersQuery?.data?.data?.entry?.map((e) => e.resource as ServiceRequest) ??
    [];

  const handleNext = () => {
    setPage({
      ...page,
      page: page.page + 1,
    });
  };

  const handlePrevious = () => {
    if (page.page > 1) {
      setPage({
        ...page,
        page: page.page - 1,
      });
    }
  };

  return (
    <div className="bg-slate-50 p-5">
      <p className="text-2xl text-gray-800 font-bold font-mono">
        Laboratory
      </p>

      <hr className="my-4" />

      <div>
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-4">
            <div />
          </div>
          <div>
            <Button
              type="button"
              text="Add Procedure"
              icon="add"
              variant="filled"
              onClick={() => {
                bottomSheetDispatch({
                  type: "show",
                  width: "medium",
                  children: (
                    <div className="px-8 py-6">
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
                      <LabOrderForm
                        encounter={encounter}
                        onSuccess={() => {
                          notifDispatch({
                            type: "showNotification",
                            notifTitle: "Success",
                            notifSubTitle: "Lab order saved successfully",
                            variant: "success",
                          });
                          bottomSheetDispatch({ type: "hide" });
                        }}
                      />
                    </div>
                  ),
                });
              }}
            />
          </div>
        </div>
        <table className="min-w-full divide-y divide-gray-200 shadow-md">
          <thead>
            <tr className="bg-gray-50">
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Lab
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Priority
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Body Site
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Note
              </th>
              <th
                scope="col"
                className="px-6 py-3  text-left text-xs text-gray-500 uppercase tracking-wider"
              ></th>
            </tr>
          </thead>
          {!ordersQuery.isLoading && (
            <tbody className="bg-white divide-y divide-gray-200">
              {orders?.map((e) => (
                <tr
                  key={e?.id}
                  className="hover:bg-gray-100 cursor-pointer text-sm text-gray-900"
                >
                  <td className="px-6 py-4">{e?.code?.text}</td>
                  <td className="px-6 py-4">{e?.status}</td>
                  <td className="px-6 py-4">{e?.priority}</td>
                  <td className="px-6 py-4">
                    {e?.bodySite?.map((b) => b.text).join(", ")}
                  </td>
                  <td className="px-6 py-4">
                    {e?.note?.map((n) => n.text).join(", ")}
                  </td>
                  <td className="z-50">
                    <Menu>
                      {({ open }) => (
                        <>
                          <span className="rounded-md shadow-sm">
                            <Menu.Button className="flex items-center space-x-2 justify-center bg-teal-500 rounded-md px-2 py-1">
                              <ChevronDownIcon className="h-4 w-4 text-teal-100" />
                              <p className="text-sm text-teal-100">Options</p>
                            </Menu.Button>
                          </span>

                          <Transition
                            show={open}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                          >
                            <Menu.Items
                              static
                              className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg  z-50"
                            >
                              <div className="py-1 z-50">
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                      className={`${
                                        active
                                          ? "bg-gray-100 text-gray-900"
                                          : "text-gray-700"
                                      } flex items-center space-x-2 w-full px-4 py-2 text-sm leading-5 text-left`}
                                      onClick={() => {
                                        bottomSheetDispatch({
                                          type: "show",
                                          width: "medium",
                                          children: (
                                            <div className="px-8 py-6">
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
                                              <LabOrderForm
                                                updateId={e.id}
                                                encounter={encounter}
                                                onSuccess={() => {
                                                  notifDispatch({
                                                    type: "showNotification",
                                                    notifTitle: "Success",
                                                    notifSubTitle:
                                                      "Lab order saved successfully",
                                                    variant: "success",
                                                  });
                                                  bottomSheetDispatch({
                                                    type: "hide",
                                                  });
                                                }}
                                              />
                                            </div>
                                          ),
                                        });
                                      }}
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                      <p>Edit</p>
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <Link
                                      href={`/orders/${e?.id}`}
                                      target="_blank"
                                      className={`${
                                        active
                                          ? "bg-gray-100 text-gray-900"
                                          : "text-gray-700"
                                      } flex items-center space-x-2 w-full px-4 py-2 text-sm leading-5 text-left`}
                                    >
                                      <CheckBadgeIcon className="h-4 w-4" />
                                      <p>Results</p>
                                    </Link>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                        </>
                      )}
                    </Menu>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {ordersQuery.isLoading && (
          <div className="bg-white h-32 flex items-center justify-center w-full">
            <Spinner color="warning" aria-label="Appointments loading" />
          </div>
        )}
        {!ordersQuery.isLoading && orders.length === 0 && (
          <div className="bg-white shadow-md h-32 flex items-center justify-center w-full">
            <div className="m-auto flex space-x-1 text-gray-500">
              <div className="material-symbols-outlined">inbox</div>
              <p className="text-center">Nothing here yet</p>
            </div>
          </div>
        )}
        {!ordersQuery.isLoading && (
          <div className="shadow-md">
            <TablePagination
              totalCount={ordersQuery?.data?.data?.total ?? 0}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </div>
        )}
      </div>
    </div>
  );
};

Laboratory.getLayout = function getLayout(page: ReactElement) {
    return <EncounterLayout>{page}</EncounterLayout>
}

export default Laboratory;