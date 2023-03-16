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

import { ReactElement, useEffect, useState } from "react";
import { EncounterLayout } from "..";
import Button from "../../../../components/button";
import { NextPageWithLayout } from "../../../_app";
import MedicationForm from "./medication-form";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import useSWR from "swr";
import { getEncounter, getMedicationStatements } from "../../../../api";
import { useRouter } from "next/router";
import { Encounter, MedicationStatement } from "fhir/r4";
import { PaginationInput } from "../../../../model";
import React from "react";
import { format, parseISO } from "date-fns";
import { Transition } from "@headlessui/react";
import { TablePagination } from "../../../../components/table-pagination";
import { Spinner } from "flowbite-react";

const Medications: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const [page, setPage] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });
  const [expandedIdx, setExpandedIdx] = useState<number>(-1);

  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;
  const patientId = encounter?.subject?.reference?.split("/")[1];

  const medicationStatementsQuery = useSWR(
    patientId ? `medicationStatements` : null,
    () => getMedicationStatements(page, `subject=${patientId}`)
  );

  useEffect(() => {
    medicationStatementsQuery.mutate();
  }, [page]);

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

  const medicationStatements: MedicationStatement[] =
    medicationStatementsQuery?.data?.data?.entry?.map(
      (e) => e.resource as MedicationStatement
    ) ?? [];

  return (
    <div className="h-screen overflow-y-auto mb-10 bg-white p-4 rounded-sm shadow-md">
      <p className="text-2xl text-gray-800 font-bold font-mono">Medications</p>

      <hr className="mt-3" />
      <div>
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-4">
            <div />
          </div>
          <div>
            <Button
              type="button"
              text="Add Medication"
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
                      <MedicationForm
                        encounter={encounter}
                        onSuccess={() => {
                          notifDispatch({
                            type: "showNotification",
                            notifTitle: "Success",
                            notifSubTitle: "Medication saved successfully",
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
                Medication
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Sig
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Start
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                End
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3  text-left text-xs text-gray-500 uppercase tracking-wider"
              ></th>
            </tr>
          </thead>
          {!medicationStatementsQuery.isLoading &&
            !medicationStatementsQuery.isValidating && (
              <tbody className="bg-white divide-y divide-gray-200">
                {medicationStatements.map((e, i) => (
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
                      <td className="px-6 py-4">
                        {e?.medicationCodeableConcept?.text}
                      </td>
                      <td className="px-6 py-4">
                        {e?.dosage?.at(0)?.timing?.code?.text}
                      </td>
                      <td className="px-6 py-4">
                        {e?.dosage?.at(0)?.timing?.repeat?.boundsPeriod?.start
                          ? format(
                              parseISO(
                                e?.dosage?.at(0)?.timing?.repeat?.boundsPeriod
                                  ?.start
                              ),
                              "MMM d, y"
                            )
                          : ""}
                      </td>
                      <td className="px-6 py-4">
                        {e?.dosage?.at(0)?.timing?.repeat?.boundsPeriod?.end
                          ? format(
                              parseISO(
                                e?.dosage?.at(0)?.timing?.repeat?.boundsPeriod
                                  ?.end
                              ),
                              "MMM d, y"
                            )
                          : ""}
                      </td>
                      <td className="px-6 py-4">{e?.category?.text}</td>
                      <td className="px-6 py-4">{e?.status}</td>
                      <td className="px-6 py-4 flex items-center justify-center">
                        {expandedIdx === i ? (
                          <p className="material-symbols-outlined">expand_less</p>
                        ) : (
                          <p className="material-symbols-outlined">expand_more</p>
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
                          className="px-20 py-4 text-sm bg-teal-50 shadow-inner rounded-md rounded-b"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex space-x-2 items-center text-gray-700">
                              <span className="material-symbols-outlined text-gray-500">medication</span>
                            </div>
                            <div>
                              {e?.dosage?.at(0)?.patientInstruction && (
                                <div>
                                  <span className="font-semibold">
                                    Additional Instructions:
                                  </span>{" "}
                                  <span>
                                    {e?.dosage?.at(0)?.patientInstruction}
                                  </span>
                                </div>
                              )}
                              {e?.dosage?.at(0)?.additionalInstruction && (
                                <div>
                                  <span className="font-semibold">
                                    Additional Instructions:
                                  </span>{" "}
                                  <span>
                                    {
                                      e?.dosage
                                        ?.at(0)
                                        ?.additionalInstruction?.at(0)?.text
                                    }
                                  </span>
                                </div>
                              )}
                              {e?.dosage?.at(0)?.method && (
                                <div>
                                  <span className="font-semibold">Method:</span>{" "}
                                  <span>{e?.dosage?.at(0)?.method?.text}</span>
                                </div>
                              )}
                              {e?.note?.length > 0 && (
                                <div>
                                  <span className="font-semibold">Note:</span>{" "}
                                  <span>
                                    {e?.note?.map((n) => n.text).join(", ")}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </Transition.Root>
                  </React.Fragment>
                ))}
              </tbody>
            )}
        </table>
        {(medicationStatementsQuery?.isLoading ||
          medicationStatementsQuery?.isValidating) && (
          <div className="bg-white h-32 flex items-center justify-center w-full">
            <Spinner color="warning" aria-label="Appointments loading" />
          </div>
        )}
        {!medicationStatementsQuery?.isLoading &&
          !medicationStatementsQuery?.isValidating &&
          medicationStatements.length === 0 && (
            <div className="bg-white shadow-md h-32 flex items-center justify-center w-full">
              <div className="m-auto flex space-x-1 text-gray-500">
                <div className="material-symbols-outlined">inbox</div>
                <p className="text-center">Nothing here yet</p>
              </div>
            </div>
          )}
        {!medicationStatementsQuery?.isLoading &&
          !medicationStatementsQuery?.isValidating && (
            <div className="shadow-md">
              <TablePagination
                totalCount={medicationStatementsQuery?.data?.data?.total ?? 0}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            </div>
          )}
      </div>
    </div>
  );
};

Medications.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default Medications;
