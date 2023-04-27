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

import {
  CheckIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
} from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { Button, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import MyBreadcrumb from "../components/breadcrumb";
import EncountersTable from "../components/encounters-table";
import StatCard from "../components/stat-card";
import useSWR from "swr";
import { getAllCareTeams, getAllUsers } from "../api";
import { PaginationInput } from "../model";
import { CareTeam, Encounter } from "fhir/r4";
import { useRouter } from "next/router";
import { debounce } from "lodash";
import { ISelectOption } from "../model";
import { useSession } from "../context/SessionProvider";
import { Spinner } from "flowbite-react";
import { getUserIdFromSession } from "../util/ory";


interface IEncounterFilterFields {
  date?: string;
  type?: string;
  status?: string;
  practitioner?: string;
  mrn?: string;
  accessionId?: string;
  careTeamCategory?: string;
}

export function Index() {
  const router = useRouter();
  const { session } = useSession();

  const [selectedWorkflow, setSelectedWorkflow] = useState<
    "encounters" | "tasks" | "service-requests"
  >("encounters");

  const [encounterSearchParams, setEncounterSearchParams] =
    useState<IEncounterFilterFields>({
      date: format(new Date(), "yyyy-MM-dd"),
      careTeamCategory: "LA27976-2",
    });

  const [page, setPage] = useState<PaginationInput>({
    page: 1,
    size: 10,
  });

  const userId = session ? getUserIdFromSession(session) : undefined;

  const practitioners =
    useSWR("users", () => getAllUsers("")).data?.data.map((e) => ({
      value: e.id,
      label: `${e.firstName} ${e.lastName}`,
    })) ?? [];

  const careTeamQuery = useSWR(userId ? "careTeams" : undefined, () => {
    const params = [];

    params.push("_include=CareTeam:encounter");

    if (encounterSearchParams.careTeamCategory === "LA27976-2") {
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
        params.push(
          `encounter.patient.identifier=${encounterSearchParams.mrn}`
        );
      }

      if (encounterSearchParams.accessionId) {
        params.push(
          `encounter.identifier=${encounterSearchParams.accessionId}`
        );
      }
    } else {
      params.push(`participant=${encounterSearchParams.careTeamCategory}`);

      if (encounterSearchParams.type) {
        params.push(`encounter.class=${encounterSearchParams.type}`);
      }

      if (encounterSearchParams.status) {
        params.push(`encounter.status=${encounterSearchParams.status}`);
      }

      if (encounterSearchParams.mrn) {
        params.push(
          `encounter.patient.identifier=${encounterSearchParams.mrn}`
        );
      }
    }

    return getAllCareTeams(page, params.join("&"));
  });

  const participantCareTeamsQuery = useSWR(
    userId ? "participantCareTeams" : undefined,
    () => {
      const params = [];
      params.push(`participant=${userId}`);
      params.push(`category:not=LA27976-2`);
      return getAllCareTeams(page, params.join("&"));
    }
  );

  useEffect(() => {
    careTeamQuery.mutate();
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

  const mrnDebouncedSearch = debounce(async (mrn) => {
    setEncounterSearchParams({
      ...encounterSearchParams,
      mrn,
    });
  }, 500);

  const participantCareTeams: ISelectOption[] =
    participantCareTeamsQuery?.data?.data?.entry
      ?.map((e) => e.resource as CareTeam)
      ?.map((e) => ({ value: e.id, label: e.name })) ?? [];

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

  if (!session) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <Spinner size="lg" color="info" />
      </div>
    );
  }

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
                <div>
                  <div className="flex items-center space-x-4">
                    <select
                      name="category"
                      value={encounterSearchParams.careTeamCategory}
                      className={`border-l-2 border-gray-200 rounded-md text-sm ${
                        encounterSearchParams.careTeamCategory ===
                          "LA27976-2" && "w-44"
                      }`}
                      onChange={(evt) => {
                        setEncounterSearchParams({
                          ...encounterSearchParams,
                          careTeamCategory: evt.target.value,
                        });
                      }}
                    >
                      <option value="LA27976-2">
                        Encounter-focused Care Team
                      </option>
                      {participantCareTeams.map((e) => (
                        <option key={e.value} value={e.value}>
                          {e.label}
                        </option>
                      ))}
                    </select>

                    {encounterSearchParams.careTeamCategory === "LA27976-2" ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="date"
                          id="date"
                          name="date"
                          value={encounterSearchParams.date}
                          className="border-l-2 border-gray-200 rounded-md text-sm"
                          onChange={(evt) => {
                            setEncounterSearchParams({
                              ...encounterSearchParams,
                              date: evt.target.value,
                            });
                          }}
                        />
                        <select
                          name="type"
                          value={encounterSearchParams.type}
                          className="border-l-2 border-gray-200 rounded-md text-sm"
                          onChange={(evt) => {
                            if (evt.target.value === "") {
                              setEncounterSearchParams({
                                ...encounterSearchParams,
                                type: "",
                              });
                            } else {
                              setEncounterSearchParams({
                                ...encounterSearchParams,
                                type: evt.target.value,
                              });
                            }
                          }}
                        >
                          <option value="">Type</option>
                          <option value="AMB">Outpatient</option>
                          <option value="EMER">Emergency</option>
                          <option value="FLD">Field</option>
                          <option value="HH">Home Health</option>
                          <option value="IMP">Inpatient</option>
                          <option value="OBSENC">Observation</option>
                          <option value="PRENC">Pre-Admission</option>
                          <option value="SS">Shory Stay</option>
                          <option value="VR">Virtual</option>
                        </select>
                        <select
                          name="status"
                          value={encounterSearchParams.status}
                          className=" border-l-2 border-gray-200 rounded-md text-sm"
                          onChange={(evt) => {
                            if (evt.target.value === "") {
                              setEncounterSearchParams({
                                ...encounterSearchParams,
                                status: "",
                              });
                            } else {
                              setEncounterSearchParams({
                                ...encounterSearchParams,
                                status: evt.target.value,
                              });
                            }
                          }}
                        >
                          <option value="">Status</option>
                          <option value="planned">Planned</option>
                          <option value="arrived">Arrived</option>
                          <option value="triaged">Triaged</option>
                          <option value="in-progress">In-Progress</option>
                          <option value="onleave">Onleave</option>
                          <option value="finished">Finished</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="entered-in-error">
                            Entered-In-Error
                          </option>
                          <option value="unknown">Unknown</option>
                        </select>

                        <select
                          name="actor"
                          className="ml-6 border-l-2 border-gray-200 rounded-md text-sm"
                          value={encounterSearchParams.practitioner}
                          onChange={(evt) => {
                            if (evt.target.value === "") {
                              setEncounterSearchParams({
                                ...encounterSearchParams,
                                practitioner: "",
                              });
                            } else {
                              setEncounterSearchParams({
                                ...encounterSearchParams,
                                practitioner: evt.target.value,
                              });
                            }
                          }}
                        >
                          <option value={""}>Practitioner</option>
                          {practitioners.map((e) => (
                            <option key={e.value} value={e.value}>
                              {e.label}
                            </option>
                          ))}
                        </select>

                        <div className="left-1/2 -ml-0.5 w-[1px] h-6 bg-gray-400"></div>

                        <div>
                          <TextInput
                            id="mrn"
                            type="text"
                            icon={MagnifyingGlassIcon}
                            placeholder="MRN"
                            required={true}
                            className="w-24"
                            onChange={(evt) => {
                              mrnDebouncedSearch(evt.target.value);
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <select
                          name="type"
                          value={encounterSearchParams.type}
                          className="border-l-2 border-gray-200 rounded-md text-sm"
                          onChange={(evt) => {
                            if (evt.target.value === "") {
                              setEncounterSearchParams({
                                ...encounterSearchParams,
                                type: "",
                              });
                            } else {
                              setEncounterSearchParams({
                                ...encounterSearchParams,
                                type: evt.target.value,
                              });
                            }
                          }}
                        >
                          <option value="">Type</option>
                          <option value="AMB">Outpatient</option>
                          <option value="EMER">Emergency</option>
                          <option value="FLD">Field</option>
                          <option value="HH">Home Health</option>
                          <option value="IMP">Inpatient</option>
                          <option value="OBSENC">Observation</option>
                          <option value="PRENC">Pre-Admission</option>
                          <option value="SS">Shory Stay</option>
                          <option value="VR">Virtual</option>
                        </select>
                        <select
                          name="status"
                          value={encounterSearchParams.status}
                          className=" border-l-2 border-gray-200 rounded-md text-sm"
                          onChange={(evt) => {
                            if (evt.target.value === "") {
                              setEncounterSearchParams({
                                ...encounterSearchParams,
                                status: "",
                              });
                            } else {
                              setEncounterSearchParams({
                                ...encounterSearchParams,
                                status: evt.target.value,
                              });
                            }
                          }}
                        >
                          <option value="">Status</option>
                          <option value="planned">Planned</option>
                          <option value="arrived">Arrived</option>
                          <option value="triaged">Triaged</option>
                          <option value="in-progress">In-Progress</option>
                          <option value="onleave">Onleave</option>
                          <option value="finished">Finished</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="entered-in-error">
                            Entered-In-Error
                          </option>
                          <option value="unknown">Unknown</option>
                        </select>
                        <div className="left-1/2 -ml-0.5 w-[1px] h-6 bg-gray-400"></div>

                        <div>
                          <TextInput
                            id="mrn"
                            type="text"
                            icon={MagnifyingGlassIcon}
                            placeholder="MRN"
                            className="w-24"
                            onChange={(evt) => {
                              mrnDebouncedSearch(evt.target.value);
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
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
                  router.push(`encounters/${encounterId}/patient-dashboard`);
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
