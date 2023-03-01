import {
  CheckIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { Button, Spinner, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import MyBreadcrumb from "../components/breadcrumb";
import EncountersTable from "../components/encounters-table";
import StatCard from "../components/stat-card";
import { TablePagination } from "../components/table-pagination";
import WorkflowTable from "../components/workflow-table";
import useSWR from "swr";
import { getAllEncounters, getAllUsers } from "../api";
import { PaginationInput } from "../model";
import { Encounter } from "fhir/r4";
import EncounterTableFilters from "../components/encounter-table-filters";
import { useRouter } from "next/router";

interface IEncountersSearchField {
  date?: string;
  type?: string;
  status?: string;
  practitioner?: string;
  mrn?: string;
  accessionId?: string;
}

export function Index() {
  const router = useRouter();
  const [selectedWorkflow, setSelectedWorkflow] = useState<
    "encounters" | "tasks" | "service-requests"
  >("encounters");

  const [encounterSearchParams, setEncounterSearchParams] =
    useState<IEncountersSearchField>({
      date: format(new Date(), "yyyy-MM-dd"),
    });

  const [page, setPage] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });

  const practitioners =
    useSWR("users", () => getAllUsers("")).data?.data.map((e) => ({
      value: e.id,
      label: `${e.firstName} ${e.lastName}`,
    })) ?? [];

  const encountersQuery = useSWR("encounters", () => {
    const params = [];

    if (encounterSearchParams.date) {
      params.push(`date=ap${encounterSearchParams.date}`);
    }

    if (encounterSearchParams.type) {
      params.push(`class=${encounterSearchParams.type}`);
    }

    if (encounterSearchParams.status) {
      params.push(`status=${encounterSearchParams.status}`);
    }

    if (encounterSearchParams.practitioner) {
      params.push(`practitioner=${encounterSearchParams.practitioner}`);
    }

    if (encounterSearchParams.mrn) {
      params.push(`patient.identifier=${encounterSearchParams.mrn}`);
    }

    if (encounterSearchParams.accessionId) {
      params.push(`identifier=${encounterSearchParams.accessionId}`);
    }

    return getAllEncounters(page, params.join("&"));
  });

  useEffect(() => {
    encountersQuery.mutate();
  }, [encounterSearchParams, page]);

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
    <div>
      <MyBreadcrumb crumbs={[{ href: "/", title: "Home", icon: "home" }]} />
      <div className="h-screen">
        <div className="md:flex md:space-x-4">
          <StatCard
            title={"Scheduled"}
            figure={0}
            onClick={() => {
              // handleStatClick('Scheduled');
            }}
          />
          <StatCard
            title={"Checked in"}
            figure={0}
            onClick={() => {
              //handleStatClick('Scheduled');
            }}
          />
          <StatCard
            title={"Checked out"}
            figure={0}
            onClick={() => {
              // handleStatClick('Scheduled');
            }}
          />
        </div>

        <div className="mt-6">
          <div className="shadow border-b border-gray-200 sm:rounded-lg">
            <div className="px-4 pt-3 bg-gray-50">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Workflow
              </p>
            </div>
            <div className="flex items-center justify-between py-3 px-4 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="flex justify-end space-x-2 items-center">
                <Button
                  onClick={() => setSelectedWorkflow("encounters")}
                  gradientMonochrome={
                    selectedWorkflow === "encounters" ? "teal" : "dark"
                  }
                >
                  <UserGroupIcon className="mr-3 h-4 w-4" />
                  Encounters
                </Button>
                <Button
                  onClick={() => setSelectedWorkflow("tasks")}
                  gradientMonochrome={
                    selectedWorkflow === "tasks" ? "teal" : "dark"
                  }
                  label="2"
                >
                  <CheckIcon className="mr-3 h-4 w-4" />
                  Tasks
                </Button>
                <Button
                  onClick={() => setSelectedWorkflow("service-requests")}
                  gradientMonochrome={
                    selectedWorkflow === "service-requests" ? "teal" : "dark"
                  }
                >
                  <InboxIcon className="mr-3 h-4 w-4" />
                  Service Requests
                </Button>
              </div>
              {selectedWorkflow === "encounters" && (
                <EncounterTableFilters
                  params={encounterSearchParams}
                  practitioners={practitioners}
                  onChange={(value) => {
                    setEncounterSearchParams({
                      ...encounterSearchParams,
                      ...value,
                    });
                  }}
                />
              )}
            </div>

            {selectedWorkflow === "encounters" && (
              <EncountersTable
                isLoading={encountersQuery?.isLoading}
                isValidating={encountersQuery?.isValidating}
                totalCount={encountersQuery?.data?.data?.total}
                encounters={
                  encountersQuery?.data?.data?.entry?.map(
                    (e) => e.resource as Encounter
                  ) ?? []
                }
                handleNext={handleNext}
                handlePrev={handlePrevious}
                onOpenChart={(encounterId: string) => {
                  router.push(`encounters/${encounterId}/dashboard`);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
