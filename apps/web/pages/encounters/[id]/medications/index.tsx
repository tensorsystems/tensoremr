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

import { ReactElement, useState } from "react";
import { EncounterLayout } from "..";
import { NextPageWithLayout } from "../../../_app";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import useSWR from "swr";
import {
  getBatch,
  getEncounter,
} from "../../../../api";
import { useRouter } from "next/router";
import {
  Encounter,
  MedicationAdministration,
  MedicationRequest,
} from "fhir/r4";
import React from "react";
import { Transition } from "@headlessui/react";
import { Spinner } from "flowbite-react";
import MedicationRequestForm from "./medication-request-form";
import MedicationAdministrationForm from "./medication-administration-form";
import { format, parseISO } from "date-fns";
import { PencilIcon } from "@heroicons/react/24/outline";

interface Medication {
  id: string;
  medication: string;
  category: string;
  status: string;
  dose: string;
  note: string;
  type: "prescription" | "administration";
  resource: MedicationRequest | MedicationAdministration;
}

const Medications: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;
  
  const medicationsQuery = useSWR(encounter ? "medications" : null, () =>
    getBatch({
      resourceType: "Bundle",
      id: "medications",
      type: "batch",
      entry: [
        {
          request: {
            method: "GET",
            url: `MedicationRequest?encounter=${encounter.id}`,
          },
        },
        {
          request: {
            method: "GET",
            url: `MedicationAdministration?context=${encounter.id}`,
          },
        },
      ],
    })
  );

  const prescriptions: Medication[] =
    medicationsQuery?.data?.data?.entry
      ?.map((e) => e)
      ?.map((e) => e.resource)
      ?.at(0)
      ?.entry?.map((e) => ({
        id: e.resource?.id,
        medication: e.resource?.medicationCodeableConcept?.text ?? "",
        category: e.resource?.category?.map((c) => c.text).join(", ") ?? "",
        status: e.resource?.status ?? "",
        dose: e?.resource?.dosageInstruction
          ?.map(
            (d) =>
              `${d?.timing?.code?.text} ${
                d?.additionalInstruction?.map((a) => a.text)?.join(",") ?? ""
              }`
          )
          ?.join(", "),
        note: e?.resource?.note?.map((n) => n.text)?.join(", "),
        type: "prescription",
        resource: e.resource,
      })) ?? [];

  const administrations: Medication[] =
    medicationsQuery?.data?.data?.entry
      ?.map((e) => e)
      ?.map((e) => e.resource)
      ?.at(1)
      ?.entry?.map((e) => ({
        id: e.resource?.id,
        medication: e.resource?.medicationCodeableConcept?.text ?? "",
        category: e.resource?.category?.text ?? "",
        status: e.resource?.status ?? "",
        note: e?.resource?.note?.map((n) => n.text)?.join(", "),
        dose: e?.resource?.dosage?.dose?.value?.toString() ?? "",
        type: "administration",
        resource: e.resource,
      })) ?? [];

  return (
    <div className="h-screen overflow-y-auto mb-10 bg-white p-4 rounded-sm shadow-md">
      <p className="text-2xl text-gray-800 font-bold font-mono">Medications</p>

      <hr className="mt-3" />
      <div>
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-4">
            <div />
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <button
                type="button"
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
                        <MedicationAdministrationForm
                          encounter={encounter}
                          onSuccess={() => {
                            notifDispatch({
                              type: "showNotification",
                              notifTitle: "Success",
                              notifSubTitle:
                                "Medication Administration saved successfully",
                              variant: "success",
                            });
                            bottomSheetDispatch({ type: "hide" });
                          }}
                        />
                      </div>
                    ),
                  });
                }}
                className="shadow-md rounded-md px-5 py-2 font-semibold bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white flex items-center space-x-1"
              >
                <span className="material-symbols-outlined">vaccines</span>
                <span>Administer</span>
              </button>
            </div>
            <div>
              <button
                type="button"
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
                        <MedicationRequestForm
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
                className="shadow-md rounded-md px-5 py-2 font-semibold bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 text-white flex items-center space-x-1"
              >
                <span className="material-symbols-outlined">medication</span>
                <span>Prescribe</span>
              </button>
            </div>
          </div>
        </div>

        <MedicationTable
          isLoading={
            medicationsQuery?.isLoading || medicationsQuery?.isValidating
          }
          items={prescriptions?.concat(administrations)}
          onEdit={(resource) => {
            if (resource.resourceType === "MedicationRequest") {
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
                    <MedicationRequestForm
                      updateId={resource?.id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Medication saved successfully",
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
            }

            if (resource.resourceType === "MedicationAdministration") {
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
                    <MedicationAdministrationForm
                      updateId={resource?.id}
                      encounter={encounter}
                      onSuccess={() => {
                        notifDispatch({
                          type: "showNotification",
                          notifTitle: "Success",
                          notifSubTitle: "Medication saved successfully",
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
            }
          }}
        />
        {(medicationsQuery?.isLoading || medicationsQuery?.isValidating) && (
          <div className="bg-white h-32 flex items-center justify-center w-full">
            <Spinner color="warning" aria-label="Medications loading" />
          </div>
        )}
        {!medicationsQuery?.isLoading &&
          !medicationsQuery?.isValidating &&
          prescriptions.length === 0 &&
          administrations.length === 0 && (
            <div className="bg-white shadow-md h-32 flex items-center justify-center w-full">
              <div className="m-auto flex space-x-1 text-gray-500">
                <div className="material-symbols-outlined">inbox</div>
                <p className="text-center">Nothing here yet</p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

interface Props {
  isLoading: boolean;
  items: Medication[];
  onEdit: (resource: MedicationAdministration | MedicationRequest) => void;
}

function MedicationTable({ items, isLoading, onEdit }: Props) {
  const [expandedIdx, setExpandedIdx] = useState<number>(-1);

  return (
    <table className="min-w-full divide-y divide-gray-200 shadow-md">
      <thead>
        <tr className="bg-gray-50">
          <th
            scope="col"
            className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
          >
            Type
          </th>
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
            className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
          >
            Dose
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
      {!isLoading && (
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map((e, i) => {
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
                  <td className="px-6 py-4">
                    {e?.type === "prescription"
                      ? "Prescription"
                      : "Administered"}
                  </td>
                  <td className="px-6 py-4">{e?.medication}</td>
                  <td className="px-6 py-4">{e?.category}</td>
                  <td className="px-6 py-4">{e?.status}</td>
                  <td className="px-6 py-4">{e?.dose}</td>
                  <td className="px-6 py-4">{e?.note}</td>
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
                          <span className="material-symbols-outlined text-gray-500">
                            {e?.resource?.resourceType === "MedicationRequest"
                              ? "medication"
                              : "vaccines"}
                          </span>
                        </div>
                        <div>
                          {e?.medication && (
                            <div>
                              <span className="font-semibold">Medication:</span>{" "}
                              <span>{e?.medication}</span>
                            </div>
                          )}
                          {e?.category && (
                            <div>
                              <span className="font-semibold">Category:</span>{" "}
                              <span>{e?.category}</span>
                            </div>
                          )}
                          {e?.resource?.resourceType === "MedicationRequest" &&
                            e?.resource?.intent && (
                              <div>
                                <span className="font-semibold">Intent:</span>{" "}
                                <span>{e?.resource?.intent}</span>
                              </div>
                            )}
                          {e?.resource?.resourceType === "MedicationRequest" &&
                            e?.resource?.priority && (
                              <div>
                                <span className="font-semibold">Priority:</span>{" "}
                                <span>{e?.resource?.priority}</span>
                              </div>
                            )}
                          {e?.resource?.resourceType === "MedicationRequest" &&
                            e?.resource?.dispenseRequest?.initialFill?.quantity
                              ?.value && (
                              <div>
                                <span className="font-semibold">
                                  Initial fill quantity:
                                </span>{" "}
                                <span>
                                  {
                                    e?.resource?.dispenseRequest?.initialFill
                                      ?.quantity?.value
                                  }
                                </span>
                              </div>
                            )}
                          {e?.resource?.resourceType === "MedicationRequest" &&
                            e?.resource?.dispenseRequest?.initialFill?.duration
                              ?.value && (
                              <div>
                                <span className="font-semibold">
                                  Initial fill quantity:
                                </span>{" "}
                                <span>
                                  {
                                    e?.resource?.dispenseRequest?.initialFill
                                      ?.duration?.value
                                  }
                                </span>
                              </div>
                            )}
                          {e?.resource?.resourceType === "MedicationRequest" &&
                            e?.resource?.dispenseRequest?.dispenseInterval
                              ?.value && (
                              <div>
                                <span className="font-semibold">
                                  Dispense interval:
                                </span>{" "}
                                <span>
                                  {
                                    e?.resource?.dispenseRequest
                                      ?.dispenseInterval?.value
                                  }
                                </span>
                              </div>
                            )}
                          {e?.resource?.resourceType === "MedicationRequest" &&
                            e?.resource?.dispenseRequest?.quantity?.value && (
                              <div>
                                <span className="font-semibold">Quantity:</span>{" "}
                                <span>
                                  {
                                    e?.resource?.dispenseRequest?.quantity
                                      ?.value
                                  }
                                </span>
                              </div>
                            )}
                          {e?.resource?.resourceType === "MedicationRequest" &&
                            e?.resource?.dispenseRequest?.validityPeriod && (
                              <div>
                                <span className="font-semibold">
                                  Validity period:{" "}
                                </span>
                                <span>
                                  From{" "}
                                  {format(
                                    parseISO(
                                      e?.resource?.dispenseRequest
                                        ?.validityPeriod?.start
                                    ),
                                    "MMM d, y"
                                  )}
                                </span>
                                {" to "}

                                <span>
                                  {format(
                                    parseISO(
                                      e?.resource?.dispenseRequest
                                        ?.validityPeriod?.end
                                    ),
                                    "MMM d, y"
                                  )}
                                </span>
                              </div>
                            )}
                          {e?.resource?.resourceType === "MedicationRequest" &&
                            e?.resource?.substitution?.allowedBoolean && (
                              <div>
                                <span className="font-semibold">
                                  Substition allowed:
                                </span>{" "}
                                <span>Yes</span>
                              </div>
                            )}
                          {e?.resource?.resourceType ===
                            "MedicationAdministration" &&
                            e?.resource?.dosage?.site?.text && (
                              <div>
                                <span className="font-semibold">Site:</span>{" "}
                                <span>{e?.resource?.dosage?.site?.text}</span>
                              </div>
                            )}
                          {e?.resource?.resourceType ===
                            "MedicationAdministration" &&
                            e?.resource?.dosage?.route?.text && (
                              <div>
                                <span className="font-semibold">Route:</span>{" "}
                                <span>{e?.resource?.dosage?.route?.text}</span>
                              </div>
                            )}
                          {e?.resource?.resourceType ===
                            "MedicationAdministration" &&
                            e?.resource?.dosage?.site?.text && (
                              <div>
                                <span className="font-semibold">Method:</span>{" "}
                                <span>{e?.resource?.dosage?.method?.text}</span>
                              </div>
                            )}
                          {e?.status && (
                            <div>
                              <span className="font-semibold">Status:</span>{" "}
                              <span>{e?.status}</span>
                            </div>
                          )}
                          {e?.dose && (
                            <div>
                              <span className="font-semibold">Dose:</span>{" "}
                              <span>{e?.dose}</span>
                            </div>
                          )}
                          {e?.note?.length > 0 && (
                            <div>
                              <span className="font-semibold">Note:</span>{" "}
                              <span>{e?.note}</span>
                            </div>
                          )}
                          <div className="mt-3">
                            <button
                              type="button"
                              className="flex items-center space-x-2 border px-3 rounded-md"
                              onClick={() => {
                                onEdit(e?.resource);
                              }}
                            >
                              <PencilIcon className="w-4 h-4" />
                              <span>Edit</span>
                            </button>
                          </div>
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
  );
}

Medications.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default Medications;
