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

import React, { useEffect, useState } from "react";
import MyBreadcrumb, { IBreadcrumb } from "../../components/breadcrumb";
import Button from "../../components/button";
import { useBottomSheetDispatch } from "@tensoremr/bottomsheet";
import { useNotificationDispatch } from "@tensoremr/notification";
import EncounterForm from "./encounter-form";
import { PaginationInput } from "../../model";
import {  getAllEncounters, getAllUsers } from "../../api";
import useSWR from "swr";
import { Encounter } from "fhir/r4";
import { format } from "date-fns";
import EncountersTable from "../../components/encounters-table";
import EncounterTableFilters from "../../components/encounter-table-filters";
import { useRouter } from "next/router";

interface ISearchField {
  date?: string;
  type?: string;
  status?: string;
  practitioner?: string;
  mrn?: string;
  accessionId?: string;
}

export default function Encounters() {
  const bottomSheetDispatch = useBottomSheetDispatch();
  const notifDispatch = useNotificationDispatch();
  const router = useRouter();

  const [crumbs] = useState<IBreadcrumb[]>([
    { href: "/", title: "Home", icon: "home" },
    { href: "/encounters", title: "Encounters", icon: "supervisor_account" },
  ]);
  const [page, setPage] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });
  const [searchParams, setSearchParams] = useState<ISearchField>({
    date: format(new Date(), "yyyy-MM-dd"),
  });

  const practitioners =
    useSWR("users", () => getAllUsers("")).data?.data.map((e) => ({
      value: e.id,
      label: `${e.firstName} ${e.lastName}`,
    })) ?? [];

  const { data, isLoading, isValidating, mutate } = useSWR("encounters", () => {
    const params = [];

    if (searchParams.date) {
      params.push(`date=ap${searchParams.date}`);
    }

    if (searchParams.type) {
      params.push(`class=${searchParams.type}`);
    }

    if (searchParams.status) {
      params.push(`status=${searchParams.status}`);
    }

    if (searchParams.practitioner) {
      params.push(`practitioner=${searchParams.practitioner}`);
    }

    if (searchParams.mrn) {
      params.push(`patient.identifier=${searchParams.mrn}`);
    }

    if (searchParams.accessionId) {
      params.push(`identifier=${searchParams.accessionId}`);
    }

    return getAllEncounters(page, params.join("&"));
  });

  useEffect(() => {
    mutate();
  }, [searchParams, page]);

  const encounters: Encounter[] =
    data?.data?.entry?.map((e) => e.resource as Encounter) ?? [];

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
    <div className="h-screen overflow-y-auto mb-10">
      <MyBreadcrumb crumbs={crumbs} />
      <div className="flex bg-white w-full h-16 p-4 mt-4 rounded-sm shadow-md justify-between items-center">
        <EncounterTableFilters
          params={searchParams}
          practitioners={practitioners}
          onChange={(value) => {
            setSearchParams({
              ...searchParams,
              ...value,
            });
          }}
        />

        <div>
          <Button
            type="button"
            text="New Encounter"
            icon="add"
            variant="filled"
            onClick={() => {
              bottomSheetDispatch({
                type: "show",
                width: "medium",
                children: (
                  <EncounterForm
                    onCancel={() => bottomSheetDispatch({ type: "hide" })}
                    onSuccess={() => {
                      bottomSheetDispatch({ type: "hide" });

                      notifDispatch({
                        type: "showNotification",
                        notifTitle: "Success",
                        notifSubTitle: "Encounter saved successfully",
                        variant: "success",
                      });
                    }}
                    onError={(message) => {
                      notifDispatch({
                        type: "showNotification",
                        notifTitle: "Error",
                        notifSubTitle: message,
                        variant: "failure",
                      });
                    }}
                  />
                ),
              });
            }}
          />
        </div>
      </div>
      <EncountersTable
        isLoading={isLoading}
        isValidating={isValidating}
        totalCount={data?.data?.total}
        encounters={encounters}
        handleNext={handleNext}
        handlePrev={handlePrevious}
        onOpenChart={(encounterId: string) => {
          router.push(`encounters/${encounterId}/dashboard`);
        }}
      />
    </div>
  );
}
