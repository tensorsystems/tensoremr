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

import { NextPageWithLayout } from "../../../_app";
import { useNotificationDispatch } from "@tensoremr/notification";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getConditionsBatch, getEncounter } from "../../../../api";
import React, { ReactElement, useState } from "react";
import { EncounterLayout } from "..";
import Button from "../../../../components/button";
import { Spinner } from "flowbite-react";
import { Condition, Encounter } from "fhir/r4";
import ProblemForm from "./problem-form";
import cn from "classnames";
import { Transition } from "@headlessui/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { format, parseISO } from "date-fns";

const Problems: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const notifDispatch = useNotificationDispatch();
  const bottomSheetDispatch = useBottomSheetDispatch();
  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;
  const [expandedIdx, setExpandedIdx] = useState<number>(-1);

  const { data, isLoading } = useSWR(encounter ? "conditions" : null, () =>
    getConditionsBatch({
      resourceType: "Bundle",
      id: "categories",
      type: "batch",
      entry: [
        {
          request: {
            method: "GET",
            url: `Condition?subject=${
              encounter.subject?.reference?.split("/")[1]
            }&category=encounter-diagnosis&category:not=problem-list-item&encounter=${
              encounter.id
            }`,
          },
        },
        {
          request: {
            method: "GET",
            url: `Condition?subject=${
              encounter.subject?.reference?.split("/")[1]
            }&category=problem-list-item&_sort=recorded-date`,
          },
        },
      ],
    })
  );

  const encounterConditions: Condition[] =
    data?.data?.entry
      ?.map((e) => e)
      ?.map((e) => e.resource)
      ?.at(0)
      ?.entry?.map((e) => ({
        ...e.resource,
        extension: [
          {
            valueString: "encounter",
            url: "uiType",
          },
        ],
      })) ?? [];

  const problemListConditions: Condition[] =
    data?.data?.entry
      ?.map((e) => e)
      ?.map((e) => e.resource)
      ?.at(1)
      ?.entry?.map((e) => ({
        ...e.resource,
        extension: [
          {
            valueString: "problem-list",
            url: "uiType",
          },
        ],
      })) ?? [];

  return (
    <div className="bg-slate-50 p-5">
      <p className="text-2xl text-gray-800 font-bold font-mono">Problems</p>

      <hr className="my-4" />

      <div className="mt-10">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-3">
            <div />
          </div>
          <div>
            <Button
              type="button"
              text="Add Problem"
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
                      <ProblemForm
                        encounter={encounter}
                        onSuccess={() => {
                          notifDispatch({
                            type: "showNotification",
                            notifTitle: "Success",
                            notifSubTitle: "Problem saved successfully",
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
                Problem
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
                Verification
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Severity
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
                Category
              </th>

              <th
                scope="col"
                className="px-6 py-3  text-left text-xs text-gray-500 uppercase tracking-wider"
              ></th>
            </tr>
          </thead>
          {!isLoading && (
            <tbody className="bg-white divide-y divide-gray-200">
              {encounterConditions
                ?.concat(problemListConditions)
                .map((e, i) => {
                  const uiType = e?.extension?.find(
                    (e) => e.url === "uiType"
                  )?.valueString;

                  return (
                    <React.Fragment key={e?.id}>
                      <tr
                        className="hover:bg-gray-100 cursor-pointer text-sm text-gray-900"
                        onClick={() => {
                          if (expandedIdx === i) {
                            setExpandedIdx(-1);
                          } else {
                            setExpandedIdx(i);
                          }
                        }}
                      >
                        <td className="px-6 py-4">{e?.code?.text}</td>
                        <td className="px-6 py-4">{e?.clinicalStatus?.text}</td>
                        <td className="px-6 py-4">
                          {e?.verificationStatus?.text}
                        </td>
                        <td className="px-6 py-4">{e?.severity?.text}</td>
                        <td className="px-6 py-4">
                          {e?.bodySite?.map((b) => b.text).join(", ")}
                        </td>
                        <td className="py-4 flex space-x-1 text-xs">
                          <span
                            key={i}
                            className={cn("rounded-full px-2 py-1 ml-1", {
                              "bg-green-100 text-green-800":
                                uiType === "encounter",
                              "bg-yellow-100 text-yellow-800":
                                uiType === "problem-list",
                            })}
                          >
                            {uiType === "encounter" && "Current Assessment"}
                            {uiType === "problem-list" && "Problem List Item"}
                          </span>
                        </td>
                        <td>
                          {expandedIdx === i ? (
                            <p className="material-icons md-expand_less"></p>
                          ) : (
                            <p className="material-icons md-expand_more"></p>
                          )}
                        </td>
                      </tr>
                      <Transition.Root
                        show={expandedIdx === i}
                        as={React.Fragment}
                        enter="ease-in duration-700"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-out duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <tr>
                          <td
                            colSpan={7}
                            className="px-20 py-4 text-sm bg-teal-50  shadow-inner rounded-md rounded-b"
                          >
                            <div className="">
                              <div>
                                <div className="ml-8">
                                  <div>
                                    <span className="font-semibold">
                                      Problem:{" "}
                                    </span>
                                    <span>{e?.code?.text}</span>
                                  </div>
                                  <div>
                                    <span className="font-semibold">
                                      Status:
                                    </span>{" "}
                                    <span>{e?.clinicalStatus?.text}</span>
                                  </div>
                                  {e?.verificationStatus && (
                                    <div>
                                      <span className="font-semibold">
                                        Verification:{" "}
                                      </span>{" "}
                                      <span>{e?.verificationStatus?.text}</span>
                                    </div>
                                  )}
                                  {e?.severity && (
                                    <div>
                                      <span className="font-semibold">
                                        Severity:{" "}
                                      </span>
                                      <span>{e?.severity?.text}</span>
                                    </div>
                                  )}
                                  {e?.bodySite && (
                                    <div>
                                      <span className="font-semibold">
                                        Body Site:{" "}
                                      </span>
                                      <span>
                                        {e?.bodySite
                                          ?.map((b) => b.text)
                                          .join(", ")}
                                      </span>
                                    </div>
                                  )}
                                  {e?.stage && (
                                    <div>
                                      <span className="font-semibold">
                                        Stage:{" "}
                                      </span>
                                      <span>
                                        {e?.stage
                                          ?.map((e) => e.summary?.text)
                                          .join(", ")}
                                      </span>
                                    </div>
                                  )}
                                  {e?.note && (
                                    <div>
                                      <span className="font-semibold">
                                        Note:{" "}
                                      </span>
                                      <span>
                                        {e?.note?.map((e) => e.text).join(", ")}
                                      </span>
                                    </div>
                                  )}
                                  {e?.onsetPeriod && (
                                    <div>
                                      <span className="font-semibold">
                                        Onset:{" "}
                                      </span>
                                      <span>
                                        From{" "}
                                        {format(
                                          parseISO(e?.onsetPeriod?.start),
                                          "MMM d, y"
                                        )}
                                      </span>
                                      {" to "}

                                      <span>
                                        {format(
                                          parseISO(e?.onsetPeriod?.end),
                                          "MMM d, y"
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  {e?.onsetAge && (
                                    <div>
                                      <span className="font-semibold">
                                        Age:{" "}
                                      </span>
                                      <span>{e?.onsetAge?.value}</span>
                                    </div>
                                  )}
                                  {e?.onsetString && (
                                    <div>
                                      <span className="font-semibold">
                                        Onset:{" "}
                                      </span>
                                      <span>{e?.onsetString}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="ml-8 mt-3">
                                <button
                                  type="button"
                                  className="flex items-center space-x-2 border px-3 rounded-md"
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
                                          <ProblemForm
                                            updateId={e?.id}
                                            encounter={encounter}
                                            onSuccess={() => {
                                              notifDispatch({
                                                type: "showNotification",
                                                notifTitle: "Success",
                                                notifSubTitle:
                                                  "Problem saved successfully",
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
                                  <PencilIcon className="w-4 h-4" />
                                  <span>Edit</span>
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      </Transition.Root>
                    </React.Fragment>
                  );
                })}
            </tbody>
          )}
        </table>
        {isLoading && (
          <div className="bg-white h-32 flex items-center justify-center w-full">
            <Spinner color="warning" aria-label="Appointments loading" />
          </div>
        )}
        {!isLoading && data?.data?.total === 0 && (
          <div className="bg-white shadow-md h-32 flex items-center justify-center w-full">
            <div className="m-auto flex space-x-1 text-gray-500">
              <div className="material-icons md-inbox"></div>
              <p className="text-center">Nothing here yet</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

Problems.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default Problems;
