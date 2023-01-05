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
  getAllLocations,
  getAllUsers,
  getEncounterAdmitSources,
  getEncounterDiets,
  getEncounterParticipantTypes,
  getEncounterReasons,
  getEncounterSpecialArrangements,
  getEncounterSpecialCourtesies,
  getEncounterStatuses,
  getServiceTypes,
} from "../_api";
import Select from "react-select";
import { useEffect, useState } from "react";
import { Patient } from "fhir/r4";
import PatientFinder from "./patient-finder";
import { Modal } from "./modal";
import { parsePatientMrn, parsePatientName } from "../_util/fhir";
import { PlusIcon } from "@heroicons/react/solid";
import { Checkbox, Label } from "flowbite-react";
import { useForm } from "react-hook-form";
import Button from "./button";
import { ISelectOption } from "@tensoremr/models";
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
  const { register, handleSubmit, setValue, watch } = useForm<any>();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient>();
  const [patientFinderOpen, setPatientFinderOpen] = useState<boolean>(false);
  const [participants, setParticipants] = useState<Array<any>>([
    { userValue: "", userLabel: "", roleValue: "", roleLabel: "" },
  ]);

  const serviceTypes =
    useSWR("serviceTypes", () => getServiceTypes())?.data?.data?.concept?.map(
      (e) => ({
        value: e.code,
        label: e.display,
        system: e.system,
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

  const encounterReasons =
    useSWR("encounterReasons", () =>
      getEncounterReasons()
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

  const locationsQuery = useSWR("schedules", () =>
    getAllLocations({ page: 1, size: 1000 })
  );

  const locations: ISelectOption[] =
    locationsQuery?.data?.data?.entry.map((e) => ({
      value: e.resource.id,
      label: e.resource.name,
    })) ?? [];

  const practitioners =
    useSWR("users", () => getAllUsers("")).data?.data.map((e) => ({
      value: e.id,
      label: `${e.firstName} ${e.lastName}`,
    })) ?? [];

  useEffect(() => {
    register("class");
    register("serviceType");
    register("status");
  }, []);

  const values = watch();

  return (
    <div className="my-10 mx-8">
      <form>
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
            <span className="material-icons text-blue-600">how_to_reg</span>
            <p className="text-gray-500">{`${parsePatientName(
              selectedPatient
            )} (${parsePatientMrn(selectedPatient)})`}</p>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-gray-700 ">Type</label>
          <Select
            options={encounterTypes}
            placeholder="Encounter Type"
            className="mt-1"
            onChange={(evt) => {
              setValue("class", evt);
            }}
          />
        </div>

        {values.class?.value === "IMP" && (
          <div className="mt-4 border rounded-md border-teal-600 p-4 bg-stone-50">
            <p className="text-gray-700 tracking-wide">Admission Details</p>

            <div className="mt-4 flex items-center gap-2">
              <Checkbox
                id="useDuration"
                name="useDuration"
                // value={useDuration + ""}
                // onChange={(evt) => {
                //   setUseDuration(evt.target.checked);
                // }}
              />
              <Label htmlFor="recurring">Re-Admission</Label>
            </div>
            <div className="mt-2">
              <Select
                isClearable
                options={encounterAdmitSources}
                placeholder="Source"
                className="mt-1"
                // value={values.serviceType}
                onChange={(evt) => {
                  //setValue("serviceType", evt);
                }}
              />
            </div>

            <div className="mt-2">
              <Select
                isClearable
                options={encounterDiets}
                placeholder="Diet"
                className="mt-1"
                // value={values.serviceType}
                onChange={(evt) => {
                  //setValue("serviceType", evt);
                }}
              />
            </div>

            <div className="mt-2">
              <Select
                isClearable
                options={encounterSpecialCourtesies}
                placeholder="Special courtesy"
                className="mt-1"
                // value={values.serviceType}
                onChange={(evt) => {
                  //setValue("serviceType", evt);
                }}
              />
            </div>

            <div className="mt-2">
              <Select
                isClearable
                options={encounterSpecialArrangements}
                placeholder="Special Arrangements"
                className="mt-1"
                // value={values.serviceType}
                onChange={(evt) => {
                  //setValue("serviceType", evt);
                }}
              />
            </div>
          </div>
        )}

        <div className="mt-4">
          <label className="block text-gray-700">Service Type</label>
          <Select
            isClearable
            options={serviceTypes}
            placeholder="Service Type"
            className="mt-1"
            onChange={(evt) => {
              setValue("serviceType", evt);
            }}
          />
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 ">Status</label>
          <Select
            isClearable
            options={encounterStatuses}
            placeholder="Encounter Status"
            className="mt-1"
            onChange={(evt) => {
              setValue("status", evt);
            }}
          />
        </div>

        <div className="mt-4">
          <p className="text-gray-700">Participants</p>
          {participants.map((e, i) => (
            <div key={i} className="mt-1 flex items-center space-x-6">
              <div className="flex-1">
                <Select
                  isClearable
                  options={practitioners}
                  placeholder="Participant"
                  className="mt-1"
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
                <Select
                  isClearable
                  options={encounterParticipantTypes}
                  placeholder="Type"
                  className="mt-1"
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
                  onClick={() =>
                    setParticipants([
                      ...participants,
                      {
                        userValue: "",
                        userLabel: "",
                        roleValue: "",
                        roleLabel: "",
                      },
                    ])
                  }
                >
                  <PlusIcon className="w-7 h-7 text-green-600" />
                </button>
              </div>
              <div className="w-7" hidden={i === participants.length - 1}></div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-gray-700 ">Location</label>
          <Select
            isMulti
            isClearable
            options={locations}
            placeholder="Location"
            className="mt-1"
            onChange={(evt) => {
              setValue("location", evt);
            }}
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
