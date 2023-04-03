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
import { ReactElement, useState } from "react";
import { PaginationInput } from "../../../../model";
import { NextPageWithLayout } from "../../../_app";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import useSWR from "swr";
import Button from "../../../../components/button";
import { EncounterLayout } from "..";
import React from "react";
import { getEncounter, getImmunizations } from "../../../../api";
import { Encounter, Immunization } from "fhir/r4";
import ImmunizationForm from "./immunization-form";
import { Spinner } from "flowbite-react";
import { TablePagination } from "../../../../components/table-pagination";

const Immunization: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
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

  const immunizationQuery = useSWR(encounter ? "immunizations" : null, () =>
    getImmunizations(
      page,
      `patient=${encounter?.subject?.reference?.split("/")[1]}`
    )
  );

  const immunizations: Immunization[] =
    immunizationQuery?.data?.data?.entry?.map(
      (e) => e.resource as Immunization
    );

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
      <p className="text-2xl text-gray-800 font-bold font-mono">Immunization</p>
      <hr className="mt-3" />
      <div className="mt-10">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center space-x-3">
            <div />
          </div>
          <div>
            <Button
              type="button"
              text="Add Immunization"
              icon="add"
              variant="filled"
              onClick={() => {
                bottomSheetDispatch({
                  type: "show",
                  width: "medium",
                  children: (
                    <div className="px-5 py-4">
                      <ImmunizationForm
                        encounter={encounter}
                        onSuccess={() => {
                          notifDispatch({
                            type: "showNotification",
                            notifTitle: "Success",
                            notifSubTitle: "Immunization saved successfully",
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
                Vaccine
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
                Occurence
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Site
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Route
              </th>

              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Dosage
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider"
              >
                Subpotent
              </th>
            </tr>
          </thead>
          {!immunizationQuery.isLoading && (
            <tbody className="bg-white divide-y divide-gray-200">
              {immunizations?.map((e) => (
                <tr
                  key={e?.id}
                  className="hover:bg-gray-100 cursor-pointer text-sm text-gray-900"
                  onClick={() => {
                    bottomSheetDispatch({
                      type: "show",
                      width: "medium",
                      children: (
                        <div className="px-5 py-4">
                          <ImmunizationForm
                            updateId={e?.id}
                            encounter={encounter}
                            onSuccess={() => {
                              notifDispatch({
                                type: "showNotification",
                                notifTitle: "Success",
                                notifSubTitle:
                                  "Immunization saved successfully",
                                variant: "success",
                              });
                              bottomSheetDispatch({ type: "hide" });
                            }}
                          />
                        </div>
                      ),
                    });
                  }}
                >
                  <td className="px-6 py-4">{e?.vaccineCode?.text}</td>
                  <td className="px-6 py-4">{e?.status}</td>
                  <td className="px-6 py-4">{e?.occurrenceString}</td>
                  <td className="px-6 py-4">{e?.site?.text}</td>
                  <td className="px-6 py-4">{e?.route?.text}</td>
                  <td className="px-6 py-4">{e?.doseQuantity?.value}</td>
                  <td className="px-6 py-4">{e?.subpotentReason?.map((s) => s.text)?.join(", ")}</td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
        {immunizationQuery?.isLoading && (
          <div className="bg-white h-32 flex items-center justify-center w-full">
            <Spinner color="warning" aria-label="Appointments loading" />
          </div>
        )}
        {!immunizationQuery?.isLoading && immunizations?.length === 0 && (
          <div className="bg-white shadow-md h-32 flex items-center justify-center w-full">
            <div className="m-auto flex space-x-1 text-gray-500">
              <div className="material-symbols-outlined">inbox</div>
              <p className="text-center">Nothing here yet</p>
            </div>
          </div>
        )}
        {!immunizationQuery?.isLoading && (
          <div className="shadow-md">
            <TablePagination
              totalCount={immunizationQuery?.data?.data?.total ?? 0}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          </div>
        )}
      </div>
    </div>
  );
};

Immunization.getLayout = function getLayout(page: ReactElement) {
  return <EncounterLayout>{page}</EncounterLayout>;
};

export default Immunization;
