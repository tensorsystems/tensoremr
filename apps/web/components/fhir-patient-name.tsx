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

import { Patient } from "fhir/r4";
import { Spinner } from "flowbite-react";
import useSWR from "swr";
import { getPatient } from "../api";
import { parsePatientMrn, parsePatientName } from "../util/fhir";

interface Props {
  patientId: string;
}

export default function FhirPatientName({ patientId }: Props) {
  const patientQuery = useSWR(`patients/${patientId}`, () =>
    getPatient(patientId)
  );

  if (patientQuery.isLoading) {
    return <Spinner color="warning" aria-label="Patient loading" />;
  }

  const patient = patientQuery.data?.data as Patient;
  if (patient) {
    return (
      <p>{`${parsePatientName(patient)} | ${parsePatientMrn(patient)}`}</p>
    );
  } else {
    return <div />;
  }
}
