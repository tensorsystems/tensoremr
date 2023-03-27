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
import { getEncounter, getVisionPrescriptions } from "../../../../api";
import { useRouter } from "next/router";
import { Encounter, VisionPrescription } from "fhir/r4";
import React from "react";
import { Transition } from "@headlessui/react";
import { Spinner } from "flowbite-react";
import { format, parseISO } from "date-fns";
import { PencilIcon } from "@heroicons/react/24/outline";
import Button from "../../../../components/button";
import VisionPrescriptionForm from "./vision-prescription-form";
import { PaginationInput } from "../../../../model";
import { TablePagination } from "../../../../components/table-pagination";
import FhirPractitionerName from "../../../../components/fhir-practitioner-name";

const Vision: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const [expandedIdx, setExpandedIdx] = useState<number>(-1);

  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();

  const encounterQuery = useSWR(`encounters/${id}`, () =>
    getEncounter(id as string)
  );

  const encounter: Encounter | undefined = encounterQuery?.data?.data;

  const [page, setPage] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });

  const prescriptionsQuery = useSWR(
    encounter?.id ? "visionPrescriptions" : null,
    () =>
      getVisionPrescriptions(
        page,
        `patient=${encounter?.subject?.reference?.split("/")[1]}`
      )
  );

  const prescriptions: VisionPrescription[] =
    prescriptionsQuery?.data?.data?.entry?.map(
      (e) => e.resource as VisionPrescription
    ) ?? [];

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
    <div className="h-screen overflow-y-auto mb-10 bg-white p-4 rounded-sm shadow-md">
      <p className="text-2xl text-gray-800 font-bold font-mono">
        Vision Prescription
      </p>
      <hr className="mt-3" />
      <div className="mt-10">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-3">
            <div />
          </div>
          <div>
            <Button
              type="button"
              text="Add Prescription"
              icon="add"
              variant="filled"
              onClick={() => {
                bottomSheetDispatch({
                  type: "show",
                  width: "medium",
                  children: (
                    <div className="px-5 py-4">
                      <VisionPrescriptionForm
                        encounter={encounter}
                        onSuccess={() => {
                          notifDispatch({
                            type: "showNotification",
                            notifTitle: "Success",
                            notifSubTitle:
                              "Vision prescription saved successfully",
                            variant: "success",
                          });
                          bottomSheetDispatch({ type: "hide" });
                        }}
                        onClose={() =>
                          bottomSheetDispatch({
                            type: "hide",
                          })
                        }
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
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Ordered by
              </th>
              <th
                scope="col"
                className="px-6 py-3  text-left text-xs text-gray-500 uppercase tracking-wider"
              ></th>
            </tr>
          </thead>
          {!prescriptionsQuery.isLoading && (
            <tbody className="bg-white divide-y divide-gray-200">
              {prescriptions?.map((e, i) => (
                <React.Fragment key={e?.id}>
                  <tr
                    key={e?.id}
                    className="hover:bg-gray-100 cursor-pointer text-sm text-gray-900"
                    onClick={() => {
                      if (expandedIdx === i) {
                        setExpandedIdx(-1);
                      } else {
                        setExpandedIdx(i);
                      }
                    }}
                  >
                    <td className="px-6 py-4">{e?.status}</td>
                    <td className="px-6 py-4">
                      {format(parseISO(e.created), "MMM d, y")}
                    </td>
                    <td className="px-6 py-4">
                      <FhirPractitionerName
                        practitionerId={e?.prescriber?.reference?.split("/")[1]}
                      />
                    </td>

                    <td className="px-6 py-4">
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
                        colSpan={4}
                        className="px-20 py-4 text-sm bg-teal-50 shadow-inner rounded-md rounded-b"
                      >
                        {e?.lensSpecification?.map((l, i) => (
                          <div
                            key={i}
                            className={`flex items-start space-x-3  mt-2`}
                          >
                            <div className="flex space-x-2 items-center text-gray-700">
                              {l.eye === "right" ? "OD" : "OS"}
                            </div>
                            <div>
                              {l?.product && (
                                <div>
                                  <span className="font-semibold">
                                    Product:
                                  </span>{" "}
                                  <span>{l?.product?.text}</span>
                                </div>
                              )}
                              {l?.sphere && (
                                <div>
                                  <span className="font-semibold">Sphere:</span>{" "}
                                  <span>{l?.sphere}</span>
                                </div>
                              )}
                              {l?.cylinder && (
                                <div>
                                  <span className="font-semibold">
                                    Cylinder:
                                  </span>{" "}
                                  <span>{l?.cylinder}</span>
                                </div>
                              )}
                              {l?.axis && (
                                <div>
                                  <span className="font-semibold">Axis:</span>{" "}
                                  <span>{l?.axis}</span>
                                </div>
                              )}
                              {l?.prism?.length > 0 &&
                                l?.prism?.map((p, i) => (
                                  <div key={i}>
                                    <div>
                                      <span className="font-semibold">
                                        Prism Amount:
                                      </span>{" "}
                                      <span>{p?.amount}</span>
                                    </div>
                                    <div>
                                      <span className="font-semibold">
                                        Prism Base:
                                      </span>{" "}
                                      <span>{p?.base}</span>
                                    </div>
                                  </div>
                                ))}
                              {l?.add && (
                                <div>
                                  <span className="font-semibold">Add:</span>{" "}
                                  <span>{l?.add}</span>
                                </div>
                              )}
                              {l?.power && (
                                <div>
                                  <span className="font-semibold">Power:</span>{" "}
                                  <span>{l?.power}</span>
                                </div>
                              )}
                              {l?.backCurve && (
                                <div>
                                  <span className="font-semibold">
                                    Back Curve:
                                  </span>{" "}
                                  <span>{l?.backCurve}</span>
                                </div>
                              )}
                              {l?.diameter && (
                                <div>
                                  <span className="font-semibold">
                                    Diameter:
                                  </span>{" "}
                                  <span>{l?.diameter}</span>
                                </div>
                              )}
                              {l?.duration && (
                                <div>
                                  <span className="font-semibold">
                                    Duration:
                                  </span>{" "}
                                  <span>{l?.duration?.value}</span>
                                </div>
                              )}
                              {l?.color && (
                                <div>
                                  <span className="font-semibold">Color:</span>{" "}
                                  <span>{l?.color}</span>
                                </div>
                              )}
                              {l?.brand && (
                                <div>
                                  <span className="font-semibold">Brand:</span>{" "}
                                  <span>{l?.brand}</span>
                                </div>
                              )}
                              {l?.note && (
                                <div>
                                  <span className="font-semibold">Note:</span>{" "}
                                  <span>
                                    {l?.note?.map((n) => n.text).join(", ")}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                        <div className="mt-3">
                          <button
                            type="button"
                            className="flex items-center space-x-2 border px-3 rounded-md"
                            onClick={() => {
                              bottomSheetDispatch({
                                type: "show",
                                width: "medium",
                                children: (
                                  <div className="px-5 py-4">
                                    <VisionPrescriptionForm
                                      updateId={e?.id}
                                      encounter={encounter}
                                      onSuccess={() => {
                                        notifDispatch({
                                          type: "showNotification",
                                          notifTitle: "Success",
                                          notifSubTitle:
                                            "Vision prescription saved successfully",
                                          variant: "success",
                                        });
                                        bottomSheetDispatch({ type: "hide" });
                                      }}
                                      onClose={() =>
                                        bottomSheetDispatch({
                                          type: "hide",
                                        })
                                      }
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
                      </td>
                    </tr>
                  </Transition.Root>
                </React.Fragment>
              ))}
            </tbody>
          )}
        </table>
        {prescriptionsQuery?.isLoading && (
          <div className="bg-white h-32 flex items-center justify-center w-full">
            <Spinner color="warning" aria-label="Appointments loading" />
          </div>
        )}
        {!prescriptionsQuery?.isLoading && prescriptions.length === 0 && (
          <div className="bg-white shadow-md h-32 flex items-center justify-center w-full">
            <div className="m-auto flex space-x-1 text-gray-500">
              <div className="material-symbols-outlined">inbox</div>
              <p className="text-center">Nothing here yet</p>
            </div>
          </div>
        )}
        {!prescriptionsQuery?.isLoading && (
          <div className="shadow-md">
            <TablePagination
              totalCount={prescriptionsQuery?.data?.data?.total ?? 0}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </div>
        )}
      </div>
    </div>
  );
};

Vision.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default Vision;
