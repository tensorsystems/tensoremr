import { CheckIcon, InboxIcon, UserGroupIcon } from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { Button } from "flowbite-react";
import { useEffect, useState } from "react";
import MyBreadcrumb from "../components/breadcrumb";
import EncountersTable from "../components/encounters-table";
import StatCard from "../components/stat-card";
import useSWR from "swr";
import { getAllCareTeams, getAllEncounters, getAllUsers } from "../api";
import { PaginationInput } from "../model";
import { CareTeam, Encounter } from "fhir/r4";
import EncounterTableFilters, {
  IEncounterFilterFields,
} from "../components/encounter-table-filters";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

export function Index() {
  const router = useRouter();
  const [selectedWorkflow, setSelectedWorkflow] = useState<
    "encounters" | "tasks" | "service-requests"
  >("encounters");

  const [encounterSearchParams, setEncounterSearchParams] =
    useState<IEncounterFilterFields>({
      date: format(new Date(), "yyyy-MM-dd"),
    });

  const [page, setPage] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });

  const { data: session } = useSession();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const userId = session?.user?.id;

  const practitioners =
    useSWR("users", () => getAllUsers("")).data?.data.map((e) => ({
      value: e.id,
      label: `${e.firstName} ${e.lastName}`,
    })) ?? [];

  const careTeamQuery = useSWR(userId ? "careTeams" : undefined, () => {
    const params = [];

    params.push("_include=CareTeam:encounter");
    params.push(`participant=${userId}`);

    if (encounterSearchParams.date) {
      params.push(`encounter.date=ap${encounterSearchParams.date}`);
    }

    if (encounterSearchParams.type) {
      params.push(`encounter.class=${encounterSearchParams.type}`);
    }

    if (encounterSearchParams.status) {
      params.push(`encounter.status=${encounterSearchParams.status}`);
    }

    if (encounterSearchParams.practitioner) {
      params.push(
        `encounter.practitioner=${encounterSearchParams.practitioner}`
      );
    }

    if (encounterSearchParams.mrn) {
      params.push(`encounter.patient.identifier=${encounterSearchParams.mrn}`);
    }

    if (encounterSearchParams.accessionId) {
      params.push(`encounter.identifier=${encounterSearchParams.accessionId}`);
    }

    return getAllCareTeams(page, params.join("&"));
  });

  useEffect(() => {
    careTeamQuery.mutate();
  }, [encounterSearchParams, page]);

  console.log("Care Teams", careTeamQuery?.data?.data);

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

  const careTeams: CareTeam[] =
    careTeamQuery?.data?.data?.entry
      ?.filter((e) => e.search.mode === "match")
      ?.map((e) => e.resource as CareTeam) ?? [];

  const encounters: Encounter[] =
    careTeamQuery?.data?.data?.entry
      ?.filter((e) => e.search.mode === "include")
      ?.map((e) => {
        const encounter: Encounter = e.resource;

        const cTeams = careTeams.filter(
          (c) => c.encounter?.reference === `Encounter/${encounter.id}`
        );

        if (cTeams.length > 0) {
          encounter.extension = [
            {
              url: "careTeam",
              valueString: cTeams.map((c) => c.name).join(", "),
            },
          ];
        }

        return encounter;
      }) ?? [];

  console.log("Care temas", careTeams);
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
                isLoading={careTeamQuery?.isLoading}
                isValidating={careTeamQuery?.isValidating}
                totalCount={careTeamQuery?.data?.data?.total}
                encounters={encounters}
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
