/* eslint-disable @typescript-eslint/ban-ts-comment */
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

import useSWR from "swr";
import {
  createEncounter,
  getAllActivityDefinition,
  getAllCareTeams,
  getAllLocations,
  getAllUsers,
  getEncounterAdmitSources,
  getEncounterDiets,
  getEncounterParticipantTypes,
  getEncounterSpecialArrangements,
  getEncounterSpecialCourtesies,
  getEncounterStatuses,
  getOneUser,
  getServiceTypes,
} from "../../api";
import Select from "react-select";
import { useEffect, useState } from "react";
import { Encounter, Patient } from "fhir/r4";
import PatientFinder from "../../components/patient-finder";
import { Modal } from "../../components/modal";
import { parsePatientMrn, parsePatientName } from "../../util/fhir";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Checkbox, Label } from "flowbite-react";
import { Controller, useForm } from "react-hook-form";
import Button from "../../components/button";
import { ISelectOption } from "@tensoremr/models";
import { useNotificationDispatch } from "@tensoremr/notification";
import useSWRMutation from "swr/mutation";
import { format, parseISO } from "date-fns";
import { CreateEncounterInput } from "../../payload";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
  onError: (message: string) => void;
}

const encounterTypes = [
  { value: "AMB", label: "Outpatient" },
  { value: "EMER", label: "Emergency" },
  { value: "FLD", label: "Field" },
  { value: "HH", label: "Home health" },
  { value: "IMP", label: "Inpatient" },
  { value: "OBSENC", label: "Observation" },
  { value: "PRENC", label: "Pre-admission" },
  { value: "SS", label: "Short Stay" },
  { value: "VR", label: "Virtual" },
];

