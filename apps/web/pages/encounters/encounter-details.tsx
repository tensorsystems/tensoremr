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

import { Encounter, Patient } from "fhir/r4";
import { Spinner } from "flowbite-react";
import { startCase } from "lodash";
import React from "react";
import useSWR from "swr";
import { getPatient } from "../../api";
import { parsePatientMrn, parsePatientName } from "../../util/fhir";

interface Props {
  encounter: Encounter;
}

export default function EncounterDetails({ encounter }: Props) {
  return (
    <div>
      <div>
        <div className="flex space-x-2 items-center text-gray-700">
          <span className="material-icons text-gray-500 md-supervisor_account"></span>
          <span>Encounter</span>
        </div>
        <div className="ml-8">
          <div>
            <span className="font-semibold">Type: </span>{" "}
            <span>{encounter.class.display}</span>
          </div>
          <div>
            <span className="font-semibold">Status: </span>{" "}
            <span>{encounter.status}</span>
          </div>
          <div>
            <span className="font-semibold">Service: </span>{" "}
            <span>
              {encounter?.type
                ?.map((t) => t.coding.map((c) => c.display).join(", "))
                .join(", ")}
            </span>
          </div>
          <div>
            <span className="font-semibold">Location: </span>
            <span>
              {encounter?.location
                ?.map((l) => l.location?.display ?? "")
                .join(", ")}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-2">
        <div className="flex space-x-2 items-center text-gray-700">
          <span className="material-icons text-gray-500 md-person"></span>
          <span>Patient</span>
        </div>
        <div className="ml-8">
          {encounter.subject && (
            <PatientDetails
              patientId={encounter.subject.reference.split("/")[1]}
            />
          )}
        </div>
      </div>

      <div className="mt-2">
        <div className="flex space-x-2 items-center text-gray-700">
          <span className="material-icons text-gray-500 md-group_add"></span>
          <span>Participants</span>
        </div>

        <div className="ml-8">
          {encounter.participant.map((e, i) => (
            <div key={i}>
              <div>
                <span className="font-semibold">
                  {e.type?.map((t) => startCase(t.text)).join(", ")}:{" "}
                </span>
                <span>{startCase(e.individual?.display)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {encounter.hospitalization && (
        <div className="mt-2">
          <div className="flex space-x-2 items-center text-gray-700">
            <span className="material-icons text-gray-500 md-apartment"></span>
            <span>Hospitalization</span>
          </div>

          <div className="ml-8">
            {encounter.hospitalization.reAdmission && (
              <div>
                <span className="font-semibold">Re-Admission</span>
              </div>
            )}
            {encounter.hospitalization.admitSource && (
              <div>
                <span className="font-semibold">Source: </span>
                <span>{encounter.hospitalization.admitSource.text}</span>
              </div>
            )}
            {encounter.hospitalization.dietPreference.map((e, i) => (
              <div key={i}>
                <span className="font-semibold">Diet: </span>
                <span>{e.coding.map((c) => c.display).join(", ")}</span>
              </div>
            ))}
            {encounter.hospitalization.specialArrangement.map((e, i) => (
              <div key={i}>
                <span className="font-semibold">Special Arrangement: </span>
                <span>{e.coding.map((c) => c.display).join(", ")}</span>
              </div>
            ))}
            {encounter.hospitalization.specialCourtesy.map((e, i) => (
              <div key={i}>
                <span className="font-semibold">Special Courtesy: </span>
                <span>{e.coding.map((c) => c.display).join(", ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface PatientDetailsProps {
  patientId: string;
}

const PatientDetails: React.FC<PatientDetailsProps> = ({ patientId }) => {
  const patientQuery = useSWR(`patients/${patientId}`, () =>
    getPatient(patientId)
  );

  if (patientQuery.isLoading) {
    return <Spinner color="warning" aria-label="Patient loading" />;
  }

  const patient = patientQuery.data?.data as Patient;
  if (patient) {
    return (
      <div>
        <div>
          <span className="font-semibold">Name: </span>
          <span>{parsePatientName(patient)}</span>
        </div>
        <div>
          <span className="font-semibold">MRN: </span>{" "}
          <span>{parsePatientMrn(patient)}</span>
        </div>
      </div>
    );
  } else {
    return <div />;
  }
};