export default function EncounterForm({ onSuccess, onCancel, onError }: Props) {
  const { register, handleSubmit, watch, control } = useForm<any>({
    defaultValues: {
      activity: {
        value: "triage",
        label: "Triage",
      },
    },
  });
  const notifDispatch = useNotificationDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>();
  const [patientFinderOpen, setPatientFinderOpen] = useState<boolean>(false);
  const [participants, setParticipants] = useState<Array<any>>([]);
  const session: any = useSessionContext();

  const serviceTypes =
    useSWR("serviceTypes", () => getServiceTypes())?.data?.data?.concept?.map(
      (e) => ({
        value: e.code,
        label: e.display,
        system: "http://terminology.hl7.org/CodeSystem/service-type",
      })
    ) ?? [];

  const encounterStatuses =
    useSWR("encounterStatuses", () =>
      getEncounterStatuses()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const encounterAdmitSources =
    useSWR("encounterAdmitSources", () =>
      getEncounterAdmitSources()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const encounterDiets =
    useSWR("encounterDiets", () =>
      getEncounterDiets()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const encounterSpecialCourtesies =
    useSWR("encounterSpecialCourtesies", () =>
      getEncounterSpecialCourtesies()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const encounterSpecialArrangements =
    useSWR("encounterSpecialArrangements", () =>
      getEncounterSpecialArrangements()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const encounterParticipantTypes =
    useSWR("encounterParticipantTypes", () =>
      getEncounterParticipantTypes()
    ).data?.data?.expansion?.contains.map((e) => ({
      value: e.code,
      label: e.display,
      system: e.system,
    })) ?? [];

  const activityDefinitions =
    useSWR("activityDefinitions", () =>
      getAllActivityDefinition({ page: 1, size: 100 })
    )?.data?.data?.entry?.map((e) => ({
      value: e.resource?.name,
      label: e.resource?.title,
    })) ?? [];

  const locationsQuery = useSWR("locations", () =>
    getAllLocations({ page: 1, size: 1000 })
  );

  const locations: ISelectOption[] =
    locationsQuery?.data?.data?.entry?.map((e) => ({
      value: e.resource.id,
      label: e.resource.name,
    })) ?? [];

  const practitioners =
    useSWR("users", () => getAllUsers("")).data?.data.map((e) => ({
      value: e.id,
      label: `${e.traits?.name?.prefix ?? ""} ${e.traits?.name?.given} ${
        e.traits?.name?.family
      }`,
    })) ?? [];

  const careTeams =
    useSWR("encounterCareTeams", () =>
      getAllCareTeams({ page: 1, size: 1000 }, "category:not=LA27976-2")
    )?.data?.data?.entry?.map((e) => ({
      value: e.resource.id,
      label: e.resource.name,
    })) ?? [];

  const encounterMu = useSWRMutation("encounters", (key, { arg }) =>
    createEncounter(arg)
  );

  console.log("Practitioners", practitioners);

  useEffect(() => {
    if (encounterParticipantTypes && session && practitioners) {
      setAdmitted(session?.userId);
    }
  }, [encounterParticipantTypes, session, practitioners]);

  const setAdmitted = async (userId: string) => {
    const exists = participants.find((e) => e.userValue === session?.userId);

    const user = (await getOneUser(userId))?.data;

    if (!exists) {
      const admitter = {
        userValue: userId,
        userLabel: `${user.namePrefix} ${user.firstName} ${user.lastName}`,
        roleValue: "ADM",
        roleLabel: "admitter",
      };

      setParticipants([...participants, admitter]);
    }
  };

  const onSubmit = async (input: any) => {
    setIsLoading(true);

    try {
      if (!input.status) {
        throw new Error("Status field is required");
      }

      const encounter: Encounter = {
        resourceType: "Encounter",
        class: input.class
          ? {
              code: input.class.value,
              display: input.class.label,
              system: input.class.system,
            }
          : undefined,
        type: input.serviceType
          ? [
              {
                coding: [
                  {
                    code: input.serviceType.value,
                    display: input.serviceType.label,
                    system: input.serviceType.system,
                  },
                ],
                text: input.serviceType.label,
              },
            ]
          : undefined,
        status: input.status.value,
        participant:
          participants.map((e) => ({
            type: [
              {
                coding: [
                  {
                    code: e.roleLabel,
                    display: e.roleValue,
                  },
                ],
                text: e.roleLabel,
              },
            ],
            individual: {
              reference: `Practitioner/${e.userValue}`,
              type: "Practitioner",
              display: e.userLabel,
            },
          })) ?? undefined,
        location: input.location
          ? [
              {
                location: {
                  reference: `Location/${input.location.value}`,
                  type: "Location",
                  display: input.location.label,
                },
                status: "active",
              },
            ]
          : undefined,

        subject: selectedPatient
          ? {
              reference: `Patient/${selectedPatient.id}`,
              type: "Patient",
            }
          : undefined,
        hospitalization:
          input.class.value === "IMP"
            ? {
                admitSource: input.admitSource
                  ? {
                      coding: [
                        {
                          code: input.admitSource.value,
                          display: input.admitSource.label,
                          system: input.admitSource.system,
                        },
                      ],
                      text: input.admitSource.label,
                    }
                  : undefined,
                reAdmission: input.reAdmission
                  ? {
                      coding: [
                        {
                          code: "R",
                          display: "Re-admission",
                          system: "http://terminology.hl7.org/ValueSet/v2-0092",
                        },
                      ],
                    }
                  : undefined,
                dietPreference: input.dietPreference.map((e) => ({
                  coding: [
                    {
                      code: e.value,
                      display: e.label,
                      system: e.system,
                    },
                  ],
                })),
                specialCourtesy: input.specialCourtesy.map((e) => ({
                  coding: [
                    {
                      code: e.value,
                      display: e.label,
                      system: e.system,
                    },
                  ],
                })),
                specialArrangement: input.specialArrangement.map((e) => ({
                  coding: [
                    {
                      code: e.value,
                      display: e.label,
                      system: e.system,
                    },
                  ],
                })),
              }
            : undefined,
        period:
          input.start || input.end
            ? {
                start: input.start
                  ? format(parseISO(input.start), "yyyy-MM-dd'T'HH:mm:ssxxx")
                  : undefined,
                end: input.end
                  ? format(parseISO(input.end), "yyyy-MM-dd'T'HH:mm:ssxxx")
                  : undefined,
              }
            : undefined,
      };

      const payload: CreateEncounterInput = {
        encounter: encounter,
        activityDefinitionName: input.activity.value,
        // @ts-ignore
        requesterId: session?.userId,
        careTeams: input.careTeams
          ? input.careTeams.map((e) => e.value)
          : undefined,
      };

      await encounterMu.trigger(payload);

      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        notifDispatch({
          type: "showNotification",
          notifTitle: "Error",
          notifSubTitle: error.message,
          variant: "failure",
        });
      }

      console.error(error);
    }

    setIsLoading(false);
  };

  const values = watch();

  return (
    <div className="my-10 pb-10 mx-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="float-right">
          <button onClick={onCancel}>
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

        <p className="text-xl font-extrabold text-teal-800">New Encounter</p>

        <div className="mt-4">
          {selectedPatient ? (
            <button
              type="button"
              className="uppercase text-yellow-600 underline"
              onClick={() => {
                setSelectedPatient(null);
                setPatientFinderOpen(true);
              }}
            >
              Select other patient
            </button>
          ) : (
            <button
              type="button"
              className="uppercase text-teal-600 underline"
              onClick={() => setPatientFinderOpen(true)}
            >
              Select Patient
            </button>
          )}
        </div>

        {selectedPatient && (
          <div className="mt-4 flex space-x-1 items-center">
            <span className={`material-symbols-outlined text-blue-600`}>
              how_to_reg
            </span>
            <p className="text-gray-500">{`${parsePatientName(
              selectedPatient
            )} (${parsePatientMrn(selectedPatient)})`}</p>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-gray-700">Type</label>
          <Controller
            name="class"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Select
                ref={ref}
                value={value}
                options={encounterTypes}
                placeholder="Encounter Type"
                className="mt-1"
                onChange={onChange}
              />
            )}
          />
        </div>

        {values.class?.value === "IMP" && (
          <div className="mt-4 border rounded-md border-teal-600 p-4 bg-stone-50">
            <p className="text-gray-700 tracking-wide">Admission Details</p>

            <div className="mt-4 flex items-center gap-2">
              <Controller
                name="reAdmission"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <Checkbox
                    ref={ref}
                    id="reAdmission"
                    name="reAdmission"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />

              <Label htmlFor="recurring">Re-Admission</Label>
            </div>
            <div className="mt-2">
              <Controller
                name="admitSource"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    ref={ref}
                    isClearable
                    options={encounterAdmitSources}
                    placeholder="Source"
                    className="mt-1"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </div>

            <div className="mt-2">
              <Controller
                name="dietPreference"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    ref={ref}
                    isClearable
                    options={encounterDiets}
                    placeholder="Diet"
                    className="mt-1"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </div>

            <div className="mt-2">
              <Controller
                name="specialCourtesy"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    isMulti
                    isClearable
                    ref={ref}
                    options={encounterSpecialCourtesies}
                    placeholder="Special courtesy"
                    className="mt-1"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </div>

            <div className="mt-2">
              <Controller
                name="specialArrangement"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    isMulti
                    isClearable
                    ref={ref}
                    options={encounterSpecialArrangements}
                    placeholder="Special Arrangements"
                    className="mt-1"
                    value={value}
                    onChange={onChange}
                  />
                )}
              />
            </div>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-gray-700">Service Type</label>
          <Controller
            name="serviceType"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Select
                isClearable
                ref={ref}
                value={value}
                options={serviceTypes}
                placeholder="Service Type"
                className="mt-1"
                onChange={onChange}
              />
            )}
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 ">Status</label>
          <Controller
            name="status"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Select
                isClearable
                ref={ref}
                value={value}
                options={encounterStatuses}
                placeholder="Encounter Status"
                className="mt-1"
                onChange={onChange}
              />
            )}
          />
        </div>

        <div className="mt-4">
          {participants.map((e, i) => (
            <div key={i} className="mt-1 flex items-center space-x-4">
              <div className="flex-1">
                <p className="text-gray-700">Participants</p>
                <Select
                  isClearable
                  options={practitioners}
                  placeholder="Participant"
                  className="mt-1"
                  value={{
                    value: participants[i].userValue,
                    label: participants[i].userLabel,
                  }}
                  onChange={(evt) => {
                    const p = participants.map((p, index) => {
                      if (i === index) {
                        return {
                          ...p,
                          userValue: evt.value,
                          userLabel: evt.label,
                        };
                      }

                      return p;
                    });
                    setParticipants(p);
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="text-gray-700">Role</p>
                <Select
                  isClearable
                  options={encounterParticipantTypes}
                  placeholder="Type"
                  className="mt-1"
                  value={{
                    value: participants[i].roleValue,
                    label: participants[i].roleLabel,
                  }}
                  onChange={(evt) => {
                    const p = participants.map((p, index) => {
                      if (i === index) {
                        return {
                          ...p,
                          roleValue: evt.value,
                          roleLabel: evt.label,
                        };
                      }

                      return p;
                    });
                    setParticipants(p);
                  }}
                />
              </div>
              <div hidden={i !== participants.length - 1}>
                <button
                  type="button"
                  onClick={() => setParticipants([...participants, {}])}
                >
                  <PlusIcon className="w-8 h-8 mt-7 text-green-600" />
                </button>
              </div>
              <div className="w-8" hidden={i === participants.length - 1}></div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-gray-700">Care team</label>
          <Controller
            name="careTeams"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Select
                isMulti
                isClearable
                ref={ref}
                options={careTeams}
                value={value}
                placeholder="Include other care teams"
                className="mt-1"
                onChange={onChange}
              />
            )}
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700">Location</label>
          <Controller
            name="location"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Select
                isClearable
                ref={ref}
                value={value}
                options={locations}
                placeholder="Location"
                className="mt-1"
                onChange={onChange}
              />
            )}
          />
        </div>

        <div className="mt-3 flex space-x-6">
          <div className="w-full">
            <label htmlFor="start" className="block text-gray-700">
              Start
            </label>
            <input
              type="datetime-local"
              id="start"
              {...register("start", { required: true })}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>

          <div className="w-full">
            <label htmlFor="end" className="block text-gray-700">
              End
            </label>
            <input
              type="datetime-local"
              id="end"
              {...register("end")}
              className="mt-1 p-1 pl-4 block w-full sm:text-md border-gray-300 border rounded-md"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-gray-700">Upcoming Activity</label>
          <Controller
            name="activity"
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <Select
                ref={ref}
                value={value}
                options={activityDefinitions}
                placeholder="Next Activity"
                className="mt-1"
                defaultValue={{
                  value: "triage",
                  label: "Triage",
                }}
                onChange={onChange}
              />
            )}
          />
        </div>

        <div className="mt-4 bg-gray-50 text-right">
          <Button
            loading={isLoading}
            loadingText={"Saving"}
            type="submit"
            text="Save"
            icon="save"
            variant="filled"
            disabled={isLoading}
            onClick={() => null}
          />
        </div>
      </form>
      <Modal
        open={patientFinderOpen}
        onClose={() => setPatientFinderOpen(false)}
      >
        <PatientFinder
          onError={(message) => {
            onError(message);
          }}
          onClose={() => setPatientFinderOpen(false)}
          onPatientSelect={(patient) => {
            setPatientFinderOpen(false);
            setSelectedPatient(patient);
          }}
        />
      </Modal>
    </div>
  );
}
